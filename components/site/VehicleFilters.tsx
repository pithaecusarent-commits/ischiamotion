"use client";

import type { Locale, VehicleFilter } from "@/lib/types";

const labels: Record<Locale, Record<VehicleFilter, string>> = {
  it: {
    all: "Tutti",
    scooter: "🛵 Scooter",
    auto: "🚗 Auto",
    gommone: "🚤 Gommone",
    barca: "🛥️ Barca",
    bici: "🚲 Bici",
    beach_club: "🏖️ Beach Club"
  },
  en: {
    all: "All",
    scooter: "🛵 Scooter",
    auto: "🚗 Cars",
    gommone: "🚤 Rubber dinghy",
    barca: "🛥️ Boats",
    bici: "🚲 E-bikes",
    beach_club: "🏖️ Beach Club"
  }
};

export function VehicleFilters({
  locale,
  active,
  onChange
}: {
  locale: Locale;
  active: VehicleFilter;
  onChange: (filter: VehicleFilter) => void;
}) {
  const filters: VehicleFilter[] = ["all", "scooter", "auto", "gommone", "barca", "bici", "beach_club"];

  return (
    <div className="pills" aria-label={locale === "it" ? "Categorie veicolo" : "Vehicle categories"}>
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onChange(filter)}
          className={`pill ${active === filter ? "active" : ""}`}
          data-filter={filter}
        >
          {labels[locale][filter]}
        </button>
      ))}
    </div>
  );
}
