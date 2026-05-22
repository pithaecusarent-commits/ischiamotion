import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";

export type AdminVehicle = {
  id: string;
  category_id: string;
  renter_id: string;
  pickup_point_id: string;
  title_it: string;
  title_en: string;
  description_it: string | null;
  description_en: string | null;
  price_from: number | null;
  image_url: string | null;
  features_it: string[];
  features_en: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name: string;
  pickup_point_label: string;
  renter_name: string;
};

export type AdminVehicleFormData = {
  category_id: string;
  renter_id: string;
  pickup_point_id: string;
  title_it: string;
  title_en: string;
  description_it: string;
  description_en: string;
  price_from: number | null;
  image_url: string;
  features_it: string[];
  features_en: string[];
  is_active: boolean;
};

export type AdminVehicleOption = {
  id: string;
  label: string;
  meta?: string;
};

export type AdminVehicleOptions = {
  categories: AdminVehicleOption[];
  renters: AdminVehicleOption[];
  pickupPoints: AdminVehicleOption[];
};

type VehicleRow = Omit<AdminVehicle, "category_name" | "pickup_point_label" | "renter_name">;

const vehicleSelect = "id, category_id, renter_id, pickup_point_id, title_it, title_en, description_it, description_en, price_from, image_url, features_it, features_en, is_active, created_at, updated_at";

function normalizeVehicle(row: VehicleRow, options: AdminVehicleOptions): AdminVehicle {
  const category = options.categories.find((item) => item.id === row.category_id);
  const pickupPoint = options.pickupPoints.find((item) => item.id === row.pickup_point_id);
  const renter = options.renters.find((item) => item.id === row.renter_id);

  return {
    ...row,
    features_it: row.features_it || [],
    features_en: row.features_en || [],
    category_name: category?.label || "-",
    pickup_point_label: pickupPoint?.label || "-",
    renter_name: renter?.label || "-"
  };
}

export async function getAdminVehicleOptions(accessToken: string): Promise<{ options: AdminVehicleOptions; error: string | null }> {
  const empty: AdminVehicleOptions = {
    categories: [],
    renters: [],
    pickupPoints: []
  };

  try {
    const supabase = createSupabaseUserClient(accessToken);
    const [categoriesResult, rentersResult, pickupPointsResult] = await Promise.all([
      supabase
        .from("vehicle_categories")
        .select("id, name_it, slug")
        .order("name_it", { ascending: true }),
      supabase
        .from("renters")
        .select("id, business_name_internal, status")
        .order("business_name_internal", { ascending: true }),
      supabase
        .from("pickup_points")
        .select("id, public_label_it, zone")
        .order("zone", { ascending: true })
    ]);

    const error = categoriesResult.error || rentersResult.error || pickupPointsResult.error;
    if (error) {
      return { options: empty, error: error.message };
    }

    return {
      options: {
        categories: (categoriesResult.data || []).map((row) => ({
          id: row.id as string,
          label: row.name_it as string,
          meta: row.slug as string
        })),
        renters: (rentersResult.data || []).map((row) => ({
          id: row.id as string,
          label: row.business_name_internal as string,
          meta: row.status as string
        })),
        pickupPoints: (pickupPointsResult.data || []).map((row) => ({
          id: row.id as string,
          label: row.public_label_it as string,
          meta: row.zone as string
        }))
      },
      error: null
    };
  } catch (error) {
    return { options: empty, error: error instanceof Error ? error.message : "Unable to load vehicle options." };
  }
}

export async function getAdminVehicles(accessToken: string): Promise<{ vehicles: AdminVehicle[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const optionsResult = await getAdminVehicleOptions(accessToken);

    if (optionsResult.error) {
      return { vehicles: [], error: optionsResult.error };
    }

    const { data, error } = await supabase
      .from("vehicles")
      .select(vehicleSelect)
      .order("created_at", { ascending: false });

    if (error) {
      return { vehicles: [], error: error.message };
    }

    return {
      vehicles: ((data || []) as unknown as VehicleRow[]).map((row) => normalizeVehicle(row, optionsResult.options)),
      error: null
    };
  } catch (error) {
    return { vehicles: [], error: error instanceof Error ? error.message : "Unable to load vehicles." };
  }
}

export async function getAdminVehicleById(accessToken: string, id: string): Promise<{ vehicle: AdminVehicle | null; options: AdminVehicleOptions; error: string | null }> {
  const optionsResult = await getAdminVehicleOptions(accessToken);

  if (optionsResult.error) {
    return { vehicle: null, options: optionsResult.options, error: optionsResult.error };
  }

  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data, error } = await supabase
      .from("vehicles")
      .select(vehicleSelect)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return { vehicle: null, options: optionsResult.options, error: error.message };
    }

    return {
      vehicle: data ? normalizeVehicle(data as unknown as VehicleRow, optionsResult.options) : null,
      options: optionsResult.options,
      error: null
    };
  } catch (error) {
    return {
      vehicle: null,
      options: optionsResult.options,
      error: error instanceof Error ? error.message : "Unable to load vehicle."
    };
  }
}

export async function createAdminVehicle(accessToken: string, data: AdminVehicleFormData): Promise<{ vehicle: AdminVehicle | null; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data: row, error } = await supabase
      .from("vehicles")
      .insert(toVehiclePayload(data))
      .select(vehicleSelect)
      .single();

    if (error) {
      return { vehicle: null, error: error.message };
    }

    const optionsResult = await getAdminVehicleOptions(accessToken);
    return {
      vehicle: row ? normalizeVehicle(row as unknown as VehicleRow, optionsResult.options) : null,
      error: optionsResult.error
    };
  } catch (error) {
    return { vehicle: null, error: error instanceof Error ? error.message : "Unable to create vehicle." };
  }
}

export async function updateAdminVehicle(accessToken: string, id: string, data: AdminVehicleFormData): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { error } = await supabase
      .from("vehicles")
      .update(toVehiclePayload(data))
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update vehicle." };
  }
}

export async function toggleAdminVehicleActive(accessToken: string, id: string, isActive: boolean): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { error } = await supabase
      .from("vehicles")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to toggle vehicle." };
  }
}

function toVehiclePayload(data: AdminVehicleFormData) {
  return {
    category_id: data.category_id,
    renter_id: data.renter_id,
    pickup_point_id: data.pickup_point_id,
    title_it: data.title_it,
    title_en: data.title_en,
    description_it: data.description_it || null,
    description_en: data.description_en || null,
    price_from: data.price_from,
    image_url: data.image_url || null,
    features_it: data.features_it,
    features_en: data.features_en,
    is_active: data.is_active
  };
}
