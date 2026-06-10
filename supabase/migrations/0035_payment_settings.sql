create table if not exists public.payment_settings (
  id uuid primary key default gen_random_uuid(),
  bank_account_holder text,
  iban text,
  bank_name text,
  bic_swift text,
  payment_reason_template text,
  deposit_instructions_it text,
  deposit_instructions_en text,
  receipt_email text,
  receipt_whatsapp text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create unique index if not exists payment_settings_single_active_idx
  on public.payment_settings (is_active)
  where is_active = true;

drop trigger if exists set_payment_settings_updated_at on public.payment_settings;
create trigger set_payment_settings_updated_at
  before update on public.payment_settings
  for each row execute function public.set_updated_at();

alter table public.payment_settings enable row level security;

drop policy if exists "Admins can read payment settings" on public.payment_settings;
create policy "Admins can read payment settings"
  on public.payment_settings for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert payment settings" on public.payment_settings;
create policy "Admins can insert payment settings"
  on public.payment_settings for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update payment settings" on public.payment_settings;
create policy "Admins can update payment settings"
  on public.payment_settings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete payment settings" on public.payment_settings;
create policy "Admins can delete payment settings"
  on public.payment_settings for delete
  to authenticated
  using (public.is_admin());
