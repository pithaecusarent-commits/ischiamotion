import type { Metadata } from "next";
import { GettingAroundLanding } from "@/components/site/GettingAroundLanding";

const title = "How to get around Ischia | IschiaMotion";
const description = "A guide to scooters, cars, e-bikes, buses, taxis, boats and RIBs for getting around Ischia.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/en/how-to-get-around-ischia",
    languages: { it: "/it/come-muoversi-a-ischia", en: "/en/how-to-get-around-ischia", "x-default": "/it/come-muoversi-a-ischia" }
  },
  openGraph: { title, description, url: "/en/how-to-get-around-ischia", siteName: "IschiaMotion", type: "website", locale: "en_US", images: [{ url: "/images/ischiamotion-logo.png", alt: "How to get around Ischia - IschiaMotion" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/images/ischiamotion-logo.png"] }
};

export default function HowToGetAroundIschiaPage() {
  return <GettingAroundLanding locale="en" />;
}
