import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";
import type { BookingDeliveryMethod, BookingPaymentMethod, BookingPaymentStatus, BookingPaymentType } from "@/lib/types";

export type AdminBookingItem = {
  id: string;
  booking_code: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string | null;
  start_date: string;
  end_date: string;
  pickup_time: string | null;
  status: string;
  delivery_method: BookingDeliveryMethod;
  delivery_location: string | null;
  delivery_notes: string | null;
  payment_type: BookingPaymentType;
  payment_method: BookingPaymentMethod;
  payment_status: BookingPaymentStatus;
  total_amount: number | null;
  deposit_amount: number | null;
  balance_due: number | null;
  payment_notes: string | null;
  notes: string | null;
  created_at: string;
};

export const adminBookingStatuses = [
  "pending",
  "confirmed",
  "voucher_sent",
  "checked_in",
  "completed",
  "cancelled",
  "no_show"
] as const;

export type AdminBookingStatus = (typeof adminBookingStatuses)[number];

const bookingSelect = "id, booking_code, customer_first_name, customer_last_name, customer_email, customer_phone, start_date, end_date, pickup_time, status, delivery_method, delivery_location, delivery_notes, payment_type, payment_method, payment_status, total_amount, deposit_amount, balance_due, payment_notes, notes, created_at";

export async function getAdminBookingRequests(accessToken: string): Promise<{ bookings: AdminBookingItem[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data, error } = await supabase
      .from("bookings")
      .select(bookingSelect)
      .order("created_at", { ascending: false });

    if (error) {
      return { bookings: [], error: error.message };
    }

    return { bookings: (data || []) as AdminBookingItem[], error: null };
  } catch (error) {
    return { bookings: [], error: error instanceof Error ? error.message : "Unable to load bookings." };
  }
}

export async function updateAdminBookingStatus(
  accessToken: string,
  id: string,
  status: AdminBookingStatus
): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { error } = await supabase
      .from("bookings")
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update booking status." };
  }
}

export async function getAdminBookingById(accessToken: string, id: string): Promise<{ booking: AdminBookingItem | null; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data, error } = await supabase
      .from("bookings")
      .select(bookingSelect)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return { booking: null, error: error.message };
    }

    return { booking: (data || null) as AdminBookingItem | null, error: null };
  } catch (error) {
    return { booking: null, error: error instanceof Error ? error.message : "Unable to load booking." };
  }
}
