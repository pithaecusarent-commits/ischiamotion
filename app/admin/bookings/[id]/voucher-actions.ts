"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendBookingVoucherEmail } from "@/lib/email/booking-voucher-email";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { logAdminAuditEvent } from "@/lib/supabase/queries/admin-audit-log";
import { getAdminBookingById, updateAdminBookingPayment, updateAdminBookingStatus } from "@/lib/supabase/queries/admin-bookings";

function redirectWithVoucherMessage(id: string, type: "success" | "error" | "depositVoucherSent", reason?: string | null): never {
  const params = new URLSearchParams({ voucher: type });
  if (reason) params.set("voucherError", reason.slice(0, 400));
  redirect(`/admin/bookings/${id}?${params.toString()}`);
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

  if (booking.payment_type === "deposit_required" && !["deposit_paid", "paid"].includes(booking.payment_status)) {
    redirectWithVoucherMessage(bookingId, "error", "Deposit payment must be registered before sending the voucher.");
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
    redirectWithVoucherMessage(bookingId, "error", voucherEmail.error);
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

export async function confirmDepositAndSendVoucherAction(formData: FormData) {
  const bookingId = String(formData.get("bookingId") || "");

  if (!bookingId) {
    redirectWithVoucherMessage(bookingId, "error");
  }

  const { accessToken, user, profile } = await requireAdmin(`/admin/bookings/${bookingId}`);
  const { booking, error: bookingError } = await getAdminBookingById(accessToken, bookingId);

  if (bookingError || !booking || booking.payment_type !== "deposit_required" || !["confirmed", "voucher_sent"].includes(booking.status)) {
    redirectWithVoucherMessage(bookingId, "error");
  }

  const paymentStatus = booking.payment_status === "paid" ? "paid" : "deposit_paid";
  const paymentUpdate = await updateAdminBookingPayment(accessToken, bookingId, {
    payment_type: booking.payment_type,
    payment_method: booking.payment_method,
    payment_status: paymentStatus,
    total_amount: booking.total_amount,
    deposit_amount: booking.deposit_amount,
    balance_due: booking.balance_due,
    payment_notes: booking.payment_notes
  });

  if (paymentUpdate.error) {
    redirectWithVoucherMessage(bookingId, "error", paymentUpdate.error);
  }

  const { error: confirmationError } = await updateAdminBookingStatus(accessToken, bookingId, "confirmed");
  if (confirmationError) {
    redirectWithVoucherMessage(bookingId, "error", confirmationError);
  }

  const voucherEmail = await sendBookingVoucherEmail(booking.id);

  if (!voucherEmail.ok) {
    await logAdminAuditEvent({
      accessToken,
      actorProfileId: user.id,
      actorEmail: profile.email,
      action: "booking.deposit_voucher_send_failed",
      targetTable: "bookings",
      targetId: bookingId,
      metadata: { error: voucherEmail.error, voucherCode: voucherEmail.voucherCode || null }
    });
    redirectWithVoucherMessage(bookingId, "error", voucherEmail.error);
  }

  await logAdminAuditEvent({
    accessToken,
    actorProfileId: user.id,
    actorEmail: profile.email,
    action: "booking.deposit_paid_and_voucher_sent",
    targetTable: "bookings",
    targetId: bookingId,
    metadata: {
      paymentStatus,
      status: "voucher_sent",
      voucherCode: voucherEmail.voucherCode,
      warning: voucherEmail.warning || null
    }
  });

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  redirectWithVoucherMessage(bookingId, "depositVoucherSent");
}
