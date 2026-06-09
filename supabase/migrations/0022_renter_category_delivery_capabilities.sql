-- Per-category delivery capabilities for renters.
-- Replaces the single-level renter_delivery_capabilities as the primary source
-- for delivery method availability. The old table remains as a legacy fallback.
--
-- Business rule enforced at RPC level:
--   Nautical categories (gommone, barca, boat-with-skipper) → pickup_point only.
--   Terrestrial categories (scooter, auto, bici-elettriche) → all methods configurable.

create table if not exists public.renter_category_delivery_capabilities (
  id              uuid        primary key default gen_random_uuid(),
  renter_id       uuid        not null references public.renters(id)           on delete cascade,
  category_id     uuid        not null references public.vehicle_categories(id) on delete cascade,
  delivery_method text        not null,
  is_enabled      boolean     not null default true,
  zones           text[],
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint renter_cat_delivery_method_check
    check (delivery_method in ('pickup_point', 'port_delivery', 'hotel_delivery')),
  constraint renter_cat_delivery_unique
    unique (renter_id, category_id, delivery_method)
);

create index if not exists renter_cat_delivery_renter_id_idx
  on public.renter_category_delivery_capabilities(renter_id);
create index if not exists renter_cat_delivery_category_id_idx
  on public.renter_category_delivery_capabilities(category_id);

alter table public.renter_category_delivery_capabilities enable row level security;

drop trigger if exists set_renter_cat_delivery_updated_at on public.renter_category_delivery_capabilities;
create trigger set_renter_cat_delivery_updated_at
  before update on public.renter_category_delivery_capabilities
  for each row execute function public.set_updated_at();

-- Admin policies
drop policy if exists "Admins can read renter category delivery capabilities"   on public.renter_category_delivery_capabilities;
create policy "Admins can read renter category delivery capabilities"
  on public.renter_category_delivery_capabilities for select
  to authenticated using (public.is_admin());

drop policy if exists "Admins can insert renter category delivery capabilities" on public.renter_category_delivery_capabilities;
create policy "Admins can insert renter category delivery capabilities"
  on public.renter_category_delivery_capabilities for insert
  to authenticated with check (public.is_admin());

drop policy if exists "Admins can update renter category delivery capabilities" on public.renter_category_delivery_capabilities;
create policy "Admins can update renter category delivery capabilities"
  on public.renter_category_delivery_capabilities for update
  to authenticated
  using    (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete renter category delivery capabilities" on public.renter_category_delivery_capabilities;
create policy "Admins can delete renter category delivery capabilities"
  on public.renter_category_delivery_capabilities for delete
  to authenticated using (public.is_admin());

-- Renter policies: own rows only
drop policy if exists "Renters can read own category delivery capabilities"   on public.renter_category_delivery_capabilities;
create policy "Renters can read own category delivery capabilities"
  on public.renter_category_delivery_capabilities for select
  to authenticated
  using (
    public.is_renter()
    and renter_id in (select public.current_renter_ids())
  );

drop policy if exists "Renters can insert own category delivery capabilities" on public.renter_category_delivery_capabilities;
create policy "Renters can insert own category delivery capabilities"
  on public.renter_category_delivery_capabilities for insert
  to authenticated
  with check (
    public.is_renter()
    and renter_id in (select public.current_renter_ids())
  );

drop policy if exists "Renters can update own category delivery capabilities" on public.renter_category_delivery_capabilities;
create policy "Renters can update own category delivery capabilities"
  on public.renter_category_delivery_capabilities for update
  to authenticated
  using (
    public.is_renter()
    and renter_id in (select public.current_renter_ids())
  )
  with check (
    public.is_renter()
    and renter_id in (select public.current_renter_ids())
  );

drop policy if exists "Renters can delete own category delivery capabilities" on public.renter_category_delivery_capabilities;
create policy "Renters can delete own category delivery capabilities"
  on public.renter_category_delivery_capabilities for delete
  to authenticated
  using (
    public.is_renter()
    and renter_id in (select public.current_renter_ids())
  );

-- ─── Updated search_public_vehicles ─────────────────────────────────────────
-- Delivery filter now:
--   1. pickup_point always passes (no capability check needed).
--   2. Non-pickup + nautical category → blocked.
--   3. Non-pickup + terrestrial → check renter_category_delivery_capabilities;
--      fall back to legacy renter_delivery_capabilities when no per-category
--      record exists for that (renter, category, method) triple.

create or replace function public.search_public_vehicles(
  p_category_slug   text    default null,
  p_start_date      date    default null,
  p_end_date        date    default null,
  p_delivery_method text    default null
)
returns table (
  id              uuid,
  category_id     uuid,
  category_slug   text,
  title_it        text,
  title_en        text,
  description_it  text,
  description_en  text,
  price_from      numeric,
  image_url       text,
  features_it     text[],
  features_en     text[],
  pickup_point_id uuid,
  pickup_label_it text,
  pickup_label_en text,
  pickup_zone     text,
  is_active       boolean
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
      c.slug                as category_slug,
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
      )                     as price_from,
      v.image_url,
      v.features_it,
      v.features_en,
      v.pickup_point_id,
      p.public_label_it     as pickup_label_it,
      p.public_label_en     as pickup_label_en,
      p.zone                as pickup_zone,
      v.is_active
    from public.vehicles v
    join public.vehicle_categories c on c.id = v.category_id
    join public.pickup_points      p on p.id = v.pickup_point_id
    cross join requested r
    where v.is_active = true
      and c.is_active = true
      and p.is_active = true
      and (p_category_slug is null or p_category_slug = 'all' or c.slug = p_category_slug)
      and (
        -- No filter → show all
        p_delivery_method is null
        -- pickup_point is always allowed
        or p_delivery_method = 'pickup_point'
        -- Non-pickup methods: nautical categories are blocked
        or (
          c.slug not in ('gommone', 'barca', 'boat-with-skipper')
          and (
            -- Per-category capability (preferred)
            exists (
              select 1 from public.renter_category_delivery_capabilities rcdc
              where rcdc.renter_id       = v.renter_id
                and rcdc.category_id     = v.category_id
                and rcdc.delivery_method = p_delivery_method
                and rcdc.is_enabled      = true
            )
            -- Legacy fallback: use renter_delivery_capabilities when no per-category
            -- record exists yet for this (renter, category, method) triple
            or (
              not exists (
                select 1 from public.renter_category_delivery_capabilities rcdc2
                where rcdc2.renter_id       = v.renter_id
                  and rcdc2.category_id     = v.category_id
                  and rcdc2.delivery_method = p_delivery_method
              )
              and exists (
                select 1 from public.renter_delivery_capabilities dc
                where dc.renter_id       = v.renter_id
                  and dc.delivery_method = p_delivery_method
                  and dc.is_enabled      = true
              )
            )
          )
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

-- ─── Updated create_public_booking_request ───────────────────────────────────
-- Delivery validation now:
--   1. Nautical category + non-pickup → reject with clear message.
--   2. Terrestrial + non-pickup → check per-category capability, fallback legacy.

create or replace function public.create_public_booking_request(
  p_booking_code         text,
  p_customer_first_name  text,
  p_customer_last_name   text,
  p_customer_email       text,
  p_customer_phone       text,
  p_customer_language    text,
  p_vehicle_id           uuid,
  p_pickup_point_id      uuid,
  p_start_date           date,
  p_end_date             date,
  p_pickup_time          text,
  p_delivery_method      text,
  p_delivery_location    text,
  p_delivery_notes       text,
  p_payment_type         text,
  p_payment_method       text,
  p_payment_status       text,
  p_payment_notes        text,
  p_notes                text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_vehicle        public.vehicles%rowtype;
  target_pickup_point_id uuid;
  new_booking_id        uuid;
begin
  if p_start_date is null or p_end_date is null or p_end_date < p_start_date then
    raise exception 'Invalid booking dates.';
  end if;

  if p_vehicle_id is not null then
    select *
    into target_vehicle
    from public.vehicles
    where id = p_vehicle_id
      and is_active = true
    limit 1;

    if target_vehicle.id is null then
      raise exception 'Vehicle not available.';
    end if;

    if p_delivery_method is not null and p_delivery_method <> 'pickup_point' then
      -- Block non-pickup methods for nautical categories
      if exists (
        select 1 from public.vehicle_categories vc
        where vc.id   = target_vehicle.category_id
          and vc.slug in ('gommone', 'barca', 'boat-with-skipper')
      ) then
        raise exception 'Modalità di consegna non disponibile per questa categoria.';
      end if;

      -- Check per-category delivery capability, with fallback to legacy table
      if not (
        exists (
          select 1 from public.renter_category_delivery_capabilities rcdc
          where rcdc.renter_id       = target_vehicle.renter_id
            and rcdc.category_id     = target_vehicle.category_id
            and rcdc.delivery_method = p_delivery_method
            and rcdc.is_enabled      = true
        )
        or (
          not exists (
            select 1 from public.renter_category_delivery_capabilities rcdc2
            where rcdc2.renter_id       = target_vehicle.renter_id
              and rcdc2.category_id     = target_vehicle.category_id
              and rcdc2.delivery_method = p_delivery_method
          )
          and exists (
            select 1 from public.renter_delivery_capabilities dc
            where dc.renter_id       = target_vehicle.renter_id
              and dc.delivery_method = p_delivery_method
              and dc.is_enabled      = true
          )
        )
      ) then
        raise exception 'Delivery method not available for this vehicle.';
      end if;
    end if;

    if exists (
      select 1
      from public.vehicle_availability_rules ar
      where ar.vehicle_id = target_vehicle.id
        and ar.renter_id  = target_vehicle.renter_id
        and ar.date_from <= p_end_date
        and ar.date_to   >= p_start_date
        and (
          ar.is_closed = true
          or greatest((p_end_date - p_start_date) + 1, 1) < ar.min_rental_days
        )
    ) then
      raise exception 'Vehicle not available for selected dates.';
    end if;

    target_pickup_point_id := coalesce(p_pickup_point_id, target_vehicle.pickup_point_id);
  else
    target_pickup_point_id := p_pickup_point_id;
  end if;

  insert into public.bookings (
    booking_code,
    customer_first_name,
    customer_last_name,
    customer_email,
    customer_phone,
    customer_language,
    vehicle_id,
    renter_id,
    pickup_point_id,
    start_date,
    end_date,
    pickup_time,
    status,
    delivery_method,
    delivery_location,
    delivery_notes,
    payment_type,
    payment_method,
    payment_status,
    payment_notes,
    notes
  )
  values (
    p_booking_code,
    p_customer_first_name,
    p_customer_last_name,
    p_customer_email,
    nullif(p_customer_phone, ''),
    p_customer_language,
    target_vehicle.id,
    target_vehicle.renter_id,
    target_pickup_point_id,
    p_start_date,
    p_end_date,
    nullif(p_pickup_time, ''),
    'pending',
    coalesce(p_delivery_method, 'pickup_point'),
    nullif(p_delivery_location, ''),
    nullif(p_delivery_notes, ''),
    coalesce(p_payment_type, 'pay_on_pickup'),
    coalesce(p_payment_method, 'unknown'),
    coalesce(p_payment_status, 'unpaid'),
    nullif(p_payment_notes, ''),
    p_notes
  )
  returning id into new_booking_id;

  return new_booking_id;
end;
$$;

revoke all on function public.create_public_booking_request(text, text, text, text, text, text, uuid, uuid, date, date, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.create_public_booking_request(text, text, text, text, text, text, uuid, uuid, date, date, text, text, text, text, text, text, text, text, text) to anon, authenticated;
