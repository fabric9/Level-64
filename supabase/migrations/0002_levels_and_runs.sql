create table if not exists public.levels (
  level_number integer primary key,
  title text not null,
  prize_amount numeric(12,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.player_runs (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.profiles(id) on delete cascade,
  current_level integer not null default 1 references public.levels(level_number),
  status text not null default 'queued' check (status in ('queued', 'active', 'eliminated', 'withdrawn', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.levels enable row level security;
alter table public.player_runs enable row level security;

create policy if not exists "levels_select_all"
on public.levels
for select
using (true);

create policy if not exists "player_runs_select_own"
on public.player_runs
for select
using (auth.uid() = player_id);

create policy if not exists "player_runs_insert_own"
on public.player_runs
for insert
with check (auth.uid() = player_id);

create policy if not exists "player_runs_update_own"
on public.player_runs
for update
using (auth.uid() = player_id)
with check (auth.uid() = player_id);

insert into public.levels (level_number, title, prize_amount)
select gs, 'Level ' || gs, case when gs = 1 then 100 else gs * 100 end
from generate_series(1, 64) as gs
on conflict (level_number) do nothing;
