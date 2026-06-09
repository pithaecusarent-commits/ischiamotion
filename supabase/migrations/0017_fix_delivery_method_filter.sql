-- Fix: pickup_point is the default/baseline delivery method and never requires
-- an explicit capability record. Only port_delivery and hotel_delivery require
-- explicit enablement in renter_delivery_capabilities.

create or replace function public.search_public_vehicles(
  p_category_slug text default null,
  p_start_date date default null,
  p_end_date date default null,
  p_delivery_method text default null
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
      p_start_date as start_date,
      p_end_date as end_date,
      case
        when p_start_date is not null and p_end_date is not null
        then greatest((p_end_date - p_start_date) + 1, 1)
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
    and (p_category_slug is null or p_category_slug = 'all' or c.slug = p_category_slug)
    and (
      p_delivery_method is null
      or p_delivery_method = 'pickup_point'
      or exists (
        select 1
        from public.renter_delivery_capabilities dc
        where dc.renter_id = v.renter_id
          and dc.delivery_method = p_delivery_method
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
            or (r.rental_days is not null and r.rental_days < ar.min_rental_days)
          )
      )
    )
  order by v.price_from asc nulls last, v.title_it asc;
$$;

revoke all on function public.search_public_vehicles(text, date, date, text) from public;
grant execute on function public.search_public_vehicles(text, date, date, text) to anon, authenticated;
