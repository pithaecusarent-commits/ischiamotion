alter table public.bookings
add column if not exists delivery_method text not null default 'pickup_point',
add column if not exists delivery_location text,
add column if not exists delivery_notes text,
add column if not exists payment_type text not null default 'pay_on_pickup',
add column if not exists payment_method text not null default 'unknown',
add column if not exists payment_status text not null default 'unpaid',
add column if not exists total_amount numeric,
add column if not exists deposit_amount numeric,
add column if not exists balance_due numeric,
add column if not exists payment_notes text;

update public.bookings
set delivery_method = coalesce(delivery_method, 'pickup_point'),
    payment_type = coalesce(payment_type, 'pay_on_pickup'),
    payment_method = coalesce(payment_method, 'unknown'),
    payment_status = coalesce(payment_status, 'unpaid');

alter table public.bookings
drop constraint if exists bookings_delivery_method_check,
add constraint bookings_delivery_method_check
check (delivery_method in ('pickup_point', 'port_delivery', 'hotel_delivery'));

alter table public.bookings
drop constraint if exists bookings_payment_type_check,
add constraint bookings_payment_type_check
check (payment_type in ('pay_on_pickup', 'deposit_required', 'prepaid_full'));

alter table public.bookings
drop constraint if exists bookings_payment_method_check,
add constraint bookings_payment_method_check
check (payment_method in ('unknown', 'cash', 'card', 'bank_transfer', 'future_online_card'));

alter table public.bookings
drop constraint if exists bookings_payment_status_check,
add constraint bookings_payment_status_check
check (payment_status in ('unpaid', 'deposit_pending', 'deposit_paid', 'paid', 'refunded', 'cancelled'));

alter table public.bookings
drop constraint if exists bookings_amounts_non_negative_check,
add constraint bookings_amounts_non_negative_check
check (
  (total_amount is null or total_amount >= 0)
  and (deposit_amount is null or deposit_amount >= 0)
  and (balance_due is null or balance_due >= 0)
);

create table if not exists public.renter_delivery_capabilities (
  id uuid primary key default gen_random_uuid(),
  renter_id uuid not null references public.renters(id) on delete cascade,
  delivery_method text not null,
  is_enabled boolean not null default true,
  zones text[],
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint renter_delivery_capabilities_method_check
    check (delivery_method in ('pickup_point', 'port_delivery', 'hotel_delivery')),
  constraint renter_delivery_capabilities_unique unique (renter_id, delivery_method)
);

create index if not exists renter_delivery_capabilities_renter_id_idx
on public.renter_delivery_capabilities(renter_id);

alter table public.renter_delivery_capabilities enable row level security;

drop trigger if exists set_renter_delivery_capabilities_updated_at on public.renter_delivery_capabilities;
create trigger set_renter_delivery_capabilities_updated_at
before update on public.renter_delivery_capabilities
for each row execute function public.set_updated_at();

drop policy if exists "Renters can read own delivery capabilities" on public.renter_delivery_capabilities;
create policy "Renters can read own delivery capabilities"
on public.renter_delivery_capabilities for select
to authenticated
using (
  public.is_renter()
  and renter_id in (select public.current_renter_ids())
);

drop policy if exists "Renters can insert own delivery capabilities" on public.renter_delivery_capabilities;
create policy "Renters can insert own delivery capabilities"
on public.renter_delivery_capabilities for insert
to authenticated
with check (
  public.is_renter()
  and renter_id in (select public.current_renter_ids())
);

drop policy if exists "Renters can update own delivery capabilities" on public.renter_delivery_capabilities;
create policy "Renters can update own delivery capabilities"
on public.renter_delivery_capabilities for update
to authenticated
using (
  public.is_renter()
  and renter_id in (select public.current_renter_ids())
)
with check (
  public.is_renter()
  and renter_id in (select public.current_renter_ids())
);

drop policy if exists "Admins can read delivery capabilities" on public.renter_delivery_capabilities;
create policy "Admins can read delivery capabilities"
on public.renter_delivery_capabilities for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can manage delivery capabilities" on public.renter_delivery_capabilities;
create policy "Admins can manage delivery capabilities"
on public.renter_delivery_capabilities for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop function if exists public.get_public_voucher_checkin(text);

create function public.get_public_voucher_checkin(lookup_voucher_code text)
returns table (
  voucher_code text,
  customer_language text,
  booking_status text,
  customer_display_name text,
  vehicle_label text,
  pickup_point_label text,
  start_date date,
  end_date date,
  pickup_time text,
  delivery_method text,
  delivery_location text,
  delivery_notes text,
  payment_type text,
  payment_status text,
  deposit_amount numeric,
  balance_due numeric
)
language sql
security definer
set search_path = public
as $$
  select
    v.voucher_code,
    b.customer_language,
    b.status as booking_status,
    trim(concat(b.customer_first_name, ' ', left(coalesce(b.customer_last_name, ''), 1), '.')) as customer_display_name,
    nullif(substring(coalesce(b.notes, '') from 'Vehicle: ([^\n]+)'), '') as vehicle_label,
    nullif(substring(coalesce(b.notes, '') from 'Pickup point: ([^\n]+)'), '') as pickup_point_label,
    b.start_date,
    b.end_date,
    b.pickup_time,
    b.delivery_method,
    b.delivery_location,
    b.delivery_notes,
    b.payment_type,
    b.payment_status,
    b.deposit_amount,
    b.balance_due
  from public.booking_vouchers v
  join public.bookings b on b.id = v.booking_id
  where v.voucher_code = lookup_voucher_code
  limit 1;
$$;

revoke all on function public.get_public_voucher_checkin(text) from public;
grant execute on function public.get_public_voucher_checkin(text) to anon, authenticated;
