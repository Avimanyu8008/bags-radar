import Link from "next/link";

const features = [
  {
    title: "Live Monitoring Dashboard",
    description: "Real-time latency monitoring of Bags services",
    href: "/",
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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center gap-10">
        <header className="flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-green-400">
            Bags Ecosystem Platform
          </p>
          <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
            BagsRadar
          </h1>
          <p className="text-base text-gray-300 md:text-lg">
            Real-time monitoring platform for the Bags ecosystem.
          </p>
        </header>

        <section className="grid w-full gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="panel flex min-h-64 flex-col justify-between p-6 transition duration-300 hover:-translate-y-1 hover:border-gray-700 hover:bg-gray-900"
            >
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
                  Feature
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  {feature.title}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-gray-300">
                  {feature.description}
                </p>
              </div>

              <div className="mt-8">
                <Link
                  href={feature.href}
                  className="inline-flex rounded-full border border-gray-700 px-5 py-2.5 text-sm font-semibold transition hover:border-gray-500 hover:bg-gray-800"
                >
                  {feature.cta}
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}