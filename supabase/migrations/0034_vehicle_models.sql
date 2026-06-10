-- FASE 1: Introduce vehicle_models as shared public model.
-- vehicles remains the per-renter offer/listing; vehicle_model_id is nullable
-- so all existing rows and code paths continue to work unchanged.
--
-- Nothing changes for:
--   search_public_vehicles, create_public_booking_request, bookings,
--   vehicle_price_rules, vehicle_availability_rules, or any frontend code.

-- ────────────────────────────────────────────────────────────────────────────
-- 1. TABLE: vehicle_models
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.vehicle_models (
  id             uuid        primary key default gen_random_uuid(),
  category_id    uuid        not null references public.vehicle_categories(id) on delete restrict,
  title_it       text        not null,
  title_en       text        not null,
  description_it text,
  description_en text,
  image_url      text,
  features_it    text[]      not null default '{}',
  features_en    text[]      not null default '{}',
  sort_order     integer     not null default 0,
  is_active      boolean     not null default true,
  created_at     timestamptz not null default timezone('utc'::text, now()),
  updated_at     timestamptz not null default timezone('utc'::text, now())
);

-- ────────────────────────────────────────────────────────────────────────────
-- 2. INDEXES on vehicle_models
-- ────────────────────────────────────────────────────────────────────────────
create index if not exists vehicle_models_category_id_idx
  on public.vehicle_models(category_id);

create index if not exists vehicle_models_is_active_idx
  on public.vehicle_models(is_active);

-- ────────────────────────────────────────────────────────────────────────────
-- 3. updated_at TRIGGER on vehicle_models
-- ────────────────────────────────────────────────────────────────────────────
drop trigger if exists set_vehicle_models_updated_at on public.vehicle_models;
create trigger set_vehicle_models_updated_at
  before update on public.vehicle_models
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- 4. RLS on vehicle_models
--    Phase 1: admin-only CRUD. No anon/public read yet.
--    (search_public_vehicles is security definer and can read regardless of RLS.
--     A public read policy will be added in Phase 3 when the RPC is updated.)
-- ────────────────────────────────────────────────────────────────────────────
alter table public.vehicle_models enable row level security;

drop policy if exists "Admins can read vehicle models" on public.vehicle_models;
create policy "Admins can read vehicle models"
  on public.vehicle_models for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert vehicle models" on public.vehicle_models;
create policy "Admins can insert vehicle models"
  on public.vehicle_models for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update vehicle models" on public.vehicle_models;
create policy "Admins can update vehicle models"
  on public.vehicle_models for update
  to authenticated
  using    (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete vehicle models" on public.vehicle_models;
create policy "Admins can delete vehicle models"
  on public.vehicle_models for delete
  to authenticated
  using (public.is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- 5. Add vehicle_model_id to vehicles (nullable, idempotent)
-- ────────────────────────────────────────────────────────────────────────────
alter table public.vehicles
  add column if not exists vehicle_model_id uuid;

-- Add FK constraint idempotently (guard against re-running)
do $$
begin
  if not exists (
    select 1 from pg_catalog.pg_constraint
    where conrelid = 'public.vehicles'::regclass
      and conname   = 'vehicles_vehicle_model_id_fkey'
  ) then
    alter table public.vehicles
      add constraint vehicles_vehicle_model_id_fkey
      foreign key (vehicle_model_id)
      references public.vehicle_models(id)
      on delete set null;
  end if;
end $$;

-- ────────────────────────────────────────────────────────────────────────────
-- 6. INDEX on vehicles(vehicle_model_id)
-- ────────────────────────────────────────────────────────────────────────────
create index if not exists vehicles_vehicle_model_id_idx
  on public.vehicles(vehicle_model_id);
