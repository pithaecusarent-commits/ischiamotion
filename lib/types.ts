export type Locale = "it" | "en";

export type VehicleCategory = "scooter" | "auto" | "barca" | "bici";

export type Vehicle = {
  id: string;
  category: VehicleCategory;
  title_it: string;
  title_en: string;
  location_it: string;
  location_en: string;
  price_from: number;
  features_it: string[];
  features_en: string[];
  emoji: string;
  is_available: boolean;
};

export type PickupPoint = {
  id: string;
  name_it: string;
  name_en: string;
  zone: string;
  public_label_it: string;
  public_label_en: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
};

export type VehicleFilter = "all" | VehicleCategory;
