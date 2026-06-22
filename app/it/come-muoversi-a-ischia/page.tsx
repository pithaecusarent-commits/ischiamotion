import type { Metadata } from "next";
import { GettingAroundLanding } from "@/components/site/GettingAroundLanding";

const title = "Come muoversi a Ischia | IschiaMotion";
const description = "Guida a scooter, auto, e-bike, bus, taxi, barche e gommoni per muoversi a Ischia tra porti, spiagge e comuni.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/it/come-muoversi-a-ischia",
    languages: { it: "/it/come-muoversi-a-ischia", en: "/en/how-to-get-around-ischia", "x-default": "/it/come-muoversi-a-ischia" }
  },
  openGraph: { title, description, url: "/it/come-muoversi-a-ischia", siteName: "IschiaMotion", type: "website", locale: "it_IT", images: [{ url: "/images/ischiamotion-logo.png", alt: "Come muoversi a Ischia - IschiaMotion" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/images/ischiamotion-logo.png"] }
};

export default function ComeMuoversiAIschiaPage() {
  return <GettingAroundLanding locale="it" />;
}
