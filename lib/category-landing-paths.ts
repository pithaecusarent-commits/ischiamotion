import type { Locale, VehicleCategorySlug } from "@/lib/types";

const categoryLandingPaths: Record<Locale, Record<VehicleCategorySlug, string>> = {
  it: {
    scooter: "/it/noleggio-scooter-ischia",
    auto: "/it/noleggio-auto-ischia",
    barca: "/it/noleggio-barche-ischia",
    gommone: "/it/noleggio-gommoni-ischia",
    bici: "/it/noleggio-bici-elettriche-ischia",
    beach_club: "/it/beach-club-ischia"
  },
  en: {
    scooter: "/en/scooter-rental-ischia",
    auto: "/en/car-rental-ischia",
    barca: "/en/boat-rental-ischia",
    gommone: "/en/rubber-dinghy-rental-ischia",
    bici: "/en/e-bike-rental-ischia",
    beach_club: "/en/ischia-beach-club"
  }
};

export function getCategoryLandingPath(locale: Locale, category: VehicleCategorySlug) {
  return categoryLandingPaths[locale][category];
}
