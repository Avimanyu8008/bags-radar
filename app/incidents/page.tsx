import Link from "next/link";
import { getIncidents } from "@/lib/monitoring";

export const dynamic = "force-dynamic";

export default async function IncidentsPage() {
  const incidents = await getIncidents();

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="panel p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-400">
                BagsRadar Timeline
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                Incidents
              </h1>
              <p className="mt-3 max-w-2xl text-gray-300">
                Latest service incidents from Supabase, ordered newest first.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/"
                className="rounded-full border border-gray-700 px-5 py-2.5 text-sm font-semibold transition hover:border-gray-500 hover:bg-gray-800"
              >
                Dashboard
              </Link>
              <Link
                href="/speedtest"
                className="rounded-full border border-gray-700 px-5 py-2.5 text-sm font-semibold transition hover:border-gray-500 hover:bg-gray-800"
              >
                Speed test
              </Link>
            </div>
          </div>
        </header>

        <section className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800 text-sm">
              <thead className="bg-gray-900/80 text-left text-xs uppercase tracking-[0.28em] text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Time</th>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-gray-900/60 text-gray-200">
                {incidents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                      No incidents logged yet. Connect Supabase and let the monitor run to populate this table.
                    </td>
                  </tr>
                ) : (
                  incidents.map((incident) => (
                    <tr key={incident.id} className="transition hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(incident.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-white">{incident.service}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${
                            incident.status === "down"
                              ? "bg-red-400/10 text-red-400"
                              : "bg-green-400/10 text-green-400"
                          }`}
                        >
                          {incident.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{incident.latency}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}