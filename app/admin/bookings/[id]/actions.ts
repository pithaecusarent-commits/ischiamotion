"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { sendBookingVoucherEmail, type VoucherEmailResult } from "@/lib/email/booking-voucher-email";
import { logAdminAuditEvent } from "@/lib/supabase/queries/admin-audit-log";
import {
  adminBookingStatuses,
  assignAdminBookingRenter,
  updateAdminBookingStatus,
  type AdminBookingStatus
} from "@/lib/supabase/queries/admin-bookings";
import { getAdminVoucherByBookingId } from "@/lib/supabase/queries/vouchers";

type StatusMessage =
  | "success"
  | "error"
  | "voucherRequired"
  | "confirmedVoucherSent"
  | "confirmedVoucherMissingEmail"
  | "confirmedVoucherProviderError"
  | "confirmedVoucherFailed"
  | "confirmedVoucherStatusError"
  | "renterAssigned"
  | "renterError";

function redirectWithMessage(id: string, type: StatusMessage) {
  const param = type === "renterAssigned" || type === "renterError" ? "renterAssign" : "statusUpdate";
  const value = type === "renterAssigned" ? "success" : type === "renterError" ? "error" : type;
  redirect(`/admin/bookings/${id}?${param}=${value}`);
}

function confirmationMessage(result: VoucherEmailResult): StatusMessage {
  if (result.ok) return "confirmedVoucherSent";
  if (result.reason === "missing_customer_email") return "confirmedVoucherMissingEmail";
  if (result.reason === "provider_not_configured") return "confirmedVoucherProviderError";
  return "confirmedVoucherFailed";
}

export async function updateBookingStatusAction(formData: FormData) {
  const bookingId = String(formData.get("bookingId") || "");
  const nextStatus = String(formData.get("status") || "");

  if (!bookingId || !adminBookingStatuses.includes(nextStatus as AdminBookingStatus)) {
    redirectWithMessage(bookingId, "error");
  }

  const { accessToken, user, profile } = await requireAdmin(`/admin/bookings/${bookingId}`);

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

  if (nextStatus === "confirmed") {
    await logAdminAuditEvent({
      accessToken,
      actorProfileId: user.id,
      actorEmail: profile.email,
      action: "booking_confirmed",
      targetTable: "bookings",
      targetId: bookingId
    });

    console.info("[booking-confirmation] booking confirmed", { bookingId });
    const voucherEmailResult = await sendBookingVoucherEmail(bookingId, {
      accessToken,
      actorProfileId: user.id,
      actorEmail: profile.email
    });

    if (voucherEmailResult.ok) {
      const { error: voucherStatusError } = await updateAdminBookingStatus(accessToken, bookingId, "voucher_sent");
      if (voucherStatusError) {
        redirectWithMessage(bookingId, "confirmedVoucherStatusError");
      }
    }

    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${bookingId}`);
    redirectWithMessage(bookingId, confirmationMessage(voucherEmailResult));
  }

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
