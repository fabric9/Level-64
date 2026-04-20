create table if not exists public.match_lobbies (
  id uuid primary key default gen_random_uuid(),
  level_number integer not null references public.levels(level_number),
  status text not null default 'open' check (status in ('open', 'matched', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  level_number integer not null references public.levels(level_number),
  player_a_id uuid not null references public.profiles(id) on delete cascade,
  player_b_id uuid not null references public.profiles(id) on delete cascade,
  run_a_id uuid not null references public.player_runs(id) on delete cascade,
  run_b_id uuid not null references public.player_runs(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'active', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.match_lobbies enable row level security;
alter table public.matches enable row level security;

create policy if not exists "match_lobbies_select_all"
on public.match_lobbies
for select
using (true);

create policy if not exists "matches_select_own"
on public.matches
for select
using (auth.uid() = player_a_id or auth.uid() = player_b_id);
