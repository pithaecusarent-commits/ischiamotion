import type { Metadata } from "next";
import { GettingAroundLanding } from "@/components/site/GettingAroundLanding";
import { canonicalUrl } from "@/lib/seo";

const title = "How to get around Ischia | IschiaMotion";
const description = "A guide to scooters, cars, e-bikes, buses, taxis, boats and RIBs for getting around Ischia.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: canonicalUrl("/en/how-to-get-around-ischia"),
    languages: {
      it: canonicalUrl("/it/come-muoversi-a-ischia"),
      en: canonicalUrl("/en/how-to-get-around-ischia"),
      "x-default": canonicalUrl("/it/come-muoversi-a-ischia")
    }
  },
  openGraph: { title, description, url: canonicalUrl("/en/how-to-get-around-ischia"), siteName: "IschiaMotion", type: "website", locale: "en_US", images: [{ url: "/images/ischiamotion-logo.png", alt: "How to get around Ischia - IschiaMotion" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/images/ischiamotion-logo.png"] }
};

export default function HowToGetAroundIschiaPage() {
  return <GettingAroundLanding locale="en" />;
}
