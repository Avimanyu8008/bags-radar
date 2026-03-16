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
              <span className="text-white/60">•</span>
              <span className="text-white/70">
                Last checked {lastChecked.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
                })}
              </span>
            </Link>
          </div>

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
        </section>
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