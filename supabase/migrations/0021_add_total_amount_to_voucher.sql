-- Add total_amount to the public voucher checkin RPC.
-- Admin already has UPDATE access on bookings via "Admins can update booking status"
-- policy (migration 0005), which covers all fields including payment fields.
-- No new RLS policy needed.

drop function if exists public.get_public_voucher_checkin(text);

create function public.get_public_voucher_checkin(lookup_voucher_code text)
returns table (
  voucher_code          text,
  customer_language     text,
  booking_status        text,
  customer_display_name text,
  vehicle_label         text,
  pickup_point_label    text,
  start_date            date,
  end_date              date,
  pickup_time           text,
  delivery_method       text,
  delivery_location     text,
  delivery_notes        text,
  payment_type          text,
  payment_status        text,
  total_amount          numeric,
  deposit_amount        numeric,
  balance_due           numeric
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
    nullif(substring(coalesce(b.notes, '') from 'Vehicle: ([^\n]+)'), '')      as vehicle_label,
    nullif(substring(coalesce(b.notes, '') from 'Pickup point: ([^\n]+)'), '') as pickup_point_label,
    b.start_date,
    b.end_date,
    b.pickup_time,
    b.delivery_method,
    b.delivery_location,
    b.delivery_notes,
    b.payment_type,
    b.payment_status,
    b.total_amount,
    b.deposit_amount,
    b.balance_due
  from public.booking_vouchers v
  join public.bookings b on b.id = v.booking_id
  where v.voucher_code = lookup_voucher_code
  limit 1;
$$;

revoke all on function public.get_public_voucher_checkin(text) from public;
grant execute on function public.get_public_voucher_checkin(text) to anon, authenticated;
