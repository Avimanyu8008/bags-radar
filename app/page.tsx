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
    <main className="min-h-screen overflow-x-hidden overflow-y-hidden bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_25%),linear-gradient(180deg,#050816_0%,#0b1020_100%)] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col gap-10">
        <nav className="sticky top-4 z-10 rounded-3xl border border-white/10 bg-white/8 px-3 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:rounded-full sm:px-4 md:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="text-center text-xs font-semibold tracking-[0.28em] text-white/90 sm:text-left sm:text-sm">
              BAGSRADAR
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-white/70 sm:gap-2 sm:text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href as any}
                  className="rounded-full border border-transparent px-2.5 py-1.5 transition hover:border-white/10 hover:bg-white/8 hover:text-white sm:px-3"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <section className="relative flex flex-1 flex-col items-center justify-center gap-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[24rem] overflow-hidden sm:h-[28rem]">
            <div className="absolute left-1/2 top-10 h-60 w-[20rem] -translate-x-[58%] rounded-full bg-cyan-400/10 blur-3xl animate-[auroraFloat_20s_ease-in-out_infinite] sm:h-72 sm:w-[34rem]" />
            <div className="absolute right-[4%] top-24 h-52 w-[16rem] rounded-full bg-teal-300/8 blur-3xl animate-[auroraDrift_18s_ease-in-out_infinite] sm:right-[8%] sm:h-64 sm:w-[26rem]" />
            <div className="absolute left-[8%] top-28 h-44 w-[14rem] rounded-full bg-sky-300/7 blur-3xl animate-[auroraDrift_24s_ease-in-out_infinite_reverse] sm:left-[12%] sm:h-56 sm:w-[22rem]" />
          </div>

          <div className="relative flex max-w-4xl animate-[fadeIn_700ms_ease-out] flex-col items-center gap-5 px-4 text-center">
            <p className="text-xs uppercase tracking-[0.34em] text-emerald-300/90 sm:text-sm sm:tracking-[0.38em]">
              Bags Ecosystem Platform
            </p>
            <div className="relative">
              <div className="absolute left-1/2 top-1/2 h-24 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/18 blur-3xl sm:h-32 sm:w-72" />
              <div className="absolute left-1/2 top-1/2 h-20 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300/12 blur-2xl sm:h-24 sm:w-56" />
              <h1 className="relative max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                BagsRadar
              </h1>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base md:text-lg">
              Real-time monitoring platform for the Bags ecosystem.
            </p>
            <Link
              href="/status"
              className="inline-flex w-full max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-center text-sm font-medium text-white shadow-[0_12px_32px_rgba(15,23,42,0.22)] backdrop-blur-xl transition hover:bg-white/14 sm:w-auto sm:gap-3 sm:px-5"
            >
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="absolute inline-flex h-3 w-3 rounded-full bg-emerald-400/35 animate-[statusDot_2s_ease-in-out_infinite]" />
                <span className="relative h-3 w-3 rounded-full bg-emerald-400 animate-[statusDot_2s_ease-in-out_infinite]" />
              </span>
              <span>All systems operational</span>
              <span className="hidden text-white/60 sm:inline">|</span>
              <span className="text-white/70">
                Last checked {lastChecked.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
                })}
              </span>
            </Link>
          </div>

          <section className="w-full max-w-5xl rounded-[28px] border border-white/12 bg-white/8 px-4 py-5 shadow-[0_24px_80px_rgba(2,6,23,0.28)] backdrop-blur-xl sm:rounded-[32px] sm:p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
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
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/12 bg-black/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 md:w-auto"
                >
                  Open full dashboard
                </Link>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#0a1326]/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:rounded-[28px] sm:p-5">
                <div className="flex flex-col gap-4 border-b border-white/8 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-emerald-300/80">
                      Bags Ecosystem Monitor
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">BagsRadar</h3>
                  </div>
                  <div className="text-left text-sm text-slate-300 sm:text-right">
                    <p>Average latency</p>
                    <p className="mt-1 text-xl font-semibold text-white">193ms</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 grid-cols-1 md:grid-cols-3">
                  {previewServices.map((service) => (
                    <div
                      key={service.name}
                      className="rounded-2xl border border-white/10 bg-white/6 p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/8"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                            Service
                          </p>
                          <h4 className="mt-2 text-lg font-semibold text-white">
                            {service.name}
                          </h4>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-black/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85">
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

          <section className="grid w-full gap-5 grid-cols-1 sm:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group relative overflow-hidden rounded-[28px] border border-white/12 bg-white/8 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.28)] backdrop-blur-xl transition-[transform,filter,box-shadow,border-color,background-color] duration-300 hover:-translate-y-1.5 hover:border-cyan-300/28 hover:bg-white/10 hover:brightness-110 hover:shadow-[0_24px_70px_rgba(34,211,238,0.14)]"
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),transparent_45%,transparent)] opacity-70" />
                <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.12),transparent_40%)]" />
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
                      className="inline-flex w-full items-center justify-center rounded-full border border-white/12 bg-black/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 sm:w-auto"
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
              <div className="text-center md:text-left">
                <p className="text-sm uppercase tracking-[0.3em] text-white/45">
                  Privacy & Transparency
                </p>
              </div>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                {trustItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-black/10 p-5 text-center md:text-left"
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

        @keyframes statusDot {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.92;
          }

          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        @keyframes auroraFloat {
          0%,
          100% {
            transform: translate3d(-8%, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(4%, 6%, 0) scale(1.08);
          }
        }

        @keyframes auroraDrift {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          33% {
            transform: translate3d(3%, -4%, 0) scale(1.04);
          }

          66% {
            transform: translate3d(-4%, 5%, 0) scale(1.06);
          }
        }
      `}</style>
    </main>
  );
}