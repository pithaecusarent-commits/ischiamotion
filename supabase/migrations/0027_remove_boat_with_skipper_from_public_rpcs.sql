-- Keep boat-with-skipper as an inactive historical slug only.
-- Beach Club is not a nautical category, so public search and booking validation
-- should no longer treat boat-with-skipper as an active nautical option.

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
        p_delivery_method is null
        or p_delivery_method = 'pickup_point'
        or (
          c.slug not in ('gommone', 'barca')
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
  target_vehicle public.vehicles%rowtype;
  target_pickup_point_id uuid;
  new_booking_id uuid;
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
      if exists (
        select 1 from public.vehicle_categories vc
        where vc.id = target_vehicle.category_id
          and vc.slug in ('gommone', 'barca')
      ) then
        raise exception 'Modalità di consegna non disponibile per questa categoria.';
      end if;

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
