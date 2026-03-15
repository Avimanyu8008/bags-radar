"use client";

import clsx from "clsx";
import type { ServiceStatus } from "@/data/services";

const badgeStyles: Record<ServiceStatus, string> = {
  UP: "bg-green-400/10 text-green-400 ring-green-400/20",
  SLOW: "bg-yellow-400/10 text-yellow-400 ring-yellow-400/20",
  DOWN: "bg-red-400/10 text-red-400 ring-red-400/20"
};

export function StatusBadge({ status }: { status: ServiceStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ring-1",
        badgeStyles[status]
      )}
    >
      <span>●</span>
      {status}
    </span>
  );
}
