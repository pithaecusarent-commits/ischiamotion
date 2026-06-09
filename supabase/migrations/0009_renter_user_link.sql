create table if not exists public.renter_users (
  id uuid primary key default gen_random_uuid(),
  renter_id uuid not null references public.renters(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint renter_users_unique unique (renter_id, profile_id)
);

create index if not exists renter_users_renter_id_idx on public.renter_users(renter_id);
create index if not exists renter_users_profile_id_idx on public.renter_users(profile_id);

alter table public.renter_users enable row level security;

create or replace function public.is_renter()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'renter'
  );
$$;

create or replace function public.current_renter_ids()
returns setof uuid
language sql
security definer
set search_path = public
as $$
  select renter_id
  from public.renter_users
  where profile_id = auth.uid()
    and public.is_renter();
$$;

drop policy if exists "Renter users can read own links" on public.renter_users;
create policy "Renter users can read own links"
on public.renter_users for select
to authenticated
using (profile_id = auth.uid() and public.is_renter());

drop policy if exists "Admins can read renter user links" on public.renter_users;
create policy "Admins can read renter user links"
on public.renter_users for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can manage renter user links" on public.renter_users;
create policy "Admins can manage renter user links"
on public.renter_users for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Renters can read assigned bookings" on public.bookings;
create policy "Renters can read assigned bookings"
on public.bookings for select
to authenticated
using (
  public.is_renter()
  and renter_id in (select public.current_renter_ids())
);

drop policy if exists "Renters can read own availability" on public.renter_category_availability;
create policy "Renters can read own availability"
on public.renter_category_availability for select
to authenticated
using (
  public.is_renter()
  and renter_id in (select public.current_renter_ids())
);

drop policy if exists "Renters can insert own availability" on public.renter_category_availability;
create policy "Renters can insert own availability"
on public.renter_category_availability for insert
to authenticated
with check (
  public.is_renter()
  and renter_id in (select public.current_renter_ids())
);

drop policy if exists "Renters can update own availability" on public.renter_category_availability;
create policy "Renters can update own availability"
on public.renter_category_availability for update
to authenticated
using (
  public.is_renter()
  and renter_id in (select public.current_renter_ids())
)
with check (
  public.is_renter()
  and renter_id in (select public.current_renter_ids())
);

drop policy if exists "Renters can read own checkins" on public.checkins;
create policy "Renters can read own checkins"
on public.checkins for select
to authenticated
using (
  public.is_renter()
  and exists (
    select 1
    from public.bookings b
    where b.id = checkins.booking_id
      and b.renter_id in (select public.current_renter_ids())
  )
);

create or replace function public.renter_checkin_voucher(lookup_voucher_code text)
returns table (
  outcome text,
  message text,
  booking_code text,
  booking_status text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  target_booking public.bookings%rowtype;
  target_voucher public.booking_vouchers%rowtype;
  existing_checkin_id uuid;
begin
  if auth.uid() is null or not public.is_renter() then
    return query select 'denied', 'Accesso noleggiatore richiesto.', null::text, null::text;
    return;
  end if;

  select *
  into target_voucher
  from public.booking_vouchers
  where voucher_code = trim(lookup_voucher_code)
  limit 1;

  if target_voucher.id is null then
    return query select 'invalid', 'Voucher non trovato.', null::text, null::text;
    return;
  end if;

  select *
  into target_booking
  from public.bookings
  where id = target_voucher.booking_id
    and renter_id in (select public.current_renter_ids())
  limit 1;

  if target_booking.id is null then
    return query select 'invalid', 'Voucher non assegnato al tuo noleggio.', null::text, null::text;
    return;
  end if;

  select id
  into existing_checkin_id
  from public.checkins
  where booking_id = target_booking.id
  limit 1;

  if existing_checkin_id is not null or target_booking.status = 'checked_in' then
    return query select 'already_checked_in', 'Check-in gia effettuato.', target_booking.booking_code, target_booking.status;
    return;
  end if;

  if target_booking.status not in ('voucher_sent', 'confirmed') then
    return query select 'invalid_status', 'Il voucher non e in uno stato valido per il check-in.', target_booking.booking_code, target_booking.status;
    return;
  end if;

  insert into public.checkins (
    booking_id,
    voucher_code,
    checked_in_at,
    checked_in_by,
    method,
    notes
  )
  values (
    target_booking.id,
    target_voucher.voucher_code,
    now(),
    auth.uid(),
    'renter',
    'Check-in registrato da area noleggiatore.'
  )
  on conflict do nothing;

  update public.bookings
  set status = 'checked_in',
      updated_at = now()
  where id = target_booking.id
    and renter_id in (select public.current_renter_ids());

  return query select 'checked_in', 'Check-in registrato correttamente.', target_booking.booking_code, 'checked_in'::text;
end;
$$;

revoke all on function public.renter_checkin_voucher(text) from public;
grant execute on function public.renter_checkin_voucher(text) to authenticated;
