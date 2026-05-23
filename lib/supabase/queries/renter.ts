import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";
import type { BookingDeliveryMethod, BookingPaymentMethod, BookingPaymentStatus, BookingPaymentType } from "@/lib/types";

export type RenterBookingItem = {
  id: string;
  booking_code: string;
  customer_first_name: string;
  customer_last_name: string;
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
  vehicles: {
    title_it: string;
    internal_name: string | null;
  } | null;
  pickup_points: {
    public_label_it: string;
    zone: string;
  } | null;
};

type RenterBookingRow = Omit<RenterBookingItem, "pickup_points" | "vehicles"> & {
  vehicles:
    | {
      title_it: string;
      internal_name: string | null;
    }
    | {
      title_it: string;
      internal_name: string | null;
    }[]
    | null;
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

export type RenterDeliveryCapabilityItem = {
  id: string | null;
  renter_id: string;
  delivery_method: BookingDeliveryMethod;
  is_enabled: boolean;
  zones: string[];
  notes: string | null;
  updated_at: string | null;
};

export type RenterVehicleItem = {
  id: string;
  renter_id: string;
  title_it: string;
  internal_name: string | null;
  price_from: number | null;
  is_active: boolean;
};

export type RenterAvailabilityRuleItem = {
  id: string;
  vehicle_id: string;
  renter_id: string;
  date_from: string;
  date_to: string;
  is_closed: boolean;
  min_rental_days: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  vehicles: {
    title_it: string;
    internal_name: string | null;
  } | null;
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
  delivery_method,
  delivery_location,
  delivery_notes,
  payment_type,
  payment_method,
  payment_status,
  total_amount,
  deposit_amount,
  balance_due,
  payment_notes,
  notes,
  vehicles (
    title_it,
    internal_name
  ),
  pickup_points (
    public_label_it,
    zone
  )
`;

const fallbackCategoryOrder = ["scooter", "auto", "bici-elettriche", "barche-gommoni", "quad"];
const deliveryMethodOrder: BookingDeliveryMethod[] = ["pickup_point", "port_delivery", "hotel_delivery"];

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
      vehicles: Array.isArray(booking.vehicles)
        ? booking.vehicles[0] || null
        : booking.vehicles,
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

export async function getRenterDeliveryCapabilities(accessToken: string): Promise<{ capabilities: RenterDeliveryCapabilityItem[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const renterResult = await getRenterIds(accessToken);

    if (renterResult.error) {
      return { capabilities: [], error: renterResult.error };
    }

    const renterId = renterResult.renterIds[0];
    if (!renterId) {
      return { capabilities: [], error: null };
    }

    const { data, error } = await supabase
      .from("renter_delivery_capabilities")
      .select("id, renter_id, delivery_method, is_enabled, zones, notes, updated_at")
      .eq("renter_id", renterId);

    if (error) {
      return { capabilities: [], error: error.message };
    }

    const rowsByMethod = new Map((data || []).map((row) => [row.delivery_method as BookingDeliveryMethod, row]));

    return {
      capabilities: deliveryMethodOrder.map((method) => {
        const row = rowsByMethod.get(method);
        return {
          id: (row?.id as string | undefined) || null,
          renter_id: renterId,
          delivery_method: method,
          is_enabled: row?.is_enabled !== false,
          zones: (row?.zones as string[] | null | undefined) || [],
          notes: (row?.notes as string | null | undefined) || null,
          updated_at: (row?.updated_at as string | null | undefined) || null
        };
      }),
      error: null
    };
  } catch (error) {
    return { capabilities: [], error: error instanceof Error ? error.message : "Unable to load delivery capabilities." };
  }
}

export async function getRenterVehicles(accessToken: string): Promise<{ vehicles: RenterVehicleItem[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const renterResult = await getRenterIds(accessToken);

    if (renterResult.error) {
      return { vehicles: [], error: renterResult.error };
    }

    if (renterResult.renterIds.length === 0) {
      return { vehicles: [], error: null };
    }

    const { data, error } = await supabase
      .from("vehicles")
      .select("id, renter_id, title_it, internal_name, price_from, is_active")
      .in("renter_id", renterResult.renterIds)
      .order("title_it", { ascending: true });

    if (error) {
      return { vehicles: [], error: error.message };
    }

    return { vehicles: (data || []) as unknown as RenterVehicleItem[], error: null };
  } catch (error) {
    return { vehicles: [], error: error instanceof Error ? error.message : "Unable to load renter vehicles." };
  }
}

export async function getRenterAvailabilityRules(accessToken: string): Promise<{ rules: RenterAvailabilityRuleItem[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data, error } = await supabase
      .from("vehicle_availability_rules")
      .select(`
        id,
        vehicle_id,
        renter_id,
        date_from,
        date_to,
        is_closed,
        min_rental_days,
        notes,
        created_at,
        updated_at,
        vehicles (
          title_it,
          internal_name
        )
      `)
      .order("date_from", { ascending: true });

    if (error) {
      return { rules: [], error: error.message };
    }

    const rules = ((data || []) as unknown as Array<Omit<RenterAvailabilityRuleItem, "vehicles"> & {
      vehicles: RenterAvailabilityRuleItem["vehicles"] | RenterAvailabilityRuleItem["vehicles"][];
    }>).map((rule) => ({
      ...rule,
      vehicles: Array.isArray(rule.vehicles) ? rule.vehicles[0] || null : rule.vehicles
    }));

    return { rules, error: null };
  } catch (error) {
    return { rules: [], error: error instanceof Error ? error.message : "Unable to load availability rules." };
  }
}

export async function createRenterAvailabilityRule(input: {
  accessToken: string;
  vehicleId: string;
  renterId: string;
  dateFrom: string;
  dateTo: string;
  isClosed: boolean;
  minRentalDays: number;
  notes: string;
}): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(input.accessToken);

    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .select("id, renter_id")
      .eq("id", input.vehicleId)
      .eq("renter_id", input.renterId)
      .maybeSingle<{ id: string; renter_id: string }>();

    if (vehicleError) {
      return { error: vehicleError.message };
    }

    if (!vehicle) {
      return { error: "Veicolo non assegnato al tuo noleggio." };
    }

    const { error } = await supabase
      .from("vehicle_availability_rules")
      .insert({
        vehicle_id: input.vehicleId,
        renter_id: vehicle.renter_id,
        date_from: input.dateFrom,
        date_to: input.dateTo,
        is_closed: input.isClosed,
        min_rental_days: input.minRentalDays,
        notes: input.notes.trim() || null
      });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to create availability rule." };
  }
}

export async function updateRenterAvailabilityRule(input: {
  accessToken: string;
  ruleId: string;
  vehicleId: string;
  renterId: string;
  dateFrom: string;
  dateTo: string;
  isClosed: boolean;
  minRentalDays: number;
  notes: string;
}): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(input.accessToken);

    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .select("id, renter_id")
      .eq("id", input.vehicleId)
      .eq("renter_id", input.renterId)
      .maybeSingle<{ id: string; renter_id: string }>();

    if (vehicleError) {
      return { error: vehicleError.message };
    }

    if (!vehicle) {
      return { error: "Veicolo non assegnato al tuo noleggio." };
    }

    const { error } = await supabase
      .from("vehicle_availability_rules")
      .update({
        vehicle_id: input.vehicleId,
        renter_id: vehicle.renter_id,
        date_from: input.dateFrom,
        date_to: input.dateTo,
        is_closed: input.isClosed,
        min_rental_days: input.minRentalDays,
        notes: input.notes.trim() || null
      })
      .eq("id", input.ruleId);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update availability rule." };
  }
}

export async function deleteRenterAvailabilityRule(input: {
  accessToken: string;
  ruleId: string;
}): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(input.accessToken);
    const { error } = await supabase
      .from("vehicle_availability_rules")
      .delete()
      .eq("id", input.ruleId);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to delete availability rule." };
  }
}

export async function updateRenterDeliveryCapability(input: {
  accessToken: string;
  renterId: string;
  deliveryMethod: BookingDeliveryMethod;
  isEnabled: boolean;
  zones: string[];
  notes: string;
}): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(input.accessToken);
    const payload = {
      is_enabled: input.isEnabled,
      zones: input.zones.length > 0 ? input.zones : null,
      notes: input.notes.trim() || null,
      updated_at: new Date().toISOString()
    };

    const { data: existing, error: existingError } = await supabase
      .from("renter_delivery_capabilities")
      .select("id")
      .eq("renter_id", input.renterId)
      .eq("delivery_method", input.deliveryMethod)
      .maybeSingle<{ id: string }>();

    if (existingError) {
      return { error: existingError.message };
    }

    const { error } = existing?.id
      ? await supabase
        .from("renter_delivery_capabilities")
        .update(payload)
        .eq("id", existing.id)
      : await supabase
        .from("renter_delivery_capabilities")
        .insert({
          ...payload,
          renter_id: input.renterId,
          delivery_method: input.deliveryMethod
        });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update delivery capability." };
  }
}

// ─── Price Rules ──────────────────────────────────────────────────────────────

export type RenterPriceRuleItem = {
  id: string;
  vehicle_id: string;
  renter_id: string;
  name: string | null;
  date_from: string;
  date_to: string;
  price_per_day: number;
  min_rental_days: number;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  vehicles: {
    title_it: string;
    internal_name: string | null;
  } | null;
};

export async function getRenterPriceRules(accessToken: string): Promise<{ rules: RenterPriceRuleItem[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data, error } = await supabase
      .from("vehicle_price_rules")
      .select(`
        id,
        vehicle_id,
        renter_id,
        name,
        date_from,
        date_to,
        price_per_day,
        min_rental_days,
        is_active,
        notes,
        created_at,
        updated_at,
        vehicles (
          title_it,
          internal_name
        )
      `)
      .order("date_from", { ascending: true });

    if (error) {
      return { rules: [], error: error.message };
    }

    const rules = ((data || []) as unknown as Array<Omit<RenterPriceRuleItem, "vehicles"> & {
      vehicles: RenterPriceRuleItem["vehicles"] | RenterPriceRuleItem["vehicles"][];
    }>).map((rule) => ({
      ...rule,
      vehicles: Array.isArray(rule.vehicles) ? rule.vehicles[0] || null : rule.vehicles
    }));

    return { rules, error: null };
  } catch (error) {
    return { rules: [], error: error instanceof Error ? error.message : "Unable to load price rules." };
  }
}

export async function createRenterPriceRule(input: {
  accessToken: string;
  vehicleId: string;
  renterId: string;
  name: string;
  dateFrom: string;
  dateTo: string;
  pricePerDay: number;
  minRentalDays: number;
  isActive: boolean;
  notes: string;
}): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(input.accessToken);

    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .select("id, renter_id")
      .eq("id", input.vehicleId)
      .eq("renter_id", input.renterId)
      .maybeSingle<{ id: string; renter_id: string }>();

    if (vehicleError) return { error: vehicleError.message };
    if (!vehicle) return { error: "Veicolo non assegnato al tuo noleggio." };

    const { error } = await supabase.from("vehicle_price_rules").insert({
      vehicle_id:     input.vehicleId,
      renter_id:      vehicle.renter_id,
      name:           input.name.trim() || null,
      date_from:      input.dateFrom,
      date_to:        input.dateTo,
      price_per_day:  input.pricePerDay,
      min_rental_days: input.minRentalDays,
      is_active:      input.isActive,
      notes:          input.notes.trim() || null
    });

    if (error) return { error: error.message };
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to create price rule." };
  }
}

export async function updateRenterPriceRule(input: {
  accessToken: string;
  ruleId: string;
  vehicleId: string;
  renterId: string;
  name: string;
  dateFrom: string;
  dateTo: string;
  pricePerDay: number;
  minRentalDays: number;
  isActive: boolean;
  notes: string;
}): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(input.accessToken);

    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .select("id, renter_id")
      .eq("id", input.vehicleId)
      .eq("renter_id", input.renterId)
      .maybeSingle<{ id: string; renter_id: string }>();

    if (vehicleError) return { error: vehicleError.message };
    if (!vehicle) return { error: "Veicolo non assegnato al tuo noleggio." };

    const { error } = await supabase
      .from("vehicle_price_rules")
      .update({
        vehicle_id:      input.vehicleId,
        renter_id:       vehicle.renter_id,
        name:            input.name.trim() || null,
        date_from:       input.dateFrom,
        date_to:         input.dateTo,
        price_per_day:   input.pricePerDay,
        min_rental_days: input.minRentalDays,
        is_active:       input.isActive,
        notes:           input.notes.trim() || null
      })
      .eq("id", input.ruleId);

    if (error) return { error: error.message };
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update price rule." };
  }
}

export async function deleteRenterPriceRule(input: {
  accessToken: string;
  ruleId: string;
}): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(input.accessToken);
    const { error } = await supabase
      .from("vehicle_price_rules")
      .delete()
      .eq("id", input.ruleId);

    if (error) return { error: error.message };
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to delete price rule." };
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
