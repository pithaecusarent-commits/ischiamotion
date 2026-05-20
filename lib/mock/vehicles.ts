import type { Vehicle } from "@/lib/types";

export const vehicles: Vehicle[] = [
  {
    id: "veh-scooter-125",
    category: "scooter",
    title_it: "Vespa 125cc",
    title_en: "Vespa 125cc",
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
    title_it: "Fiat 500 · 4 posti",
    title_en: "Fiat 500 · 4 seats",
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
    title_it: "Gommone 5m",
    title_en: "5m rib",
    location_it: "Casamicciola",
    location_en: "Casamicciola",
    price_from: 115,
    features_it: ["Senza patente", "Costa libera"],
    features_en: ["No license", "Free coast"],
    emoji: "⛵",
    is_available: true
  },
  {
    id: "veh-ebike",
    title_it: "E-Bike City",
    title_en: "City E-Bike",
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
    title_it: "Open 7m · con patente",
    title_en: "Open 7m · license required",
    location_it: "Sant'Angelo",
    location_en: "Sant'Angelo",
    price_from: 190,
    features_it: ["Premium", "Full day"],
    features_en: ["Premium", "Full day"],
    emoji: "🚤",
    is_available: true
  }
];
