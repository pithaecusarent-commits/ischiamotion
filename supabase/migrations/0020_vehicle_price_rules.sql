-- TASK 1: Seasonal price rules per vehicle
-- Strategy for public search: when dates are provided, use max(price_per_day)
-- among active rules overlapping the requested range; fall back to vehicles.price_from.

create table if not exists public.vehicle_price_rules (
  id              uuid        primary key default gen_random_uuid(),
  vehicle_id      uuid        references public.vehicles(id) on delete cascade,
  renter_id       uuid        references public.renters(id)  on delete cascade,
  name            text,
  date_from       date        not null,
  date_to         date        not null,
  price_per_day   numeric     not null,
  min_rental_days integer     not null default 1,
  is_active       boolean     not null default true,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint vehicle_price_rules_dates_check    check (date_to >= date_from),
  constraint vehicle_price_rules_price_check    check (price_per_day >= 0),
  constraint vehicle_price_rules_min_days_check check (min_rental_days >= 1)
);

create index if not exists vehicle_price_rules_vehicle_id_idx on public.vehicle_price_rules(vehicle_id);
create index if not exists vehicle_price_rules_renter_id_idx  on public.vehicle_price_rules(renter_id);
create index if not exists vehicle_price_rules_dates_idx       on public.vehicle_price_rules(date_from, date_to);

alter table public.vehicle_price_rules enable row level security;

drop trigger if exists set_vehicle_price_rules_updated_at on public.vehicle_price_rules;
create trigger set_vehicle_price_rules_updated_at
  before update on public.vehicle_price_rules
  for each row execute function public.set_updated_at();

-- Admin: full access
drop policy if exists "Admins can read vehicle price rules"   on public.vehicle_price_rules;
create policy "Admins can read vehicle price rules"
  on public.vehicle_price_rules for select
  to authenticated using (public.is_admin());

drop policy if exists "Admins can insert vehicle price rules" on public.vehicle_price_rules;
create policy "Admins can insert vehicle price rules"
  on public.vehicle_price_rules for insert
  to authenticated with check (public.is_admin());

drop policy if exists "Admins can update vehicle price rules" on public.vehicle_price_rules;
create policy "Admins can update vehicle price rules"
  on public.vehicle_price_rules for update
  to authenticated
  using    (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete vehicle price rules" on public.vehicle_price_rules;
create policy "Admins can delete vehicle price rules"
  on public.vehicle_price_rules for delete
  to authenticated using (public.is_admin());

-- Renter: own rules only (vehicle must belong to renter)
drop policy if exists "Renters can read own vehicle price rules" on public.vehicle_price_rules;
create policy "Renters can read own vehicle price rules"
  on public.vehicle_price_rules for select
  to authenticated
  using (
    public.is_renter()
    and renter_id in (select public.current_renter_ids())
    and exists (
      select 1 from public.vehicles v
      where v.id = vehicle_price_rules.vehicle_id
        and v.renter_id = vehicle_price_rules.renter_id
    )
  );

drop policy if exists "Renters can insert own vehicle price rules" on public.vehicle_price_rules;
create policy "Renters can insert own vehicle price rules"
  on public.vehicle_price_rules for insert
  to authenticated
  with check (
    public.is_renter()
    and renter_id in (select public.current_renter_ids())
    and exists (
      select 1 from public.vehicles v
      where v.id = vehicle_price_rules.vehicle_id
        and v.renter_id = vehicle_price_rules.renter_id
    )
  );

drop policy if exists "Renters can update own vehicle price rules" on public.vehicle_price_rules;
create policy "Renters can update own vehicle price rules"
  on public.vehicle_price_rules for update
  to authenticated
  using (
    public.is_renter()
    and renter_id in (select public.current_renter_ids())
    and exists (
      select 1 from public.vehicles v
      where v.id = vehicle_price_rules.vehicle_id
        and v.renter_id = vehicle_price_rules.renter_id
    )
  )
  with check (
    public.is_renter()
    and renter_id in (select public.current_renter_ids())
    and exists (
      select 1 from public.vehicles v
      where v.id = vehicle_price_rules.vehicle_id
        and v.renter_id = vehicle_price_rules.renter_id
    )
  );

drop policy if exists "Renters can delete own vehicle price rules" on public.vehicle_price_rules;
create policy "Renters can delete own vehicle price rules"
  on public.vehicle_price_rules for delete
  to authenticated
  using (
    public.is_renter()
    and renter_id in (select public.current_renter_ids())
    and exists (
      select 1 from public.vehicles v
      where v.id = vehicle_price_rules.vehicle_id
        and v.renter_id = vehicle_price_rules.renter_id
    )
  );

-- TASK 6: Update search_public_vehicles to compute effective price from price rules.
-- Price selection strategy:
--   1. If search dates are provided, pick max(price_per_day) from active rules
--      whose date range overlaps [p_start_date, p_end_date].
--   2. If no overlapping rule exists (or dates not provided), fall back to vehicles.price_from.
--   3. Results are ordered by effective price asc.
create or replace function public.search_public_vehicles(
  p_category_slug  text default null,
  p_start_date     date default null,
  p_end_date       date default null,
  p_delivery_method text default null
)
returns table (
  id               uuid,
  category_id      uuid,
  category_slug    text,
  title_it         text,
  title_en         text,
  description_it   text,
  description_en   text,
  price_from       numeric,
  image_url        text,
  features_it      text[],
  features_en      text[],
  pickup_point_id  uuid,
  pickup_label_it  text,
  pickup_label_en  text,
  pickup_zone      text,
  is_active        boolean
)
language sql
security definer
set search_path = public
as $$
  with requested as (
    select
      p_start_date as start_date,
      p_end_date   as end_date,
      case
        when p_start_date is not null and p_end_date is not null
        then greatest((p_end_date - p_start_date) + 1, 1)
        else null
      end as rental_days
  ),
  base as (
    select
      v.id,
      v.category_id,
      c.slug                     as category_slug,
      v.title_it,
      v.title_en,
      v.description_it,
      v.description_en,
      coalesce(
        case
          when p_start_date is not null and p_end_date is not null then (
            select max(pr.price_per_day)
            from public.vehicle_price_rules pr
            where pr.vehicle_id = v.id
              and pr.is_active  = true
              and pr.date_from <= p_end_date
              and pr.date_to   >= p_start_date
          )
          else null
        end,
        v.price_from
      )                          as price_from,
      v.image_url,
      v.features_it,
      v.features_en,
      v.pickup_point_id,
      p.public_label_it          as pickup_label_it,
      p.public_label_en          as pickup_label_en,
      p.zone                     as pickup_zone,
      v.is_active
    from public.vehicles v
    join public.vehicle_categories c on c.id = v.category_id
    join public.pickup_points      p on p.id = v.pickup_point_id
    cross join requested r
    where v.is_active   = true
      and c.is_active   = true
      and p.is_active   = true
      and (p_category_slug is null or p_category_slug = 'all' or c.slug = p_category_slug)
      and (
        p_delivery_method is null
        or exists (
          select 1 from public.renter_delivery_capabilities dc
          where dc.renter_id       = v.renter_id
            and dc.delivery_method = p_delivery_method
            and dc.is_enabled      = true
        )
      )
      and (
        r.start_date is null
        or r.end_date is null
        or not exists (
          select 1 from public.vehicle_availability_rules ar
          where ar.vehicle_id = v.id
            and ar.renter_id  = v.renter_id
            and ar.date_from <= r.end_date
            and ar.date_to   >= r.start_date
            and (
              ar.is_closed = true
              or (r.rental_days is not null and r.rental_days < ar.min_rental_days)
            )
        )
      )
  )
  select * from base
  order by price_from asc nulls last, title_it asc;
$$;

revoke all on function public.search_public_vehicles(text, date, date, text) from public;
grant execute on function public.search_public_vehicles(text, date, date, text) to anon, authenticated;
