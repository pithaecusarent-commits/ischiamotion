delete from public.checkins duplicate
using public.checkins keeper
where duplicate.booking_id is not null
  and duplicate.booking_id = keeper.booking_id
  and (
    duplicate.created_at > keeper.created_at
    or (
      duplicate.created_at = keeper.created_at
      and duplicate.id > keeper.id
    )
  );

create unique index if not exists checkins_booking_id_unique_idx
on public.checkins (booking_id)
where booking_id is not null;

drop policy if exists "Admins can read checkins" on public.checkins;
create policy "Admins can read checkins"
on public.checkins for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert checkins" on public.checkins;
create policy "Admins can insert checkins"
on public.checkins for insert
to authenticated
with check (public.is_admin());

-- No anon, renter or public update policy is granted in this phase.
