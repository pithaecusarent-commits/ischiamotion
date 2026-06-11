alter table public.payment_settings
  add column if not exists bank_transfer_enabled boolean not null default true,
  add column if not exists stripe_enabled boolean not null default false,
  add column if not exists paypal_enabled boolean not null default false;
