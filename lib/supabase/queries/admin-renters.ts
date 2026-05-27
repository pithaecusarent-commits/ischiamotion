import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";

export type AdminRenterApplication = {
  id: string;
  email: string | null;
  account_status: "pending" | "approved" | "rejected" | "disabled";
  business_name: string | null;
  contact_name: string | null;
  phone: string | null;
  created_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
};

export type AdminRenterVehicle = {
  id: string;
  title_it: string;
  is_active: boolean;
  slug: string | null;
  vehicle_categories: { name_it: string } | null;
};

export type AdminRenterDetail = {
  profile: AdminRenterApplication;
  renter: {
    id: string;
    business_name_internal: string | null;
    contact_name: string | null;
    email: string | null;
    phone: string | null;
    status: string;
  } | null;
  vehicles: AdminRenterVehicle[];
  bookingStats: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
};

export async function getRenterDetailByProfileId(
  accessToken: string,
  profileId: string
): Promise<{ detail: AdminRenterDetail | null; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, account_status, business_name, contact_name, phone, created_at, approved_at, rejected_at, rejection_reason")
      .eq("id", profileId)
      .single();

    if (profileError || !profile) {
      return { detail: null, error: profileError?.message || "Profile not found." };
    }

    const { data: renterLink } = await supabase
      .from("renter_users")
      .select("renter_id")
      .eq("profile_id", profileId)
      .maybeSingle();

    let renter: AdminRenterDetail["renter"] = null;
    let vehicles: AdminRenterVehicle[] = [];
    let bookingStats = { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };

    if (renterLink?.renter_id) {
      const renterId = renterLink.renter_id;

      const [renterResult, vehiclesResult, bookingsResult] = await Promise.all([
        supabase
          .from("renters")
          .select("id, business_name_internal, contact_name, email, phone, status")
          .eq("id", renterId)
          .single(),
        supabase
          .from("vehicles")
          .select("id, title_it, is_active, slug, vehicle_categories(name_it)")
          .eq("renter_id", renterId)
          .order("is_active", { ascending: false }),
        supabase
          .from("bookings")
          .select("status")
          .eq("renter_id", renterId)
      ]);

      renter = renterResult.data || null;

      const rawVehicles = (vehiclesResult.data || []) as Array<{
        id: string;
        title_it: string;
        is_active: boolean;
        slug: string | null;
        vehicle_categories: { name_it: string } | { name_it: string }[] | null;
      }>;
      vehicles = rawVehicles.map((v) => ({
        ...v,
        vehicle_categories: Array.isArray(v.vehicle_categories)
          ? v.vehicle_categories[0] || null
          : v.vehicle_categories
      }));

      for (const b of bookingsResult.data || []) {
        bookingStats.total++;
        if (b.status === "pending") bookingStats.pending++;
        else if (["confirmed", "voucher_sent", "checked_in"].includes(b.status)) bookingStats.confirmed++;
        else if (b.status === "completed") bookingStats.completed++;
        else if (b.status === "cancelled" || b.status === "no_show") bookingStats.cancelled++;
      }
    }

    return {
      detail: {
        profile: profile as AdminRenterApplication,
        renter,
        vehicles,
        bookingStats
      },
      error: null
    };
  } catch (error) {
    return {
      detail: null,
      error: error instanceof Error ? error.message : "Unable to load renter detail."
    };
  }
}

export async function getAdminRenterApplications(
  accessToken: string
): Promise<{ applications: AdminRenterApplication[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, account_status, business_name, contact_name, phone, created_at, approved_at, rejected_at, rejection_reason")
      .eq("role", "renter")
      .order("created_at", { ascending: false });

    if (error) {
      return { applications: [], error: error.message };
    }

    return {
      applications: (data || []) as AdminRenterApplication[],
      error: null
    };
  } catch (error) {
    return {
      applications: [],
      error: error instanceof Error ? error.message : "Unable to load renter applications."
    };
  }
}

export async function getPendingRenterApplicationCount(
  accessToken: string
): Promise<{ count: number; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { count, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "renter")
      .eq("account_status", "pending");

    if (error) {
      return { count: 0, error: error.message };
    }

    return { count: count || 0, error: null };
  } catch (error) {
    return {
      count: 0,
      error: error instanceof Error ? error.message : "Unable to load pending renter applications."
    };
  }
}

export async function approveRenterApplication(
  accessToken: string,
  profileId: string
): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { error } = await supabase.rpc("approve_renter_profile", {
      target_profile_id: profileId
    });

    return { error: error?.message || null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to approve renter." };
  }
}

export async function rejectRenterApplication(
  accessToken: string,
  profileId: string,
  reason: string
): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { error } = await supabase.rpc("reject_renter_profile", {
      target_profile_id: profileId,
      reason
    });

    return { error: error?.message || null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to reject renter." };
  }
}

export async function deactivateRenterApplication(
  accessToken: string,
  profileId: string
): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { error } = await supabase.rpc("disable_renter_profile", {
      p_profile_id: profileId
    });

    return { error: error?.message || null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to deactivate renter." };
  }
}
