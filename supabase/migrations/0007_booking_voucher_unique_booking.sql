delete from public.booking_vouchers duplicate
using public.booking_vouchers keeper
where duplicate.booking_id = keeper.booking_id
  and (
    duplicate.created_at > keeper.created_at
    or (
      duplicate.created_at = keeper.created_at
      and duplicate.id > keeper.id
    )
  );

create unique index if not exists booking_vouchers_booking_id_unique_idx
on public.booking_vouchers (booking_id);
