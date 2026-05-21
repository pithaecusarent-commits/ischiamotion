import type { Metadata } from "next";
import { ScooterLanding } from "@/components/site/ScooterLanding";
import { getActivePickupPoints } from "@/lib/supabase/queries/pickup-points";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Noleggio scooter Ischia | IschiaMotion",
  description: "Noleggio scooter Ischia con richiesta online e punti ritiro IschiaMotion a Porto d’Ischia, Forio, Casamicciola, Sant’Angelo e Barano.",
  alternates: {
    canonical: "/it/noleggio-scooter-ischia",
    languages: {
      it: "/it/noleggio-scooter-ischia",
      en: "/en/scooter-rental-ischia"
    }
  }
};

export default async function ItalianScooterRentalPage() {
  const pickupPoints = await getActivePickupPoints();
  return <ScooterLanding locale="it" pickupPoints={pickupPoints} />;
}
