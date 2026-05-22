import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";

export type RenterBookingItem = {
  id: string;
  booking_code: string;
  customer_first_name: string;
  customer_last_name: string;
  start_date: string;
  end_date: string;
  pickup_time: string | null;
  status: string;
  pickup_points: {
    public_label_it: string;
    zone: string;
  } | null;
};

type RenterBookingRow = Omit<RenterBookingItem, "pickup_points"> & {
  pickup_points:
    | {
      public_label_it: string;
      zone: string;
    }
    | {
      public_label_it: string;
      zone: string;
    }[]
    | null;
};

export type RenterCategoryAvailabilityItem = {
  id: string | null;
  renter_id: string;
  category_id: string;
  category_slug: string;
  category_name: string;
  is_open: boolean;
  reason: string | null;
  updated_at: string | null;
};

export type RenterCheckinResult = {
  outcome: "checked_in" | "already_checked_in" | "invalid" | "invalid_status" | "denied";
  message: string;
  booking_code: string | null;
  booking_status: string | null;
};

const bookingSelect = `
  id,
  booking_code,
  customer_first_name,
  customer_last_name,
  start_date,
  end_date,
  pickup_time,
  status,
  pickup_points (
    public_label_it,
    zone
  )
`;

const fallbackCategoryOrder = ["scooter", "auto", "bici-elettriche", "barche-gommoni", "quad"];

export async function getRenterIds(accessToken: string): Promise<{ renterIds: string[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data, error } = await supabase
      .from("renter_users")
      .select("renter_id")
      .order("created_at", { ascending: true });

    if (error) {
      return { renterIds: [], error: error.message };
    }

    return { renterIds: (data || []).map((row) => row.renter_id as string), error: null };
  } catch (error) {
    return { renterIds: [], error: error instanceof Error ? error.message : "Unable to load renter links." };
  }
}

export async function getRenterBookings(accessToken: string): Promise<{ bookings: RenterBookingItem[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data, error } = await supabase
      .from("bookings")
      .select(bookingSelect)
      .order("start_date", { ascending: true });

    if (error) {
      return { bookings: [], error: error.message };
    }

    const bookings = ((data || []) as unknown as RenterBookingRow[]).map((booking) => ({
      ...booking,
      pickup_points: Array.isArray(booking.pickup_points)
        ? booking.pickup_points[0] || null
        : booking.pickup_points
    }));

    return { bookings, error: null };
  } catch (error) {
    return { bookings: [], error: error instanceof Error ? error.message : "Unable to load bookings." };
  }
}

export async function getRenterAvailability(accessToken: string): Promise<{ availability: RenterCategoryAvailabilityItem[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const renterResult = await getRenterIds(accessToken);

    if (renterResult.error) {
      return { availability: [], error: renterResult.error };
    }

    const renterId = renterResult.renterIds[0];
    if (!renterId) {
      return { availability: [], error: null };
    }

    const [{ data: categories, error: categoriesError }, { data: rows, error: rowsError }] = await Promise.all([
      supabase
        .from("vehicle_categories")
        .select("id, slug, name_it")
        .in("slug", fallbackCategoryOrder),
      supabase
        .from("renter_category_availability")
        .select("id, renter_id, category_id, is_open, reason, updated_at")
        .eq("renter_id", renterId)
    ]);

    if (categoriesError || rowsError) {
      return { availability: [], error: categoriesError?.message || rowsError?.message || "Unable to load availability." };
    }

    const rowsByCategory = new Map((rows || []).map((row) => [row.category_id as string, row]));
    const sortedCategories = (categories || []).sort(
      (a, b) => fallbackCategoryOrder.indexOf(a.slug as string) - fallbackCategoryOrder.indexOf(b.slug as string)
    );

    return {
      availability: sortedCategories.map((category) => {
        const row = rowsByCategory.get(category.id as string);
        return {
          id: (row?.id as string | undefined) || null,
          renter_id: renterId,
          category_id: category.id as string,
          category_slug: category.slug as string,
          category_name: category.name_it as string,
          is_open: row?.is_open !== false,
          reason: (row?.reason as string | null | undefined) || null,
          updated_at: (row?.updated_at as string | null | undefined) || null
        };
      }),
      error: null
    };
  } catch (error) {
    return { availability: [], error: error instanceof Error ? error.message : "Unable to load availability." };
  }
}

export async function updateRenterAvailability(input: {
  accessToken: string;
  renterId: string;
  categoryId: string;
  isOpen: boolean;
  reason: string;
}): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(input.accessToken);

    const { data: existing, error: existingError } = await supabase
      .from("renter_category_availability")
      .select("id")
      .eq("renter_id", input.renterId)
      .eq("category_id", input.categoryId)
      .is("pickup_point_id", null)
      .maybeSingle<{ id: string }>();

    if (existingError) {
      return { error: existingError.message };
    }

    const payload = {
      is_open: input.isOpen,
      reason: input.reason.trim() || null,
      updated_at: new Date().toISOString()
    };

    const { error } = existing?.id
      ? await supabase
        .from("renter_category_availability")
        .update(payload)
        .eq("id", existing.id)
      : await supabase
        .from("renter_category_availability")
        .insert({
          ...payload,
          renter_id: input.renterId,
          category_id: input.categoryId,
          pickup_point_id: null
        });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update availability." };
  }
}

export async function createRenterCheckin(input: {
  accessToken: string;
  voucherCode: string;
}): Promise<{ result: RenterCheckinResult | null; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(input.accessToken);
    const { data, error } = await supabase
      .rpc("renter_checkin_voucher", { lookup_voucher_code: input.voucherCode })
      .maybeSingle();

    if (error) {
      return { result: null, error: error.message };
    }

    return { result: data as RenterCheckinResult | null, error: null };
  } catch (error) {
    return { result: null, error: error instanceof Error ? error.message : "Unable to register check-in." };
  }
}
