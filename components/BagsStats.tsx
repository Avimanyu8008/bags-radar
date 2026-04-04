"use client";

import { useEffect, useState } from "react";
import type { BagsData } from "@/lib/bags";
import { getBagsData } from "@/lib/bags";

function formatCurrency(value: number, maximumFractionDigits: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: maximumFractionDigits > 2 ? maximumFractionDigits : 2,
    maximumFractionDigits
  }).format(value);
}

export default function BagsStats() {
  const [data, setData] = useState<BagsData | null>(null);

  useEffect(() => {
    let mounted = true;

    getBagsData().then((result) => {
      if (mounted) {
        setData(result);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!data) {
    return null;
  }

  const health =
    data.change > 5 ? "Strong" :
    data.change > 0 ? "Stable" : "Weak";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-[0_0_80px_rgba(139,92,246,0.18)]">
      <div className="mb-2 text-xs text-white/60">BAGS ECOSYSTEM</div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-lg font-semibold text-white/90">
            ${formatCurrency(data.price, 4)}
          </div>
          <div className="text-xs text-white/50">
            24h volume: ${formatCurrency(data.volume, 0)}
          </div>
          <div className="mt-1 text-xs text-white/50">
            Ecosystem health: {health}
          </div>
        </div>

        <div
          className={`text-sm font-medium ${
            data.change >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {data.change >= 0 ? "+" : ""}{data.change}%
        </div>
      </div>
    </div>
  );
}
