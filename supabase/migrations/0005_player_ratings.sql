alter table public.profiles
add column if not exists rating integer not null default 1200,
add column if not exists wins integer not null default 0,
add column if not exists losses integer not null default 0;

create table if not exists public.rating_events (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.profiles(id) on delete cascade,
  match_id uuid not null references public.matches(id) on delete cascade,
  old_rating integer not null,
  new_rating integer not null,
  delta integer not null,
  created_at timestamptz not null default now()
);

alter table public.rating_events enable row level security;

create policy if not exists "rating_events_select_own"
on public.rating_events
for select
using (auth.uid() = player_id);
