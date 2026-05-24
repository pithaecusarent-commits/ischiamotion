import type { Metadata } from "next";
import { ScooterLanding } from "@/components/site/ScooterLanding";
import { getActivePickupPoints } from "@/lib/supabase/queries/pickup-points";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Noleggio scooter Ischia | IschiaMotion",
  description: "Richiedi disponibilità per noleggio scooter Ischia tramite una rete di noleggiatori selezionati, con punti ritiro a Porto d’Ischia, Forio e altre zone.",
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
