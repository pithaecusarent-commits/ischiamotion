"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { approveRenterApplication, deactivateRenterApplication, rejectRenterApplication } from "@/lib/supabase/queries/admin-renters";

function rentersRedirect(params: string): never {
  redirect(`/admin/renters?${params}`);
}

export async function approveRenterAction(formData: FormData) {
  const profileId = String(formData.get("profile_id") || "");
  const { accessToken } = await requireAdmin("/admin/renters");

  if (!profileId) {
    rentersRedirect(`error=${encodeURIComponent("Profilo non valido.")}`);
  }

  const result = await approveRenterApplication(accessToken, profileId);
  if (result.error) {
    rentersRedirect(`error=${encodeURIComponent(result.error)}`);
  }

  rentersRedirect("approved=1");
}

export async function rejectRenterAction(formData: FormData) {
  const profileId = String(formData.get("profile_id") || "");
  const reason = String(formData.get("reason") || "").trim();
  const { accessToken } = await requireAdmin("/admin/renters");

  if (!profileId) {
    rentersRedirect(`error=${encodeURIComponent("Profilo non valido.")}`);
  }

  const result = await rejectRenterApplication(accessToken, profileId, reason);
  if (result.error) {
    rentersRedirect(`error=${encodeURIComponent(result.error)}`);
  }

  rentersRedirect("rejected=1");
}

export async function deactivateRenterAction(formData: FormData) {
  const profileId = String(formData.get("profile_id") || "");
  const { accessToken } = await requireAdmin("/admin/renters");

  if (!profileId) {
    rentersRedirect(`error=${encodeURIComponent("Profilo non valido.")}`);
  }

  const result = await deactivateRenterApplication(accessToken, profileId);
  if (result.error) {
    rentersRedirect(`error=${encodeURIComponent(result.error)}`);
  }

  rentersRedirect("disabled=1");
}
