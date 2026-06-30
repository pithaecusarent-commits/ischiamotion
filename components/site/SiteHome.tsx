import type { Locale, PublicPickupPoint } from "@/lib/types";
import { Header } from "@/components/site/Header";
import { HomeHero } from "@/components/site/HomeHero";
import { TrustBar } from "@/components/site/TrustBar";
import { PickupPointsSection } from "@/components/site/PickupPointsSection";
import { ExperienceSection } from "@/components/site/ExperienceSection";
import { SeoExperiences } from "@/components/site/SeoExperiences";
import { HowItWorks } from "@/components/site/HowItWorks";
import { TrustpilotReviewBox } from "@/components/site/TrustpilotReviewBox";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import { RevealObserver } from "@/components/site/RevealObserver";
import type { HomepageCategoryMinPrices } from "@/lib/supabase/queries/public-vehicles";

export function SiteHome({
  locale,
  pickupPoints,
  categoryMinPrices = {}
}: {
  locale: Locale;
  pickupPoints: PublicPickupPoint[];
  categoryMinPrices?: HomepageCategoryMinPrices;
}) {
  return (
    <>
      <Header locale={locale} />
      <main>
        <HomeHero locale={locale} pickupPoints={pickupPoints} categoryMinPrices={categoryMinPrices} />
        <section className="brand-intro reveal" aria-labelledby="brand-intro-title">
          <div className="section-eyebrow">{locale === "it" ? "Il brand locale" : "The local platform"}</div>
          <h2 id="brand-intro-title">{locale === "it" ? "Cos’è IschiaMotion" : "What IschiaMotion is"}</h2>
          {locale === "it" ? (
            <>
              <p>
                <a href="/it/ischiamotion">IschiaMotion</a> è una piattaforma locale di Ischia dedicata alla mobilità turistica e ai servizi mare.
                Aiutiamo turisti e visitatori a richiedere disponibilità per scooter, auto, e-bike, gommoni e beach club tramite partner locali
                selezionati sull&apos;isola.
              </p>
              <p>
                IschiaMotion raccoglie la tua richiesta e verifica disponibilità, condizioni e conferma con partner locali selezionati
                sull&apos;isola. Offre così un punto di contatto rapido, chiaro e locale attraverso il sito ufficiale{" "}
                <a href="/it">ischiamotion.com/it</a>.
              </p>
              <p>
                Esplora il <a href="/it/noleggio-scooter-ischia">noleggio scooter a Ischia</a>, il{" "}
                <a href="/it/noleggio-auto-ischia">noleggio auto a Ischia</a>, il{" "}
                <a href="/it/noleggio-bici-elettriche-ischia">noleggio e-bike a Ischia</a> e le opzioni per{" "}
                <a href="/it/noleggio-gommoni-ischia">gommoni</a> o <a href="/it/noleggio-barche-ischia">barche</a>.
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
            </>
          )}
        </section>
        <PickupPointsSection locale={locale} pickupPoints={pickupPoints} />
        <ExperienceSection locale={locale} />
        <SeoExperiences locale={locale} />
        <HowItWorks locale={locale} />
        <TrustBar locale={locale} />
        <TrustpilotReviewBox locale={locale} />
        <FinalCTA locale={locale} />
      </main>
      <WhatsAppCTA locale={locale} />
      <Footer locale={locale} />
      <RevealObserver />
    </>
  );
}
