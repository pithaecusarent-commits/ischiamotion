import type { PublicVehicle } from "@/lib/types";

export const vehicles: PublicVehicle[] = [
  {
    id: "veh-scooter-125",
    category: "scooter",
    title_it: "Scooter 125",
    title_en: "125cc Scooter",
    location_it: "Porto d'Ischia",
    location_en: "Ischia Port",
    price_from: 32,
    features_it: ["2 caschi", "Consumi bassi"],
    features_en: ["2 helmets", "Low fuel use"],
    emoji: "🛵",
    is_available: true
  },
  {
    id: "veh-city-car",
    category: "auto",
    title_it: "Auto",
    title_en: "Car",
    location_it: "Forio",
    location_en: "Forio",
    price_from: 55,
    features_it: ["A/C", "Perfetta per coppie"],
    features_en: ["A/C", "Perfect for couples"],
    emoji: "🚗",
    is_available: true
  },
  {
    id: "veh-rib-5",
    category: "barca",
    title_it: "Gommone",
    title_en: "RIB / Dinghy",
    location_it: "Casamicciola",
    location_en: "Casamicciola",
    price_from: 115,
    features_it: ["Senza patente", "Costa libera"],
    features_en: ["No license", "Free coast"],
    emoji: "🛥️",
    is_available: true
  },
  {
    id: "veh-ebike",
    title_it: "E-bike",
    title_en: "E-bike",
    category: "bici",
    location_it: "Ischia Ponte",
    location_en: "Ischia Ponte",
    price_from: 22,
    features_it: ["Autonomia 70km", "Green"],
    features_en: ["70km range", "Green"],
    emoji: "🚲",
    is_available: true
  },
  {
    id: "veh-open-7",
    category: "barca",
    title_it: "Barca",
    title_en: "Boat",
    location_it: "Sant'Angelo",
    location_en: "Sant'Angelo",
    price_from: 190,
    features_it: ["Premium", "Full day"],
    features_en: ["Premium", "Full day"],
    emoji: "🚤",
    is_available: true
  },
  {
    id: "veh-skipper-1",
    category: "skipper",
    title_it: "Barca con skipper",
    title_en: "Boat with skipper",
    location_it: "Porto d'Ischia",
    location_en: "Ischia Port",
    price_from: 260,
    features_it: ["Skipper incluso", "Itinerario personalizzato", "Esperienza premium"],
    features_en: ["Skipper included", "Custom itinerary", "Premium experience"],
    emoji: "⛵",
    is_available: true
  }
];
