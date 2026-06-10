"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import {
  createAdminVehicleModel,
  toggleAdminVehicleModelActive,
  updateAdminVehicleModel,
  type AdminVehicleModelFormData
} from "@/lib/supabase/queries/admin-vehicle-models";
import {
  deleteVehicleImageByPublicUrl,
  uploadVehicleImage
} from "@/lib/supabase/queries/admin-vehicle-images";

function parseFeatures(value: FormDataEntryValue | null) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function parseModelFormData(
  formData: FormData,
  accessToken: string
): Promise<{
  data: AdminVehicleModelFormData | null;
  error: string | null;
  uploadedImage: boolean;
  originalImageUrl: string;
}> {
  const titleIt = String(formData.get("title_it") || "").trim();
  const titleEn = String(formData.get("title_en") || "").trim();
  const categoryId = String(formData.get("category_id") || "").trim();
  const sortRaw = String(formData.get("sort_order") || "0").trim();
  const sortOrder = Number.isFinite(Number(sortRaw)) ? Math.max(0, Math.trunc(Number(sortRaw))) : 0;
  const imageFile = formData.get("image_file");
  const existingImageUrl = String(formData.get("image_url") || "").trim();
  const originalImageUrl = String(formData.get("original_image_url") || "").trim();
  let imageUrl = existingImageUrl;
  let uploadedImage = false;

  if (!titleIt) return { data: null, error: "Titolo IT obbligatorio.", uploadedImage, originalImageUrl };
  if (!titleEn) return { data: null, error: "Titolo EN obbligatorio.", uploadedImage, originalImageUrl };
  if (!categoryId) return { data: null, error: "Categoria obbligatoria.", uploadedImage, originalImageUrl };

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
      title_it: titleIt,
      title_en: titleEn,
      description_it: String(formData.get("description_it") || "").trim(),
      description_en: String(formData.get("description_en") || "").trim(),
      image_url: imageUrl,
      features_it: parseFeatures(formData.get("features_it")),
      features_en: parseFeatures(formData.get("features_en")),
      sort_order: sortOrder,
      is_active: formData.get("is_active") === "on"
    },
    error: null,
    uploadedImage,
    originalImageUrl
  };
}

export async function createVehicleModelAction(formData: FormData) {
  const { accessToken } = await requireAdmin("/admin/vehicle-models/new");
  const parsed = await parseModelFormData(formData, accessToken);

  if (!parsed.data) {
    redirect(`/admin/vehicle-models/new?error=${encodeURIComponent(parsed.error || "Dati non validi.")}`);
  }

  const { id, error } = await createAdminVehicleModel(accessToken, parsed.data);
  revalidatePath("/admin/vehicle-models");

  if (error || !id) {
    redirect(`/admin/vehicle-models/new?error=${encodeURIComponent(error || "Errore nella creazione.")}`);
  }

  redirect(`/admin/vehicle-models/${id}?created=1`);
}

export async function updateVehicleModelAction(formData: FormData) {
  const modelId = String(formData.get("model_id") || "");
  const { accessToken } = await requireAdmin(`/admin/vehicle-models/${modelId}`);
  const parsed = await parseModelFormData(formData, accessToken);

  if (!modelId) {
    redirect("/admin/vehicle-models?error=Modello%20non%20valido");
  }

  if (!parsed.data) {
    redirect(`/admin/vehicle-models/${modelId}?error=${encodeURIComponent(parsed.error || "Dati non validi.")}`);
  }

  const { error } = await updateAdminVehicleModel(accessToken, modelId, parsed.data);
  revalidatePath("/admin/vehicle-models");
  revalidatePath(`/admin/vehicle-models/${modelId}`);

  if (error) {
    redirect(`/admin/vehicle-models/${modelId}?error=${encodeURIComponent(error)}`);
  }

  if (
    parsed.uploadedImage &&
    parsed.originalImageUrl &&
    parsed.originalImageUrl !== parsed.data.image_url
  ) {
    await deleteVehicleImageByPublicUrl(parsed.originalImageUrl);
  }

  redirect(`/admin/vehicle-models/${modelId}?saved=1`);
}

export async function toggleVehicleModelStatusAction(formData: FormData) {
  const modelId = String(formData.get("model_id") || "");
  const isActive = String(formData.get("is_active") || "false") === "true";
  const { accessToken } = await requireAdmin("/admin/vehicle-models");

  if (!modelId) {
    redirect("/admin/vehicle-models?error=Modello%20non%20valido");
  }

  const { error } = await toggleAdminVehicleModelActive(accessToken, modelId, isActive);
  revalidatePath("/admin/vehicle-models");

  if (error) {
    redirect(`/admin/vehicle-models?error=${encodeURIComponent(error)}`);
  }

  redirect("/admin/vehicle-models?updated=1");
}
