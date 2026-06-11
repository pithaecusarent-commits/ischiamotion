-- MARKETPLACE STEP 1: Aggregate public vehicle search by vehicle_model_id.
--
-- When multiple partner vehicles (vehicles) share the same vehicle_model_id,
-- the public search now shows ONE card per model instead of one card per vehicle:
--   - "id" in output = representative vehicle_id (cheapest active offer) → booking-compatible, no frontend changes needed
--   - price_from = MIN across all active offers of active partners for that model
--   - title/description/image: from vehicle_models if set, else from the representative vehicle
--   - vehicles with vehicle_model_id IS NULL: unchanged (show as-is, current behaviour)
--
-- Also adds rnt.status = 'active' filter (was missing: previously vehicles from
-- paused/disabled partners could appear in public search).
--
-- Output columns: IDENTICAL to migration 0032. No TypeScript changes needed.
-- Booking: vehicle.id passed to create_public_booking_request is always a real vehicle_id.

-- ─── Drop old 7-param signature ───────────────────────────────────────────────

drop function if exists public.search_public_vehicles(text, date, date, text, text, text, text);

-- ─── New search_public_vehicles ───────────────────────────────────────────────

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

  -- All active vehicles from active partners passing every filter.
  -- vehicle_model_id is included for downstream aggregation.
  base as (
    select
      v.id,
      v.vehicle_model_id,
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
    where v.is_active    = true
      and c.is_active    = true
      and p.is_active    = true
      and rnt.status     = 'active'   -- exclude paused / disabled partners
      and (p_category_slug is null or p_category_slug = 'all' or c.slug = p_category_slug)

      -- ── Delivery method filter ─────────────────────────────────────────────
      and (
        p_delivery_method is null
        or p_delivery_method = 'pickup_point'
        or (
          c.slug not in ('gommone', 'barca', 'boat-with-skipper')
          and (
            exists (
              select 1 from public.renter_category_delivery_capabilities rcdc
              where rcdc.renter_id       = v.renter_id
                and rcdc.category_id     = v.category_id
                and rcdc.delivery_method = p_delivery_method
                and rcdc.is_enabled      = true
            )
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
      and (
        p_pickup_municipality is null
        or p_delivery_method is null
        or p_delivery_method <> 'pickup_point'
        or rnt.ischiamotion_point_municipality = p_pickup_municipality
      )

      -- ── Port zone filter ───────────────────────────────────────────────────
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
  ),

  -- ── Vehicles with no model: show as-is (current behaviour) ──────────────────
  standalone as (
    select * from base where vehicle_model_id is null
  ),

  -- ── Vehicles grouped by model: pick cheapest as representative ──────────────
  -- row_number() picks the representative; min() over partition gives the floor price.
  model_ranked as (
    select
      b.*,
      row_number() over (
        partition by b.vehicle_model_id
        order by b.price_from asc nulls last, b.id asc
      ) as rn,
      min(b.price_from) over (
        partition by b.vehicle_model_id
      ) as group_min_price
    from base b
    where b.vehicle_model_id is not null
  ),

  -- Keep only the representative row; overlay with vehicle_models canonical data.
  -- vm.title/description/image take precedence if the model record has them.
  model_aggregated as (
    select
      mr.id,                                                         -- representative vehicle_id (used for booking)
      mr.vehicle_model_id,
      mr.category_id,
      mr.category_slug,
      coalesce(nullif(vm.title_it, ''), mr.title_it)               as title_it,
      coalesce(nullif(vm.title_en, ''), mr.title_en)               as title_en,
      coalesce(vm.description_it, mr.description_it)               as description_it,
      coalesce(vm.description_en, mr.description_en)               as description_en,
      mr.group_min_price                                            as price_from,
      coalesce(nullif(vm.image_url, ''), mr.image_url)             as image_url,
      coalesce(nullif(vm.features_it, '{}'), mr.features_it)       as features_it,
      coalesce(nullif(vm.features_en, '{}'), mr.features_en)       as features_en,
      mr.pickup_point_id,
      mr.pickup_label_it,
      mr.pickup_label_en,
      mr.pickup_zone,
      mr.is_active
    from model_ranked mr
    join public.vehicle_models vm on vm.id = mr.vehicle_model_id
    where mr.rn = 1
  )

  -- ── Final UNION: standalone + one card per model ───────────────────────────
  select
    id, category_id, category_slug,
    title_it, title_en, description_it, description_en,
    price_from, image_url, features_it, features_en,
    pickup_point_id, pickup_label_it, pickup_label_en, pickup_zone,
    is_active
  from standalone

  union all

  select
    id, category_id, category_slug,
    title_it, title_en, description_it, description_en,
    price_from, image_url, features_it, features_en,
    pickup_point_id, pickup_label_it, pickup_label_en, pickup_zone,
    is_active
  from model_aggregated

  order by price_from asc nulls last, title_it asc;
$$;

revoke all   on function public.search_public_vehicles(text, date, date, text, text, text, text) from public;
grant execute on function public.search_public_vehicles(text, date, date, text, text, text, text) to anon, authenticated;
