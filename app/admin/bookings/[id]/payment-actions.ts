"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { updateAdminBookingPayment } from "@/lib/supabase/queries/admin-bookings";
import type { BookingPaymentMethod, BookingPaymentStatus, BookingPaymentType } from "@/lib/types";

function parseAmount(value: FormDataEntryValue | null): number | null {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const num = Number(raw);
  return Number.isFinite(num) && num >= 0 ? num : null;
}

export async function updateBookingPaymentAction(formData: FormData) {
  const bookingId = String(formData.get("bookingId") || "");

  if (!bookingId) {
    redirect("/admin/bookings?error=Prenotazione%20non%20valida");
  }

  const { accessToken } = await requireAdmin(`/admin/bookings/${bookingId}`);

  const totalAmount   = parseAmount(formData.get("total_amount"));
  const depositAmount = parseAmount(formData.get("deposit_amount"));

  let balanceDue = parseAmount(formData.get("balance_due"));
  if (totalAmount !== null && depositAmount !== null) {
    balanceDue = Math.max(totalAmount - depositAmount, 0);
  }

  const { error } = await updateAdminBookingPayment(accessToken, bookingId, {
    payment_type:   String(formData.get("payment_type")   || "pay_on_pickup") as BookingPaymentType,
    payment_method: String(formData.get("payment_method") || "unknown")        as BookingPaymentMethod,
    payment_status: String(formData.get("payment_status") || "unpaid")         as BookingPaymentStatus,
    total_amount:   totalAmount,
    deposit_amount: depositAmount,
    balance_due:    balanceDue,
    payment_notes:  String(formData.get("payment_notes") || "").trim() || null
  });

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);

  if (error) {
    redirect(`/admin/bookings/${bookingId}?payment=error`);
  }

  redirect(`/admin/bookings/${bookingId}?payment=success`);
}
