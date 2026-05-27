alter table public.profiles
add column if not exists account_status text not null default 'pending',
add column if not exists business_name text,
add column if not exists contact_name text,
add column if not exists phone text,
add column if not exists approved_at timestamptz,
add column if not exists approved_by uuid references public.profiles(id) on delete set null,
add column if not exists rejected_at timestamptz,
add column if not exists rejection_reason text;

alter table public.profiles
drop constraint if exists profiles_account_status_check;

alter table public.profiles
add constraint profiles_account_status_check
check (account_status in ('pending', 'approved', 'rejected', 'disabled'));

update public.profiles
set account_status = 'approved',
    approved_at = coalesce(approved_at, now()),
    updated_at = now()
where role = 'admin'
  and account_status is distinct from 'approved';

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and account_status = 'approved'
  );
$$;

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
      and account_status = 'approved'
      and exists (
        select 1
        from public.renter_users ru
        join public.renters r on r.id = ru.renter_id
        where ru.profile_id = auth.uid()
          and r.status = 'active'
      )
  );
$$;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_business_name text := nullif(trim(new.raw_user_meta_data ->> 'business_name'), '');
  requested_contact_name text := nullif(trim(new.raw_user_meta_data ->> 'contact_name'), '');
  requested_phone text := nullif(trim(new.raw_user_meta_data ->> 'phone'), '');
begin
  insert into public.profiles (
    id,
    email,
    role,
    account_status,
    business_name,
    contact_name,
    phone,
    approved_at
  )
  values (
    new.id,
    new.email,
    'renter',
    'pending',
    requested_business_name,
    requested_contact_name,
    requested_phone,
    null
  )
  on conflict (id) do update set
    email = excluded.email,
    business_name = coalesce(excluded.business_name, public.profiles.business_name),
    contact_name = coalesce(excluded.contact_name, public.profiles.contact_name),
    phone = coalesce(excluded.phone, public.profiles.phone),
    updated_at = now();

  return new;
end;
$$;

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
on public.profiles for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

do $$
begin
  if exists (
    select 1
    from public.renter_users
    group by profile_id
    having count(*) > 1
  ) then
    raise exception 'Duplicate renter_users.profile_id rows found. Resolve them before applying renter approval constraints.';
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'renter_users_profile_id_unique'
  ) then
    alter table public.renter_users
    add constraint renter_users_profile_id_unique unique (profile_id);
  end if;
end $$;

create or replace function public.approve_renter_profile(target_profile_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_profile public.profiles%rowtype;
  linked_renter_id uuid;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Admin access required.';
  end if;

  select *
  into target_profile
  from public.profiles
  where id = target_profile_id
  limit 1
  for update;

  if target_profile.id is null then
    raise exception 'Profilo non trovato.';
  end if;

  if target_profile.role <> 'renter' then
    raise exception 'Il profilo selezionato non e un noleggiatore.';
  end if;

  if target_profile.account_status = 'rejected' then
    raise exception 'Il profilo selezionato e stato rifiutato.';
  end if;

  if target_profile.account_status = 'disabled' then
    raise exception 'Il profilo selezionato e disattivato.';
  end if;

  select renter_id
  into linked_renter_id
  from public.renter_users
  where profile_id = target_profile_id
  order by created_at asc
  limit 1;

  if linked_renter_id is null then
    if target_profile.email is not null then
      select id
      into linked_renter_id
      from public.renters
      where lower(email) = lower(target_profile.email)
      order by created_at asc
      limit 1;
    end if;
  end if;

  if linked_renter_id is null then
    insert into public.renters (
      business_name_internal,
      contact_name,
      email,
      phone,
      status
    )
    values (
      coalesce(nullif(trim(target_profile.business_name), ''), coalesce(target_profile.email, 'Noleggiatore')),
      nullif(trim(coalesce(target_profile.contact_name, '')), ''),
      target_profile.email,
      nullif(trim(coalesce(target_profile.phone, '')), ''),
      'active'
    )
    returning id into linked_renter_id;
  end if;

  insert into public.renter_users (renter_id, profile_id)
  values (linked_renter_id, target_profile_id)
  on conflict (profile_id) do update
  set profile_id = excluded.profile_id
  returning renter_id into linked_renter_id;

  update public.renters
  set status = 'active',
      email = coalesce(email, target_profile.email),
      contact_name = coalesce(contact_name, target_profile.contact_name),
      phone = coalesce(phone, target_profile.phone),
      updated_at = now()
  where id = linked_renter_id;

  update public.profiles
  set account_status = 'approved',
      approved_at = now(),
      approved_by = auth.uid(),
      rejected_at = null,
      rejection_reason = null,
      updated_at = now()
  where id = target_profile_id;

  return linked_renter_id;
end;
$$;

create or replace function public.reject_renter_profile(target_profile_id uuid, reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Admin access required.';
  end if;

  if exists (
    select 1
    from public.profiles
    where id = target_profile_id
      and role = 'renter'
      and account_status = 'approved'
  ) then
    raise exception 'Il profilo selezionato e gia approvato.';
  end if;

  update public.profiles
  set account_status = 'rejected',
      rejected_at = now(),
      rejection_reason = nullif(trim(coalesce(reason, '')), ''),
      updated_at = now()
  where id = target_profile_id
    and role = 'renter';
end;
$$;

create or replace function public.deactivate_renter_profile(target_profile_id uuid)
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
  where id = target_profile_id
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
  where id = target_profile_id;

  update public.renters
  set status = 'disabled',
      updated_at = now()
  where id in (
    select renter_id
    from public.renter_users
    where profile_id = target_profile_id
  );

  update public.vehicles
  set is_active = false,
      updated_at = now()
  where renter_id in (
    select renter_id
    from public.renter_users
    where profile_id = target_profile_id
  );
end;
$$;

revoke all on function public.approve_renter_profile(uuid) from public;
grant execute on function public.approve_renter_profile(uuid) to authenticated;

revoke all on function public.reject_renter_profile(uuid, text) from public;
grant execute on function public.reject_renter_profile(uuid, text) to authenticated;

revoke all on function public.deactivate_renter_profile(uuid) from public;
grant execute on function public.deactivate_renter_profile(uuid) to authenticated;
