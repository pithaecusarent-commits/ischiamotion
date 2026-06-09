"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendBookingVoucherEmail, type VoucherEmailResult } from "@/lib/email/booking-voucher-email";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { getAdminBookingById, updateAdminBookingStatus } from "@/lib/supabase/queries/admin-bookings";

type VoucherMessage = "success" | "error" | "missingEmail" | "providerError" | "statusError";

function redirectWithVoucherMessage(id: string, type: VoucherMessage): never {
  redirect(`/admin/bookings/${id}?voucher=${type}`);
}

function voucherMessage(result: VoucherEmailResult): VoucherMessage {
  if (result.ok) return "success";
  if (result.reason === "missing_customer_email") return "missingEmail";
  if (result.reason === "provider_not_configured") return "providerError";
  return "error";
}

export async function generateVoucherAction(formData: FormData) {
  const bookingId = String(formData.get("bookingId") || "");

  if (!bookingId) {
    redirectWithVoucherMessage(bookingId, "error");
  }

  const { accessToken, user, profile } = await requireAdmin(`/admin/bookings/${bookingId}`);
  const { booking, error: bookingError } = await getAdminBookingById(accessToken, bookingId);

  if (bookingError || !booking || !["confirmed", "voucher_sent"].includes(booking.status)) {
    redirectWithVoucherMessage(bookingId, "error");
  }

  const result = await sendBookingVoucherEmail(bookingId, {
    accessToken,
    actorProfileId: user.id,
    actorEmail: profile.email
  });

  if (!result.ok) {
    revalidatePath(`/admin/bookings/${bookingId}`);
    redirectWithVoucherMessage(bookingId, voucherMessage(result));
  }

  const { error: statusError } = await updateAdminBookingStatus(accessToken, bookingId, "voucher_sent");
  if (statusError) {
    redirectWithVoucherMessage(bookingId, "statusError");
  }

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  redirectWithVoucherMessage(bookingId, "success");
}
