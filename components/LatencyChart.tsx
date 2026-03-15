"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { LatencyPoint } from "@/data/services";

export function LatencyChart({ history }: { history: LatencyPoint[] }) {
  const chartData = history.map((point) => ({
    time: new Date(point.checkedAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    }),
    website: point.services.website ?? 0,
    rpc: point.services.rpc ?? 0,
    api: point.services.api ?? 0
  }));

  return (
    <div className="panel p-5">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
          Trends
        </p>
        <h3 className="mt-2 text-xl font-semibold">Latency over time</h3>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" unit="ms" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                borderColor: "#1f2937",
                borderRadius: "12px"
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="website"
              name="Bags Website"
              stroke="#4ade80"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="api"
              name="Bags API"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="rpc"
              name="Solana RPC"
              stroke="#facc15"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
