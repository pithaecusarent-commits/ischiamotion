"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import {
  createAdminVehicle,
  toggleAdminVehicleActive,
  updateAdminVehicle,
  type AdminVehicleFormData
} from "@/lib/supabase/queries/admin-vehicles";

function parseFeatures(value: FormDataEntryValue | null) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseVehicleFormData(formData: FormData): { data: AdminVehicleFormData | null; error: string | null } {
  const titleIt = String(formData.get("title_it") || "").trim();
  const titleEn = String(formData.get("title_en") || "").trim();
  const categoryId = String(formData.get("category_id") || "").trim();
  const renterId = String(formData.get("renter_id") || "").trim();
  const pickupPointId = String(formData.get("pickup_point_id") || "").trim();
  const priceRaw = String(formData.get("price_from") || "").trim();
  const priceFrom = priceRaw ? Number(priceRaw) : null;

  if (!titleIt) return { data: null, error: "Titolo IT obbligatorio." };
  if (!titleEn) return { data: null, error: "Titolo EN obbligatorio." };
  if (!categoryId) return { data: null, error: "Categoria obbligatoria." };
  if (!renterId) return { data: null, error: "Noleggiatore obbligatorio." };
  if (!pickupPointId) return { data: null, error: "Pickup point obbligatorio." };
  if (priceRaw && Number.isNaN(priceFrom)) return { data: null, error: "Prezzo da deve essere numerico." };

  return {
    data: {
      category_id: categoryId,
      renter_id: renterId,
      pickup_point_id: pickupPointId,
      title_it: titleIt,
      title_en: titleEn,
      description_it: String(formData.get("description_it") || "").trim(),
      description_en: String(formData.get("description_en") || "").trim(),
      price_from: priceFrom,
      image_url: String(formData.get("image_url") || "").trim(),
      features_it: parseFeatures(formData.get("features_it")),
      features_en: parseFeatures(formData.get("features_en")),
      is_active: formData.get("is_active") === "on"
    },
    error: null
  };
}

export async function createAdminVehicleAction(formData: FormData) {
  const { accessToken } = await requireAdmin("/admin/vehicles/new");
  const parsed = parseVehicleFormData(formData);

  if (!parsed.data) {
    redirect(`/admin/vehicles/new?error=${encodeURIComponent(parsed.error || "Dati non validi.")}`);
  }

  const { error } = await createAdminVehicle(accessToken, parsed.data);
  revalidatePath("/admin/vehicles");

  if (error) {
    redirect(`/admin/vehicles/new?error=${encodeURIComponent(error)}`);
  }

  redirect("/admin/vehicles?created=1");
}

export async function updateAdminVehicleAction(formData: FormData) {
  const vehicleId = String(formData.get("vehicle_id") || "");
  const { accessToken } = await requireAdmin(`/admin/vehicles/${vehicleId}`);
  const parsed = parseVehicleFormData(formData);

  if (!vehicleId) {
    redirect("/admin/vehicles?error=Veicolo%20non%20valido");
  }

  if (!parsed.data) {
    redirect(`/admin/vehicles/${vehicleId}?error=${encodeURIComponent(parsed.error || "Dati non validi.")}`);
  }

  const { error } = await updateAdminVehicle(accessToken, vehicleId, parsed.data);
  revalidatePath("/admin/vehicles");
  revalidatePath(`/admin/vehicles/${vehicleId}`);

  if (error) {
    redirect(`/admin/vehicles/${vehicleId}?error=${encodeURIComponent(error)}`);
  }

  redirect(`/admin/vehicles/${vehicleId}?saved=1`);
}

export async function toggleAdminVehicleActiveAction(formData: FormData) {
  const vehicleId = String(formData.get("vehicle_id") || "");
  const isActive = String(formData.get("is_active") || "false") === "true";
  const { accessToken } = await requireAdmin("/admin/vehicles");

  if (!vehicleId) {
    redirect("/admin/vehicles?error=Veicolo%20non%20valido");
  }

  const { error } = await toggleAdminVehicleActive(accessToken, vehicleId, isActive);
  revalidatePath("/admin/vehicles");

  if (error) {
    redirect(`/admin/vehicles?error=${encodeURIComponent(error)}`);
  }

  redirect("/admin/vehicles?updated=1");
}
