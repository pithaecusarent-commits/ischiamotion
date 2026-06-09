alter table public.vehicles
add column if not exists internal_name text;

drop policy if exists "Public can read active vehicles without renter details" on public.vehicles;

drop policy if exists "Renters can read assigned booking vehicles" on public.vehicles;
create policy "Renters can read assigned booking vehicles"
on public.vehicles for select
to authenticated
using (
  public.is_renter()
  and exists (
    select 1
    from public.bookings b
    where b.vehicle_id = vehicles.id
      and b.renter_id in (select public.current_renter_ids())
  )
);

-- Public vehicle reads will be reintroduced through a sanitized query/view
-- that never exposes vehicles.internal_name or renter business names.
