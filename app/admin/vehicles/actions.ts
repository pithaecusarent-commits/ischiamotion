"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import {
  createAdminVehicle,
  createAdminVehiclePriceRule,
  deleteAdminVehiclePriceRule,
  toggleAdminVehicleActive,
  updateAdminVehicle,
  updateAdminVehiclePriceRule,
  type AdminPriceRuleInput,
  type AdminVehicleFormData
} from "@/lib/supabase/queries/admin-vehicles";
import { deleteVehicleImageByPublicUrl, uploadVehicleImage } from "@/lib/supabase/queries/admin-vehicle-images";

function parseFeatures(value: FormDataEntryValue | null) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function parseVehicleFormData(
  formData: FormData,
  accessToken: string
): Promise<{ data: AdminVehicleFormData | null; error: string | null; uploadedImage: boolean; originalImageUrl: string }> {
  const titleIt = String(formData.get("title_it") || "").trim();
  const titleEn = String(formData.get("title_en") || "").trim();
  const categoryId = String(formData.get("category_id") || "").trim();
  const renterId = String(formData.get("renter_id") || "").trim();
  const pickupPointId = String(formData.get("pickup_point_id") || "").trim();
  const internalName = String(formData.get("internal_name") || "").trim();
  const priceRaw = String(formData.get("price_from") || "").trim();
  const priceFrom = priceRaw ? Number(priceRaw) : null;
  const imageFile = formData.get("image_file");
  const existingImageUrl = String(formData.get("image_url") || "").trim();
  const originalImageUrl = String(formData.get("original_image_url") || "").trim();
  let imageUrl = existingImageUrl;
  let uploadedImage = false;

  if (!titleIt) return { data: null, error: "Titolo IT obbligatorio.", uploadedImage, originalImageUrl };
  if (!titleEn) return { data: null, error: "Titolo EN obbligatorio.", uploadedImage, originalImageUrl };
  if (!categoryId) return { data: null, error: "Categoria obbligatoria.", uploadedImage, originalImageUrl };
  if (!renterId) return { data: null, error: "Noleggiatore obbligatorio.", uploadedImage, originalImageUrl };
  if (!pickupPointId) return { data: null, error: "Pickup point obbligatorio.", uploadedImage, originalImageUrl };
  if (priceRaw && Number.isNaN(priceFrom)) return { data: null, error: "Prezzo da deve essere numerico.", uploadedImage, originalImageUrl };

  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      imageUrl = await uploadVehicleImage(imageFile, accessToken);
      uploadedImage = true;
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Upload immagine non riuscito.",
        uploadedImage,
        originalImageUrl
      };
    }
  }

  return {
    data: {
      category_id: categoryId,
      renter_id: renterId,
      pickup_point_id: pickupPointId,
      internal_name: internalName,
      title_it: titleIt,
      title_en: titleEn,
      description_it: String(formData.get("description_it") || "").trim(),
      description_en: String(formData.get("description_en") || "").trim(),
      price_from: priceFrom,
      image_url: imageUrl,
      features_it: parseFeatures(formData.get("features_it")),
      features_en: parseFeatures(formData.get("features_en")),
      is_active: formData.get("is_active") === "on"
    },
    error: null,
    uploadedImage,
    originalImageUrl
  };
}

export async function createAdminVehicleAction(formData: FormData) {
  const { accessToken } = await requireAdmin("/admin/vehicles/new");
  const parsed = await parseVehicleFormData(formData, accessToken);

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
  const parsed = await parseVehicleFormData(formData, accessToken);

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

  if (
    parsed.uploadedImage &&
    parsed.originalImageUrl &&
    parsed.originalImageUrl !== parsed.data.image_url
  ) {
    await deleteVehicleImageByPublicUrl(parsed.originalImageUrl);
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

function parsePriceRuleFormData(formData: FormData): { data: AdminPriceRuleInput | null; error: string | null } {
  const vehicleId  = String(formData.get("vehicle_id")  || "").trim();
  const renterId   = String(formData.get("renter_id")   || "").trim();
  const name       = String(formData.get("name")        || "").trim();
  const dateFrom   = String(formData.get("dateFrom")    || "").trim();
  const dateTo     = String(formData.get("dateTo")      || "").trim();
  const priceRaw   = Number(formData.get("pricePerDay") || "0");
  const minDaysRaw = Number(formData.get("minRentalDays") || "1");
  const isActive   = String(formData.get("isActive")    || "true") !== "false";
  const notes      = String(formData.get("notes")       || "").trim();

  if (!vehicleId || !renterId) return { data: null, error: "Veicolo obbligatorio." };
  if (!dateFrom || !dateTo)    return { data: null, error: "Date obbligatorie." };
  if (!isValidIsoDate(dateFrom) || !isValidIsoDate(dateTo)) {
    return { data: null, error: "Formato date non valido." };
  }
  if (new Date(`${dateTo}T00:00:00Z`).getTime() < new Date(`${dateFrom}T00:00:00Z`).getTime()) {
    return { data: null, error: "La data fine deve essere successiva o uguale alla data inizio." };
  }
  if (!Number.isFinite(priceRaw) || priceRaw < 0) return { data: null, error: "Prezzo non valido." };

  return {
    data: {
      vehicle_id:      vehicleId,
      renter_id:       renterId,
      name,
      date_from:       dateFrom,
      date_to:         dateTo,
      price_per_day:   priceRaw,
      min_rental_days: Math.max(Math.trunc(Number.isFinite(minDaysRaw) ? minDaysRaw : 1), 1),
      is_active:       isActive,
      notes
    },
    error: null
  };
}

function isValidIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export async function saveAdminVehiclePriceRuleAction(formData: FormData) {
  const vehicleId = String(formData.get("vehicle_id") || "");
  const { accessToken } = await requireAdmin(`/admin/vehicles/${vehicleId}`);
  const ruleId = String(formData.get("priceRuleId") || "");
  const parsed = parsePriceRuleFormData(formData);

  if (!parsed.data) {
    redirect(`/admin/vehicles/${vehicleId}?error=${encodeURIComponent(parsed.error || "Dati non validi.")}`);
  }

  const { error } = ruleId
    ? await updateAdminVehiclePriceRule(accessToken, ruleId, parsed.data)
    : await createAdminVehiclePriceRule(accessToken, parsed.data);

  revalidatePath(`/admin/vehicles/${vehicleId}`);

  if (error) {
    redirect(`/admin/vehicles/${vehicleId}?error=${encodeURIComponent(error)}`);
  }

  redirect(`/admin/vehicles/${vehicleId}?saved=1`);
}

export async function deleteAdminVehiclePriceRuleAction(formData: FormData) {
  const vehicleId = String(formData.get("vehicle_id") || "");
  const ruleId    = String(formData.get("priceRuleId") || "");
  const { accessToken } = await requireAdmin(`/admin/vehicles/${vehicleId}`);

  if (!ruleId) {
    redirect(`/admin/vehicles/${vehicleId}?error=Regola%20non%20valida`);
  }

  const { error } = await deleteAdminVehiclePriceRule(accessToken, ruleId);
  revalidatePath(`/admin/vehicles/${vehicleId}`);

  if (error) {
    redirect(`/admin/vehicles/${vehicleId}?error=${encodeURIComponent(error)}`);
  }

  redirect(`/admin/vehicles/${vehicleId}?saved=1`);
}
