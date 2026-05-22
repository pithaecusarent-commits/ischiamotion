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
);

drop view if exists public.public_vehicle_listings;
create view public.public_vehicle_listings as
select
  v.id,
  v.category_id,
  c.slug as category_slug,
  v.title_it,
  v.title_en,
  v.description_it,
  v.description_en,
  v.price_from,
  v.image_url,
  v.features_it,
  v.features_en,
  v.pickup_point_id,
  p.public_label_it as pickup_label_it,
  p.public_label_en as pickup_label_en,
  p.zone as pickup_zone,
  v.is_active
from public.vehicles v
join public.vehicle_categories c on c.id = v.category_id
join public.pickup_points p on p.id = v.pickup_point_id
where v.is_active = true
  and c.is_active = true
  and p.is_active = true;

revoke all on public.public_vehicle_listings from public;
grant select on public.public_vehicle_listings to anon, authenticated;

create or replace function public.get_public_vehicle_listings(
  lookup_category_slug text default null,
  requested_start_date date default null,
  requested_end_date date default null,
  requested_delivery_method text default null
)
returns table (
  id uuid,
  category_id uuid,
  category_slug text,
  title_it text,
  title_en text,
  description_it text,
  description_en text,
  price_from numeric,
  image_url text,
  features_it text[],
  features_en text[],
  pickup_point_id uuid,
  pickup_label_it text,
  pickup_label_en text,
  pickup_zone text,
  is_active boolean
)
language sql
security definer
set search_path = public
as $$
  with requested as (
    select
      requested_start_date as start_date,
      requested_end_date as end_date,
      case
        when requested_start_date is not null and requested_end_date is not null
        then greatest((requested_end_date - requested_start_date) + 1, 1)
        else null
      end as rental_days
  )
  select
    v.id,
    v.category_id,
    c.slug as category_slug,
    v.title_it,
    v.title_en,
    v.description_it,
    v.description_en,
    v.price_from,
    v.image_url,
    v.features_it,
    v.features_en,
    v.pickup_point_id,
    p.public_label_it as pickup_label_it,
    p.public_label_en as pickup_label_en,
    p.zone as pickup_zone,
    v.is_active
  from public.vehicles v
  join public.vehicle_categories c on c.id = v.category_id
  join public.pickup_points p on p.id = v.pickup_point_id
  cross join requested r
  where v.is_active = true
    and c.is_active = true
    and p.is_active = true
    and (lookup_category_slug is null or c.slug = lookup_category_slug)
    and (
      requested_delivery_method is null
      or exists (
        select 1
        from public.renter_delivery_capabilities dc
        where dc.renter_id = v.renter_id
          and dc.delivery_method = requested_delivery_method
          and dc.is_enabled = true
      )
    )
    and (
      r.start_date is null
      or r.end_date is null
      or not exists (
        select 1
        from public.vehicle_availability_rules ar
        where ar.vehicle_id = v.id
          and ar.renter_id = v.renter_id
          and ar.date_from <= r.end_date
          and ar.date_to >= r.start_date
          and (
            ar.is_closed = true
            or (r.rental_days is not null and r.rental_days < ar.min_stay_days)
          )
      )
    )
  order by v.price_from asc nulls last, v.title_it asc;
$$;

revoke all on function public.get_public_vehicle_listings(text, date, date, text) from public;
grant execute on function public.get_public_vehicle_listings(text, date, date, text) to anon, authenticated;
