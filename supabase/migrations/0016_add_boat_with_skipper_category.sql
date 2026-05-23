insert into public.vehicle_categories (slug, name_it, name_en, is_active)
values ('boat-with-skipper', 'Barca con skipper', 'Boat with skipper', true)
on conflict (slug) do update
  set name_it = excluded.name_it,
      name_en = excluded.name_en,
      is_active = excluded.is_active;
