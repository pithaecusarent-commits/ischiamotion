import type { Locale } from "@/lib/types";

export const NAUTICAL_CATEGORY_SLUGS = ["gommone", "barca"] as const;

export function isNauticalCategory(slug: string | undefined | null): boolean {
  if (!slug) return false;
  return (NAUTICAL_CATEGORY_SLUGS as readonly string[]).includes(slug);
}

export function isBeachClubCategory(slug: string | undefined | null): boolean {
  return slug === "beach_club";
}

export type VehicleSearchMode = "standard" | "nautical" | "beach_club";

export function getSearchMode(slug: string | undefined | null): VehicleSearchMode {
  if (isNauticalCategory(slug)) return "nautical";
  if (isBeachClubCategory(slug)) return "beach_club";
  return "standard";
}

// Short label used in the booking request modal / summary. The search-form field
// ("Modalità ritiro / consegna") uses its own longer wording for the standard case.
export function searchModeSummaryLabel(mode: VehicleSearchMode, locale: Locale): string {
  if (mode === "nautical") return locale === "it" ? "Porto di partenza" : "Departure port";
  if (mode === "beach_club") return locale === "it" ? "Località" : "Location";
  return locale === "it" ? "Ritiro/consegna" : "Pickup/delivery";
}
