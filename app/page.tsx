"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const features = [
  {
    title: "Live Monitoring Dashboard",
    description: "Real-time latency monitoring of Bags services",
    href: "/dashboard",
    cta: "Open Dashboard"
  },
  {
    title: "Public Status Page",
    description: "View the current operational status of all services",
    href: "/status",
    cta: "View Status"
  },
  {
    title: "Incident Reports",
    description: "Community reported outages and service disruptions",
    href: "/incidents",
    cta: "View Incidents"
  },
  {
    title: "Network Speed Test",
    description: "Test the response time of Bags infrastructure",
    href: "/speedtest",
    cta: "Run Speed Test"
  }
];

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Status", href: "/status" },
  { label: "Incidents", href: "/incidents" },
  { label: "Speed Test", href: "/speedtest" }
];

const previewServices = [
  { name: "Bags Website", status: "Operational", latency: "128ms", tone: "bg-emerald-400" },
  { name: "Solana RPC", status: "Degraded", latency: "286ms", tone: "bg-yellow-400" },
  { name: "Bags API", status: "Operational", latency: "164ms", tone: "bg-emerald-400" }
];

const trustItems = [
  {
    title: "No Login Required",
    description: "Use BagsRadar instantly without creating an account."
  },
  {
    title: "No Personal Data Stored",
    description: "We do not collect or store any personal user data."
  },
  {
    title: "Public Infrastructure Monitoring",
    description: "All checks monitor publicly available services only."
  }
];

export default function HomePage() {
  const [lastChecked, setLastChecked] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLastChecked(new Date());
    }, 1_000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_25%),linear-gradient(180deg,#050816_0%,#0b1020_100%)] px-4 py-6 text-white md:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col gap-10">
        <nav className="sticky top-4 z-10 rounded-full border border-white/10 bg-white/8 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl md:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="text-sm font-semibold tracking-[0.28em] text-white/90">
              BAGSRADAR
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href as any}
                  className="rounded-full border border-transparent px-3 py-1.5 transition hover:border-white/10 hover:bg-white/8 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <section className="flex flex-1 flex-col items-center justify-center gap-10">
          <div className="flex max-w-4xl animate-[fadeIn_700ms_ease-out] flex-col items-center gap-5 text-center">
            <p className="text-sm uppercase tracking-[0.38em] text-emerald-300/90">
              Bags Ecosystem Platform
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
              BagsRadar
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Real-time monitoring platform for the Bags ecosystem.
            </p>
            <Link
              href="/status"
              className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white shadow-[0_12px_32px_rgba(15,23,42,0.22)] backdrop-blur-xl transition hover:bg-white/14"
            >
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative h-3 w-3 rounded-full bg-emerald-400" />
              </span>
              <span>All systems operational</span>
              <span className="text-white/60">|</span>
              <span className="text-white/70">
                Last checked {lastChecked.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
                })}
              </span>
            </Link>
          </div>

          <section className="w-full max-w-5xl rounded-[32px] border border-white/12 bg-white/8 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.28)] backdrop-blur-xl md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/45">
                    Live Dashboard Preview
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Monitoring at a glance
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                    A lightweight preview of the BagsRadar monitoring experience, showing the service health layout before you open the full dashboard.
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center rounded-full border border-white/12 bg-black/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  Open full dashboard
                </Link>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#0a1326]/80 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-emerald-300/80">
                      Bags Ecosystem Monitor
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">BagsRadar</h3>
                  </div>
                  <div className="text-right text-sm text-slate-300">
                    <p>Average latency</p>
                    <p className="mt-1 text-xl font-semibold text-white">193ms</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {previewServices.map((service) => (
                    <div
                      key={service.name}
                      className="rounded-2xl border border-white/10 bg-white/6 p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/8"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                            Service
                          </p>
                          <h4 className="mt-2 text-lg font-semibold text-white">
                            {service.name}
                          </h4>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85">
                          <span className={`h-2.5 w-2.5 rounded-full ${service.tone}`} />
                          {service.status}
                        </span>
                      </div>
                      <div className="mt-6">
                        <p className="text-sm text-white/45">Latency</p>
                        <p className="mt-2 text-3xl font-semibold text-white">{service.latency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid w-full gap-5 md:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group relative overflow-hidden rounded-[28px] border border-white/12 bg-white/8 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-white/18 hover:bg-white/10"
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),transparent_45%,transparent)] opacity-70" />
                <div className="relative flex min-h-64 flex-col justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/45">
                      Feature
                    </p>
                    <h2 className="mt-4 text-2xl font-semibold text-white">
                      {feature.title}
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
                      {feature.description}
                    </p>
                  </div>

                  <div className="mt-8">
                    <Link
                      href={feature.href as any}
                      className="inline-flex items-center rounded-full border border-white/12 bg-black/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                    >
                      {feature.cta}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="w-full rounded-[28px] border border-white/12 bg-white/8 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.24)] backdrop-blur-xl md:p-8">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/45">
                  Privacy & Transparency
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {trustItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-black/10 p-5 text-left"
                  >
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>

        <footer className="mt-auto border-t border-white/10 py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div>
              <p className="text-base font-semibold text-white">BagsRadar</p>
              <p className="mt-1 text-sm text-slate-300">
                Real-time monitoring for the Bags ecosystem.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href as any}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}