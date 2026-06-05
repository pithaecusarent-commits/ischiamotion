insert into public.vehicle_categories (slug, name_it, name_en, is_active)
values ('beach_club', 'Beach Club', 'Beach Club', true)
on conflict (slug) do update
set name_it = excluded.name_it,
    name_en = excluded.name_en,
    is_active = true;

do $$
declare
  skipper_category_id uuid;
  beach_club_category_id uuid;
begin
  select id into skipper_category_id
  from public.vehicle_categories
  where slug = 'boat-with-skipper'
  limit 1;

  select id into beach_club_category_id
  from public.vehicle_categories
  where slug = 'beach_club'
  limit 1;

  if beach_club_category_id is null then
    raise exception 'beach_club category was not created.';
  end if;

  if skipper_category_id is not null then
    update public.vehicles
    set category_id = beach_club_category_id,
        updated_at = now()
    where category_id = skipper_category_id;

    insert into public.renter_category_availability (
      renter_id,
      category_id,
      pickup_point_id,
      is_open,
      reason,
      updated_at
    )
    select
      renter_id,
      beach_club_category_id,
      pickup_point_id,
      is_open,
      reason,
      now()
    from public.renter_category_availability
    where category_id = skipper_category_id
    on conflict (renter_id, category_id, pickup_point_id) do update
    set is_open = excluded.is_open,
        reason = excluded.reason,
        updated_at = now();

    delete from public.renter_category_availability
    where category_id = skipper_category_id;

    insert into public.renter_category_delivery_capabilities (
      renter_id,
      category_id,
      delivery_method,
      is_enabled,
      zones,
      notes,
      updated_at
    )
    select
      renter_id,
      beach_club_category_id,
      delivery_method,
      is_enabled,
      zones,
      notes,
      now()
    from public.renter_category_delivery_capabilities
    where category_id = skipper_category_id
    on conflict (renter_id, category_id, delivery_method) do update
    set is_enabled = excluded.is_enabled,
        zones = excluded.zones,
        notes = excluded.notes,
        updated_at = now();

    delete from public.renter_category_delivery_capabilities
    where category_id = skipper_category_id;

    update public.vehicle_categories
    set name_it = 'Barca con skipper',
        name_en = 'Boat with skipper',
        is_active = false
    where id = skipper_category_id;
  end if;
end $$;
