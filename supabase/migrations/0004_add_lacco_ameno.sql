insert into public.pickup_points (
  slug,
  name_it,
  name_en,
  public_label_it,
  public_label_en,
  zone,
  address_internal,
  latitude,
  longitude,
  description_it,
  description_en
)
values (
  'lacco-ameno',
  'IschiaMotion Point - Lacco Ameno',
  'IschiaMotion Point - Lacco Ameno',
  'IschiaMotion Point - Lacco Ameno',
  'IschiaMotion Point - Lacco Ameno',
  'Lacco Ameno',
  null,
  40.7597,
  13.8978,
  'Punto ritiro nella zona di Lacco Ameno, costa nord.',
  'Pickup point in the Lacco Ameno area, north coast.'
)
on conflict (slug) do update set
  name_it = excluded.name_it,
  name_en = excluded.name_en,
  public_label_it = excluded.public_label_it,
  public_label_en = excluded.public_label_en,
  zone = excluded.zone,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  description_it = excluded.description_it,
  description_en = excluded.description_en,
  is_active = true;
