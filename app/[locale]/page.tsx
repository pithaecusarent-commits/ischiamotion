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
    ? "Noleggio a Ischia: scooter, auto e barche | IschiaMotion"
    : "Ischia rentals: scooters, cars and boats | IschiaMotion";
  const description = isIt
    ? "Richiedi disponibilità per scooter, auto, e-bike, gommoni e barche a Ischia tramite partner locali selezionati."
    : "Request scooters, cars, e-bikes, rubber dinghies and boats in Ischia through selected local partners.";

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
        isIt ? "Noleggio scooter auto barche Ischia tramite marketplace locale" : "Scooter car boat rental Ischia through a local marketplace",
        isIt
          ? "IschiaMotion facilita richieste di disponibilità per noleggio scooter, auto, e-bike, gommoni, barche e Beach Club tramite partner selezionati a Ischia."
          : "IschiaMotion facilitates availability requests for scooter rental, car rental, e-bike rental, rubber dinghy rental, boat rental and Beach Clubs through selected local partners in Ischia."
      )} />
      <SiteHome locale={params.locale} pickupPoints={pickupPoints} categoryMinPrices={categoryMinPrices} />
    </>
  );
}
