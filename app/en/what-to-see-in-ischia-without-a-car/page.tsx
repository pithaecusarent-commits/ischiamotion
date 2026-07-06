import type { Metadata } from "next";
import { IschiaNoCarGuide } from "@/components/site/IschiaNoCarGuide";
import { canonicalUrl } from "@/lib/seo";

const title = "What to See in Ischia Without a Car: Itinerary and Getting Around";
const description = "Discover what to see in Ischia without a car: Ischia Porto, Forio, Sant’Angelo, Maronti, Aragonese Castle and beaches. Practical tips on scooters, cars, buses and boats.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: canonicalUrl("/en/what-to-see-in-ischia-without-a-car"),
    languages: {
      it: canonicalUrl("/it/cosa-vedere-a-ischia-senza-auto"),
      en: canonicalUrl("/en/what-to-see-in-ischia-without-a-car"),
      "x-default": canonicalUrl("/it/cosa-vedere-a-ischia-senza-auto")
    }
  },
  openGraph: {
    title,
    description,
    url: canonicalUrl("/en/what-to-see-in-ischia-without-a-car"),
    siteName: "IschiaMotion",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/ischiamotion-logo.png", alt: "What to see in Ischia without a car - IschiaMotion" }]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/ischiamotion-logo.png"]
  }
};

export default function WhatToSeeInIschiaWithoutACarPage() {
  return <IschiaNoCarGuide locale="en" />;
}
