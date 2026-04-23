"use client";

import { useEffect, useState } from "react";
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

interface ChartRow {
  time: string;
  website: number;
  rpc: number;
  api: number;
}

function buildChartData(history: LatencyPoint[], useClientTime: boolean): ChartRow[] {
  return history.map((point) => ({
    time: useClientTime
      ? new Date(point.checkedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      : "--:--",
    website: point.services.website ?? 0,
    rpc: point.services.rpc ?? 0,
    api: point.services.api ?? 0
  }));
}

export function LatencyChart({ history }: { history: LatencyPoint[] }) {
  const [chartData, setChartData] = useState<ChartRow[]>(() => buildChartData(history, false));

  useEffect(() => {
    setChartData(buildChartData(history, true));
  }, [history]);

  return (
    <div className="panel p-5">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">
          Trends
        </p>
        <h3 className="mt-2 text-xl font-semibold text-white/90">Latency over time</h3>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.6)" />
            <YAxis stroke="rgba(255,255,255,0.6)" unit="ms" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.92)",
                borderColor: "rgba(255,255,255,0.1)",
                borderRadius: "16px",
                color: "#ffffff"
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="website"
              name="Bags Website"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="api"
              name="Bags API"
              stroke="#34d399"
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
