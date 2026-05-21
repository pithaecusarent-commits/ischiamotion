import type { Metadata } from "next";
import { ScooterLanding } from "@/components/site/ScooterLanding";
import { getActivePickupPoints } from "@/lib/supabase/queries/pickup-points";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Scooter rental Ischia | IschiaMotion",
  description: "Scooter rental Ischia with online requests and branded IschiaMotion pickup points in Ischia Port, Forio, Casamicciola, Sant’Angelo and Barano.",
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
