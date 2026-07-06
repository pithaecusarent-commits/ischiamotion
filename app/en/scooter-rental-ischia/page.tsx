import type { Metadata } from "next";
import { ScooterLanding } from "@/components/site/ScooterLanding";
import { canonicalUrl } from "@/lib/seo";
import { getActivePickupPoints } from "@/lib/supabase/queries/pickup-points";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Scooter rental in Ischia | IschiaMotion",
  description: "Request a scooter in Ischia. Check availability, prices, helmets and pickup through selected local partners.",
  alternates: {
    canonical: canonicalUrl("/en/scooter-rental-ischia"),
    languages: {
      it: canonicalUrl("/it/noleggio-scooter-ischia"),
      en: canonicalUrl("/en/scooter-rental-ischia"),
      "x-default": canonicalUrl("/it/noleggio-scooter-ischia")
    }
  },
  openGraph: {
    title: "Scooter rental in Ischia | IschiaMotion",
    description: "Request a scooter in Ischia. Check availability, prices, helmets and pickup through selected local partners.",
    url: canonicalUrl("/en/scooter-rental-ischia"),
    siteName: "IschiaMotion",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/ischiamotion-logo.png", alt: "Scooter rental in Ischia through local partners" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Scooter rental in Ischia | IschiaMotion",
    description: "Request a scooter in Ischia. Check availability, prices, helmets and pickup through selected local partners.",
    images: ["/images/ischiamotion-logo.png"]
  }
};

export default async function EnglishScooterRentalPage() {
  const pickupPoints = await getActivePickupPoints();
  return <ScooterLanding locale="en" pickupPoints={pickupPoints} />;
}
