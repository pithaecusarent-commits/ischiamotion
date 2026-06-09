import type { Metadata } from "next";
import { ScooterLanding } from "@/components/site/ScooterLanding";
import { getActivePickupPoints } from "@/lib/supabase/queries/pickup-points";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Noleggio Scooter a Ischia | Partner locali IschiaMotion",
  description: "Richiedi uno scooter a Ischia tramite partner locali selezionati. Verifica disponibilità, ritiro, casco e condizioni prima della conferma.",
  alternates: {
    canonical: "/it/noleggio-scooter-ischia",
    languages: {
      it: "/it/noleggio-scooter-ischia",
      en: "/en/scooter-rental-ischia",
      "x-default": "/it/noleggio-scooter-ischia"
    }
  },
  openGraph: {
    title: "Noleggio Scooter a Ischia | Partner locali IschiaMotion",
    description: "Richiedi uno scooter a Ischia tramite partner locali selezionati. Verifica disponibilità, ritiro, casco e condizioni prima della conferma.",
    url: "/it/noleggio-scooter-ischia",
    siteName: "IschiaMotion",
    type: "website",
    locale: "it_IT",
    images: [{ url: "/images/ischiamotion-logo.png", alt: "Noleggio scooter a Ischia tramite partner locali" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Noleggio Scooter a Ischia | Partner locali IschiaMotion",
    description: "Richiedi uno scooter a Ischia tramite partner locali selezionati. Verifica disponibilità, ritiro, casco e condizioni prima della conferma.",
    images: ["/images/ischiamotion-logo.png"]
  }
};

export default async function ItalianScooterRentalPage() {
  const pickupPoints = await getActivePickupPoints();
  return <ScooterLanding locale="it" pickupPoints={pickupPoints} />;
}
