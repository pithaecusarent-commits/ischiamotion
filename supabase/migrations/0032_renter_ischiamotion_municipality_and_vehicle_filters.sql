-- Adds structured IschiaMotion Point municipality to renters.
-- Updates search_public_vehicles with optional zone/municipality filters.
--
-- New column: renters.ischiamotion_point_municipality
--   Constrained to the 6 valid municipality slugs (same set used in
--   bookings.hotel_municipality and delivery zone capabilities).
--   Nullable — existing rows are unaffected.
--
-- Updated RPC: search_public_vehicles(7 params, backward-compatible via defaults)
--   p_pickup_municipality: filter vehicles by renter's IschiaMotion Point commune
--   p_port_slug:          filter vehicles whose renter covers a specific port zone
--   p_hotel_municipality: filter vehicles whose renter covers a specific hotel zone

-- ─── renters table ────────────────────────────────────────────────────────────

alter table public.renters
  add column if not exists ischiamotion_point_municipality text;

alter table public.renters
  drop constraint if exists renters_ischiamotion_point_municipality_check;

alter table public.renters
  add constraint renters_ischiamotion_point_municipality_check
    check (
      ischiamotion_point_municipality is null
      or ischiamotion_point_municipality in (
        'ischia',
        'casamicciola_terme',
        'lacco_ameno',
        'forio',
        'serrara_fontana',
        'barano_ischia'
      )
    );

-- ─── search_public_vehicles (drop old 4-param signature, create 7-param) ─────

drop function if exists public.search_public_vehicles(text, date, date, text);

create or replace function public.search_public_vehicles(
  p_category_slug        text  default null,
  p_start_date           date  default null,
  p_end_date             date  default null,
  p_delivery_method      text  default null,
  p_pickup_municipality  text  default null,
  p_port_slug            text  default null,
  p_hotel_municipality   text  default null
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
    join public.vehicle_categories c   on c.id = v.category_id
    join public.pickup_points      p   on p.id = v.pickup_point_id
    join public.renters            rnt on rnt.id = v.renter_id
    cross join requested req
    where v.is_active = true
      and c.is_active = true
      and p.is_active = true
      and (p_category_slug is null or p_category_slug = 'all' or c.slug = p_category_slug)

      -- ── Delivery method filter (unchanged from 0022) ──────────────────────
      and (
        p_delivery_method is null
        or p_delivery_method = 'pickup_point'
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
            -- Legacy fallback: no per-category row yet for this triple
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

      -- ── Pickup municipality filter ─────────────────────────────────────────
      -- Active only when delivery_method = 'pickup_point' AND a municipality
      -- was requested.  Filters by the renter's IschiaMotion Point commune.
      and (
        p_pickup_municipality is null
        or p_delivery_method is null
        or p_delivery_method <> 'pickup_point'
        or rnt.ischiamotion_point_municipality = p_pickup_municipality
      )

      -- ── Port zone filter ──────────────────────────────────────────────────
      -- Active only when delivery_method = 'port_delivery' AND a port slug
      -- was requested.  Requires the renter's per-category capability to
      -- explicitly include that port in its zones array.
      and (
        p_port_slug is null
        or p_delivery_method is null
        or p_delivery_method <> 'port_delivery'
        or exists (
          select 1 from public.renter_category_delivery_capabilities rcdc_p
          where rcdc_p.renter_id       = v.renter_id
            and rcdc_p.category_id     = v.category_id
            and rcdc_p.delivery_method = 'port_delivery'
            and rcdc_p.is_enabled      = true
            and rcdc_p.zones           @> array[p_port_slug]
        )
      )

      -- ── Hotel municipality filter ──────────────────────────────────────────
      -- Active only when delivery_method = 'hotel_delivery' AND a hotel
      -- municipality slug was requested.
      and (
        p_hotel_municipality is null
        or p_delivery_method is null
        or p_delivery_method <> 'hotel_delivery'
        or exists (
          select 1 from public.renter_category_delivery_capabilities rcdc_h
          where rcdc_h.renter_id       = v.renter_id
            and rcdc_h.category_id     = v.category_id
            and rcdc_h.delivery_method = 'hotel_delivery'
            and rcdc_h.is_enabled      = true
            and rcdc_h.zones           @> array[p_hotel_municipality]
        )
      )

      -- ── Date availability filter ───────────────────────────────────────────
      and (
        req.start_date is null
        or req.end_date is null
        or not exists (
          select 1 from public.vehicle_availability_rules ar
          where ar.vehicle_id = v.id
            and ar.renter_id  = v.renter_id
            and ar.date_from <= req.end_date
            and ar.date_to   >= req.start_date
            and (
              ar.is_closed = true
              or (req.rental_days is not null and req.rental_days < ar.min_rental_days)
            )
        )
      )
  )
  select * from base
  order by price_from asc nulls last, title_it asc;
$$;

revoke all on function public.search_public_vehicles(text, date, date, text, text, text, text) from public;
grant execute on function public.search_public_vehicles(text, date, date, text, text, text, text) to anon, authenticated;
