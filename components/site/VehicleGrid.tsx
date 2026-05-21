"use client";

import { useMemo, useState } from "react";
import type { Locale, PublicPickupPoint, PublicVehicle, VehicleFilter } from "@/lib/types";
import { vehicles } from "@/lib/mock/vehicles";
import { VehicleCard } from "@/components/site/VehicleCard";
import { BookingRequestModal } from "@/components/site/BookingRequestModal";

export function useVehicleFilter() {
  return useState<VehicleFilter>("all");
}

export function VehicleGrid({
  locale,
  active,
  pickupPoints,
  startDate,
  endDate
}: {
  locale: Locale;
  active: VehicleFilter;
  pickupPoints: PublicPickupPoint[];
  startDate: string;
  endDate: string;
}) {
  const [selectedVehicle, setSelectedVehicle] = useState<PublicVehicle | null>(null);
  const filtered = useMemo(
    () => vehicles.filter((vehicle) => vehicle.is_available),
    []
  );
  const visibleIds = useMemo(
    () => new Set(filtered.filter((vehicle) => active === "all" || vehicle.category === active).map((vehicle) => vehicle.id)),
    [active, filtered]
  );

  return (
    <>
      <section className="section reveal" id="veicoli">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">{locale === "it" ? "Disponibili ora" : "Available now"}</div>
            <h2 className="section-title" dangerouslySetInnerHTML={{ __html: locale === "it" ? "Scegli il tuo<br><em>mezzo perfetto</em>" : "Choose your<br><em>perfect ride</em>" }} />
          </div>
          <a href="#prenota" className="see-all">{locale === "it" ? "Vedi tutti →" : "View all →"}</a>
        </div>

        <div className="vehicles-grid">
          {filtered.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} locale={locale} visible={visibleIds.has(vehicle.id)} onBook={setSelectedVehicle} />
          ))}
        </div>
      </section>
      <BookingRequestModal locale={locale} vehicle={selectedVehicle} pickupPoints={pickupPoints} startDate={startDate} endDate={endDate} onClose={() => setSelectedVehicle(null)} />
    </>
  );
}
