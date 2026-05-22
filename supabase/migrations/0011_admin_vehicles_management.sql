drop policy if exists "Admins can read vehicle categories" on public.vehicle_categories;
create policy "Admins can read vehicle categories"
on public.vehicle_categories for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can read pickup points" on public.pickup_points;
create policy "Admins can read pickup points"
on public.pickup_points for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can read renters" on public.renters;
create policy "Admins can read renters"
on public.renters for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can read vehicles" on public.vehicles;
create policy "Admins can read vehicles"
on public.vehicles for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert vehicles" on public.vehicles;
create policy "Admins can insert vehicles"
on public.vehicles for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update vehicles" on public.vehicles;
create policy "Admins can update vehicles"
on public.vehicles for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Keep the existing public select policy for active vehicles intact.
-- No renter insert/update policy is granted in this phase.
