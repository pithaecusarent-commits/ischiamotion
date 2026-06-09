alter table public.profiles
add column if not exists seasonality_notes text,
add column if not exists seasonality_periods jsonb not null default '[]'::jsonb;

alter table public.renters
add column if not exists seasonality_notes text,
add column if not exists seasonality_periods jsonb not null default '[]'::jsonb;

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
  requested_seasonality_notes text := nullif(trim(new.raw_user_meta_data ->> 'seasonality_notes'), '');
  requested_seasonality_periods jsonb := coalesce(new.raw_user_meta_data -> 'seasonality_periods', '[]'::jsonb);
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
    admin_notes,
    seasonality_notes,
    seasonality_periods
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
    requested_admin_notes,
    requested_seasonality_notes,
    requested_seasonality_periods
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
    seasonality_notes = coalesce(excluded.seasonality_notes, public.profiles.seasonality_notes),
    seasonality_periods = case when jsonb_array_length(excluded.seasonality_periods) > 0 then excluded.seasonality_periods else public.profiles.seasonality_periods end,
    updated_at = now();

  return new;
end;
$$;

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
      seasonality_notes,
      seasonality_periods,
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
      nullif(trim(coalesce(target_profile.seasonality_notes, '')), ''),
      coalesce(target_profile.seasonality_periods, '[]'::jsonb),
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
      seasonality_notes = coalesce(seasonality_notes, target_profile.seasonality_notes),
      seasonality_periods = case when jsonb_array_length(coalesce(target_profile.seasonality_periods, '[]'::jsonb)) > 0 then target_profile.seasonality_periods else seasonality_periods end,
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
