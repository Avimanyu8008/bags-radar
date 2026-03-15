"use client";

import { StatusBadge } from "@/components/StatusBadge";
import type { ServiceResult } from "@/data/services";

export function ServiceCard({ service }: { service: ServiceResult }) {
  return (
    <article className="panel p-5 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
            Service
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            {service.name}
          </h3>
        </div>
        <StatusBadge status={service.status} />
      </div>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">Latency</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {service.latency !== null ? `${service.latency}ms` : "Timed out"}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          {new Date(service.checkedAt).toLocaleTimeString()}
        </p>
      </div>
    </article>
  );
}
