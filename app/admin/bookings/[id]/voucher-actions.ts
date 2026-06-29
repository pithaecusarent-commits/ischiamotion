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

function userFriendlyVoucherError(error: string | null | undefined) {
  const message = (error || "").trim();
  const lower = message.toLowerCase();

  if (!message) return "Errore temporaneo durante l'operazione voucher.";
  if (lower.includes("resend_api_key") || lower.includes("api key")) {
    return "Resend non configurato: verifica RESEND_API_KEY nelle variabili ambiente.";
  }
  if (lower.includes("email") && (lower.includes("missing") || lower.includes("invalid") || lower.includes("not found"))) {
    return "Email cliente mancante o non valida: aggiorna i dati cliente prima di inviare il voucher.";
  }
  if (lower.includes("deposit")) {
    return "Acconto richiesto: registra l'acconto ricevuto prima di inviare il voucher.";
  }
  if (lower.includes("policy") || lower.includes("permission") || lower.includes("rls") || lower.includes("not authorized")) {
    return "Operazione non permessa da Supabase/RLS: verifica ruolo admin e policy applicate.";
  }
  if (lower.includes("booking must be confirmed")) {
    return "Voucher richiesto: conferma prima la disponibilità della prenotazione.";
  }

  return message;
}

export async function generateVoucherAction(formData: FormData) {
  const bookingId = String(formData.get("bookingId") || "");

  if (!bookingId) {
    redirectWithVoucherMessage(bookingId, "error");
  }

  const { accessToken, user, profile } = await requireAdmin(`/admin/bookings/${bookingId}`);
  const { booking, error: bookingError } = await getAdminBookingById(accessToken, bookingId);

  if (bookingError || !booking || !["confirmed", "voucher_sent"].includes(booking.status)) {
    redirectWithVoucherMessage(bookingId, "error", bookingError || "Voucher richiesto: conferma prima la disponibilità della prenotazione.");
  }

  if (!booking.customer_email?.trim()) {
    redirectWithVoucherMessage(bookingId, "error", "Email cliente mancante: aggiorna i dati cliente prima di inviare il voucher.");
  }

  if (booking.payment_type === "deposit_required" && !["deposit_paid", "paid"].includes(booking.payment_status)) {
    redirectWithVoucherMessage(bookingId, "error", "Acconto richiesto: registra l'acconto ricevuto prima di inviare il voucher.");
  }

  const { error: confirmationError } = await updateAdminBookingStatus(accessToken, bookingId, "confirmed");
  if (confirmationError) {
    redirectWithVoucherMessage(bookingId, "error", userFriendlyVoucherError(confirmationError));
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
    redirectWithVoucherMessage(bookingId, "error", userFriendlyVoucherError(voucherEmail.error));
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
    redirectWithVoucherMessage(bookingId, "error", bookingError || "Operazione non permessa: conferma la prenotazione e verifica che richieda acconto.");
  }

  if (!booking.customer_email?.trim()) {
    redirectWithVoucherMessage(bookingId, "error", "Email cliente mancante: aggiorna i dati cliente prima di inviare il voucher.");
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
    redirectWithVoucherMessage(bookingId, "error", userFriendlyVoucherError(paymentUpdate.error));
  }

  const { error: confirmationError } = await updateAdminBookingStatus(accessToken, bookingId, "confirmed");
  if (confirmationError) {
    redirectWithVoucherMessage(bookingId, "error", userFriendlyVoucherError(confirmationError));
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
    redirectWithVoucherMessage(bookingId, "error", userFriendlyVoucherError(voucherEmail.error));
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
