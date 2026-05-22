import { createClient } from "@supabase/supabase-js";
import { vehicles as mockVehicles } from "@/lib/mock/vehicles";
import type { Locale, PublicVehicle, VehicleCategorySlug } from "@/lib/types";

type PublicVehicleListingRow = {
  id: string;
  category_slug: string;
  title_it: string;
  title_en: string;
  description_it: string | null;
  description_en: string | null;
  price_from: number | null;
  image_url: string | null;
  features_it: string[] | null;
  features_en: string[] | null;
  pickup_point_id: string | null;
  pickup_label_it: string;
  pickup_label_en: string;
  pickup_zone: string;
  is_active: boolean;
};

export type PublicVehicleQueryParams = {
  locale: Locale;
  category_slug?: string;
  start_date?: string;
  end_date?: string;
  delivery_method?: string;
};

const categoryMap: Record<string, VehicleCategorySlug> = {
  scooter: "scooter",
  auto: "auto",
  "bici-elettriche": "bici",
  "barche-gommoni": "barca",
  barca: "barca",
  bici: "bici"
};

const emojiMap: Record<VehicleCategorySlug, string> = {
  scooter: "🛵",
  auto: "🚗",
  bici: "🚲",
  barca: "🚤"
};

export async function getPublicVehicles(params: PublicVehicleQueryParams): Promise<PublicVehicle[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return mockVehicles;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    const { data, error } = await supabase.rpc("get_public_vehicle_listings", {
      lookup_category_slug: params.category_slug || null,
      requested_start_date: params.start_date || null,
      requested_end_date: params.end_date || null,
      requested_delivery_method: params.delivery_method || null
    });

    if (error || !data?.length) {
      return mockVehicles;
    }

    return (data as PublicVehicleListingRow[])
      .map(toPublicVehicle)
      .filter((vehicle): vehicle is PublicVehicle => Boolean(vehicle))
      .sort((a, b) => a.price_from - b.price_from);
  } catch {
    return mockVehicles;
  }
}

function toPublicVehicle(row: PublicVehicleListingRow): PublicVehicle | null {
  const category = categoryMap[row.category_slug];
  if (!category) return null;

  return {
    id: row.id,
    category,
    title_it: row.title_it,
    title_en: row.title_en,
    location_it: row.pickup_label_it || row.pickup_zone,
    location_en: row.pickup_label_en || row.pickup_zone,
    price_from: Number(row.price_from || 0),
    image_url: row.image_url,
    pickup_point_id: row.pickup_point_id,
    source: "supabase",
    features_it: row.features_it || [],
    features_en: row.features_en || [],
    emoji: emojiMap[category],
    is_available: row.is_active
  };
}
