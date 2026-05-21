import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHome } from "@/components/site/SiteHome";
import type { Locale } from "@/lib/types";
import { getActivePickupPoints } from "@/lib/supabase/queries/pickup-points";

type Props = { params: { locale: Locale } };
const locales: Locale[] = ["it", "en"];

export const revalidate = 300;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: Props): Metadata {
  if (!locales.includes(params.locale)) notFound();
  const isIt = params.locale === "it";
  return {
    title: isIt ? "Noleggio veicoli Ischia | IschiaMotion" : "Vehicle rental Ischia | IschiaMotion",
    description: isIt
      ? "Noleggia scooter, auto, bici elettriche e barche a Ischia. Prenota online, ritira sull'isola e vivi ogni angolo al tuo ritmo."
      : "Rent scooters, cars, e-bikes and boats in Ischia. Book online, pick up on the island and explore at your own pace.",
    alternates: {
      canonical: `/${params.locale}`,
      languages: { it: "/it", en: "/en" }
    },
    keywords: isIt
      ? ["noleggio veicoli Ischia", "noleggio scooter Ischia", "noleggio auto Ischia"]
      : ["vehicle rental Ischia", "scooter rental Ischia", "car rental Ischia"]
  };
}

export default async function LocaleHome({ params }: Props) {
  if (!locales.includes(params.locale)) notFound();
  const pickupPoints = await getActivePickupPoints();
  return <SiteHome locale={params.locale} pickupPoints={pickupPoints} />;
}
