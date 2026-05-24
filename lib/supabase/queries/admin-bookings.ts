import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";
import type { BookingDeliveryMethod, BookingPaymentMethod, BookingPaymentStatus, BookingPaymentType } from "@/lib/types";

export type AdminBookingItem = {
  id: string;
  booking_code: string;
  renter_id: string | null;
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
  renters: {
    business_name_internal: string;
    status: string;
  } | null;
};

export type AdminRenterOption = {
  id: string;
  business_name_internal: string;
  status: string;
};

type AdminBookingRow = Omit<AdminBookingItem, "renters"> & {
  renters:
    | {
      business_name_internal: string;
      status: string;
    }
    | {
      business_name_internal: string;
      status: string;
    }[]
    | null;
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

const bookingSelect = "id, booking_code, renter_id, customer_first_name, customer_last_name, customer_email, customer_phone, start_date, end_date, pickup_time, status, delivery_method, delivery_location, delivery_notes, payment_type, payment_method, payment_status, total_amount, deposit_amount, balance_due, payment_notes, notes, created_at, renters(business_name_internal, status)";

function normalizeAdminBooking(row: AdminBookingRow): AdminBookingItem {
  return {
    ...row,
    renters: Array.isArray(row.renters) ? row.renters[0] || null : row.renters
  };
}

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

    return { bookings: ((data || []) as unknown as AdminBookingRow[]).map(normalizeAdminBooking), error: null };
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

export async function updateAdminBookingPayment(
  accessToken: string,
  id: string,
  data: {
    payment_type: BookingPaymentType;
    payment_method: BookingPaymentMethod;
    payment_status: BookingPaymentStatus;
    total_amount: number | null;
    deposit_amount: number | null;
    balance_due: number | null;
    payment_notes: string | null;
  }
): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { error } = await supabase
      .from("bookings")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return { error: error.message };
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update booking payment." };
  }
}

export async function getActiveAdminRenters(accessToken: string): Promise<{ renters: AdminRenterOption[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data, error } = await supabase
      .from("renters")
      .select("id, business_name_internal, status")
      .eq("status", "active")
      .order("business_name_internal", { ascending: true });

    if (error) return { renters: [], error: error.message };
    return { renters: (data || []) as AdminRenterOption[], error: null };
  } catch (error) {
    return { renters: [], error: error instanceof Error ? error.message : "Unable to load renters." };
  }
}

export async function assignAdminBookingRenter(
  accessToken: string,
  bookingId: string,
  renterId: string
): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data: renter, error: renterError } = await supabase
      .from("renters")
      .select("id, status")
      .eq("id", renterId)
      .eq("status", "active")
      .maybeSingle<{ id: string; status: string }>();

    if (renterError) return { error: renterError.message };
    if (!renter) return { error: "Noleggiatore non valido o non attivo." };

    const { error } = await supabase
      .from("bookings")
      .update({
        renter_id: renterId,
        updated_at: new Date().toISOString()
      })
      .eq("id", bookingId);

    if (error) return { error: error.message };
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to assign renter." };
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

    return { booking: data ? normalizeAdminBooking(data as unknown as AdminBookingRow) : null, error: null };
  } catch (error) {
    return { booking: null, error: error instanceof Error ? error.message : "Unable to load booking." };
  }
}
