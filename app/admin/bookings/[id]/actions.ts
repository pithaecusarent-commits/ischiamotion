"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendBookingDepositInstructionsEmail } from "@/lib/email/booking-deposit-email";
import { sendBookingVoucherEmail } from "@/lib/email/booking-voucher-email";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { logAdminAuditEvent } from "@/lib/supabase/queries/admin-audit-log";
import {
  adminBookingStatuses,
  assignAdminBookingRenter,
  getAdminBookingById,
  updateAdminBookingPayment,
  updateAdminBookingStatus,
  type AdminBookingStatus
} from "@/lib/supabase/queries/admin-bookings";
import { getAdminVoucherByBookingId } from "@/lib/supabase/queries/vouchers";

function redirectWithMessage(
  id: string,
  type: "success" | "error" | "voucherRequired" | "voucherEmailError" | "voucherSent" | "depositInstructionsSent" | "renterAssigned" | "renterError"
) {
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
  const { booking, error: bookingError } = await getAdminBookingById(accessToken, bookingId);

  if (bookingError || !booking) {
    redirectWithMessage(bookingId, "error");
  }
  const currentBooking = booking!;

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

    const depositRequired = currentBooking.payment_type === "deposit_required";
    const depositReceived = currentBooking.payment_status === "deposit_paid" || currentBooking.payment_status === "paid";

    if (depositRequired && !depositReceived) {
      const nextPaymentStatus = currentBooking.payment_status === "unpaid" ? "deposit_pending" : currentBooking.payment_status;

      if (nextPaymentStatus !== currentBooking.payment_status) {
        const paymentUpdate = await updateAdminBookingPayment(accessToken, bookingId, {
          payment_type: currentBooking.payment_type,
          payment_method: currentBooking.payment_method,
          payment_status: nextPaymentStatus,
          total_amount: currentBooking.total_amount,
          deposit_amount: currentBooking.deposit_amount,
          balance_due: currentBooking.balance_due,
          payment_notes: currentBooking.payment_notes
        });

        if (paymentUpdate.error) {
          redirectWithMessage(bookingId, "error");
        }
      }

      const depositEmail = await sendBookingDepositInstructionsEmail({
        bookingCode: currentBooking.booking_code,
        customerFirstName: currentBooking.customer_first_name,
        customerLastName: currentBooking.customer_last_name,
        customerEmail: currentBooking.customer_email,
        customerLanguage: currentBooking.customer_language,
        startDate: currentBooking.start_date,
        endDate: currentBooking.end_date,
        pickupTime: currentBooking.pickup_time,
        deliveryMethod: currentBooking.delivery_method,
        deliveryLocation: currentBooking.delivery_location,
        paymentMethod: currentBooking.payment_method,
        paymentNotes: currentBooking.payment_notes,
        totalAmount: currentBooking.total_amount,
        depositAmount: currentBooking.deposit_amount,
        balanceDue: currentBooking.balance_due,
        notes: currentBooking.notes
      });

      if (!depositEmail.ok) {
        await logAdminAuditEvent({
          accessToken,
          actorProfileId: user.id,
          actorEmail: profile.email,
          action: "booking.deposit_email_failed",
          targetTable: "bookings",
          targetId: bookingId,
          metadata: { error: depositEmail.error }
        });
        revalidatePath("/admin/bookings");
        revalidatePath(`/admin/bookings/${bookingId}`);
        redirectWithMessage(bookingId, "error");
      }

      await logAdminAuditEvent({
        accessToken,
        actorProfileId: user.id,
        actorEmail: profile.email,
        action: "booking.deposit_instructions_sent",
          targetTable: "bookings",
          targetId: bookingId,
          metadata: {
            paymentStatus: nextPaymentStatus,
            paymentType: currentBooking.payment_type
          }
        });
      revalidatePath("/admin/bookings");
      revalidatePath(`/admin/bookings/${bookingId}`);
      redirectWithMessage(bookingId, "depositInstructionsSent");
    }

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
      metadata: { status: "voucher_sent", voucherCode: voucherEmail.voucherCode, warning: voucherEmail.warning || null }
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
