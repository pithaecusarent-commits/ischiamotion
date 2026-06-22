import type { Metadata } from "next";
import { ScooterLanding } from "@/components/site/ScooterLanding";
import { getActivePickupPoints } from "@/lib/supabase/queries/pickup-points";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Noleggio scooter a Ischia | IschiaMotion",
  description: "Richiedi uno scooter a Ischia. Verifica disponibilità, prezzi, casco e ritiro tramite partner locali selezionati.",
  alternates: {
    canonical: "/it/noleggio-scooter-ischia",
    languages: {
      it: "/it/noleggio-scooter-ischia",
      en: "/en/scooter-rental-ischia",
      "x-default": "/it/noleggio-scooter-ischia"
    }
  },
  openGraph: {
    title: "Noleggio scooter a Ischia | IschiaMotion",
    description: "Richiedi uno scooter a Ischia. Verifica disponibilità, prezzi, casco e ritiro tramite partner locali selezionati.",
    url: "/it/noleggio-scooter-ischia",
    siteName: "IschiaMotion",
    type: "website",
    locale: "it_IT",
    images: [{ url: "/images/ischiamotion-logo.png", alt: "Noleggio scooter a Ischia tramite partner locali" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Noleggio scooter a Ischia | IschiaMotion",
    description: "Richiedi uno scooter a Ischia. Verifica disponibilità, prezzi, casco e ritiro tramite partner locali selezionati.",
    images: ["/images/ischiamotion-logo.png"]
  }
};

export default async function ItalianScooterRentalPage() {
  const pickupPoints = await getActivePickupPoints();
  return <ScooterLanding locale="it" pickupPoints={pickupPoints} />;
}
