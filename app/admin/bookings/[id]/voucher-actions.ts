"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { getAdminBookingById, updateAdminBookingStatus } from "@/lib/supabase/queries/admin-bookings";
import { createAdminVoucher } from "@/lib/supabase/queries/vouchers";

function redirectWithVoucherMessage(id: string, type: "success" | "error"): never {
  redirect(`/admin/bookings/${id}?voucher=${type}`);
}

export async function generateVoucherAction(formData: FormData) {
  const bookingId = String(formData.get("bookingId") || "");

  if (!bookingId) {
    redirectWithVoucherMessage(bookingId, "error");
  }

  const { accessToken } = await requireAdmin(`/admin/bookings/${bookingId}`);
  const { booking, error: bookingError } = await getAdminBookingById(accessToken, bookingId);

  if (bookingError || !booking || !["confirmed", "voucher_sent"].includes(booking.status)) {
    redirectWithVoucherMessage(bookingId, "error");
  }

  const { error: voucherError } = await createAdminVoucher(accessToken, booking);

  if (voucherError) {
    redirectWithVoucherMessage(bookingId, "error");
  }

  const { error: statusError } = await updateAdminBookingStatus(accessToken, bookingId, "voucher_sent");

  if (statusError) {
    redirectWithVoucherMessage(bookingId, "error");
  }

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  redirectWithVoucherMessage(bookingId, "success");
}
