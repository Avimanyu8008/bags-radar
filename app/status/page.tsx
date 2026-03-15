"use client";

import { useEffect, useState } from "react";
import type { ServiceResult, ServiceStatus } from "@/data/services";
import { DEMO_SERVICE_RESULTS } from "@/data/services";

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

export default function StatusPage() {
  const [services, setServices] = useState<ServiceResult[]>(DEMO_SERVICE_RESULTS);
  const [checkedAt, setCheckedAt] = useState<string>(new Date().toISOString());

  useEffect(() => {
    let mounted = true;

    async function loadStatus() {
      try {
        const response = await fetch("/api/check-services", {
          cache: "no-store"
        });

        if (!response.ok || !mounted) {
          return;
        }

        const payload = (await response.json()) as CheckServicesPayload;
        setServices(payload.services);
        setCheckedAt(payload.checkedAt);
      } catch {
        if (!mounted) {
          return;
        }
      }
    }

    loadStatus();
    const interval = window.setInterval(loadStatus, 15_000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

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
      </div>
    </main>
  );
}