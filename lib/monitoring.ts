import {
  DEMO_LATENCY_HISTORY,
  DEMO_SERVICE_RESULTS,
  SERVICES,
  type ReportCounts,
  type ReportType,
  type ServiceResult
} from "@/data/services";
import { checkService } from "@/lib/checkService";
import { getLatencyHistory, saveServiceSnapshot, addFallbackReport, getFallbackCounts } from "@/lib/monitorStore";
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
