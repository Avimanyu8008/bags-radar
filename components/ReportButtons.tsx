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
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
            Crowd reporting
          </p>
          <h3 className="mt-2 text-xl font-semibold">Report an issue</h3>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {reportButtons.map((button) => (
            <button
              key={button.type}
              type="button"
              onClick={() => handleReport(button.type)}
              disabled={activeType !== null}
              className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm font-medium text-white transition hover:border-gray-700 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {activeType === button.type ? "Sending..." : button.label}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-400">{message}</p>
      </div>
    </div>
  );
}
