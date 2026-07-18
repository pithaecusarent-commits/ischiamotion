import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHome } from "@/components/site/SiteHome";
import type { Locale } from "@/lib/types";
import { getActivePickupPoints } from "@/lib/supabase/queries/pickup-points";
import { getHomepageCategoryMinPrices } from "@/lib/supabase/queries/public-vehicles";
import { JsonLd } from "@/components/site/JsonLd";
import { canonicalUrl, serviceJsonLd, websiteJsonLd } from "@/lib/seo";

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
    ? "IschiaMotion | Noleggio Scooter, Auto, E-Bike, Barche e Beach / Pool Club a Ischia"
    : "IschiaMotion | Scooter, Car, E-Bike, Boat and Beach / Pool Club Rentals in Ischia";
  const description = isIt
    ? "IschiaMotion è la piattaforma locale a Ischia per richiedere scooter, auto, e-bike, gommoni, barche e Beach / Pool Club tramite partner selezionati."
    : "IschiaMotion is a local platform in Ischia to request scooters, cars, e-bikes, rubber dinghies, boats and Beach / Pool Club experiences through selected local partners.";

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
      canonical: canonicalUrl(`/${params.locale}`),
      languages: {
        it: canonicalUrl("/it"),
        en: canonicalUrl("/en"),
        "x-default": canonicalUrl("/it")
      }
    }
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
        isIt ? "IschiaMotion piattaforma locale per scooter auto e servizi mare a Ischia" : "IschiaMotion local platform for scooters cars and seaside services in Ischia",
        isIt
          ? "IschiaMotion facilita richieste di disponibilità per scooter, auto, e-bike, gommoni, barche e Beach / Pool Club tramite partner selezionati a Ischia."
          : "IschiaMotion facilitates availability requests for scooter rental, car rental, e-bike rental, rubber dinghy rental, boat rental and Beach / Pool Club experiences through selected local partners in Ischia."
      )} />
      <SiteHome locale={params.locale} pickupPoints={pickupPoints} categoryMinPrices={categoryMinPrices} />
    </>
  );
}
