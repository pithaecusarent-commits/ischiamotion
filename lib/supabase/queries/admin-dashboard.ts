import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";

type CountMetric = {
  value: number;
  available: boolean;
  error: string | null;
};

export type AdminDashboardBooking = {
  id: string;
  booking_code: string;
  customer_first_name: string;
  customer_last_name: string;
  status: string;
  created_at: string;
  notes: string | null;
  vehicles: {
    title_it: string;
    title_en: string;
    vehicle_categories: {
      name_it: string;
      name_en: string;
    } | null;
  } | null;
};

export type AdminDashboardPendingRenter = {
  id: string;
  email: string | null;
  business_name: string | null;
  contact_name: string | null;
  created_at: string;
};

export type RenterProductivityStat = {
  renterId: string;
  businessName: string;
  contactName: string | null;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  vehicleCount: number;
};

export type AdminDashboardData = {
  metrics: {
    pendingBookings: CountMetric;
    pendingRenters: CountMetric;
    activeVehicles: CountMetric;
    activeRenters: CountMetric;
    confirmedBookings: CountMetric;
    generatedVouchers: CountMetric;
    completedCheckins: CountMetric;
  };
  recentBookings: AdminDashboardBooking[];
  recentBookingsError: string | null;
  pendingRenterApplications: AdminDashboardPendingRenter[];
  pendingRenterApplicationsError: string | null;
  renterProductivity: RenterProductivityStat[];
  renterProductivityError: string | null;
};

type AdminDashboardBookingRow = Omit<AdminDashboardBooking, "vehicles"> & {
  vehicles:
    | {
      title_it: string;
      title_en: string;
      vehicle_categories:
        | {
          name_it: string;
          name_en: string;
        }
        | {
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
          name_it: string;
          name_en: string;
        }
        | {
          name_it: string;
          name_en: string;
        }[]
        | null;
    }[]
    | null;
};

const unavailableMetric: CountMetric = {
  value: 0,
  available: false,
  error: null
};

async function countRows(
  accessToken: string,
  table: string,
  filters: Array<{ column: string; value: string | boolean }> = []
): Promise<CountMetric> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    let query = supabase.from(table).select("id", { count: "exact", head: true });

    filters.forEach((filter) => {
      query = query.eq(filter.column, filter.value);
    });

    const { count, error } = await query;

    if (error) {
      return { ...unavailableMetric, error: error.message };
    }

    return { value: count || 0, available: true, error: null };
  } catch (error) {
    return {
      ...unavailableMetric,
      error: error instanceof Error ? error.message : "Unable to load metric."
    };
  }
}

function normalizeBooking(row: AdminDashboardBookingRow): AdminDashboardBooking {
  const vehicle = Array.isArray(row.vehicles) ? row.vehicles[0] || null : row.vehicles;
  const category = vehicle?.vehicle_categories;

  return {
    ...row,
    vehicles: vehicle
      ? {
        ...vehicle,
        vehicle_categories: Array.isArray(category) ? category[0] || null : category || null
      }
      : null
  };
}

async function getRecentBookings(accessToken: string) {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data, error } = await supabase
      .from("bookings")
      .select("id, booking_code, customer_first_name, customer_last_name, status, created_at, notes, vehicles(title_it, title_en, vehicle_categories(name_it, name_en))")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      return { bookings: [], error: error.message };
    }

    return {
      bookings: ((data || []) as unknown as AdminDashboardBookingRow[]).map(normalizeBooking),
      error: null
    };
  } catch (error) {
    return {
      bookings: [],
      error: error instanceof Error ? error.message : "Unable to load recent bookings."
    };
  }
}

async function getRenterProductivityStats(accessToken: string): Promise<{
  stats: RenterProductivityStat[];
  error: string | null;
}> {
  try {
    const supabase = createSupabaseUserClient(accessToken);

    const [rentersResult, bookingsResult, vehiclesResult] = await Promise.all([
      supabase.from("renters").select("id, business_name_internal, contact_name").eq("status", "active"),
      supabase.from("bookings").select("renter_id, status").not("renter_id", "is", null),
      supabase.from("vehicles").select("renter_id, is_active").not("renter_id", "is", null)
    ]);

    if (rentersResult.error) {
      return { stats: [], error: rentersResult.error.message };
    }

    const renters = rentersResult.data || [];
    const bookings = bookingsResult.data || [];
    const vehicles = vehiclesResult.data || [];

    const bookingsByRenter: Record<string, { total: number; confirmed: number; pending: number }> = {};
    for (const b of bookings) {
      if (!b.renter_id) continue;
      if (!bookingsByRenter[b.renter_id]) {
        bookingsByRenter[b.renter_id] = { total: 0, confirmed: 0, pending: 0 };
      }
      bookingsByRenter[b.renter_id].total++;
      if (["confirmed", "voucher_sent", "checked_in", "completed"].includes(b.status)) {
        bookingsByRenter[b.renter_id].confirmed++;
      }
      if (b.status === "pending") {
        bookingsByRenter[b.renter_id].pending++;
      }
    }

    const vehiclesByRenter: Record<string, number> = {};
    for (const v of vehicles) {
      if (!v.renter_id || !v.is_active) continue;
      vehiclesByRenter[v.renter_id] = (vehiclesByRenter[v.renter_id] || 0) + 1;
    }

    const stats: RenterProductivityStat[] = renters
      .map((r) => ({
        renterId: r.id,
        businessName: r.business_name_internal || "Noleggiatore",
        contactName: r.contact_name || null,
        totalBookings: bookingsByRenter[r.id]?.total || 0,
        confirmedBookings: bookingsByRenter[r.id]?.confirmed || 0,
        pendingBookings: bookingsByRenter[r.id]?.pending || 0,
        vehicleCount: vehiclesByRenter[r.id] || 0,
      }))
      .sort((a, b) => b.confirmedBookings - a.confirmedBookings || b.totalBookings - a.totalBookings)
      .slice(0, 5);

    return { stats, error: null };
  } catch (error) {
    return {
      stats: [],
      error: error instanceof Error ? error.message : "Unable to load renter productivity stats."
    };
  }
}

async function getPendingRenterApplications(accessToken: string) {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, business_name, contact_name, created_at")
      .eq("role", "renter")
      .eq("account_status", "pending")
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      return { applications: [], error: error.message };
    }

    return {
      applications: (data || []) as AdminDashboardPendingRenter[],
      error: null
    };
  } catch (error) {
    return {
      applications: [],
      error: error instanceof Error ? error.message : "Unable to load renter applications."
    };
  }
}

export async function getAdminDashboardData(accessToken: string): Promise<AdminDashboardData> {
  const [
    pendingBookings,
    pendingRenters,
    activeVehicles,
    activeRenters,
    confirmedBookings,
    generatedVouchers,
    completedCheckins,
    recentBookings,
    pendingRenterApplications,
    renterProductivity
  ] = await Promise.all([
    countRows(accessToken, "bookings", [{ column: "status", value: "pending" }]),
    countRows(accessToken, "profiles", [
      { column: "role", value: "renter" },
      { column: "account_status", value: "pending" }
    ]),
    countRows(accessToken, "vehicles", [{ column: "is_active", value: true }]),
    countRows(accessToken, "renters", [{ column: "status", value: "active" }]),
    countRows(accessToken, "bookings", [{ column: "status", value: "confirmed" }]),
    countRows(accessToken, "booking_vouchers"),
    countRows(accessToken, "checkins"),
    getRecentBookings(accessToken),
    getPendingRenterApplications(accessToken),
    getRenterProductivityStats(accessToken)
  ]);

  return {
    metrics: {
      pendingBookings,
      pendingRenters,
      activeVehicles,
      activeRenters,
      confirmedBookings,
      generatedVouchers,
      completedCheckins
    },
    recentBookings: recentBookings.bookings,
    recentBookingsError: recentBookings.error,
    pendingRenterApplications: pendingRenterApplications.applications,
    pendingRenterApplicationsError: pendingRenterApplications.error,
    renterProductivity: renterProductivity.stats,
    renterProductivityError: renterProductivity.error
  };
}
