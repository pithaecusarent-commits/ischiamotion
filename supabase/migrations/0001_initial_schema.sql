create extension if not exists pgcrypto;

create table if not exists public.vehicle_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_it text not null,
  name_en text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.pickup_points (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_it text not null,
  name_en text not null,
  public_label_it text not null,
  public_label_en text not null,
  zone text not null,
  address_internal text,
  latitude numeric,
  longitude numeric,
  description_it text,
  description_en text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.renters (
  id uuid primary key default gen_random_uuid(),
  business_name_internal text not null,
  contact_name text,
  email text,
  phone text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint renters_status_check check (status in ('pending', 'active', 'paused', 'disabled'))
);

comment on table public.renters is 'Internal-only renter data. Do not expose business_name_internal in the public frontend.';
comment on column public.renters.business_name_internal is 'Internal anti-bypass field. Never show this value to final customers.';

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.vehicle_categories(id) on delete restrict,
  renter_id uuid references public.renters(id) on delete restrict,
  pickup_point_id uuid references public.pickup_points(id) on delete restrict,
  title_it text not null,
  title_en text not null,
  description_it text,
  description_en text,
  price_from numeric,
  image_url text,
  features_it text[] not null default '{}',
  features_en text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text unique not null,
  customer_first_name text not null,
  customer_last_name text not null,
  customer_email text not null,
  customer_phone text,
  customer_language text not null default 'it',
  vehicle_id uuid references public.vehicles(id) on delete restrict,
  renter_id uuid references public.renters(id) on delete restrict,
  pickup_point_id uuid references public.pickup_points(id) on delete restrict,
  start_date date not null,
  end_date date not null,
  pickup_time text,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_status_check check (status in ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  constraint bookings_customer_language_check check (customer_language in ('it', 'en')),
  constraint bookings_date_check check (end_date >= start_date)
);

create table if not exists public.booking_vouchers (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  voucher_code text unique not null,
  qr_payload text,
  qr_image_url text,
  issued_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  voucher_code text,
  checked_in_at timestamptz,
  checked_in_by uuid,
  method text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.renter_category_availability (
  id uuid primary key default gen_random_uuid(),
  renter_id uuid not null references public.renters(id) on delete cascade,
  category_id uuid not null references public.vehicle_categories(id) on delete cascade,
  pickup_point_id uuid references public.pickup_points(id) on delete cascade,
  is_open boolean not null default true,
  reason text,
  updated_at timestamptz not null default now(),
  constraint renter_category_availability_unique unique (renter_id, category_id, pickup_point_id)
);

create index if not exists vehicles_category_id_idx on public.vehicles(category_id);
create index if not exists vehicles_renter_id_idx on public.vehicles(renter_id);
create index if not exists vehicles_pickup_point_id_idx on public.vehicles(pickup_point_id);
create index if not exists bookings_vehicle_id_idx on public.bookings(vehicle_id);
create index if not exists bookings_renter_id_idx on public.bookings(renter_id);
create index if not exists bookings_pickup_point_id_idx on public.bookings(pickup_point_id);
create index if not exists booking_vouchers_booking_id_idx on public.booking_vouchers(booking_id);
create index if not exists checkins_booking_id_idx on public.checkins(booking_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_renters_updated_at on public.renters;
create trigger set_renters_updated_at
before update on public.renters
for each row execute function public.set_updated_at();

drop trigger if exists set_vehicles_updated_at on public.vehicles;
create trigger set_vehicles_updated_at
before update on public.vehicles
for each row execute function public.set_updated_at();

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

create or replace function public.set_availability_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_renter_category_availability_updated_at on public.renter_category_availability;
create trigger set_renter_category_availability_updated_at
before update on public.renter_category_availability
for each row execute function public.set_availability_updated_at();

alter table public.vehicle_categories enable row level security;
alter table public.pickup_points enable row level security;
alter table public.vehicles enable row level security;
alter table public.renters enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_vouchers enable row level security;
alter table public.checkins enable row level security;
alter table public.renter_category_availability enable row level security;

drop policy if exists "Public can read active vehicle categories" on public.vehicle_categories;
create policy "Public can read active vehicle categories"
on public.vehicle_categories for select
using (is_active = true);

drop policy if exists "Public can read active pickup points" on public.pickup_points;
create policy "Public can read active pickup points"
on public.pickup_points for select
using (is_active = true);

drop policy if exists "Public can read active vehicles without renter details" on public.vehicles;
create policy "Public can read active vehicles without renter details"
on public.vehicles for select
using (is_active = true);

insert into public.vehicle_categories (slug, name_it, name_en)
values
  ('scooter', 'Scooter', 'Scooters'),
  ('auto', 'Auto', 'Cars'),
  ('bici-elettriche', 'Bici elettriche', 'E-bikes'),
  ('barche-gommoni', 'Barche e gommoni', 'Boats and ribs'),
  ('quad', 'Quad', 'Quads')
on conflict (slug) do update set
  name_it = excluded.name_it,
  name_en = excluded.name_en,
  is_active = true;

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
values
  (
    'porto-ischia',
    'IschiaMotion Point - Porto d''Ischia',
    'IschiaMotion Point - Ischia Port',
    'IschiaMotion Point - Porto d''Ischia',
    'IschiaMotion Point - Ischia Port',
    'Ischia Porto',
    null,
    40.7459,
    13.9455,
    'Punto ritiro vicino agli arrivi principali del porto.',
    'Pickup point near the main port arrivals.'
  ),
  (
    'forio',
    'IschiaMotion Point - Forio',
    'IschiaMotion Point - Forio',
    'IschiaMotion Point - Forio',
    'IschiaMotion Point - Forio',
    'Forio',
    null,
    40.7357,
    13.8592,
    'Punto ritiro comodo per Forio e la costa ovest.',
    'Convenient pickup point for Forio and the west coast.'
  ),
  (
    'casamicciola',
    'IschiaMotion Point - Casamicciola',
    'IschiaMotion Point - Casamicciola',
    'IschiaMotion Point - Casamicciola',
    'IschiaMotion Point - Casamicciola',
    'Casamicciola',
    null,
    40.7506,
    13.9128,
    'Punto ritiro nella zona di Casamicciola.',
    'Pickup point in the Casamicciola area.'
  ),
  (
    'sant-angelo',
    'IschiaMotion Point - Sant''Angelo',
    'IschiaMotion Point - Sant''Angelo',
    'IschiaMotion Point - Sant''Angelo',
    'IschiaMotion Point - Sant''Angelo',
    'Sant''Angelo',
    null,
    40.6967,
    13.8941,
    'Punto ritiro per Sant''Angelo e il versante sud.',
    'Pickup point for Sant''Angelo and the south side.'
  ),
  (
    'barano',
    'IschiaMotion Point - Barano',
    'IschiaMotion Point - Barano',
    'IschiaMotion Point - Barano',
    'IschiaMotion Point - Barano',
    'Barano',
    null,
    40.7142,
    13.9268,
    'Punto ritiro per Barano e le zone interne.',
    'Pickup point for Barano and inland areas.'
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
