# BagsRadar

BagsRadar is a hackathon-ready monitoring dashboard for the Bags ecosystem. It combines a DownDetector-style status board, a speed test page, crowd outage reporting, and a latency trend chart in a clean dark UI.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Next.js API routes
- Supabase (PostgreSQL)
- Recharts
- Vercel

## Features

- Monitors `https://bags.fm`, `https://bags.fm/api`, and `https://api.mainnet-beta.solana.com`
- Calculates service latency with `fetch()` and `Date.now()`
- Status mapping: `UP`, `SLOW`, `DOWN`
- Speed test page at `/speedtest`
- Crowd outage reporting via `/api/report`
- Report analytics for the last 30 minutes via `/api/reports`
- Latency trend chart for the latest 10 measurements
- Auto-refresh every 30 seconds
- Demo-mode fallback data when live checks or Supabase are unavailable

## Project structure

- `app/page.tsx`
- `app/speedtest/page.tsx`
- `app/api/check-services/route.ts`
- `app/api/report/route.ts`
- `app/api/reports/route.ts`
- `components/ServiceCard.tsx`
- `components/StatusBadge.tsx`
- `components/ReportButtons.tsx`
- `components/LatencyChart.tsx`
- `lib/checkService.ts`
- `lib/supabaseClient.ts`
- `data/services.ts`

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

If these values are missing, BagsRadar still works in demo mode using in-memory fallback reports and seeded sample metrics.

## Supabase setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run the SQL in `supabase/schema.sql`.
4. Copy the project URL and anon key into `.env.local`.

## Local development

1. Install Node.js 18.17+ or Node.js 20+.
2. Install dependencies:

```bash
npm install
```

3. Start the app:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Deploy to Vercel

1. Push this project to GitHub.
2. Import the repo into Vercel.
3. Add these environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.

Vercel will build the Next.js app automatically. The API routes under `app/api/*` will deploy as serverless functions.

## Notes

- `checkService()` uses a lightweight JSON-RPC health request for Solana RPC so that the latency check reflects real endpoint availability.
- The latency history is stored in memory for demo simplicity. If you want persistent trend history later, you can move snapshots into Supabase.
- Because this workspace does not currently have Node.js installed, dependency installation and runtime verification need to be done once Node is available.