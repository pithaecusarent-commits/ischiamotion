import type { Metadata } from "next";
import { ScooterLanding } from "@/components/site/ScooterLanding";
import { getActivePickupPoints } from "@/lib/supabase/queries/pickup-points";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Noleggio Scooter Ischia | Prenota scooter sull’isola",
  description: "Richiedi disponibilità per noleggio scooter a Ischia tramite partner selezionati: Ischia Porto, spiagge, borghi, casco, patente e conferma dopo verifica.",
  alternates: {
    canonical: "/it/noleggio-scooter-ischia",
    languages: {
      it: "/it/noleggio-scooter-ischia",
      en: "/en/scooter-rental-ischia",
      "x-default": "/it"
    }
  }
};

export default async function ItalianScooterRentalPage() {
  const pickupPoints = await getActivePickupPoints();
  return <ScooterLanding locale="it" pickupPoints={pickupPoints} />;
}
