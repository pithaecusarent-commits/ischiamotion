import { createClient } from "@supabase/supabase-js";
import { pickupPoints as mockPickupPoints } from "@/lib/mock/pickup-points";
import type { PublicPickupPoint } from "@/lib/types";

function canUseMockFallback() {
  return process.env.NODE_ENV !== "production";
}

type PickupPointRow = {
  id: string;
  public_label_it: string;
  public_label_en: string;
  zone: string;
  description_it: string | null;
  description_en: string | null;
  is_active: boolean;
};

function toPublicPickupPoint(row: PickupPointRow): PublicPickupPoint {
  return {
    id: row.id,
    name_it: row.public_label_it,
    name_en: row.public_label_en,
    public_label_it: row.public_label_it,
    public_label_en: row.public_label_en,
    zone: row.zone,
    latitude: null,
    longitude: null,
    description_it: row.description_it,
    description_en: row.description_en,
    is_active: row.is_active
  };
}

export async function getActivePickupPoints(): Promise<PublicPickupPoint[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return canUseMockFallback() ? mockPickupPoints : [];
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    const { data, error } = await supabase
      .from("pickup_points")
      .select("id, public_label_it, public_label_en, zone, description_it, description_en, is_active")
      .eq("is_active", true)
      .order("zone", { ascending: true });

    if (error || !data?.length) {
      return canUseMockFallback() ? mockPickupPoints : [];
    }

    return data.map((row) => toPublicPickupPoint(row as PickupPointRow));
  } catch {
    return canUseMockFallback() ? mockPickupPoints : [];
  }
}
