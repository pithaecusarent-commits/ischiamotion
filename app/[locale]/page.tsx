import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHome } from "@/components/site/SiteHome";
import type { Locale } from "@/lib/types";
import { getActivePickupPoints } from "@/lib/supabase/queries/pickup-points";
import { getHomepageCategoryMinPrices } from "@/lib/supabase/queries/public-vehicles";
import { JsonLd } from "@/components/site/JsonLd";
import { serviceJsonLd, websiteJsonLd } from "@/lib/seo";

type Props = { params: { locale: Locale } };
const locales: Locale[] = ["it", "en"];

export const revalidate = 300;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: Props): Metadata {
  if (!locales.includes(params.locale)) notFound();
  const isIt = params.locale === "it";
  const title = isIt
    ? "Noleggio Ischia: Scooter, Auto, E-Bike e Barche | IschiaMotion"
    : "Scooter, Car, E-bike & Boat Rental in Ischia | IschiaMotion";
  const description = isIt
    ? "Cerchi noleggi a Ischia? Richiedi disponibilità per scooter, auto, e-bike, gommoni e barche tramite partner locali selezionati."
    : "Request availability for scooters, cars, e-bikes and boats in Ischia through local partners. Receive quick confirmation when available.";

  return {
    title,
    description,
    openGraph: {
      title,
      description
    },
    twitter: {
      title,
      description
    },
    alternates: {
      canonical: `/${params.locale}`,
      languages: { it: "/it", en: "/en", "x-default": "/it" }
    },
    keywords: isIt
      ? ["noleggio Ischia", "noleggio veicoli Ischia", "noleggio scooter Ischia", "noleggio auto Ischia", "noleggio e-bike Ischia", "noleggio gommoni Ischia", "noleggio barche Ischia", "Beach Club Ischia"]
      : ["vehicle rental Ischia", "scooter rental Ischia", "car rental Ischia", "e-bike rental Ischia", "rubber dinghy rental Ischia", "boat rental Ischia", "Ischia Beach Club"]
  };
}

export default async function LocaleHome({ params }: Props) {
  if (!locales.includes(params.locale)) notFound();
  const [pickupPoints, categoryMinPrices] = await Promise.all([
    getActivePickupPoints(),
    getHomepageCategoryMinPrices(params.locale)
  ]);
  const isIt = params.locale === "it";

  return (
    <>
      <JsonLd data={websiteJsonLd(params.locale)} />
      <JsonLd data={serviceJsonLd(
        params.locale,
        `/${params.locale}`,
        isIt ? "Noleggio scooter auto barche Ischia tramite marketplace locale" : "Scooter car boat rental Ischia through a local marketplace",
        isIt
          ? "IschiaMotion facilita richieste di disponibilità per noleggio scooter, auto, e-bike, gommoni, barche e Beach Club tramite partner selezionati a Ischia."
          : "IschiaMotion facilitates availability requests for scooter rental, car rental, e-bike rental, rubber dinghy rental, boat rental and Beach Clubs through selected local partners in Ischia."
      )} />
      <SiteHome locale={params.locale} pickupPoints={pickupPoints} categoryMinPrices={categoryMinPrices} />
    </>
  );
}
