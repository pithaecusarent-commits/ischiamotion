"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale, PublicPickupPoint, PublicVehicle, VehicleFilter } from "@/lib/types";
import { vehicles as mockVehicles } from "@/lib/mock/vehicles";
import { VehicleCard } from "@/components/site/VehicleCard";
import { BookingRequestModal } from "@/components/site/BookingRequestModal";
import { getPublicVehicles } from "@/lib/supabase/queries/public-vehicles";

export function useVehicleFilter() {
  return useState<VehicleFilter>("all");
}

export function VehicleGrid({
  locale,
  active,
  pickupPoints,
  startDate,
  endDate,
  vehicles
}: {
  locale: Locale;
  active: VehicleFilter;
  pickupPoints: PublicPickupPoint[];
  startDate: string;
  endDate: string;
  vehicles?: PublicVehicle[];
}) {
  const [selectedVehicle, setSelectedVehicle] = useState<PublicVehicle | null>(null);
  const [vehicleList, setVehicleList] = useState(vehicles?.length ? vehicles : mockVehicles);

  useEffect(() => {
    let isMounted = true;
    const categorySlug = active === "scooter"
      ? "scooter"
      : active === "auto"
        ? "auto"
        : active === "bici"
          ? "bici-elettriche"
          : active === "barca"
            ? "barche-gommoni"
            : undefined;

    getPublicVehicles({
      locale,
      category_slug: categorySlug,
      start_date: startDate,
      end_date: endDate
    }).then((nextVehicles) => {
      if (isMounted && nextVehicles.length > 0) {
        setVehicleList(nextVehicles);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [active, endDate, locale, startDate]);

  const filtered = useMemo(
    () => vehicleList.filter((vehicle) => vehicle.is_available).sort((a, b) => a.price_from - b.price_from),
    [vehicleList]
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
            <div className="section-eyebrow">{locale === "it" ? "Richiesta disponibilità" : "Availability request"}</div>
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
