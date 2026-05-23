"use client";

import { useMemo, useState } from "react";
import type { Locale, PublicVehicle, VehicleFilter } from "@/lib/types";
import { vehicles } from "@/lib/mock/vehicles";
import { VehicleCard } from "@/components/site/VehicleCard";

export function useVehicleFilter() {
  return useState<VehicleFilter>("all");
}

export function VehicleGrid({
  locale,
  active,
  onCategoryChange
}: {
  locale: Locale;
  active: VehicleFilter;
  onCategoryChange: (category: VehicleFilter) => void;
}) {
  const filtered = useMemo(
    () => vehicles.filter((vehicle) => vehicle.is_available),
    []
  );
  const visibleIds = useMemo(
    () => new Set(filtered.filter((vehicle) => active === "all" || vehicle.category === active).map((vehicle) => vehicle.id)),
    [active, filtered]
  );

  function handleBook(vehicle: PublicVehicle) {
    onCategoryChange(vehicle.category);
    document.getElementById("prenota")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="section reveal" id="veicoli">
      <div className="section-header">
        <div>
          <div className="section-eyebrow">{locale === "it" ? "Richiesta disponibilità" : "Availability request"}</div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: locale === "it" ? "Scegli il tuo<br><em>mezzo perfetto</em>" : "Choose your<br><em>perfect ride</em>" }} />
        </div>
        <a href="#prenota" className="see-all">{locale === "it" ? "Vedi tutti →" : "View all →"}</a>
      </div>

      <div className="vehicles-grid">
        {filtered.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} locale={locale} visible={visibleIds.has(vehicle.id)} onBook={handleBook} />
        ))}
      </div>
    </section>
  );
}
