"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import {
  adminBookingStatuses,
  assignAdminBookingRenter,
  updateAdminBookingStatus,
  type AdminBookingStatus
} from "@/lib/supabase/queries/admin-bookings";
import { getAdminVoucherByBookingId } from "@/lib/supabase/queries/vouchers";

function redirectWithMessage(id: string, type: "success" | "error" | "voucherRequired" | "renterAssigned" | "renterError") {
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

  const { accessToken } = await requireAdmin(`/admin/bookings/${bookingId}`);

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

  const { accessToken } = await requireAdmin(`/admin/bookings/${bookingId}`);
  const { error } = await assignAdminBookingRenter(accessToken, bookingId, renterId);

  if (error) {
    redirectWithMessage(bookingId, "renterError");
  }

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath("/renter/bookings");
  redirectWithMessage(bookingId, "renterAssigned");
}
