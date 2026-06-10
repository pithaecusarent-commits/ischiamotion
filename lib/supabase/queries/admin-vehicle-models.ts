import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";

export type AdminVehicleModel = {
  id: string;
  category_id: string;
  title_it: string;
  title_en: string;
  description_it: string | null;
  description_en: string | null;
  image_url: string | null;
  features_it: string[];
  features_en: string[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name: string;
  offer_count: number;
};

export type AdminVehicleModelFormData = {
  category_id: string;
  title_it: string;
  title_en: string;
  description_it: string;
  description_en: string;
  image_url: string;
  features_it: string[];
  features_en: string[];
  sort_order: number;
  is_active: boolean;
};

const modelSelect =
  "id, category_id, title_it, title_en, description_it, description_en, image_url, features_it, features_en, sort_order, is_active, created_at, updated_at";

type ModelRow = {
  id: string;
  category_id: string;
  title_it: string;
  title_en: string;
  description_it: string | null;
  description_en: string | null;
  image_url: string | null;
  features_it: string[];
  features_en: string[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type CategoryRow = { id: string; name_it: string };

function normalizeModel(
  row: ModelRow,
  categories: CategoryRow[],
  offerCounts: Map<string, number>
): AdminVehicleModel {
  const category = categories.find((c) => c.id === row.category_id);
  return {
    ...row,
    features_it: row.features_it || [],
    features_en: row.features_en || [],
    category_name: category?.name_it || "-",
    offer_count: offerCounts.get(row.id) || 0
  };
}

export async function getAdminVehicleModels(
  accessToken: string
): Promise<{ models: AdminVehicleModel[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const [modelsResult, categoriesResult, offerCountResult] = await Promise.all([
      supabase
        .from("vehicle_models")
        .select(modelSelect)
        .order("sort_order", { ascending: true })
        .order("title_it", { ascending: true }),
      supabase
        .from("vehicle_categories")
        .select("id, name_it")
        .order("name_it", { ascending: true }),
      supabase
        .from("vehicles")
        .select("vehicle_model_id")
        .not("vehicle_model_id", "is", null)
    ]);

    const err = modelsResult.error || categoriesResult.error || offerCountResult.error;
    if (err) return { models: [], error: err.message };

    const offerCounts = new Map<string, number>();
    for (const row of offerCountResult.data || []) {
      if (row.vehicle_model_id) {
        offerCounts.set(
          row.vehicle_model_id,
          (offerCounts.get(row.vehicle_model_id) || 0) + 1
        );
      }
    }

    const categories = (categoriesResult.data || []) as CategoryRow[];
    const models = ((modelsResult.data || []) as unknown as ModelRow[]).map((row) =>
      normalizeModel(row, categories, offerCounts)
    );

    return { models, error: null };
  } catch (error) {
    return {
      models: [],
      error: error instanceof Error ? error.message : "Impossibile caricare i modelli."
    };
  }
}

export async function getAdminVehicleModelById(
  accessToken: string,
  id: string
): Promise<{ model: AdminVehicleModel | null; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const [modelResult, categoriesResult, offerCountResult] = await Promise.all([
      supabase.from("vehicle_models").select(modelSelect).eq("id", id).maybeSingle(),
      supabase.from("vehicle_categories").select("id, name_it"),
      supabase
        .from("vehicles")
        .select("vehicle_model_id")
        .eq("vehicle_model_id", id)
    ]);

    const err = modelResult.error || categoriesResult.error || offerCountResult.error;
    if (err) return { model: null, error: err.message };
    if (!modelResult.data) return { model: null, error: null };

    const offerCounts = new Map<string, number>();
    offerCounts.set(id, (offerCountResult.data || []).length);

    const categories = (categoriesResult.data || []) as CategoryRow[];
    return {
      model: normalizeModel(
        modelResult.data as unknown as ModelRow,
        categories,
        offerCounts
      ),
      error: null
    };
  } catch (error) {
    return {
      model: null,
      error: error instanceof Error ? error.message : "Impossibile caricare il modello."
    };
  }
}

export async function createAdminVehicleModel(
  accessToken: string,
  data: AdminVehicleModelFormData
): Promise<{ id: string | null; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data: row, error } = await supabase
      .from("vehicle_models")
      .insert(toModelPayload(data))
      .select("id")
      .single();
    if (error) return { id: null, error: error.message };
    return { id: (row as { id: string }).id, error: null };
  } catch (error) {
    return {
      id: null,
      error: error instanceof Error ? error.message : "Impossibile creare il modello."
    };
  }
}

export async function updateAdminVehicleModel(
  accessToken: string,
  id: string,
  data: AdminVehicleModelFormData
): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { error } = await supabase
      .from("vehicle_models")
      .update(toModelPayload(data))
      .eq("id", id);
    if (error) return { error: error.message };
    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Impossibile aggiornare il modello."
    };
  }
}

export async function toggleAdminVehicleModelActive(
  accessToken: string,
  id: string,
  isActive: boolean
): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { error } = await supabase
      .from("vehicle_models")
      .update({ is_active: isActive })
      .eq("id", id);
    if (error) return { error: error.message };
    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Impossibile aggiornare lo stato."
    };
  }
}

function toModelPayload(data: AdminVehicleModelFormData) {
  return {
    category_id: data.category_id,
    title_it: data.title_it,
    title_en: data.title_en,
    description_it: data.description_it || null,
    description_en: data.description_en || null,
    image_url: data.image_url || null,
    features_it: data.features_it,
    features_en: data.features_en,
    sort_order: data.sort_order,
    is_active: data.is_active
  };
}
