"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { getAdminBookingById, updateAdminBookingStatus } from "@/lib/supabase/queries/admin-bookings";
import { createAdminCheckin } from "@/lib/supabase/queries/checkins";
import { getAdminVoucherByBookingId } from "@/lib/supabase/queries/vouchers";

function redirectWithCheckinMessage(id: string, type: "success" | "error"): never {
  redirect(`/admin/bookings/${id}?checkin=${type}`);
}

export async function markBookingCheckedInAction(formData: FormData) {
  const bookingId = String(formData.get("bookingId") || "");

  if (!bookingId) {
    redirectWithCheckinMessage(bookingId, "error");
  }

  const { accessToken, user } = await requireAdmin(`/admin/bookings/${bookingId}`);
  const { booking, error: bookingError } = await getAdminBookingById(accessToken, bookingId);

  if (bookingError || !booking || !["voucher_sent", "confirmed"].includes(booking.status)) {
    redirectWithCheckinMessage(bookingId, "error");
  }

  const { voucher, error: voucherError } = await getAdminVoucherByBookingId(accessToken, booking.id);

  if (voucherError || !voucher) {
    redirectWithCheckinMessage(bookingId, "error");
  }

  const { error: checkinError } = await createAdminCheckin({
    accessToken,
    bookingId: booking.id,
    voucherCode: voucher.voucher_code,
    adminUserId: user.id
  });

  if (checkinError) {
    redirectWithCheckinMessage(bookingId, "error");
  }

  const { error: statusError } = await updateAdminBookingStatus(accessToken, booking.id, "checked_in");

  if (statusError) {
    redirectWithCheckinMessage(bookingId, "error");
  }

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  redirectWithCheckinMessage(bookingId, "success");
}
