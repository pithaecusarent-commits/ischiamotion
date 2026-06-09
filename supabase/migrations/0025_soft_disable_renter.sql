create or replace function public.disable_renter_profile(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_profile public.profiles%rowtype;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Admin access required.';
  end if;

  select *
  into target_profile
  from public.profiles
  where id = p_profile_id
  limit 1
  for update;

  if target_profile.id is null then
    raise exception 'Profilo non trovato.';
  end if;

  if target_profile.role <> 'renter' then
    raise exception 'Il profilo selezionato non e un noleggiatore.';
  end if;

  update public.profiles
  set account_status = 'disabled',
      updated_at = now()
  where id = p_profile_id;

  update public.renters
  set status = 'disabled',
      updated_at = now()
  where id in (
    select renter_id
    from public.renter_users
    where profile_id = p_profile_id
  );

  update public.vehicles
  set is_active = false,
      updated_at = now()
  where renter_id in (
    select renter_id
    from public.renter_users
    where profile_id = p_profile_id
  );
end;
$$;

revoke all on function public.disable_renter_profile(uuid) from public;
revoke all on function public.disable_renter_profile(uuid) from anon;
grant execute on function public.disable_renter_profile(uuid) to authenticated;
