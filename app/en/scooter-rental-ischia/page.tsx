import type { Metadata } from "next";
import { ScooterLanding } from "@/components/site/ScooterLanding";
import { getActivePickupPoints } from "@/lib/supabase/queries/pickup-points";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Scooter rental Ischia | IschiaMotion",
  description: "Request scooter rental availability in Ischia through selected local rental partners, with pickup points in Ischia Port, Forio and other island areas.",
  alternates: {
    canonical: "/en/scooter-rental-ischia",
    languages: {
      it: "/it/noleggio-scooter-ischia",
      en: "/en/scooter-rental-ischia"
    }
  }
};

export default async function EnglishScooterRentalPage() {
  const pickupPoints = await getActivePickupPoints();
  return <ScooterLanding locale="en" pickupPoints={pickupPoints} />;
}
