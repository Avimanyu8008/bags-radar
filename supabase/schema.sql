create extension if not exists "pgcrypto";

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('wallet', 'trading', 'token')),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists reports_created_at_idx on public.reports (created_at desc);
create index if not exists reports_type_idx on public.reports (type);

alter table public.reports enable row level security;

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