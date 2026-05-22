drop policy if exists "Admins can read booking vouchers" on public.booking_vouchers;
create policy "Admins can read booking vouchers"
on public.booking_vouchers for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert booking vouchers" on public.booking_vouchers;
create policy "Admins can insert booking vouchers"
on public.booking_vouchers for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update booking vouchers" on public.booking_vouchers;
create policy "Admins can update booking vouchers"
on public.booking_vouchers for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create or replace function public.get_public_voucher_checkin(lookup_voucher_code text)
returns table (
  voucher_code text,
  booking_status text,
  customer_display_name text,
  vehicle_label text,
  pickup_point_label text,
  start_date date,
  end_date date,
  pickup_time text
)
language sql
security definer
set search_path = public
as $$
  select
    v.voucher_code,
    b.status as booking_status,
    trim(concat(b.customer_first_name, ' ', left(coalesce(b.customer_last_name, ''), 1), '.')) as customer_display_name,
    nullif(substring(coalesce(b.notes, '') from 'Vehicle: ([^\n]+)'), '') as vehicle_label,
    nullif(substring(coalesce(b.notes, '') from 'Pickup point: ([^\n]+)'), '') as pickup_point_label,
    b.start_date,
    b.end_date,
    b.pickup_time
  from public.booking_vouchers v
  join public.bookings b on b.id = v.booking_id
  where v.voucher_code = lookup_voucher_code
  limit 1;
$$;

revoke all on function public.get_public_voucher_checkin(text) from public;
grant execute on function public.get_public_voucher_checkin(text) to anon, authenticated;

-- No anon table policy is granted for booking_vouchers.
-- Public check-in reads only sanitized fields through get_public_voucher_checkin().
-- Renter voucher access intentionally not granted in this phase.
