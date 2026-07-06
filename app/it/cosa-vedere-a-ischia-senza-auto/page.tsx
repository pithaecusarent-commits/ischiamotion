import type { Metadata } from "next";
import { IschiaNoCarGuide } from "@/components/site/IschiaNoCarGuide";
import { canonicalUrl } from "@/lib/seo";

const title = "Cosa vedere a Ischia senza auto: itinerario e come muoversi";
const description = "Scopri cosa vedere a Ischia senza auto: Ischia Porto, Forio, Sant’Angelo, Maronti, Castello Aragonese e spiagge. Consigli pratici su scooter, auto, bus e barche.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: canonicalUrl("/it/cosa-vedere-a-ischia-senza-auto"),
    languages: {
      it: canonicalUrl("/it/cosa-vedere-a-ischia-senza-auto"),
      en: canonicalUrl("/en/what-to-see-in-ischia-without-a-car"),
      "x-default": canonicalUrl("/it/cosa-vedere-a-ischia-senza-auto")
    }
  },
  openGraph: {
    title,
    description,
    url: canonicalUrl("/it/cosa-vedere-a-ischia-senza-auto"),
    siteName: "IschiaMotion",
    type: "website",
    locale: "it_IT",
    images: [{ url: "/images/ischiamotion-logo.png", alt: "Cosa vedere a Ischia senza auto - IschiaMotion" }]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/ischiamotion-logo.png"]
  }
};

export default function CosaVedereAIschiaSenzaAutoPage() {
  return <IschiaNoCarGuide locale="it" />;
}
