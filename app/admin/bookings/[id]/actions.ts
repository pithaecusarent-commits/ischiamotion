"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { adminBookingStatuses, updateAdminBookingStatus, type AdminBookingStatus } from "@/lib/supabase/queries/admin-bookings";

function redirectWithMessage(id: string, type: "success" | "error") {
  redirect(`/admin/bookings/${id}?statusUpdate=${type}`);
}

export async function updateBookingStatusAction(formData: FormData) {
  const bookingId = String(formData.get("bookingId") || "");
  const nextStatus = String(formData.get("status") || "");

  if (!bookingId || !adminBookingStatuses.includes(nextStatus as AdminBookingStatus)) {
    redirectWithMessage(bookingId, "error");
  }

  const { accessToken } = await requireAdmin(`/admin/bookings/${bookingId}`);
  const { error } = await updateAdminBookingStatus(accessToken, bookingId, nextStatus as AdminBookingStatus);

  if (error) {
    redirectWithMessage(bookingId, "error");
  }

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  redirectWithMessage(bookingId, "success");
}
