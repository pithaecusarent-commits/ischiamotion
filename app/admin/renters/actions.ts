"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { logAdminAuditEvent } from "@/lib/supabase/queries/admin-audit-log";
import { sendRenterApprovedEmail, sendRenterRejectedEmail } from "@/lib/email/renter-emails";
import {
  approveRenterApplication,
  createAdminRenterRecord,
  deactivateRenterApplication,
  getRenterDetailByProfileId,
  rejectRenterApplication
} from "@/lib/supabase/queries/admin-renters";

function rentersRedirect(params: string): never {
  redirect(`/admin/renters?${params}`);
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

  await sendRenterApprovedEmail({
    businessName: before.detail?.profile.business_name || "Noleggiatore",
    contactName: before.detail?.profile.contact_name,
    email: before.detail?.profile.email
  }).catch(() => null);

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
    businessName: before.detail?.profile.business_name || "Noleggiatore",
    contactName: before.detail?.profile.contact_name,
    email: before.detail?.profile.email,
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

  if (!businessName) {
    redirect(`/admin/renters/new?error=${encodeURIComponent("Nome attivita obbligatorio.")}`);
  }

  if (createAuthUser && !email) {
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
    operatingZones: splitList(formData.get("operating_zones")),
    serviceCategories: formData.getAll("service_categories").map((item) => String(item).trim()).filter(Boolean),
    seasonalityNotes: String(formData.get("seasonality_notes") || "").trim(),
    adminNotes: String(formData.get("admin_notes") || "").trim(),
    createAuthUser
  });

  if (result.error) {
    redirect(`/admin/renters/new?error=${encodeURIComponent(result.error)}`);
  }

  await logAdminAuditEvent({
    accessToken,
    actorProfileId: profile.id,
    actorEmail: profile.email,
    action: createAuthUser ? "renter.created_with_auth" : "renter.created",
    targetTable: result.profileId ? "profiles" : "renters",
    targetId: result.profileId || result.renterId || undefined,
    metadata: { renterId: result.renterId, setupUrlGenerated: Boolean(result.setupUrl) }
  });

  redirect(`/admin/renters?created=1${result.profileId ? `&profile=${encodeURIComponent(result.profileId)}` : ""}`);
}
