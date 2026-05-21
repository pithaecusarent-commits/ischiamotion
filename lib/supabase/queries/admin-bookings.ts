import type { PublicBookingListItem } from "@/lib/supabase/queries/bookings";
import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";

export async function getAdminBookingRequests(accessToken: string): Promise<{ bookings: PublicBookingListItem[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data, error } = await supabase
      .from("bookings")
      .select("booking_code, customer_first_name, customer_last_name, customer_email, customer_phone, start_date, end_date, pickup_time, status, notes, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return { bookings: [], error: error.message };
    }

    return { bookings: (data || []) as PublicBookingListItem[], error: null };
  } catch (error) {
    return { bookings: [], error: error instanceof Error ? error.message : "Unable to load bookings." };
  }
}
