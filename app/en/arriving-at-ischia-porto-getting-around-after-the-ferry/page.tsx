import type { Metadata } from "next";
import { IschiaPortArrivalGuide } from "@/components/site/IschiaPortArrivalGuide";
import { canonicalUrl } from "@/lib/seo";

const title = "Arriving at Ischia Porto: Getting Around After the Ferry";
const description = "Arriving at Ischia Porto by ferry? Discover practical ways to get around the island, including scooters, cars, taxis, buses and local travel options.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: canonicalUrl("/en/arriving-at-ischia-porto-getting-around-after-the-ferry"),
    languages: {
      it: canonicalUrl("/it/arrivare-a-ischia-porto-come-muoversi-dopo-il-traghetto"),
      en: canonicalUrl("/en/arriving-at-ischia-porto-getting-around-after-the-ferry"),
      "x-default": canonicalUrl("/it/arrivare-a-ischia-porto-come-muoversi-dopo-il-traghetto")
    }
  },
  openGraph: {
    title,
    description,
    url: canonicalUrl("/en/arriving-at-ischia-porto-getting-around-after-the-ferry"),
    siteName: "IschiaMotion",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/ischiamotion-logo.png", alt: "Arriving at Ischia Porto - IschiaMotion" }]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/ischiamotion-logo.png"]
  }
};

export default function ArrivingAtIschiaPortoPage() {
  return <IschiaPortArrivalGuide locale="en" />;
}
