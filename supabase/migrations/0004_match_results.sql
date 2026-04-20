create table if not exists public.match_results (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  winner_player_id uuid not null references public.profiles(id) on delete cascade,
  loser_player_id uuid not null references public.profiles(id) on delete cascade,
  winning_run_id uuid not null references public.player_runs(id) on delete cascade,
  losing_run_id uuid not null references public.player_runs(id) on delete cascade,
  level_number integer not null references public.levels(level_number),
  result_type text not null default 'adjudicated' check (result_type in ('checkmate', 'resign', 'timeout', 'adjudicated')),
  created_at timestamptz not null default now()
);

alter table public.match_results enable row level security;

create policy if not exists "match_results_select_own"
on public.match_results
for select
using (auth.uid() = winner_player_id or auth.uid() = loser_player_id);
