"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServiceRoleClient, createSupabaseUserClient, requireAdmin } from "@/lib/supabase/admin-auth";
import { isRenterPortalEnabled } from "@/lib/renter-portal";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logAdminAuditEvent } from "@/lib/supabase/queries/admin-audit-log";
import { sendAdminManagedRenterCreatedEmail, sendRenterApprovedEmail, sendRenterRejectedEmail } from "@/lib/email/renter-emails";
import {
  activateAdminManagedRenterAccess,
  approveRenterApplication,
  createAdminRenterRecord,
  deactivateRenterApplication,
  getRenterDetailByProfileId,
  rejectRenterApplication,
  updateAdminRenterRecord,
  updateAdminRenterIschiaMotionPoint,
  upsertAdminRenterCategoryDeliveryCapability
} from "@/lib/supabase/queries/admin-renters";
import type { BookingDeliveryMethod } from "@/lib/types";

const adminPasswordResetRedirectUrl = "https://www.ischiamotion.com/auth/update-password";

function rentersRedirect(params: string): never {
  redirect(`/admin/renters?${params}`);
}

function renterDetailRedirect(routeId: string, params: string): never {
  redirect(`/admin/renters/${encodeURIComponent(routeId)}?${params}`);
}

function isValidEmail(value: string | null | undefined): value is string {
  return Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
}

export async function approveRenterAction(formData: FormData) {
  const profileId = String(formData.get("profile_id") || "");
  const { accessToken, profile } = await requireAdmin("/admin/renters");

  if (!profileId) {
    rentersRedirect(`error=${encodeURIComponent("Profilo non valido.")}`);
  }

  const before = await getRenterDetailByProfileId(accessToken, profileId);
  const result = await approveRenterApplication(accessToken, profileId);
  if (result.error) {
    rentersRedirect(`error=${encodeURIComponent(result.error)}`);
  }

  if (isRenterPortalEnabled()) {
    await sendRenterApprovedEmail({
      businessName: before.detail?.profile?.business_name || "Partner",
      contactName: before.detail?.profile?.contact_name,
      email: before.detail?.profile?.email
    }).catch(() => null);
  }

  await logAdminAuditEvent({
    accessToken,
    actorProfileId: profile.id,
    actorEmail: profile.email,
    action: "renter.approved",
    targetTable: "profiles",
    targetId: profileId,
    metadata: { renterId: result.renterId }
  });

  rentersRedirect("approved=1");
}

export async function rejectRenterAction(formData: FormData) {
  const profileId = String(formData.get("profile_id") || "");
  const reason = String(formData.get("reason") || "").trim();
  const { accessToken, profile } = await requireAdmin("/admin/renters");

  if (!profileId) {
    rentersRedirect(`error=${encodeURIComponent("Profilo non valido.")}`);
  }

  const before = await getRenterDetailByProfileId(accessToken, profileId);
  const result = await rejectRenterApplication(accessToken, profileId, reason);
  if (result.error) {
    rentersRedirect(`error=${encodeURIComponent(result.error)}`);
  }

  await sendRenterRejectedEmail({
    businessName: before.detail?.profile?.business_name || "Noleggiatore",
    contactName: before.detail?.profile?.contact_name,
    email: before.detail?.profile?.email,
    reason
  }).catch(() => null);

  await logAdminAuditEvent({
    accessToken,
    actorProfileId: profile.id,
    actorEmail: profile.email,
    action: "renter.rejected",
    targetTable: "profiles",
    targetId: profileId,
    metadata: { reason }
  });

  rentersRedirect("rejected=1");
}

export async function deactivateRenterAction(formData: FormData) {
  const profileId = String(formData.get("profile_id") || "");
  const { accessToken, profile } = await requireAdmin("/admin/renters");

  if (!profileId) {
    rentersRedirect(`error=${encodeURIComponent("Profilo non valido.")}`);
  }

  const result = await deactivateRenterApplication(accessToken, profileId);
  if (result.error) {
    rentersRedirect(`error=${encodeURIComponent(result.error)}`);
  }

  await logAdminAuditEvent({
    accessToken,
    actorProfileId: profile.id,
    actorEmail: profile.email,
    action: "renter.disabled",
    targetTable: "profiles",
    targetId: profileId
  });

  rentersRedirect("disabled=1");
}

export async function activateAdminManagedRenterAccessAction(formData: FormData) {
  const renterId = String(formData.get("renter_id") || "");
  const { accessToken, profile } = await requireAdmin("/admin/renters");

  if (!renterId) {
    rentersRedirect(`error=${encodeURIComponent("Renter non valido.")}`);
  }

  if (!isRenterPortalEnabled()) {
    rentersRedirect(`error=${encodeURIComponent("Accesso partner disattivato. I partner sono gestiti internamente dall'admin.")}`);
  }

  const result = await activateAdminManagedRenterAccess(renterId);
  if (result.error) {
    rentersRedirect(`error=${encodeURIComponent(result.error)}`);
  }

  await logAdminAuditEvent({
    accessToken,
    actorProfileId: profile.id,
    actorEmail: profile.email,
    action: "renter.access_created",
    targetTable: "renters",
    targetId: renterId,
    metadata: { profileId: result.profileId, setupUrlGenerated: Boolean(result.setupUrl) }
  });

  rentersRedirect(`access=1${result.profileId ? `&profile=${encodeURIComponent(result.profileId)}` : ""}`);
}

export async function sendPasswordResetLinkAction(formData: FormData) {
  const profileId = String(formData.get("profile_id") || "");
  const routeId = String(formData.get("route_id") || profileId);
  const { accessToken, profile: adminProfile } = await requireAdmin(`/admin/renters/${routeId || profileId}`);

  if (!profileId || !routeId) {
    rentersRedirect(`error=${encodeURIComponent("Questo partner non ha un account di accesso collegato.")}`);
  }

  const requestHeaders = headers();
  const clientIp = getClientIp(requestHeaders);
  const limit = checkRateLimit({
    key: `admin-password-reset:${adminProfile.id}:${profileId}:${clientIp}`,
    limit: 3,
    windowMs: 60 * 60 * 1000
  });

  if (!limit.allowed) {
    renterDetailRedirect(routeId, `error=${encodeURIComponent("Troppe richieste di reset password. Riprova piu tardi.")}`);
  }

  const userClient = createSupabaseUserClient(accessToken);
  const { data: renterProfile, error: profileError } = await userClient
    .from("profiles")
    .select("id, email, role")
    .eq("id", profileId)
    .maybeSingle<{ id: string; email: string | null; role: "admin" | "renter" }>();

  if (profileError || !renterProfile || renterProfile.role !== "renter") {
    renterDetailRedirect(routeId, `error=${encodeURIComponent("Questo partner non ha un account di accesso collegato.")}`);
  }

  const service = createSupabaseServiceRoleClient();
  const { data: authData, error: authError } = await service.auth.admin.getUserById(profileId);
  const accountEmail = authData.user?.email?.trim().toLowerCase() || null;

  if (authError || !authData.user) {
    renterDetailRedirect(routeId, `error=${encodeURIComponent("Questo partner non ha un account di accesso collegato.")}`);
  }

  if (!isValidEmail(accountEmail)) {
    renterDetailRedirect(routeId, `error=${encodeURIComponent("Questo utente non ha un'email valida.")}`);
  }

  const profileEmail = renterProfile.email?.trim().toLowerCase() || null;
  if (profileEmail && profileEmail !== accountEmail) {
    renterDetailRedirect(routeId, `error=${encodeURIComponent("Email profilo diversa dall'email dell'account Auth. Reset non inviato.")}`);
  }

  const { error: resetError } = await service.auth.resetPasswordForEmail(accountEmail, {
    redirectTo: adminPasswordResetRedirectUrl
  });

  if (resetError) {
    renterDetailRedirect(routeId, `error=${encodeURIComponent(`Impossibile inviare il reset password: ${resetError.message}`)}`);
  }

  await logAdminAuditEvent({
    accessToken,
    actorProfileId: adminProfile.id,
    actorEmail: adminProfile.email,
    action: "user.password_reset_requested",
    targetTable: "profiles",
    targetId: profileId,
    metadata: { redirectTo: adminPasswordResetRedirectUrl }
  });

  revalidatePath(`/admin/renters/${routeId}`);
  renterDetailRedirect(routeId, "passwordReset=1");
}

function splitList(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function createRenterFromAdminAction(formData: FormData) {
  const { accessToken, profile } = await requireAdmin("/admin/renters/new");
  const businessName = String(formData.get("business_name") || "").trim();
  const contactName = String(formData.get("contact_name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const createAuthUser = String(formData.get("create_auth_user") || "") === "1";
  const shouldCreateAuthUser = isRenterPortalEnabled() && createAuthUser;

  if (!businessName) {
    redirect(`/admin/renters/new?error=${encodeURIComponent("Nome attivita obbligatorio.")}`);
  }

  if (shouldCreateAuthUser && !email) {
    redirect(`/admin/renters/new?error=${encodeURIComponent("Email obbligatoria per creare l'accesso Auth.")}`);
  }

  const result = await createAdminRenterRecord(accessToken, {
    businessName,
    contactName,
    email,
    phone,
    vatNumber: String(formData.get("vat_number") || "").trim(),
    fiscalCode: String(formData.get("fiscal_code") || "").trim(),
    businessAddress: String(formData.get("business_address") || "").trim(),
    businessCity: String(formData.get("business_city") || "").trim(),
    ischiamotionPointMunicipality: String(formData.get("ischiamotion_point_municipality") || "").trim(),
    operatingZones: splitList(formData.get("operating_zones")),
    serviceCategories: formData.getAll("service_categories").map((item) => String(item).trim()).filter(Boolean),
    seasonalityNotes: String(formData.get("seasonality_notes") || "").trim(),
    adminNotes: String(formData.get("admin_notes") || "").trim(),
    createAuthUser: shouldCreateAuthUser
  });

  if (result.error) {
    redirect(`/admin/renters/new?error=${encodeURIComponent(result.error)}`);
  }

  if (!shouldCreateAuthUser) {
    await sendAdminManagedRenterCreatedEmail({
      businessName,
      contactName,
      email
    }).catch(() => null);
  }

  await logAdminAuditEvent({
    accessToken,
    actorProfileId: profile.id,
    actorEmail: profile.email,
    action: shouldCreateAuthUser ? "renter.created_with_auth" : "renter.created",
    targetTable: result.profileId ? "profiles" : "renters",
    targetId: result.profileId || result.renterId || undefined,
    metadata: { renterId: result.renterId, setupUrlGenerated: Boolean(result.setupUrl), managedByAdmin: !shouldCreateAuthUser }
  });

  const createdTarget = result.profileId
    ? `&profile=${encodeURIComponent(result.profileId)}`
    : result.renterId
      ? `&renter=${encodeURIComponent(result.renterId)}`
      : "";

  redirect(`/admin/renters?created=1${createdTarget}`);
}

export async function saveAdminRenterDetailsAction(formData: FormData) {
  const { accessToken, profile } = await requireAdmin("/admin/renters");
  const renterId = String(formData.get("renterId") || "");
  const routeId = String(formData.get("routeId") || "");
  const returnPath = `/admin/renters/${routeId}`;
  const businessName = String(formData.get("business_name") || "").trim();

  if (!renterId || !routeId) {
    redirect(`${returnPath}?error=${encodeURIComponent("Partner non valido.")}`);
  }

  if (!businessName) {
    redirect(`${returnPath}?error=${encodeURIComponent("Nome attivita obbligatorio.")}`);
  }

  const input = {
    businessName,
    contactName: String(formData.get("contact_name") || "").trim(),
    email: String(formData.get("email") || "").trim().toLowerCase(),
    phone: String(formData.get("phone") || "").trim(),
    vatNumber: String(formData.get("vat_number") || "").trim(),
    fiscalCode: String(formData.get("fiscal_code") || "").trim(),
    businessAddress: String(formData.get("business_address") || "").trim(),
    businessCity: String(formData.get("business_city") || "").trim(),
    ischiamotionPointMunicipality: String(formData.get("ischiamotion_point_municipality") || "").trim(),
    operatingZones: splitList(formData.get("operating_zones")),
    serviceCategories: formData.getAll("service_categories").map((item) => String(item).trim()).filter(Boolean),
    seasonalityNotes: String(formData.get("seasonality_notes") || "").trim(),
    adminNotes: String(formData.get("admin_notes") || "").trim()
  };

  const { error } = await updateAdminRenterRecord(accessToken, renterId, input);

  if (error) {
    redirect(`${returnPath}?error=${encodeURIComponent(error)}`);
  }

  await logAdminAuditEvent({
    accessToken,
    actorProfileId: profile.id,
    actorEmail: profile.email,
    action: "renter.updated",
    targetTable: "renters",
    targetId: renterId,
    metadata: input
  });

  revalidatePath("/admin/renters");
  revalidatePath(returnPath);
  redirect(`${returnPath}?renterSaved=1`);
}

export async function saveAdminRenterDeliveryCapabilityAction(formData: FormData) {
  const { accessToken } = await requireAdmin("/admin/renters");

  const renterId = String(formData.get("renterId") || "");
  const categoryId = String(formData.get("categoryId") || "");
  const categorySlug = String(formData.get("categorySlug") || "");
  const returnPath = `/admin/renters/${String(formData.get("routeId") || "")}`;
  const notes = String(formData.get("notes") || "");

  if (!renterId || !categoryId || !categorySlug) {
    redirect(`${returnPath}?error=${encodeURIComponent("Configurazione non valida.")}`);
  }

  const portZones = formData.getAll("port_zones").map((z) => String(z).trim()).filter(Boolean);
  const hotelZones = formData.getAll("hotel_zones").map((z) => String(z).trim()).filter(Boolean);

  const methods: Array<{ method: BookingDeliveryMethod; field: string; zones: string[] }> = [
    { method: "pickup_point", field: "enabled_pickup_point", zones: [] },
    { method: "port_delivery", field: "enabled_port_delivery", zones: portZones },
    { method: "hotel_delivery", field: "enabled_hotel_delivery", zones: hotelZones }
  ];

  for (const { method, field, zones } of methods) {
    const isEnabled = String(formData.get(field) || "false") === "true";
    const { error } = await upsertAdminRenterCategoryDeliveryCapability({
      accessToken,
      renterId,
      categoryId,
      categorySlug,
      deliveryMethod: method,
      isEnabled,
      zones,
      notes
    });
    if (error) {
      redirect(`${returnPath}?error=${encodeURIComponent(error)}`);
    }
  }

  redirect(`${returnPath}?deliverySaved=1`);
}

export async function saveAdminRenterIschiaMotionPointAction(formData: FormData) {
  const { accessToken, profile } = await requireAdmin("/admin/renters");
  const renterId = String(formData.get("renterId") || "");
  const routeId = String(formData.get("routeId") || "");
  const municipality = String(formData.get("ischiamotion_point_municipality") || "").trim();
  const returnPath = `/admin/renters/${routeId}`;

  if (!renterId || !routeId || !municipality) {
    redirect(`${returnPath}?error=${encodeURIComponent("Comune IschiaMotion Point non valido.")}`);
  }

  const { error } = await updateAdminRenterIschiaMotionPoint({
    accessToken,
    renterId,
    municipality
  });

  if (error) {
    redirect(`${returnPath}?error=${encodeURIComponent(error)}`);
  }

  await logAdminAuditEvent({
    accessToken,
    actorProfileId: profile.id,
    actorEmail: profile.email,
    action: "renter.ischiamotion_point_update",
    targetTable: "renters",
    targetId: renterId,
    metadata: { ischiamotion_point_municipality: municipality }
  });

  revalidatePath("/admin/renters");
  revalidatePath(returnPath);
  redirect(`${returnPath}?pointSaved=1`);
}
