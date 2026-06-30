"use client";

import { useState } from "react";
import type { BookingDeliveryMethod, Locale, PublicPickupPoint, VehicleFilter } from "@/lib/types";
import { Hero } from "@/components/site/Hero";
import { VehicleGrid, useVehicleFilter } from "@/components/site/VehicleGrid";
import type { HomepageCategoryMinPrices } from "@/lib/supabase/queries/public-vehicles";

export function HomeHero({
  locale,
  pickupPoints,
  categoryMinPrices
}: {
  locale: Locale;
  pickupPoints: PublicPickupPoint[];
  categoryMinPrices: HomepageCategoryMinPrices;
}) {
  const [activeFilter, setActiveFilter] = useVehicleFilter();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<BookingDeliveryMethod>("pickup_point");

  return (
    <>
      <Hero
        locale={locale}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        pickupPoints={pickupPoints}
        startDate={startDate}
        endDate={endDate}
        deliveryMethod={deliveryMethod}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onDeliveryMethodChange={setDeliveryMethod}
      />
      <VehicleGrid locale={locale} active={activeFilter} onCategoryChange={setActiveFilter} categoryMinPrices={categoryMinPrices} />
    </>
  );
}
