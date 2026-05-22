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
