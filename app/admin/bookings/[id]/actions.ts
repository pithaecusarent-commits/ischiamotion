"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { logAdminAuditEvent } from "@/lib/supabase/queries/admin-audit-log";
import {
  adminBookingStatuses,
  assignAdminBookingRenter,
  getAdminBookingById,
  updateAdminBookingStatus,
  type AdminBookingStatus
} from "@/lib/supabase/queries/admin-bookings";

function redirectWithMessage(
  id: string,
  type: "success" | "error" | "operationNotAllowed" | "renterAssigned" | "renterError",
  reason?: string
) {
  const param = type === "renterAssigned" || type === "renterError" ? "renterAssign" : "statusUpdate";
  const value = type === "renterAssigned" ? "success" : type === "renterError" ? "error" : type;
  const params = new URLSearchParams({ [param]: value });
  if (reason) params.set("statusError", reason.slice(0, 400));
  redirect(`/admin/bookings/${id}?${params.toString()}`);
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
    redirectWithMessage(bookingId, "error", bookingError || "Prenotazione non trovata o operazione non permessa.");
  }

  if (nextStatus === "checked_in" || nextStatus === "voucher_sent") {
    redirectWithMessage(
      bookingId,
      "operationNotAllowed",
      nextStatus === "checked_in"
        ? "Usa il bottone dedicato \"Segna check-in effettuato\", così viene creato anche il log check-in."
        : "Usa l'azione dedicata \"Invia voucher QR\", così voucher, email e stato restano sincronizzati."
    );
  }

  const { error } = await updateAdminBookingStatus(accessToken, bookingId, nextStatus as AdminBookingStatus);

  if (error) {
    redirectWithMessage(bookingId, "error", error);
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
    redirect(`/admin/bookings/${bookingId}?renterAssign=error&renterError=${encodeURIComponent(error)}`);
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
