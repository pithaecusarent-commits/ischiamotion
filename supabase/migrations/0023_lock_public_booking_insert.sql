-- Remove all direct anon INSERT access on the bookings table.
--
-- Background:
--   Migration 0002 created "Public can create pending booking requests" allowing
--   anon to INSERT rows directly with status='pending' and renter_id IS NULL.
--   Migration 0015 replaced it with "Public can create unassigned mock booking
--   requests" (same intent, same bypass risk).
--
-- Problem:
--   Both policies let any anonymous caller insert arbitrary rows into bookings
--   without going through create_public_booking_request, bypassing:
--     - date validation
--     - vehicle availability checks
--     - delivery method capability checks
--     - nautical category restrictions
--
-- Fix:
--   Drop both policies. The only public path for booking creation is now the
--   create_public_booking_request RPC, which is SECURITY DEFINER and therefore
--   does not need a table-level INSERT policy to operate. Its EXECUTE grant for
--   anon and authenticated roles was set in migration 0022 and is unchanged.
--
-- Impact on other operations:
--   Admin SELECT/UPDATE: unaffected (governed by is_admin() policies).
--   Renter SELECT: unaffected (governed by is_renter() + current_renter_ids()).
--   Voucher / check-in / status updates: unaffected (use admin/renter policies).

drop policy if exists "Public can create unassigned mock booking requests" on public.bookings;
drop policy if exists "Public can create pending booking requests"          on public.bookings;
