import type { Locale } from "@/lib/types";

export type DeliveryPort = "ischia_porto" | "casamicciola" | "forio";

export type HotelMunicipality =
  | "ischia"
  | "casamicciola_terme"
  | "lacco_ameno"
  | "forio"
  | "serrara_fontana"
  | "barano_ischia";

export const DELIVERY_PORTS: DeliveryPort[] = ["ischia_porto", "casamicciola", "forio"];

export const HOTEL_MUNICIPALITIES: HotelMunicipality[] = [
  "ischia",
  "casamicciola_terme",
  "lacco_ameno",
  "forio",
  "serrara_fontana",
  "barano_ischia"
];

export const portLabels: Record<Locale, Record<DeliveryPort, string>> = {
  it: {
    ischia_porto: "Ischia Porto",
    casamicciola: "Casamicciola",
    forio: "Forio"
  },
  en: {
    ischia_porto: "Ischia Porto",
    casamicciola: "Casamicciola",
    forio: "Forio"
  }
};

export const municipalityLabels: Record<Locale, Record<HotelMunicipality, string>> = {
  it: {
    ischia: "Ischia",
    casamicciola_terme: "Casamicciola Terme",
    lacco_ameno: "Lacco Ameno",
    forio: "Forio",
    serrara_fontana: "Serrara Fontana",
    barano_ischia: "Barano d'Ischia"
  },
  en: {
    ischia: "Ischia",
    casamicciola_terme: "Casamicciola Terme",
    lacco_ameno: "Lacco Ameno",
    forio: "Forio",
    serrara_fontana: "Serrara Fontana",
    barano_ischia: "Barano d'Ischia"
  }
};

export function isValidDeliveryPort(value: string): value is DeliveryPort {
  return (DELIVERY_PORTS as string[]).includes(value);
}

export function isValidHotelMunicipality(value: string): value is HotelMunicipality {
  return (HOTEL_MUNICIPALITIES as string[]).includes(value);
}
