alter table public.users enable row level security;
alter table public.pets enable row level security;
alter table public.scans enable row level security;
alter table public.pet_actions enable row level security;
alter table public.activities enable row level security;
alter table public.recycling_facilities enable row level security;

drop policy if exists "deny direct users access" on public.users;
drop policy if exists "deny direct pets access" on public.pets;
drop policy if exists "deny direct scans access" on public.scans;
drop policy if exists "deny direct pet_actions access" on public.pet_actions;
drop policy if exists "deny direct activities access" on public.activities;
drop policy if exists "deny direct recycling_facilities access" on public.recycling_facilities;

create policy "deny direct users access" on public.users
  for all
  using (false)
  with check (false);

create policy "deny direct pets access" on public.pets
  for all
  using (false)
  with check (false);

create policy "deny direct scans access" on public.scans
  for all
  using (false)
  with check (false);

create policy "deny direct pet_actions access" on public.pet_actions
  for all
  using (false)
  with check (false);

create policy "deny direct activities access" on public.activities
  for all
  using (false)
  with check (false);

create policy "deny direct recycling_facilities access" on public.recycling_facilities
  for all
  using (false)
  with check (false);
