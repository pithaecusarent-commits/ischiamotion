-- Pre go-live hardening:
-- 1) Public voucher lookup must not expose usable vouchers for cancelled/no_show bookings.
-- 2) Add safe, non-destructive indexes used by admin/dashboard/detail pages.
-- 3) Ensure bookings.booking_code is protected by a unique index/constraint.

do $$
begin
  if exists (
    select 1
    from public.bookings
    where booking_code is not null
    group by booking_code
    having count(*) > 1
  ) then
    raise exception 'Cannot create unique booking_code protection: duplicate booking_code values exist.';
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_index i
    join pg_class t on t.oid = i.indrelid
    join pg_namespace n on n.oid = t.relnamespace
    join pg_attribute a on a.attrelid = t.oid and a.attnum = any(i.indkey)
    where n.nspname = 'public'
      and t.relname = 'bookings'
      and i.indisunique = true
      and a.attname = 'booking_code'
  ) then
    create unique index bookings_booking_code_unique_idx
    on public.bookings (booking_code)
    where booking_code is not null;
  end if;
end $$;

create index if not exists bookings_status_idx
on public.bookings (status);

create index if not exists bookings_created_at_idx
on public.bookings (created_at desc);

create index if not exists bookings_start_date_idx
on public.bookings (start_date);

create index if not exists admin_audit_log_target_created_at_idx
on public.admin_audit_log (target_table, target_id, created_at desc);

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
    case
      when b.status in ('cancelled', 'no_show') then 'invalid'
      else b.status
    end as booking_status,
    case
      when b.status in ('cancelled', 'no_show') then null
      else trim(concat(b.customer_first_name, ' ', left(coalesce(b.customer_last_name, ''), 1), '.'))
    end as customer_display_name,
    case
      when b.status in ('cancelled', 'no_show') then null
      else nullif(substring(coalesce(b.notes, '') from 'Vehicle: ([^\n]+)'), '')
    end as vehicle_label,
    case
      when b.status in ('cancelled', 'no_show') then null
      else nullif(substring(coalesce(b.notes, '') from 'Pickup point: ([^\n]+)'), '')
    end as pickup_point_label,
    case when b.status in ('cancelled', 'no_show') then null else b.start_date end as start_date,
    case when b.status in ('cancelled', 'no_show') then null else b.end_date end as end_date,
    case when b.status in ('cancelled', 'no_show') then null else b.pickup_time end as pickup_time,
    case when b.status in ('cancelled', 'no_show') then null else b.delivery_method end as delivery_method,
    case when b.status in ('cancelled', 'no_show') then null else b.delivery_location end as delivery_location,
    case when b.status in ('cancelled', 'no_show') then null else b.delivery_notes end as delivery_notes,
    case when b.status in ('cancelled', 'no_show') then null else b.payment_type end as payment_type,
    case when b.status in ('cancelled', 'no_show') then null else b.payment_status end as payment_status,
    case when b.status in ('cancelled', 'no_show') then null else b.total_amount end as total_amount,
    case when b.status in ('cancelled', 'no_show') then null else b.deposit_amount end as deposit_amount,
    case when b.status in ('cancelled', 'no_show') then null else b.balance_due end as balance_due
  from public.booking_vouchers v
  join public.bookings b on b.id = v.booking_id
  where v.voucher_code = lookup_voucher_code
  limit 1;
$$;

revoke all on function public.get_public_voucher_checkin(text) from public;
grant execute on function public.get_public_voucher_checkin(text) to anon, authenticated;
