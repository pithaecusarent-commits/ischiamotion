-- Store structured delivery zone fields on bookings for admin renter matching.
-- Existing display fields remain unchanged:
--   delivery_location keeps the human-readable place/name.
--   pickup_point_id keeps the selected pickup point when available.
--   hotel_municipality remains the structured hotel municipality.

alter table public.bookings
  add column if not exists pickup_municipality text,
  add column if not exists port_slug text;

alter table public.bookings
  drop constraint if exists bookings_pickup_municipality_check;

alter table public.bookings
  add constraint bookings_pickup_municipality_check
    check (
      pickup_municipality is null
      or pickup_municipality in (
        'ischia',
        'casamicciola_terme',
        'lacco_ameno',
        'forio',
        'serrara_fontana',
        'barano_ischia'
      )
    );

alter table public.bookings
  drop constraint if exists bookings_port_slug_check;

alter table public.bookings
  add constraint bookings_port_slug_check
    check (
      port_slug is null
      or port_slug in ('ischia_porto', 'casamicciola', 'forio')
    );

drop function if exists public.create_public_booking_request(
  text, text, text, text, text, text, uuid, uuid, date, date,
  text, text, text, text, text, text, text, text, text, text
);

create or replace function public.create_public_booking_request(
  p_booking_code          text,
  p_customer_first_name   text,
  p_customer_last_name    text,
  p_customer_email        text,
  p_customer_phone        text,
  p_customer_language     text,
  p_vehicle_id            uuid,
  p_pickup_point_id       uuid,
  p_start_date            date,
  p_end_date              date,
  p_pickup_time           text,
  p_delivery_method       text,
  p_delivery_location     text,
  p_hotel_municipality    text,
  p_delivery_notes        text,
  p_payment_type          text,
  p_payment_method        text,
  p_payment_status        text,
  p_payment_notes         text,
  p_notes                 text,
  p_pickup_municipality   text default null,
  p_port_slug             text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_vehicle         public.vehicles%rowtype;
  target_pickup_point_id uuid;
  new_booking_id         uuid;
  valid_municipalities   text[] := array[
    'ischia', 'casamicciola_terme', 'lacco_ameno',
    'forio', 'serrara_fontana', 'barano_ischia'
  ];
  valid_ports            text[] := array['ischia_porto', 'casamicciola', 'forio'];
begin
  if p_start_date is null or p_end_date is null or p_end_date < p_start_date then
    raise exception 'Invalid booking dates.';
  end if;

  if p_delivery_method is not null and p_delivery_method not in ('pickup_point', 'port_delivery', 'hotel_delivery') then
    raise exception 'Invalid delivery method.';
  end if;

  if p_pickup_municipality is not null and p_pickup_municipality <> ''
     and not (p_pickup_municipality = any(valid_municipalities)) then
    raise exception 'Comune IschiaMotion Point non valido.';
  end if;

  if p_port_slug is not null and p_port_slug <> ''
     and not (p_port_slug = any(valid_ports)) then
    raise exception 'Porto non valido.';
  end if;

  if p_delivery_method = 'hotel_delivery' then
    if p_hotel_municipality is null or p_hotel_municipality = '' then
      raise exception 'Il comune e obbligatorio per la consegna in hotel.';
    end if;
    if not (p_hotel_municipality = any(valid_municipalities)) then
      raise exception 'Comune non valido.';
    end if;
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
          and vc.slug in ('gommone', 'barca', 'boat-with-skipper')
      ) then
        raise exception 'Modalita di consegna non disponibile per questa categoria.';
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
    hotel_municipality,
    pickup_municipality,
    port_slug,
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
    case when p_delivery_method = 'hotel_delivery' then nullif(p_hotel_municipality, '') else null end,
    case when coalesce(p_delivery_method, 'pickup_point') = 'pickup_point' then nullif(p_pickup_municipality, '') else null end,
    case when p_delivery_method = 'port_delivery' then nullif(p_port_slug, '') else null end,
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

revoke all on function public.create_public_booking_request(
  text, text, text, text, text, text, uuid, uuid, date, date,
  text, text, text, text, text, text, text, text, text, text, text, text
) from public;

grant execute on function public.create_public_booking_request(
  text, text, text, text, text, text, uuid, uuid, date, date,
  text, text, text, text, text, text, text, text, text, text, text, text
) to anon, authenticated;
