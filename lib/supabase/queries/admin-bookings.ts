import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";
import type { BookingDeliveryMethod, BookingPaymentMethod, BookingPaymentStatus, BookingPaymentType, Locale } from "@/lib/types";

export type AdminBookingItem = {
  id: string;
  booking_code: string;
  renter_id: string | null;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_language: Locale;
  vehicle_id: string | null;
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
  vehicles: {
    title_it: string;
    title_en: string;
    vehicle_categories: {
      slug: string;
      name_it: string;
      name_en: string;
    } | null;
  } | null;
};

export type AdminRenterOption = {
  id: string;
  business_name_internal: string;
  status: string;
};

export type AdminBookingFilters = {
  status?: string;
  renterId?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  q?: string;
};

export type AdminBookingCategoryOption = {
  slug: string;
  name_it: string;
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
  vehicles:
    | {
      title_it: string;
      title_en: string;
      vehicle_categories:
        | {
          slug: string;
          name_it: string;
          name_en: string;
        }
        | {
          slug: string;
          name_it: string;
          name_en: string;
        }[]
        | null;
    }
    | {
      title_it: string;
      title_en: string;
      vehicle_categories:
        | {
          slug: string;
          name_it: string;
          name_en: string;
        }
        | {
          slug: string;
          name_it: string;
          name_en: string;
        }[]
        | null;
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

const bookingSelect = "id, booking_code, renter_id, customer_first_name, customer_last_name, customer_email, customer_phone, customer_language, vehicle_id, start_date, end_date, pickup_time, status, delivery_method, delivery_location, delivery_notes, payment_type, payment_method, payment_status, total_amount, deposit_amount, balance_due, payment_notes, notes, created_at, renters(business_name_internal, status), vehicles(title_it, title_en, vehicle_categories(slug, name_it, name_en))";

function normalizeAdminBooking(row: AdminBookingRow): AdminBookingItem {
  const vehicle = Array.isArray(row.vehicles) ? row.vehicles[0] || null : row.vehicles;
  const category = vehicle?.vehicle_categories;

  return {
    ...row,
    renters: Array.isArray(row.renters) ? row.renters[0] || null : row.renters,
    vehicles: vehicle
      ? {
        ...vehicle,
        vehicle_categories: Array.isArray(category) ? category[0] || null : category || null
      }
      : null
  };
}

export async function getAdminBookingRequests(
  accessToken: string,
  filters: AdminBookingFilters = {}
): Promise<{ bookings: AdminBookingItem[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    let query = supabase
      .from("bookings")
      .select(bookingSelect)
      .order("created_at", { ascending: false });

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.renterId) {
      query = query.eq("renter_id", filters.renterId);
    }

    if (filters.dateFrom) {
      query = query.gte("start_date", filters.dateFrom);
    }

    if (filters.dateTo) {
      query = query.lte("start_date", filters.dateTo);
    }

    if (filters.q) {
      const term = filters.q.replace(/[%_,]/g, "").trim();
      if (term) {
        query = query.or(`booking_code.ilike.%${term}%,customer_first_name.ilike.%${term}%,customer_last_name.ilike.%${term}%,customer_email.ilike.%${term}%,customer_phone.ilike.%${term}%`);
      }
    }

    const { data, error } = await query;

    if (error) {
      return { bookings: [], error: error.message };
    }

    const bookings = ((data || []) as unknown as AdminBookingRow[])
      .map(normalizeAdminBooking)
      .filter((booking) => !filters.category || booking.vehicles?.vehicle_categories?.slug === filters.category);

    return { bookings, error: null };
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

export async function getAdminBookingCategories(accessToken: string): Promise<{ categories: AdminBookingCategoryOption[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data, error } = await supabase
      .from("vehicle_categories")
      .select("slug, name_it")
      .eq("is_active", true)
      .order("name_it", { ascending: true });

    if (error) return { categories: [], error: error.message };
    return { categories: (data || []) as AdminBookingCategoryOption[], error: null };
  } catch (error) {
    return { categories: [], error: error instanceof Error ? error.message : "Unable to load categories." };
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
