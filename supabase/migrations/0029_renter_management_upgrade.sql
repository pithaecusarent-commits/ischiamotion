alter table public.profiles
add column if not exists privacy_accepted_at timestamptz,
add column if not exists terms_accepted_at timestamptz,
add column if not exists force_password_change boolean not null default false,
add column if not exists password_changed_at timestamptz,
add column if not exists temp_password_created_at timestamptz,
add column if not exists temp_password_expires_at timestamptz,
add column if not exists created_by_admin boolean not null default false,
add column if not exists created_by_admin_id uuid references public.profiles(id) on delete set null,
add column if not exists vat_number text,
add column if not exists fiscal_code text,
add column if not exists business_address text,
add column if not exists business_city text,
add column if not exists operating_zones text[] not null default '{}',
add column if not exists service_categories text[] not null default '{}',
add column if not exists admin_notes text;

alter table public.renters
add column if not exists vat_number text,
add column if not exists fiscal_code text,
add column if not exists business_address text,
add column if not exists business_city text,
add column if not exists operating_zones text[] not null default '{}',
add column if not exists service_categories text[] not null default '{}',
add column if not exists admin_notes text,
add column if not exists onboarding_status text not null default 'not_started';

alter table public.renters
drop constraint if exists renters_onboarding_status_check;

alter table public.renters
add constraint renters_onboarding_status_check
check (onboarding_status in ('not_started', 'pending_first_login', 'in_progress', 'complete'));

create index if not exists profiles_account_status_idx on public.profiles(account_status);
create index if not exists renters_onboarding_status_idx on public.renters(onboarding_status);

drop policy if exists "Admins can insert renters" on public.renters;
create policy "Admins can insert renters"
on public.renters for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update renters" on public.renters;
create policy "Admins can update renters"
on public.renters for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

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
  requested_vat_number text := nullif(trim(new.raw_user_meta_data ->> 'vat_number'), '');
  requested_fiscal_code text := nullif(trim(new.raw_user_meta_data ->> 'fiscal_code'), '');
  requested_business_address text := nullif(trim(new.raw_user_meta_data ->> 'business_address'), '');
  requested_business_city text := nullif(trim(new.raw_user_meta_data ->> 'business_city'), '');
  requested_operating_zones text[] := coalesce(
    array(select jsonb_array_elements_text(coalesce(new.raw_user_meta_data -> 'operating_zones', '[]'::jsonb))),
    '{}'::text[]
  );
  requested_service_categories text[] := coalesce(
    array(select jsonb_array_elements_text(coalesce(new.raw_user_meta_data -> 'service_categories', '[]'::jsonb))),
    '{}'::text[]
  );
  requested_admin_notes text := nullif(trim(new.raw_user_meta_data ->> 'admin_notes'), '');
  requested_privacy_accepted_at timestamptz := nullif(new.raw_user_meta_data ->> 'privacy_accepted_at', '')::timestamptz;
  requested_terms_accepted_at timestamptz := nullif(new.raw_user_meta_data ->> 'terms_accepted_at', '')::timestamptz;
  requested_created_by_admin boolean := coalesce((new.raw_user_meta_data ->> 'created_by_admin')::boolean, false);
  requested_force_password_change boolean := coalesce((new.raw_user_meta_data ->> 'force_password_change')::boolean, false);
begin
  insert into public.profiles (
    id,
    email,
    role,
    account_status,
    business_name,
    contact_name,
    phone,
    approved_at,
    privacy_accepted_at,
    terms_accepted_at,
    force_password_change,
    temp_password_created_at,
    temp_password_expires_at,
    created_by_admin,
    vat_number,
    fiscal_code,
    business_address,
    business_city,
    operating_zones,
    service_categories,
    admin_notes
  )
  values (
    new.id,
    new.email,
    'renter',
    'pending',
    requested_business_name,
    requested_contact_name,
    requested_phone,
    null,
    requested_privacy_accepted_at,
    requested_terms_accepted_at,
    requested_force_password_change,
    case when requested_force_password_change then now() else null end,
    case when requested_force_password_change then now() + interval '7 days' else null end,
    requested_created_by_admin,
    requested_vat_number,
    requested_fiscal_code,
    requested_business_address,
    requested_business_city,
    requested_operating_zones,
    requested_service_categories,
    requested_admin_notes
  )
  on conflict (id) do update set
    email = excluded.email,
    business_name = coalesce(excluded.business_name, public.profiles.business_name),
    contact_name = coalesce(excluded.contact_name, public.profiles.contact_name),
    phone = coalesce(excluded.phone, public.profiles.phone),
    privacy_accepted_at = coalesce(excluded.privacy_accepted_at, public.profiles.privacy_accepted_at),
    terms_accepted_at = coalesce(excluded.terms_accepted_at, public.profiles.terms_accepted_at),
    force_password_change = public.profiles.force_password_change or excluded.force_password_change,
    temp_password_created_at = coalesce(public.profiles.temp_password_created_at, excluded.temp_password_created_at),
    temp_password_expires_at = coalesce(public.profiles.temp_password_expires_at, excluded.temp_password_expires_at),
    created_by_admin = public.profiles.created_by_admin or excluded.created_by_admin,
    vat_number = coalesce(excluded.vat_number, public.profiles.vat_number),
    fiscal_code = coalesce(excluded.fiscal_code, public.profiles.fiscal_code),
    business_address = coalesce(excluded.business_address, public.profiles.business_address),
    business_city = coalesce(excluded.business_city, public.profiles.business_city),
    operating_zones = case when array_length(excluded.operating_zones, 1) > 0 then excluded.operating_zones else public.profiles.operating_zones end,
    service_categories = case when array_length(excluded.service_categories, 1) > 0 then excluded.service_categories else public.profiles.service_categories end,
    admin_notes = coalesce(excluded.admin_notes, public.profiles.admin_notes),
    updated_at = now();

  return new;
end;
$$;

create or replace function public.complete_renter_first_password_change()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  linked_renter_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authenticated access required.';
  end if;

  update public.profiles
  set force_password_change = false,
      password_changed_at = now(),
      temp_password_expires_at = null,
      updated_at = now()
  where id = auth.uid()
    and role = 'renter'
    and account_status = 'approved';

  select ru.renter_id
  into linked_renter_id
  from public.renter_users ru
  where ru.profile_id = auth.uid()
  order by ru.created_at asc
  limit 1;

  if linked_renter_id is not null then
    update public.renters
    set onboarding_status = 'in_progress',
        updated_at = now()
    where id = linked_renter_id
      and onboarding_status = 'pending_first_login';
  end if;
end;
$$;

revoke all on function public.complete_renter_first_password_change() from public;
grant execute on function public.complete_renter_first_password_change() to authenticated;

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

  if linked_renter_id is null and target_profile.email is not null then
    select id
    into linked_renter_id
    from public.renters
    where lower(email) = lower(target_profile.email)
    order by created_at asc
    limit 1;
  end if;

  if linked_renter_id is null then
    insert into public.renters (
      business_name_internal,
      contact_name,
      email,
      phone,
      status,
      vat_number,
      fiscal_code,
      business_address,
      business_city,
      operating_zones,
      service_categories,
      admin_notes,
      onboarding_status
    )
    values (
      coalesce(nullif(trim(target_profile.business_name), ''), coalesce(target_profile.email, 'Noleggiatore')),
      nullif(trim(coalesce(target_profile.contact_name, '')), ''),
      target_profile.email,
      nullif(trim(coalesce(target_profile.phone, '')), ''),
      'active',
      nullif(trim(coalesce(target_profile.vat_number, '')), ''),
      nullif(trim(coalesce(target_profile.fiscal_code, '')), ''),
      nullif(trim(coalesce(target_profile.business_address, '')), ''),
      nullif(trim(coalesce(target_profile.business_city, '')), ''),
      coalesce(target_profile.operating_zones, '{}'::text[]),
      coalesce(target_profile.service_categories, '{}'::text[]),
      nullif(trim(coalesce(target_profile.admin_notes, '')), ''),
      case when target_profile.force_password_change then 'pending_first_login' else 'not_started' end
    )
    returning id into linked_renter_id;
  end if;

  insert into public.renter_users (renter_id, profile_id)
  values (linked_renter_id, target_profile_id)
  on conflict (profile_id) do update
  set renter_id = excluded.renter_id
  returning renter_id into linked_renter_id;

  update public.renters
  set status = 'active',
      email = coalesce(email, target_profile.email),
      contact_name = coalesce(contact_name, target_profile.contact_name),
      phone = coalesce(phone, target_profile.phone),
      vat_number = coalesce(vat_number, target_profile.vat_number),
      fiscal_code = coalesce(fiscal_code, target_profile.fiscal_code),
      business_address = coalesce(business_address, target_profile.business_address),
      business_city = coalesce(business_city, target_profile.business_city),
      operating_zones = case when array_length(coalesce(target_profile.operating_zones, '{}'::text[]), 1) > 0 then target_profile.operating_zones else operating_zones end,
      service_categories = case when array_length(coalesce(target_profile.service_categories, '{}'::text[]), 1) > 0 then target_profile.service_categories else service_categories end,
      admin_notes = coalesce(admin_notes, target_profile.admin_notes),
      onboarding_status = case when target_profile.force_password_change then 'pending_first_login' else onboarding_status end,
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
