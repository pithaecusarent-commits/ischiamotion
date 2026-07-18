"use client";

import { useEffect } from "react";
import { useState } from "react";
import type { BookingDeliveryMethod, Locale, PublicPickupPoint } from "@/lib/types";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { SocialProofSection } from "@/components/site/SocialProofSection";
import { TrustBar } from "@/components/site/TrustBar";
import { VehicleGrid, useVehicleFilter } from "@/components/site/VehicleGrid";
import { ValueProposition } from "@/components/site/ValueProposition";
import { PickupPointsSection } from "@/components/site/PickupPointsSection";
import { ExperienceSection } from "@/components/site/ExperienceSection";
import { SeoExperiences } from "@/components/site/SeoExperiences";
import { HowItWorks } from "@/components/site/HowItWorks";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import { pickupPoints as mockPickupPoints } from "@/lib/mock/pickup-points";
import type { HomepageCategoryMinPrices } from "@/lib/supabase/queries/public-vehicles";

export function SiteHome({
  locale,
  pickupPoints = mockPickupPoints,
  categoryMinPrices = {}
}: {
  locale: Locale;
  pickupPoints?: PublicPickupPoint[];
  categoryMinPrices?: HomepageCategoryMinPrices;
}) {
  const [activeFilter, setActiveFilter] = useVehicleFilter();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<BookingDeliveryMethod>("pickup_point");

  useEffect(() => {
    document.documentElement.classList.add("reveal-observer-ready");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("reveal-observer-ready");
    };
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
        <SocialProofSection locale={locale} />
        <VehicleGrid locale={locale} active={activeFilter} onCategoryChange={setActiveFilter} categoryMinPrices={categoryMinPrices} />
        <ValueProposition locale={locale} />
        <section className="brand-intro reveal" aria-labelledby="brand-intro-title">
          <div className="section-eyebrow">{locale === "it" ? "Il brand locale" : "The local platform"}</div>
          <h2 id="brand-intro-title">{locale === "it" ? "Cos’è IschiaMotion" : "What IschiaMotion is"}</h2>
          {locale === "it" ? (
            <>
              <p>
                <a href="/it/ischiamotion">IschiaMotion</a> è una piattaforma locale di Ischia dedicata alla mobilità turistica e ai servizi mare.
                Aiutiamo turisti e visitatori a richiedere disponibilità per scooter, auto, e-bike, gommoni e Beach / Pool Club tramite partner locali
                selezionati sull’isola.
              </p>
              <p>
                IschiaMotion raccoglie la tua richiesta e verifica disponibilità, condizioni e conferma con partner locali selezionati
                sull’isola. Offre così un punto di contatto rapido, chiaro e locale attraverso il sito ufficiale{" "}
                <a href="/it">ischiamotion.com/it</a>.
              </p>
              <p>
                Esplora il <a href="/it/noleggio-scooter-ischia">noleggio scooter a Ischia</a>, il{" "}
                <a href="/it/noleggio-auto-ischia">noleggio auto a Ischia</a>, il{" "}
                <a href="/it/noleggio-bici-elettriche-ischia">noleggio e-bike a Ischia</a> e le opzioni per{" "}
                <a href="/it/noleggio-gommoni-ischia">gommoni</a> o <a href="/it/noleggio-barche-ischia">barche</a>.
                Se arrivi al porto puoi consultare anche il <a href="/it/noleggio-scooter-ischia-porto">noleggio scooter a Ischia Porto</a>;
                per esigenze specifiche, verifica le opzioni di <a href="/it/noleggio-auto-ischia-senza-carta-di-credito">auto senza carta di credito</a>.
              </p>
            </>
          ) : (
            <>
              <p>
                IschiaMotion is a local marketplace for mobility and marine services across the island of Ischia. We collect availability
                requests and connect visitors with selected local partners.
              </p>
              <p>
                IschiaMotion collects your request and checks availability, conditions and confirmation with selected local partners on
                the island. This makes local mobility and marine-service requests clearer and simpler.
              </p>
              <p>
                Planning a car-free stay? Start with our guide to <a href="/en/where-to-stay-in-ischia-without-a-car">where to stay in Ischia without a car</a>,
                then compare scooter, car and e-bike options for your area.
              </p>
            </>
          )}
        </section>
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
