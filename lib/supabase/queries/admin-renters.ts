import { randomBytes } from "crypto";
import { createSupabaseServiceRoleClient, createSupabaseUserClient } from "@/lib/supabase/admin-auth";
import { sendRenterSetupEmail } from "@/lib/email/renter-emails";

export type RenterAccountStatus = "pending" | "approved" | "rejected" | "disabled";

export type AdminRenterApplication = {
  id: string;
  email: string | null;
  account_status: RenterAccountStatus;
  business_name: string | null;
  contact_name: string | null;
  phone: string | null;
  created_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  privacy_accepted_at: string | null;
  force_password_change: boolean;
  created_by_admin: boolean;
  vat_number: string | null;
  fiscal_code: string | null;
  business_address: string | null;
  business_city: string | null;
  operating_zones: string[];
  service_categories: string[];
  admin_notes: string | null;
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
    vat_number: string | null;
    fiscal_code: string | null;
    business_address: string | null;
    business_city: string | null;
    operating_zones: string[];
    service_categories: string[];
    admin_notes: string | null;
    onboarding_status: string;
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

export type AdminRenterFilters = {
  status?: RenterAccountStatus | "all";
  q?: string;
};

export type CreateAdminRenterInput = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  vatNumber: string;
  fiscalCode: string;
  businessAddress: string;
  businessCity: string;
  operatingZones: string[];
  serviceCategories: string[];
  adminNotes: string;
  createAuthUser: boolean;
};

const profileSelect = [
  "id",
  "email",
  "account_status",
  "business_name",
  "contact_name",
  "phone",
  "created_at",
  "approved_at",
  "rejected_at",
  "rejection_reason",
  "privacy_accepted_at",
  "force_password_change",
  "created_by_admin",
  "vat_number",
  "fiscal_code",
  "business_address",
  "business_city",
  "operating_zones",
  "service_categories",
  "admin_notes"
].join(", ");

function clean(value: string | null | undefined) {
  return value?.trim() || null;
}

function randomTemporaryPassword() {
  return `${randomBytes(18).toString("base64url")}A1!`;
}

function setupRedirectUrl() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://ischiamotion.com").replace(/\/$/, "");
  return `${siteUrl}/auth/callback?next=/renter/change-password`;
}

export async function getRenterDetailByProfileId(
  accessToken: string,
  profileId: string
): Promise<{ detail: AdminRenterDetail | null; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(profileSelect)
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
          .select("id, business_name_internal, contact_name, email, phone, status, vat_number, fiscal_code, business_address, business_city, operating_zones, service_categories, admin_notes, onboarding_status")
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
        profile: profile as unknown as AdminRenterApplication,
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
  accessToken: string,
  filters: AdminRenterFilters = {}
): Promise<{ applications: AdminRenterApplication[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    let query = supabase
      .from("profiles")
      .select(profileSelect)
      .eq("role", "renter")
      .order("created_at", { ascending: false });

    if (filters.status && filters.status !== "all") {
      query = query.eq("account_status", filters.status);
    }

    const term = filters.q?.trim();
    if (term) {
      query = query.or(`email.ilike.%${term}%,business_name.ilike.%${term}%,contact_name.ilike.%${term}%,phone.ilike.%${term}%`);
    }

    const { data, error } = await query;

    if (error) {
      return { applications: [], error: error.message };
    }

    return {
      applications: (data || []) as unknown as AdminRenterApplication[],
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
): Promise<{ renterId: string | null; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data, error } = await supabase.rpc("approve_renter_profile", {
      target_profile_id: profileId
    });

    return { renterId: typeof data === "string" ? data : null, error: error?.message || null };
  } catch (error) {
    return { renterId: null, error: error instanceof Error ? error.message : "Unable to approve renter." };
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

export async function createAdminRenterRecord(
  accessToken: string,
  input: CreateAdminRenterInput
): Promise<{ renterId: string | null; profileId: string | null; setupUrl: string | null; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const baseRenter = {
      business_name_internal: input.businessName,
      contact_name: clean(input.contactName),
      email: clean(input.email),
      phone: clean(input.phone),
      status: "active",
      vat_number: clean(input.vatNumber),
      fiscal_code: clean(input.fiscalCode),
      business_address: clean(input.businessAddress),
      business_city: clean(input.businessCity),
      operating_zones: input.operatingZones,
      service_categories: input.serviceCategories,
      admin_notes: clean(input.adminNotes),
      onboarding_status: input.createAuthUser ? "pending_first_login" : "not_started"
    };

    if (!input.createAuthUser) {
      const { data, error } = await supabase
        .from("renters")
        .insert(baseRenter)
        .select("id")
        .single();

      return { renterId: data?.id || null, profileId: null, setupUrl: null, error: error?.message || null };
    }

    if (!input.email) {
      return { renterId: null, profileId: null, setupUrl: null, error: "Email obbligatoria per creare l'accesso Auth." };
    }

    const service = createSupabaseServiceRoleClient();
    const temporaryPassword = randomTemporaryPassword();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: authData, error: authError } = await service.auth.admin.createUser({
      email: input.email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        business_name: input.businessName,
        contact_name: input.contactName,
        phone: input.phone,
        vat_number: input.vatNumber,
        fiscal_code: input.fiscalCode,
        business_address: input.businessAddress,
        business_city: input.businessCity,
        operating_zones: input.operatingZones,
        service_categories: input.serviceCategories,
        admin_notes: input.adminNotes,
        created_by_admin: true,
        force_password_change: true
      }
    });

    const profileId = authData.user?.id || null;
    if (authError || !profileId) {
      return { renterId: null, profileId: null, setupUrl: null, error: authError?.message || "Impossibile creare utente Auth." };
    }

    await supabase
      .from("profiles")
      .update({
        business_name: input.businessName,
        contact_name: clean(input.contactName),
        phone: clean(input.phone),
        account_status: "pending",
        force_password_change: true,
        temp_password_created_at: now.toISOString(),
        temp_password_expires_at: expiresAt,
        created_by_admin: true,
        vat_number: clean(input.vatNumber),
        fiscal_code: clean(input.fiscalCode),
        business_address: clean(input.businessAddress),
        business_city: clean(input.businessCity),
        operating_zones: input.operatingZones,
        service_categories: input.serviceCategories,
        admin_notes: clean(input.adminNotes)
      })
      .eq("id", profileId);

    const approved = await approveRenterApplication(accessToken, profileId);
    if (approved.error) {
      return { renterId: null, profileId, setupUrl: null, error: approved.error };
    }

    let setupUrl: string | null = null;
    const linkResult = await (service.auth.admin as unknown as {
      generateLink: (params: Record<string, unknown>) => Promise<{ data: { properties?: { action_link?: string; actionLink?: string } } | null; error: { message: string } | null }>;
    }).generateLink({
      type: "recovery",
      email: input.email,
      options: {
        redirectTo: setupRedirectUrl()
      }
    });

    setupUrl = linkResult.data?.properties?.action_link || linkResult.data?.properties?.actionLink || null;

    await sendRenterSetupEmail({
      businessName: input.businessName,
      contactName: input.contactName,
      email: input.email,
      setupUrl
    }).catch(() => null);

    return { renterId: approved.renterId, profileId, setupUrl, error: null };
  } catch (error) {
    return {
      renterId: null,
      profileId: null,
      setupUrl: null,
      error: error instanceof Error ? error.message : "Unable to create renter."
    };
  }
}
