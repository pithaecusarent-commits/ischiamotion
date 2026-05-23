create table if not exists public.vehicle_availability_rules (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  renter_id uuid not null references public.renters(id) on delete cascade,
  date_from date not null,
  date_to date not null,
  is_closed boolean not null default false,
  min_stay_days integer not null default 1,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vehicle_availability_rules_date_check check (date_to >= date_from),
  constraint vehicle_availability_rules_min_stay_check check (min_stay_days >= 1)
);

drop policy if exists "Renters can read own vehicles" on public.vehicles;
create policy "Renters can read own vehicles"
on public.vehicles for select
to authenticated
using (
  public.is_renter()
  and renter_id in (select public.current_renter_ids())
);

create index if not exists vehicle_availability_rules_vehicle_id_idx
on public.vehicle_availability_rules(vehicle_id);

create index if not exists vehicle_availability_rules_renter_id_idx
on public.vehicle_availability_rules(renter_id);

create index if not exists vehicle_availability_rules_dates_idx
on public.vehicle_availability_rules(date_from, date_to);

alter table public.vehicle_availability_rules enable row level security;

drop trigger if exists set_vehicle_availability_rules_updated_at on public.vehicle_availability_rules;
create trigger set_vehicle_availability_rules_updated_at
before update on public.vehicle_availability_rules
for each row execute function public.set_updated_at();

drop policy if exists "Admins can read vehicle availability rules" on public.vehicle_availability_rules;
create policy "Admins can read vehicle availability rules"
on public.vehicle_availability_rules for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert vehicle availability rules" on public.vehicle_availability_rules;
create policy "Admins can insert vehicle availability rules"
on public.vehicle_availability_rules for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update vehicle availability rules" on public.vehicle_availability_rules;
create policy "Admins can update vehicle availability rules"
on public.vehicle_availability_rules for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete vehicle availability rules" on public.vehicle_availability_rules;
create policy "Admins can delete vehicle availability rules"
on public.vehicle_availability_rules for delete
to authenticated
using (public.is_admin());

drop policy if exists "Renters can read own vehicle availability rules" on public.vehicle_availability_rules;
create policy "Renters can read own vehicle availability rules"
on public.vehicle_availability_rules for select
to authenticated
using (
  public.is_renter()
  and renter_id in (select public.current_renter_ids())
  and exists (
    select 1
    from public.vehicles v
    where v.id = vehicle_availability_rules.vehicle_id
      and v.renter_id = vehicle_availability_rules.renter_id
  )
);

drop policy if exists "Renters can insert own vehicle availability rules" on public.vehicle_availability_rules;
create policy "Renters can insert own vehicle availability rules"
on public.vehicle_availability_rules for insert
to authenticated
with check (
  public.is_renter()
  and renter_id in (select public.current_renter_ids())
  and exists (
    select 1
    from public.vehicles v
    where v.id = vehicle_availability_rules.vehicle_id
      and v.renter_id = vehicle_availability_rules.renter_id
  )
);

drop policy if exists "Renters can update own vehicle availability rules" on public.vehicle_availability_rules;
create policy "Renters can update own vehicle availability rules"
on public.vehicle_availability_rules for update
to authenticated
using (
  public.is_renter()
  and renter_id in (select public.current_renter_ids())
  and exists (
    select 1
    from public.vehicles v
    where v.id = vehicle_availability_rules.vehicle_id
      and v.renter_id = vehicle_availability_rules.renter_id
  )
)
with check (
  public.is_renter()
  and renter_id in (select public.current_renter_ids())
  and exists (
    select 1
    from public.vehicles v
    where v.id = vehicle_availability_rules.vehicle_id
      and v.renter_id = vehicle_availability_rules.renter_id
  )
);

drop policy if exists "Renters can delete own vehicle availability rules" on public.vehicle_availability_rules;
create policy "Renters can delete own vehicle availability rules"
on public.vehicle_availability_rules for delete
to authenticated
using (
  public.is_renter()
  and renter_id in (select public.current_renter_ids())
  and exists (
    select 1
    from public.vehicles v
    where v.id = vehicle_availability_rules.vehicle_id
      and v.renter_id = vehicle_availability_rules.renter_id
  )
);
