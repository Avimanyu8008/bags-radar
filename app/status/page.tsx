"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { IncidentRecord, ServiceResult, ServiceStatus } from "@/data/services";
import { DEMO_SERVICE_RESULTS } from "@/data/services";
import { getSupabaseClient } from "@/lib/supabaseClient";

interface CheckServicesPayload {
  services: ServiceResult[];
  checkedAt: string;
  source: "live" | "demo";
}

const uptimeLabels: Record<ServiceStatus, string> = {
  UP: "99.9%",
  SLOW: "99.0%",
  DOWN: "95.0%"
};

function getBarClass(color: "green" | "yellow" | "red") {
  if (color === "red") {
    return "bg-red-500";
  }

  if (color === "yellow") {
    return "bg-yellow-400";
  }

  return "bg-green-500";
}

function buildUptimeBars(service: ServiceResult, incidents: IncidentRecord[]) {
  const bars = Array.from<"green" | "yellow" | "red">({ length: 30 }).fill("green");
  const relevantIncidents = incidents.filter((incident) => incident.service === service.name);

  if (service.status === "SLOW") {
    bars[28] = "yellow";
    bars[29] = "yellow";
  }

  if (service.status === "DOWN") {
    bars[26] = "red";
    bars[27] = "red";
    bars[28] = "red";
    bars[29] = "red";
  }

  relevantIncidents.slice(0, 3).forEach((incident, index) => {
    const cursor = Math.max(0, 27 - index * 2);

    if (incident.status === "down") {
      bars[cursor] = "red";
      bars[Math.min(cursor + 1, 29)] = "red";
    }
  });

  return bars;
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceResult[]>(DEMO_SERVICE_RESULTS);
  const [checkedAt, setCheckedAt] = useState<string>(new Date().toISOString());
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadStatusPage() {
      try {
        const [statusResponse, incidentsResponse] = await Promise.all([
          fetch("/api/check-services", {
            cache: "no-store"
          }),
          getSupabaseClient()
            ?.from("incidents")
            .select("id, service, status, latency, created_at")
            .order("created_at", { ascending: false })
            .limit(10)
        ]);

        if (!mounted) {
          return;
        }

        if (statusResponse.ok) {
          const payload = (await statusResponse.json()) as CheckServicesPayload;
          setServices(payload.services);
          setCheckedAt(payload.checkedAt);
        }

        if (incidentsResponse && !incidentsResponse.error && incidentsResponse.data) {
          setIncidents(incidentsResponse.data as IncidentRecord[]);
        }
      } catch {
        if (!mounted) {
          return;
        }
      }
    }

    loadStatusPage();
    const interval = window.setInterval(loadStatusPage, 15_000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-[#111111] md:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-5">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Bags Ecosystem Status
            </h1>
          </div>

          <div className="rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] px-6 py-5">
            <p className="text-lg font-semibold text-[#166534]">
              We&apos;re fully operational
            </p>
            <p className="mt-1 text-sm text-[#166534]">
              We&apos;re not aware of any issues affecting our systems.
            </p>
          </div>

          <p className="text-sm text-[#525252]">
            Last updated{" "}
            {new Date(checkedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            })}
          </p>
        </header>

        <section className="rounded-3xl border border-[#e5e5e5] bg-[#f7f7f7] p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#111111]">System status</h2>
            </div>

            <div className="space-y-6">
              {services.map((service) => {
                const bars = buildUptimeBars(service, incidents);

                return (
                  <div
                    key={service.id}
                    className="border-b border-[#e5e5e5] pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <h3 className="text-lg font-medium text-[#111111]">
                        {service.name}
                      </h3>
                      <span className="text-sm text-[#525252]">
                        {service.status === "UP"
                          ? "Operational"
                          : service.status === "SLOW"
                            ? "Degraded"
                            : "Outage"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {bars.map((bar, index) => (
                        <span
                          key={`${service.id}-${index}`}
                          className={`h-8 w-2.5 rounded-sm ${getBarClass(bar)}`}
                        />
                      ))}
                    </div>

                    <p className="mt-3 text-sm text-[#525252]">
                      {uptimeLabels[service.status]} uptime
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between rounded-2xl border border-[#e5e5e5] bg-[#f7f7f7] px-6 py-4">
          <div>
            <p className="text-base font-medium text-[#111111]">View incident history</p>
            <p className="mt-1 text-sm text-[#525252]">
              {incidents.length > 0
                ? `${incidents.length} recent incident updates available`
                : "Check the incident timeline for recent updates"}
            </p>
          </div>
          <Link
            href="/incidents"
            className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-semibold text-[#111111] transition hover:bg-[#fafafa]"
          >
            Open timeline
          </Link>
        </div>
      </div>
    </main>
  );
}