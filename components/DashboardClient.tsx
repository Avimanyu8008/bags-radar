"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LatencyChart } from "@/components/LatencyChart";
import { ReportButtons } from "@/components/ReportButtons";
import { ServiceCard } from "@/components/ServiceCard";
import {
  DEMO_LATENCY_HISTORY,
  DEMO_REPORT_COUNTS,
  DEMO_SERVICE_RESULTS,
  REPORT_LABELS,
  type LatencyPoint,
  type ReportCounts,
  type ServiceResult
} from "@/data/services";

interface DashboardPayload {
  services: ServiceResult[];
  history: LatencyPoint[];
  checkedAt: string;
  source: "live" | "demo";
}

interface ReportsPayload {
  counts: ReportCounts;
  windowMinutes: number;
  source: "supabase" | "fallback";
}

export function DashboardClient() {
  const [services, setServices] = useState<ServiceResult[]>(DEMO_SERVICE_RESULTS);
  const [history, setHistory] = useState<LatencyPoint[]>(DEMO_LATENCY_HISTORY);
  const [counts, setCounts] = useState<ReportCounts>(DEMO_REPORT_COUNTS);
  const [checkedAt, setCheckedAt] = useState<string>(new Date().toISOString());
  const [source, setSource] = useState<DashboardPayload["source"]>("demo");
  const discordAlertsEnabled =
    process.env.NEXT_PUBLIC_DISCORD_ENABLED === "true";

  console.log("DISCORD ENV:", process.env.NEXT_PUBLIC_DISCORD_ENABLED);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        const [servicesResponse, reportsResponse] = await Promise.all([
          fetch("/api/check-services", { cache: "no-store" }),
          fetch("/api/reports", { cache: "no-store" })
        ]);

        if (!mounted) {
          return;
        }

        if (servicesResponse.ok) {
          const servicesPayload = (await servicesResponse.json()) as DashboardPayload;
          setServices(servicesPayload.services);
          setHistory(servicesPayload.history);
          setCheckedAt(servicesPayload.checkedAt);
          setSource(servicesPayload.source);
        }

        if (reportsResponse.ok) {
          const reportsPayload = (await reportsResponse.json()) as ReportsPayload;
          setCounts(reportsPayload.counts);
        }
      } catch {
        if (!mounted) {
          return;
        }
      }
    }

    loadDashboard();
    const interval = window.setInterval(loadDashboard, 30_000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const averageLatency = useMemo(() => {
    const validLatencies = services
      .map((service) => service.latency)
      .filter((latency): latency is number => typeof latency === "number");

    if (validLatencies.length === 0) {
      return null;
    }

    return Math.round(
      validLatencies.reduce((total, value) => total + value, 0) /
        validLatencies.length
    );
  }, [services]);

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="panel relative overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 -z-10 bg-grid bg-[size:18px_18px] opacity-20" />
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-green-400">
                Bags Ecosystem Monitor
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                BagsRadar
              </h1>
              <p className="mt-3 max-w-2xl text-base text-gray-300 md:text-lg">
                Real-time health dashboard for the Bags ecosystem.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-sm text-gray-300 md:items-end">
              <span>
                Last check:{" "}
                {new Date(checkedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
                })}
              </span>
              <span>
                Average latency: {averageLatency !== null ? `${averageLatency}ms` : "N/A"}
              </span>
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <div className="flex items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      source === "live" ? "bg-green-400" : "bg-yellow-400"
                    }`}
                  />
                  <span>{source === "live" ? "Live checks" : "Demo mode"}</span>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
                    discordAlertsEnabled
                      ? "bg-green-400/10 text-green-400 ring-1 ring-green-400/20"
                      : "bg-yellow-400/10 text-yellow-400 ring-1 ring-yellow-400/20"
                  }`}
                >
                  Discord alerts: {discordAlertsEnabled ? "ACTIVE" : "NOT CONFIGURED"}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Link
                  href="/speedtest"
                  className="inline-flex rounded-full border border-gray-700 px-4 py-2 text-sm font-medium transition hover:border-gray-500 hover:bg-gray-800"
                >
                  Open speed test
                </Link>
                <Link
                  href="/incidents"
                  className="inline-flex rounded-full border border-gray-700 px-4 py-2 text-sm font-medium transition hover:border-gray-500 hover:bg-gray-800"
                >
                  View incidents
                </Link>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <LatencyChart history={history} />

          <div className="panel p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
              Reports in last 30 minutes
            </p>
            <h3 className="mt-2 text-xl font-semibold">Community outage pulse</h3>
            <div className="mt-6 space-y-4">
              {Object.entries(REPORT_LABELS).map(([type, label]) => (
                <div
                  key={type}
                  className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-950 px-4 py-4"
                >
                  <span className="text-sm text-gray-300">{label}</span>
                  <span className="text-2xl font-semibold text-white">
                    {counts[type as keyof ReportCounts]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ReportButtons />
      </div>
    </main>
  );
}