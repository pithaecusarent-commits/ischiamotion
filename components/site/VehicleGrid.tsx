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
  onCategoryChange,
  vehicles: suppliedVehicles
}: {
  locale: Locale;
  active: VehicleFilter;
  onCategoryChange: (category: VehicleFilter) => void;
  vehicles?: PublicVehicle[];
}) {
  const sourceVehicles = useMemo(
    () => suppliedVehicles ?? (process.env.NODE_ENV !== "production" ? vehicles : []),
    [suppliedVehicles]
  );
  const filtered = useMemo(
    () => sourceVehicles.filter((vehicle) => vehicle.is_available),
    [sourceVehicles]
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
          <div className="section-eyebrow">{locale === "it" ? "Noleggio a Ischia tramite partner" : "Rental in Ischia via partners"}</div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: locale === "it" ? "Scooter, auto,<br><em>e-bike e barche</em>" : "Scooters, cars,<br><em>e-bikes and boats</em>" }} />
        </div>
        <a href="#prenota" className="see-all">{locale === "it" ? "Richiedi disponibilità →" : "Request availability →"}</a>
      </div>

      {filtered.length > 0 ? (
        <div className="vehicles-grid">
          {filtered.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} locale={locale} visible={visibleIds.has(vehicle.id)} onBook={handleBook} />
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-ink/10 bg-white/75 p-8 text-center shadow-card">
          <h3 className="font-serif text-3xl font-bold">
            {locale === "it" ? "Mezzi in verifica" : "Vehicles under review"}
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-ink/60">
            {locale === "it"
              ? "Al momento non ci sono mezzi disponibili da mostrare. Prova a inviare una richiesta o scrivici su WhatsApp per verificare le opzioni con i partner locali."
              : "No vehicles are currently available to show. Send a request or message us on WhatsApp to check options with local partners."}
          </p>
          <a href="#prenota" className="primary-btn mt-5 inline-flex">
            {locale === "it" ? "Imposta una richiesta" : "Set a request"}
          </a>
        </div>
      )}
    </section>
  );
}
