"use client";

import { useState } from "react";
import type { ReportType } from "@/data/services";

const reportButtons: { label: string; type: ReportType }[] = [
  { label: "Report Wallet Issue", type: "wallet" },
  { label: "Report Trading Issue", type: "trading" },
  { label: "Report Token Page Issue", type: "token" }
];

export function ReportButtons() {
  const [activeType, setActiveType] = useState<ReportType | null>(null);
  const [message, setMessage] = useState("Community reports help spot outages fast.");

  async function handleReport(type: ReportType) {
    setActiveType(type);
    setMessage("Submitting report...");

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ type })
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      setMessage("Report received. Thanks for helping the Bags community.");
    } catch {
      setMessage("Report saved in demo mode. Supabase can be connected later.");
    } finally {
      setActiveType(null);
    }
  }

  return (
    <div className="panel p-5">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">
            Crowd reporting
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white/90">Report an issue</h3>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {reportButtons.map((button) => (
            <button
              key={button.type}
              type="button"
              onClick={() => handleReport(button.type)}
              disabled={activeType !== null}
              className="rounded-2xl bg-emerald-500/90 px-4 py-3 text-sm font-medium text-black transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {activeType === button.type ? "Sending..." : button.label}
            </button>
          ))}
        </div>

        <p className="text-sm text-white/60">{message}</p>
      </div>
    </div>
  );
}

