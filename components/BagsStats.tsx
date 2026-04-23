"use client";

import { useEffect, useState } from "react";
import { formatInteger, formatPrice, safeNumber } from "@/lib/format";

interface EcosystemSnapshot {
  price: number | null;
  volume: number | null;
}

export default function BagsStats() {
  const [data, setData] = useState<EcosystemSnapshot>({
    price: null,
    volume: null
  });

  useEffect(() => {
    let mounted = true;

    async function loadMarketData() {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_vol=true",
          {
            cache: "no-store"
          }
        );

        if (!response.ok) {
          throw new Error("CoinGecko request failed");
        }

        const payload = (await response.json()) as {
          solana?: {
            usd?: number;
            usd_24h_vol?: number;
          };
        };

        if (!mounted) {
          return;
        }

        setData({
          price: payload.solana?.usd ?? null,
          volume: payload.solana?.usd_24h_vol ?? null
        });
      } catch {
        if (!mounted) {
          return;
        }

        setData({
          price: null,
          volume: null
        });
      }
    }

    loadMarketData();
    const interval = window.setInterval(loadMarketData, 30_000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const hasPrice = data.price !== null;
  const hasVolume = data.volume !== null;
  const safePrice = safeNumber(data.price ?? 0);
  const safeVolume = safeNumber(data.volume ?? 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-[0_0_40px_rgba(16,185,129,0.08)]">
      <div className="mb-2 text-xs text-white/60">BAGS ECOSYSTEM</div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-lg font-semibold text-white/90">
            {hasPrice ? `$${formatPrice(safePrice)}` : "--"}
          </div>
          <div className="text-xs text-white/50">
            24h volume: {hasVolume ? `$${formatInteger(safeVolume)}` : "--"}
          </div>
        </div>

        <div className="text-sm font-medium text-emerald-400">
          Live
        </div>
      </div>
    </div>
  );
}
