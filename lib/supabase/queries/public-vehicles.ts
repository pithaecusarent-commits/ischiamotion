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

export type PublicVehicleSearchResult = {
  vehicles: PublicVehicle[];
  isFallback: boolean;
  error: string | null;
};

export type HomepageCategoryMinPrices = Partial<Record<VehicleCategorySlug, number>>;

const categoryMap: Record<string, VehicleCategorySlug> = {
  scooter: "scooter",
  auto: "auto",
  "bici-elettriche": "bici",
  bici: "bici",
  gommone: "gommone",
  gommoni: "gommone",
  rib: "gommone",
  dinghy: "gommone",
  barca: "barca",
  barche: "barca",
  boat: "barca",
  "barche-gommoni": "barca",
  "beach-club": "beach_club",
  "beach_club": "beach_club"
};

const emojiMap: Record<VehicleCategorySlug, string> = {
  scooter: "🛵",
  auto: "🚗",
  bici: "🚲",
  gommone: "🚤",
  barca: "🛥️",
  beach_club: "🏖️"
};

function canUseMockFallback() {
  return process.env.NODE_ENV !== "production";
}

export function mapPublicVehicleToVehicleCardModel(row: PublicVehicleListingRow): PublicVehicle | null {
  const category = categoryMap[row.category_slug];
  if (!category) return null;

  return {
    id: row.id,
    category,
    title_it: row.title_it,
    title_en: row.title_en,
    description_it: row.description_it,
    description_en: row.description_en,
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

export async function searchPublicVehicles(params: PublicVehicleQueryParams): Promise<PublicVehicleSearchResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      vehicles: canUseMockFallback() ? filterMockVehicles(params) : [],
      isFallback: canUseMockFallback(),
      error: "Missing Supabase public environment variables."
    };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    const { data, error } = await supabase.rpc("search_public_vehicles", {
      p_category_slug: toDatabaseCategorySlug(params.category_slug),
      p_start_date: params.start_date || null,
      p_end_date: params.end_date || null,
      p_delivery_method: (params.delivery_method && params.delivery_method !== "pickup_point") ? params.delivery_method : null
    });

    if (error) {
      return {
        vehicles: canUseMockFallback() ? filterMockVehicles(params) : [],
        isFallback: canUseMockFallback(),
        error: error.message
      };
    }

    const vehicles = ((data || []) as PublicVehicleListingRow[])
      .map(mapPublicVehicleToVehicleCardModel)
      .filter((vehicle: PublicVehicle | null): vehicle is PublicVehicle => Boolean(vehicle))
      .sort((a, b) => a.price_from - b.price_from);

    return { vehicles, isFallback: false, error: null };
  } catch {
    return {
      vehicles: canUseMockFallback() ? filterMockVehicles(params) : [],
      isFallback: canUseMockFallback(),
      error: "Unable to search public vehicles."
    };
  }
}

export async function getPublicVehicles(params: PublicVehicleQueryParams): Promise<PublicVehicle[]> {
  const result = await searchPublicVehicles(params);
  return result.vehicles;
}

export async function getHomepageCategoryMinPrices(locale: Locale): Promise<HomepageCategoryMinPrices> {
  const result = await searchPublicVehicles({ locale });

  return result.vehicles.reduce<HomepageCategoryMinPrices>((prices, vehicle) => {
    if (!vehicle.is_available || vehicle.price_from <= 0) return prices;

    const current = prices[vehicle.category];
    if (current === undefined || vehicle.price_from < current) {
      prices[vehicle.category] = vehicle.price_from;
    }

    return prices;
  }, {});
}

function filterMockVehicles(params: PublicVehicleQueryParams) {
  return mockVehicles
    .filter((vehicle) => {
      if (!vehicle.is_available) return false;
      if (!params.category_slug || params.category_slug === "all") return true;
      return vehicle.category === categoryMap[params.category_slug];
    })
    .sort((a, b) => a.price_from - b.price_from);
}

function toDatabaseCategorySlug(categorySlug?: string) {
  if (!categorySlug || categorySlug === "all") return null;
  if (categorySlug === "bici") return "bici-elettriche";
  if (categorySlug === "beach_club") return "beach_club";
  // "barca" and "gommone" use their own DB slugs directly
  return categorySlug;
}
