"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { BookingDeliveryMethod, Locale, PublicPickupPoint, PublicVehicle, VehicleFilter } from "@/lib/types";
import { Hero } from "@/components/site/Hero";

const VehicleGrid = dynamic(
  () => import("@/components/site/VehicleGrid").then((m) => ({ default: m.VehicleGrid })),
  { ssr: true }
);

export function HomeHero({
  locale,
  pickupPoints,
  vehicles,
  children
}: {
  locale: Locale;
  pickupPoints: PublicPickupPoint[];
  vehicles: PublicVehicle[];
  children: React.ReactNode;
}) {
  const [activeFilter, setActiveFilter] = useState<VehicleFilter>("all");
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
      >
        {children}
      </Hero>
      <VehicleGrid locale={locale} active={activeFilter} onCategoryChange={setActiveFilter} vehicles={vehicles} />
    </>
  );
}
