import {
  DEMO_LATENCY_HISTORY,
  DEMO_SERVICE_RESULTS,
  SERVICES,
  type IncidentRecord,
  type IncidentStatus,
  type ReportCounts,
  type ReportType,
  type ServiceResult
} from "@/data/services";
import { checkService } from "@/lib/checkService";
import {
  addFallbackReport,
  getFallbackCounts,
  getLatencyHistory,
  getPreviousServiceStatus,
  saveServiceSnapshot,
  setPreviousServiceStatus
} from "@/lib/monitorStore";
import { getSupabaseClient } from "@/lib/supabaseClient";

export interface CheckServicesResponse {
  services: ServiceResult[];
  history: typeof DEMO_LATENCY_HISTORY;
  checkedAt: string;
  source: "live" | "demo";
}

export interface ReportsResponse {
  counts: ReportCounts;
  windowMinutes: number;
  source: "supabase" | "fallback";
}

function toIncidentLatency(latency: number | null) {
  return latency === null ? "timeout" : `${latency}ms`;
}

export async function sendDiscordAlert(service: string, latency: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return;
  }

  const message = [
    "\uD83D\uDEA8 SERVICE DOWN",
    `Service: ${service}`,
    `Latency: ${latency}`,
    `Time: ${new Date().toISOString()}`
  ].join("\n");

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: message
      })
    });
  } catch {
    // Discord alerts are best-effort and should never break monitoring.
  }
}

export async function sendDiscordRecoveryAlert(service: string, latency: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return;
  }

  const message = [
    "\uD83D\uDFE2 SERVICE RECOVERED",
    `Service: ${service}`,
    `Latency: ${latency}`,
    `Time: ${new Date().toISOString()}`
  ].join("\n");

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: message
      })
    });
  } catch {
    // Discord alerts are best-effort and should never break monitoring.
  }
}

async function logIncident(service: string, status: IncidentStatus, latency: string) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return;
  }

  await supabase.from("incidents").insert({
    service,
    status,
    latency
  });
}

async function getLatestIncidentStatus(service: string) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return undefined;
  }

  const { data, error } = await supabase
    .from("incidents")
    .select("status")
    .eq("service", service)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return undefined;
  }

  return data.status as IncidentStatus;
}

async function syncIncidentForService(service: ServiceResult) {
  const supabase = getSupabaseClient();
  const isDown = service.status === "DOWN";
  const isUp = service.status === "UP";
  const latency = toIncidentLatency(service.latency);

  if (supabase) {
    const previousIncidentStatus = await getLatestIncidentStatus(service.name);

    if (previousIncidentStatus !== "down" && isDown) {
      await logIncident(service.name, "down", latency);
    }

    if (previousIncidentStatus === "down" && !isDown) {
      await logIncident(service.name, "recovered", latency);
    }

    if (previousIncidentStatus !== "down" && isDown) {
      await sendDiscordAlert(service.name, latency);
    }

    if (previousIncidentStatus === "down" && isUp) {
      await sendDiscordRecoveryAlert(service.name, latency);
    }

    return;
  }

  const previousStatus = getPreviousServiceStatus(service.id);

  if (previousStatus === undefined) {
    setPreviousServiceStatus(service.id, service.status);
    return;
  }

  if ((previousStatus === "UP" || previousStatus === "SLOW") && isDown) {
    await sendDiscordAlert(service.name, latency);
    setPreviousServiceStatus(service.id, service.status);
    return;
  }

  if (previousStatus === "DOWN" && isUp) {
    await sendDiscordRecoveryAlert(service.name, latency);
    setPreviousServiceStatus(service.id, service.status);
    return;
  }

  setPreviousServiceStatus(service.id, service.status);
}

export async function runServiceChecks(): Promise<CheckServicesResponse> {
  try {
    const results = await Promise.all(
      SERVICES.map(async (service) => {
        const result = await checkService(service.url);

        return {
          ...service,
          ...result,
          checkedAt: new Date().toISOString()
        };
      })
    );

    await Promise.all(results.map((service) => syncIncidentForService(service)));
    saveServiceSnapshot(results);

    return {
      services: results,
      history: getLatencyHistory(),
      checkedAt: new Date().toISOString(),
      source: "live"
    };
  } catch {
    return {
      services: DEMO_SERVICE_RESULTS,
      history: DEMO_LATENCY_HISTORY,
      checkedAt: new Date().toISOString(),
      source: "demo"
    };
  }
}

export async function createOutageReport(type: ReportType) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    addFallbackReport(type);
    return { ok: true, source: "fallback" as const };
  }

  const { error } = await supabase.from("reports").insert({
    type
  });

  if (error) {
    addFallbackReport(type);
    return { ok: true, source: "fallback" as const };
  }

  return { ok: true, source: "supabase" as const };
}

export async function getRecentReportCounts(): Promise<ReportsResponse> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      counts: getFallbackCounts(),
      windowMinutes: 30,
      source: "fallback"
    };
  }

  const since = new Date(Date.now() - 30 * 60_000).toISOString();
  const { data, error } = await supabase
    .from("reports")
    .select("type, created_at")
    .gte("created_at", since);

  if (error || !data) {
    return {
      counts: getFallbackCounts(),
      windowMinutes: 30,
      source: "fallback"
    };
  }

  const counts: ReportCounts = {
    wallet: 0,
    trading: 0,
    token: 0
  };

  for (const report of data) {
    const type = report.type as ReportType;

    if (type in counts) {
      counts[type] += 1;
    }
  }

  return {
    counts,
    windowMinutes: 30,
    source: "supabase"
  };
}

export async function getIncidents() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [] as IncidentRecord[];
  }

  const { data, error } = await supabase
    .from("incidents")
    .select("id, service, status, latency, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [] as IncidentRecord[];
  }

  return data as IncidentRecord[];
}