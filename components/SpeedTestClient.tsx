"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ServiceCard } from "@/components/ServiceCard";
import { DEMO_SERVICE_RESULTS, type ServiceResult } from "@/data/services";

interface DashboardPayload {
  services: ServiceResult[];
}

export function SpeedTestClient() {
  const [services, setServices] = useState<ServiceResult[]>(DEMO_SERVICE_RESULTS);
  const [running, setRunning] = useState(false);

  async function runSpeedTest() {
    setRunning(true);

    try {
      const response = await fetch("/api/check-services", { cache: "no-store" });

      if (!response.ok) {
        throw new Error("Speed test failed");
      }

      const payload = (await response.json()) as DashboardPayload;
      setServices(payload.services);
    } catch {
      setServices(DEMO_SERVICE_RESULTS);
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => {
    runSpeedTest();
  }, []);

  const averageLatency = useMemo(() => {
    const values = services
      .map((service) => service.latency)
      .filter((latency): latency is number => typeof latency === "number");

    if (values.length === 0) {
      return null;
    }

    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  }, [services]);

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="panel p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-400">
                BagsRadar Labs
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                Speed Test
              </h1>
              <p className="mt-3 max-w-2xl text-gray-300">
                One-click latency test for the Bags website, API, and Solana RPC.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={runSpeedTest}
                disabled={running}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {running ? "Running..." : "Run speed test"}
              </button>
              <Link
                href="/"
                className="rounded-full border border-gray-700 px-5 py-2.5 text-sm font-semibold transition hover:border-gray-500 hover:bg-gray-800"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </section>

        <section className="panel p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
            Test summary
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-gray-800 bg-gray-950 p-4"
              >
                <p className="text-sm text-gray-400">{service.name}</p>
                <p className="mt-2 text-2xl font-semibold">
                  {service.latency !== null ? `${service.latency}ms` : "Timed out"}
                </p>
              </div>
            ))}

            <div className="rounded-2xl border border-sky-400/30 bg-sky-400/10 p-4">
              <p className="text-sm text-sky-200">Average latency</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {averageLatency !== null ? `${averageLatency}ms` : "N/A"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}