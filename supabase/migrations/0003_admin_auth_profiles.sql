create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'renter',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('admin', 'renter'))
);

alter table public.profiles
add column if not exists updated_at timestamptz not null default now();

alter table public.profiles enable row level security;

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
  );
$$;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "Admins can read profiles" on public.profiles;
create policy "Admins can read profiles"
on public.profiles for select
to authenticated
using (public.is_admin());

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'renter')
  on conflict (id) do update set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

insert into public.profiles (id, email, role)
select id, email, 'renter'
from auth.users
on conflict (id) do update set email = excluded.email, updated_at = now();

drop policy if exists "Authenticated admins can read booking requests" on public.bookings;

drop policy if exists "Admins can read booking requests" on public.bookings;
create policy "Admins can read booking requests"
on public.bookings for select
to authenticated
using (public.is_admin());

-- Future renter policy placeholder:
-- When bookings are reliably assigned to renters, add a select policy that allows
-- role = 'renter' users to read only rows where bookings.renter_id maps to their
-- renter identity. Until then, do not grant renter read access to bookings.
