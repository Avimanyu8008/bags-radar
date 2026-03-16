"use client";

import { useEffect, useMemo, useState } from "react";
import type { IncidentRecord, ServiceResult, ServiceStatus } from "@/data/services";
import { DEMO_SERVICE_RESULTS } from "@/data/services";
import { getSupabaseClient } from "@/lib/supabaseClient";

interface CheckServicesPayload {
  services: ServiceResult[];
  checkedAt: string;
  source: "live" | "demo";
}

const publicStatusLabels: Record<ServiceStatus, string> = {
  UP: "Operational",
  SLOW: "Degraded",
  DOWN: "Outage"
};

const publicStatusStyles: Record<ServiceStatus, string> = {
  UP: "bg-green-400/10 text-green-400 ring-green-400/20",
  SLOW: "bg-yellow-400/10 text-yellow-400 ring-yellow-400/20",
  DOWN: "bg-red-400/10 text-red-400 ring-red-400/20"
};

const uptimeLabels: Record<ServiceStatus, string> = {
  UP: "99.9%",
  SLOW: "99.0%",
  DOWN: "95.0%"
};

function getIncidentTitle(incident: IncidentRecord) {
  if (incident.status === "down") {
    return `${incident.service} outage reported`;
  }

  return `${incident.service} recovered`;
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

  const globalStatus = useMemo(() => {
    if (services.some((service) => service.status === "DOWN")) {
      return {
        icon: "\uD83D\uDD34",
        label: "Major Outage",
        classes: "border-red-400/30 bg-red-400/10 text-red-300"
      };
    }

    if (services.some((service) => service.status === "SLOW")) {
      return {
        icon: "\uD83D\uDFE1",
        label: "Degraded Performance",
        classes: "border-yellow-400/30 bg-yellow-400/10 text-yellow-200"
      };
    }

    return {
      icon: "\uD83D\uDFE2",
      label: "All Systems Operational",
      classes: "border-green-400/30 bg-green-400/10 text-green-200"
    };
  }, [services]);

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="panel relative overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 -z-10 bg-grid bg-[size:18px_18px] opacity-20" />
          <div className="flex flex-col gap-4">
            <p className="text-sm uppercase tracking-[0.35em] text-green-400">
              Public status page
            </p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Bags Ecosystem Status
            </h1>
            <div className="flex justify-center">
              <div
                className={`inline-flex items-center justify-center rounded-2xl border px-6 py-4 text-center text-lg font-semibold shadow-glow ${globalStatus.classes}`}
              >
                <span className="mr-3 text-2xl">{globalStatus.icon}</span>
                <span>{globalStatus.label}</span>
              </div>
            </div>
            <p className="max-w-2xl text-base text-gray-300 md:text-lg">
              Real-time service health for the Bags ecosystem.
            </p>
            <p className="text-sm text-gray-400">
              Last checked:{" "}
              {new Date(checkedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              })}
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="panel p-5 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
                    Service
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    {service.name}
                  </h2>
                </div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ring-1 ${
                    publicStatusStyles[service.status]
                  }`}
                >
                  <span>&#9679;</span>
                  {publicStatusLabels[service.status]}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Latency</p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {service.latency !== null ? `${service.latency}ms` : "Timed out"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Uptime</p>
                  <p className="mt-1 text-sm text-gray-300">
                    {uptimeLabels[service.status]}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Last checked</p>
                  <p className="mt-1 text-sm text-gray-300">
                    {new Date(service.checkedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="panel p-6">
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
                Timeline
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Status History</h2>
            </div>

            <div className="space-y-4">
              {incidents.length === 0 ? (
                <div className="rounded-2xl border border-gray-800 bg-gray-950 px-4 py-5 text-sm text-gray-400">
                  No recent incidents yet.
                </div>
              ) : (
                incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="rounded-2xl border border-gray-800 bg-gray-950 px-4 py-4"
                  >
                    <p className="text-base font-medium text-white">
                      {getIncidentTitle(incident)}
                    </p>
                    <p className="mt-1 text-sm text-gray-300">
                      Service affected: {incident.service}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {new Date(incident.created_at).toLocaleString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}