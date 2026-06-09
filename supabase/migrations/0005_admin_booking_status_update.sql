alter table public.bookings
drop constraint if exists bookings_status_check;

alter table public.bookings
add constraint bookings_status_check
check (status in ('pending', 'confirmed', 'voucher_sent', 'checked_in', 'completed', 'cancelled', 'no_show'));

drop policy if exists "Admins can update booking status" on public.bookings;
create policy "Admins can update booking status"
on public.bookings for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Renter update access intentionally not granted in this phase.
-- Future renter policies should only allow scoped updates for bookings assigned
-- to that renter, once renter identity mapping is implemented.
