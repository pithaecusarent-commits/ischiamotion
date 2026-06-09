"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendBookingVoucherEmail } from "@/lib/email/booking-voucher-email";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { logAdminAuditEvent } from "@/lib/supabase/queries/admin-audit-log";
import { getAdminBookingById, updateAdminBookingStatus } from "@/lib/supabase/queries/admin-bookings";

function redirectWithVoucherMessage(id: string, type: "success" | "error"): never {
  redirect(`/admin/bookings/${id}?voucher=${type}`);
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

  const { error: confirmationError } = await updateAdminBookingStatus(accessToken, bookingId, "confirmed");
  if (confirmationError) {
    redirectWithVoucherMessage(bookingId, "error");
  }

  const voucherEmail = await sendBookingVoucherEmail(booking.id);

  if (!voucherEmail.ok) {
    await logAdminAuditEvent({
      accessToken,
      actorProfileId: user.id,
      actorEmail: profile.email,
      action: "booking.voucher_send_failed",
      targetTable: "bookings",
      targetId: bookingId,
      metadata: { error: voucherEmail.error, voucherCode: voucherEmail.voucherCode || null }
    });
    redirectWithVoucherMessage(bookingId, "error");
  }

  await logAdminAuditEvent({
    accessToken,
    actorProfileId: user.id,
    actorEmail: profile.email,
    action: "booking.voucher_sent",
    targetTable: "bookings",
    targetId: bookingId,
    metadata: { status: "voucher_sent", voucherCode: voucherEmail.voucherCode }
  });

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  redirectWithVoucherMessage(bookingId, "success");
}
