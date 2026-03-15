create extension if not exists "pgcrypto";

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('wallet', 'trading', 'token')),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  service text not null,
  status text not null check (status in ('down', 'recovered')),
  latency text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists reports_created_at_idx on public.reports (created_at desc);
create index if not exists reports_type_idx on public.reports (type);
create index if not exists incidents_created_at_idx on public.incidents (created_at desc);
create index if not exists incidents_service_idx on public.incidents (service);

alter table public.reports enable row level security;
alter table public.incidents enable row level security;

drop policy if exists "Allow public insert reports" on public.reports;
drop policy if exists "Allow public read reports" on public.reports;
drop policy if exists "Allow public insert incidents" on public.incidents;
drop policy if exists "Allow public read incidents" on public.incidents;

create policy "Allow public insert reports"
on public.reports
for insert
to anon
with check (true);

create policy "Allow public read reports"
on public.reports
for select
to anon
using (true);

create policy "Allow public insert incidents"
on public.incidents
for insert
to anon
with check (true);

create policy "Allow public read incidents"
on public.incidents
for select
to anon
using (true);