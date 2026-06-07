import type { Metadata } from "next";
import { ScooterLanding } from "@/components/site/ScooterLanding";
import { getActivePickupPoints } from "@/lib/supabase/queries/pickup-points";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Scooter Rental in Ischia | Local Partners | IschiaMotion",
  description: "Request a scooter in Ischia through selected local partners. Check availability, pickup, helmet and conditions before confirmation.",
  alternates: {
    canonical: "/en/scooter-rental-ischia",
    languages: {
      it: "/it/noleggio-scooter-ischia",
      en: "/en/scooter-rental-ischia",
      "x-default": "/it/noleggio-scooter-ischia"
    }
  },
  openGraph: {
    title: "Scooter Rental in Ischia | Local Partners | IschiaMotion",
    description: "Request a scooter in Ischia through selected local partners. Check availability, pickup, helmet and conditions before confirmation.",
    url: "/en/scooter-rental-ischia",
    siteName: "IschiaMotion",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/ischiamotion-logo.png", alt: "Scooter rental in Ischia through local partners" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Scooter Rental in Ischia | Local Partners | IschiaMotion",
    description: "Request a scooter in Ischia through selected local partners. Check availability, pickup, helmet and conditions before confirmation.",
    images: ["/images/ischiamotion-logo.png"]
  }
};

export default async function EnglishScooterRentalPage() {
  const pickupPoints = await getActivePickupPoints();
  return <ScooterLanding locale="en" pickupPoints={pickupPoints} />;
}
