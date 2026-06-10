import { randomBytes } from "crypto";
import { createSupabaseServiceRoleClient, createSupabaseUserClient } from "@/lib/supabase/admin-auth";
import { sendRenterSetupEmail } from "@/lib/email/renter-emails";
import type { BookingDeliveryMethod } from "@/lib/types";
import { isNauticalCategory } from "@/lib/vehicle-categories";

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
  seasonality_notes: string | null;
  seasonality_periods: unknown[];
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
    seasonality_notes: string | null;
    seasonality_periods: unknown[];
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

export type AdminStandaloneRenter = {
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
  seasonality_notes: string | null;
  seasonality_periods: unknown[];
  admin_notes: string | null;
  onboarding_status: string;
  created_at: string;
  updated_at: string;
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
  seasonalityNotes: string;
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
  "seasonality_notes",
  "seasonality_periods",
  "admin_notes"
].join(", ");

function clean(value: string | null | undefined) {
  return value?.trim() || null;
}

function randomTemporaryPassword() {
  return `${randomBytes(18).toString("base64url")}A1!`;
}

function setupRedirectUrl() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.ischiamotion.com").replace(/\/$/, "");
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
          .select("id, business_name_internal, contact_name, email, phone, status, vat_number, fiscal_code, business_address, business_city, operating_zones, service_categories, seasonality_notes, seasonality_periods, admin_notes, onboarding_status")
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

export async function getStandaloneAdminRenters(
  accessToken: string,
  filters: AdminRenterFilters = {}
): Promise<{ renters: AdminStandaloneRenter[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const [rentersResult, linksResult] = await Promise.all([
      supabase
        .from("renters")
        .select("id, business_name_internal, contact_name, email, phone, status, vat_number, fiscal_code, business_address, business_city, operating_zones, service_categories, seasonality_notes, seasonality_periods, admin_notes, onboarding_status, created_at, updated_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("renter_users")
        .select("renter_id")
    ]);

    if (rentersResult.error) {
      return { renters: [], error: rentersResult.error.message };
    }

    if (linksResult.error) {
      return { renters: [], error: linksResult.error.message };
    }

    const linkedRenterIds = new Set((linksResult.data || []).map((link) => link.renter_id).filter(Boolean));
    let renters = ((rentersResult.data || []) as unknown as AdminStandaloneRenter[])
      .filter((renter) => !linkedRenterIds.has(renter.id));

    if (filters.status && filters.status !== "all") {
      if (filters.status === "approved") {
        renters = renters.filter((renter) => renter.status === "active");
      } else if (filters.status === "disabled") {
        renters = renters.filter((renter) => renter.status === "disabled");
      } else if (filters.status === "pending") {
        renters = renters.filter((renter) => renter.status === "pending");
      } else {
        renters = [];
      }
    }

    const term = filters.q?.trim().toLowerCase();
    if (term) {
      renters = renters.filter((renter) => [
        renter.business_name_internal,
        renter.contact_name,
        renter.email,
        renter.phone
      ].some((value) => value?.toLowerCase().includes(term)));
    }

    return { renters, error: null };
  } catch (error) {
    return {
      renters: [],
      error: error instanceof Error ? error.message : "Unable to load standalone renters."
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

export async function activateAdminManagedRenterAccess(
  renterId: string
): Promise<{ renterId: string | null; profileId: string | null; setupUrl: string | null; error: string | null }> {
  try {
    const service = createSupabaseServiceRoleClient();
    const { data: renter, error: renterError } = await service
      .from("renters")
      .select("id, business_name_internal, contact_name, email, phone, vat_number, fiscal_code, business_address, business_city, operating_zones, service_categories, seasonality_notes, seasonality_periods, admin_notes")
      .eq("id", renterId)
      .single();

    if (renterError || !renter) {
      return { renterId: null, profileId: null, setupUrl: null, error: renterError?.message || "Renter non trovato." };
    }

    if (!renter.email) {
      return { renterId, profileId: null, setupUrl: null, error: "Email obbligatoria per creare l'accesso Auth." };
    }

    const existingLink = await service
      .from("renter_users")
      .select("profile_id")
      .eq("renter_id", renterId)
      .maybeSingle();

    if (existingLink.data?.profile_id) {
      return { renterId, profileId: existingLink.data.profile_id, setupUrl: null, error: "Questo renter ha gia un accesso collegato." };
    }

    const temporaryPassword = randomTemporaryPassword();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const seasonalityPeriods = Array.isArray(renter.seasonality_periods) ? renter.seasonality_periods : [];

    const { data: authData, error: authError } = await service.auth.admin.createUser({
      email: renter.email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        business_name: renter.business_name_internal,
        contact_name: renter.contact_name,
        phone: renter.phone,
        vat_number: renter.vat_number,
        fiscal_code: renter.fiscal_code,
        business_address: renter.business_address,
        business_city: renter.business_city,
        operating_zones: renter.operating_zones || [],
        service_categories: renter.service_categories || [],
        seasonality_notes: renter.seasonality_notes,
        seasonality_periods: seasonalityPeriods,
        admin_notes: renter.admin_notes,
        created_by_admin: true,
        force_password_change: true
      }
    });

    const profileId = authData.user?.id || null;
    if (authError || !profileId) {
      return { renterId, profileId: null, setupUrl: null, error: authError?.message || "Impossibile creare utente Auth." };
    }

    await service
      .from("profiles")
      .update({
        business_name: renter.business_name_internal,
        contact_name: clean(renter.contact_name),
        phone: clean(renter.phone),
        account_status: "approved",
        approved_at: now.toISOString(),
        force_password_change: true,
        temp_password_created_at: now.toISOString(),
        temp_password_expires_at: expiresAt,
        created_by_admin: true,
        vat_number: clean(renter.vat_number),
        fiscal_code: clean(renter.fiscal_code),
        business_address: clean(renter.business_address),
        business_city: clean(renter.business_city),
        operating_zones: renter.operating_zones || [],
        service_categories: renter.service_categories || [],
        seasonality_notes: clean(renter.seasonality_notes),
        seasonality_periods: seasonalityPeriods,
        admin_notes: clean(renter.admin_notes),
        updated_at: now.toISOString()
      })
      .eq("id", profileId);

    const { error: linkError } = await service
      .from("renter_users")
      .insert({ renter_id: renterId, profile_id: profileId });

    if (linkError) {
      return { renterId, profileId, setupUrl: null, error: linkError.message };
    }

    await service
      .from("renters")
      .update({
        onboarding_status: "pending_first_login",
        updated_at: now.toISOString()
      })
      .eq("id", renterId);

    const linkResult = await (service.auth.admin as unknown as {
      generateLink: (params: Record<string, unknown>) => Promise<{ data: { properties?: { action_link?: string; actionLink?: string } } | null; error: { message: string } | null }>;
    }).generateLink({
      type: "recovery",
      email: renter.email,
      options: {
        redirectTo: setupRedirectUrl()
      }
    });

    const setupUrl = linkResult.data?.properties?.action_link || linkResult.data?.properties?.actionLink || null;

    await sendRenterSetupEmail({
      businessName: renter.business_name_internal || "Noleggiatore",
      contactName: renter.contact_name,
      email: renter.email,
      setupUrl
    }).catch(() => null);

    return { renterId, profileId, setupUrl, error: null };
  } catch (error) {
    return {
      renterId,
      profileId: null,
      setupUrl: null,
      error: error instanceof Error ? error.message : "Unable to activate renter access."
    };
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
      seasonality_notes: clean(input.seasonalityNotes),
      seasonality_periods: [],
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
        seasonality_notes: input.seasonalityNotes,
        seasonality_periods: [],
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
        seasonality_notes: clean(input.seasonalityNotes),
        seasonality_periods: [],
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

// ─── Admin Renter Delivery Capabilities ──────────────────────────────────────

export type AdminRenterDeliveryCapabilityItem = {
  id: string | null;
  renter_id: string;
  category_id: string;
  category_slug: string;
  category_name_it: string;
  delivery_method: BookingDeliveryMethod;
  is_enabled: boolean;
  zones: string[];
  notes: string | null;
};

export type AdminRenterDeliveryGroup = {
  category_id: string;
  category_slug: string;
  category_name_it: string;
  renter_id: string;
  capabilities: AdminRenterDeliveryCapabilityItem[];
};

const deliveryMethodOrder: BookingDeliveryMethod[] = ["pickup_point", "port_delivery", "hotel_delivery"];

export async function getAdminRenterCategoryDeliveryCapabilities(
  accessToken: string,
  renterId: string
): Promise<{ groups: AdminRenterDeliveryGroup[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);

    const [vehiclesResult, capabilitiesResult] = await Promise.all([
      supabase
        .from("vehicles")
        .select("category_id, vehicle_categories(id, slug, name_it)")
        .eq("renter_id", renterId)
        .eq("is_active", true),
      supabase
        .from("renter_category_delivery_capabilities")
        .select("id, renter_id, category_id, delivery_method, is_enabled, zones, notes")
        .eq("renter_id", renterId)
    ]);

    if (vehiclesResult.error) return { groups: [], error: vehiclesResult.error.message };
    if (capabilitiesResult.error) return { groups: [], error: capabilitiesResult.error.message };

    const seenIds = new Set<string>();
    const categories: Array<{ id: string; slug: string; name_it: string }> = [];
    for (const v of (vehiclesResult.data || []) as unknown as Array<{
      category_id: string | null;
      vehicle_categories: { id: string; slug: string; name_it: string } | { id: string; slug: string; name_it: string }[] | null;
    }>) {
      if (!v.category_id || seenIds.has(v.category_id)) continue;
      seenIds.add(v.category_id);
      const cat = Array.isArray(v.vehicle_categories) ? v.vehicle_categories[0] : v.vehicle_categories;
      if (cat) categories.push({ id: v.category_id, slug: cat.slug, name_it: cat.name_it });
    }

    const capMap = new Map<string, { id: string; is_enabled: boolean; zones: string[] | null; notes: string | null }>();
    for (const cap of (capabilitiesResult.data || []) as unknown as Array<{
      id: string; category_id: string; delivery_method: string; is_enabled: boolean; zones: string[] | null; notes: string | null;
    }>) {
      capMap.set(`${cap.category_id}:${cap.delivery_method}`, {
        id: cap.id,
        is_enabled: cap.is_enabled,
        zones: cap.zones,
        notes: cap.notes
      });
    }

    const groups: AdminRenterDeliveryGroup[] = categories.map((cat) => ({
      category_id: cat.id,
      category_slug: cat.slug,
      category_name_it: cat.name_it,
      renter_id: renterId,
      capabilities: deliveryMethodOrder.map((method) => {
        const existing = capMap.get(`${cat.id}:${method}`);
        return {
          id: existing?.id || null,
          renter_id: renterId,
          category_id: cat.id,
          category_slug: cat.slug,
          category_name_it: cat.name_it,
          delivery_method: method,
          is_enabled: existing ? existing.is_enabled : method === "pickup_point",
          zones: existing?.zones || [],
          notes: existing?.notes || null
        };
      })
    }));

    return { groups, error: null };
  } catch (err) {
    return { groups: [], error: err instanceof Error ? err.message : "Unable to load delivery capabilities." };
  }
}

export async function upsertAdminRenterCategoryDeliveryCapability(input: {
  accessToken: string;
  renterId: string;
  categoryId: string;
  categorySlug: string;
  deliveryMethod: BookingDeliveryMethod;
  isEnabled: boolean;
  zones: string[];
  notes: string;
}): Promise<{ error: string | null }> {
  if (isNauticalCategory(input.categorySlug) && input.deliveryMethod !== "pickup_point" && input.isEnabled) {
    return { error: "Per barche e gommoni è disponibile solo il ritiro presso IschiaMotion Point." };
  }

  try {
    const supabase = createSupabaseUserClient(input.accessToken);
    const payload = {
      renter_id: input.renterId,
      category_id: input.categoryId,
      delivery_method: input.deliveryMethod,
      is_enabled: input.isEnabled,
      zones: input.zones.length > 0 ? input.zones : null,
      notes: input.notes.trim() || null,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from("renter_category_delivery_capabilities")
      .upsert(payload, { onConflict: "renter_id,category_id,delivery_method" });

    if (error) return { error: error.message };
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update delivery capability." };
  }
}
