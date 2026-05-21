import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";

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
  notes: string | null;
  created_at: string;
};

const bookingSelect = "id, booking_code, customer_first_name, customer_last_name, customer_email, customer_phone, start_date, end_date, pickup_time, status, notes, created_at";

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
