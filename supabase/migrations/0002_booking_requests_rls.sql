drop policy if exists "Public can create pending booking requests" on public.bookings;
create policy "Public can create pending booking requests"
on public.bookings for insert
to anon
with check (
  status = 'pending'
  and renter_id is null
);

drop policy if exists "Authenticated admins can read booking requests" on public.bookings;
create policy "Authenticated admins can read booking requests"
on public.bookings for select
to authenticated
using (true);
