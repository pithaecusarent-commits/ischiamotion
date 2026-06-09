"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendBookingVoucherEmail } from "@/lib/email/booking-voucher-email";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { logAdminAuditEvent } from "@/lib/supabase/queries/admin-audit-log";
import {
  adminBookingStatuses,
  assignAdminBookingRenter,
  updateAdminBookingStatus,
  type AdminBookingStatus
} from "@/lib/supabase/queries/admin-bookings";
import { getAdminVoucherByBookingId } from "@/lib/supabase/queries/vouchers";

function redirectWithMessage(id: string, type: "success" | "error" | "voucherRequired" | "voucherEmailError" | "voucherSent" | "renterAssigned" | "renterError") {
  const param = type === "renterAssigned" || type === "renterError" ? "renterAssign" : "statusUpdate";
  const value = type === "renterAssigned" ? "success" : type === "renterError" ? "error" : type;
  redirect(`/admin/bookings/${id}?${param}=${value}`);
}

export async function updateBookingStatusAction(formData: FormData) {
  const bookingId = String(formData.get("bookingId") || "");
  const nextStatus = String(formData.get("status") || "");

  if (!bookingId || !adminBookingStatuses.includes(nextStatus as AdminBookingStatus)) {
    redirectWithMessage(bookingId, "error");
  }

  const { accessToken, user, profile } = await requireAdmin(`/admin/bookings/${bookingId}`);

  if (nextStatus === "confirmed" || nextStatus === "voucher_sent") {
    const { error } = await updateAdminBookingStatus(accessToken, bookingId, "confirmed");

    if (error) {
      redirectWithMessage(bookingId, "error");
    }

    await logAdminAuditEvent({
      accessToken,
      actorProfileId: user.id,
      actorEmail: profile.email,
      action: "booking.status_update",
      targetTable: "bookings",
      targetId: bookingId,
      metadata: { status: "confirmed" }
    });

    const voucherEmail = await sendBookingVoucherEmail(bookingId);

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
      revalidatePath("/admin/bookings");
      revalidatePath(`/admin/bookings/${bookingId}`);
      redirectWithMessage(bookingId, "voucherEmailError");
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
    redirectWithMessage(bookingId, "voucherSent");
  }

  if (nextStatus === "checked_in") {
    const { voucher } = await getAdminVoucherByBookingId(accessToken, bookingId);

    if (!voucher) {
      redirectWithMessage(bookingId, "voucherRequired");
    }
  }

  const { error } = await updateAdminBookingStatus(accessToken, bookingId, nextStatus as AdminBookingStatus);

  if (error) {
    redirectWithMessage(bookingId, "error");
  }

  await logAdminAuditEvent({
    accessToken,
    actorProfileId: user.id,
    actorEmail: profile.email,
    action: "booking.status_update",
    targetTable: "bookings",
    targetId: bookingId,
    metadata: { status: nextStatus }
  });

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  redirectWithMessage(bookingId, "success");
}

export async function assignBookingRenterAction(formData: FormData) {
  const bookingId = String(formData.get("bookingId") || "");
  const renterId = String(formData.get("renterId") || "");

  if (!bookingId || !renterId) {
    redirectWithMessage(bookingId, "renterError");
  }

  const { accessToken, user, profile } = await requireAdmin(`/admin/bookings/${bookingId}`);
  const { error } = await assignAdminBookingRenter(accessToken, bookingId, renterId);

  if (error) {
    redirectWithMessage(bookingId, "renterError");
  }

  await logAdminAuditEvent({
    accessToken,
    actorProfileId: user.id,
    actorEmail: profile.email,
    action: "booking.renter_assign",
    targetTable: "bookings",
    targetId: bookingId,
    metadata: { renterId }
  });

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath("/renter/bookings");
  redirectWithMessage(bookingId, "renterAssigned");
}
