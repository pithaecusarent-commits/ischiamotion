"use client";

import { useEffect } from "react";
import { useState } from "react";
import type { Locale } from "@/lib/types";
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
import { pickupPoints as mockPickupPoints } from "@/lib/mock/pickup-points";
import type { PublicPickupPoint } from "@/lib/types";

export function SiteHome({ locale, pickupPoints = mockPickupPoints }: { locale: Locale; pickupPoints?: PublicPickupPoint[] }) {
  const [activeFilter, setActiveFilter] = useVehicleFilter();
  const [startDate, setStartDate] = useState("2026-06-15");
  const [endDate, setEndDate] = useState("2026-06-20");

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
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <VehicleGrid locale={locale} active={activeFilter} pickupPoints={pickupPoints} startDate={startDate} endDate={endDate} />
        <PickupPointsSection locale={locale} pickupPoints={pickupPoints} />
        <ExperienceSection locale={locale} />
        <SeoExperiences locale={locale} />
        <HowItWorks locale={locale} />
        <TrustBar locale={locale} />
        <FinalCTA locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
