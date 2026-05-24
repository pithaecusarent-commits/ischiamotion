"use client";

import { useEffect } from "react";
import { useState } from "react";
import type { BookingDeliveryMethod, Locale, PublicPickupPoint } from "@/lib/types";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { TrustBar } from "@/components/site/TrustBar";
import { VehicleGrid, useVehicleFilter } from "@/components/site/VehicleGrid";
import { PickupPointsSection } from "@/components/site/PickupPointsSection";
import { ExperienceSection } from "@/components/site/ExperienceSection";
import { SeoExperiences } from "@/components/site/SeoExperiences";
import { HowItWorks } from "@/components/site/HowItWorks";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import { pickupPoints as mockPickupPoints } from "@/lib/mock/pickup-points";

export function SiteHome({
  locale,
  pickupPoints = mockPickupPoints
}: {
  locale: Locale;
  pickupPoints?: PublicPickupPoint[];
}) {
  const [activeFilter, setActiveFilter] = useVehicleFilter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<BookingDeliveryMethod>("pickup_point");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header locale={locale} />
      <main>
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
        <VehicleGrid locale={locale} active={activeFilter} onCategoryChange={setActiveFilter} />
        <PickupPointsSection locale={locale} pickupPoints={pickupPoints} />
        <ExperienceSection locale={locale} />
        <SeoExperiences locale={locale} />
        <HowItWorks locale={locale} />
        <TrustBar locale={locale} />
        <FinalCTA locale={locale} />
      </main>
      <WhatsAppCTA locale={locale} />
      <Footer locale={locale} />
    </>
  );
}
