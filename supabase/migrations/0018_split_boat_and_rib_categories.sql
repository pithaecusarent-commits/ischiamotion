-- Split nautical categories: gommone (RIB/Dinghy) and barca (Boat) are now
-- separate slugs instead of the legacy combined "barche-gommoni".
-- boat-with-skipper is re-upserted for idempotency.

insert into public.vehicle_categories (slug, name_it, name_en, is_active)
values
  ('gommone',          'Gommone',          'RIB / Dinghy',      true),
  ('barca',            'Barca',            'Boat',              true),
  ('boat-with-skipper','Barca con skipper','Boat with skipper', true)
on conflict (slug) do update
  set name_it   = excluded.name_it,
      name_en   = excluded.name_en,
      is_active = excluded.is_active;
