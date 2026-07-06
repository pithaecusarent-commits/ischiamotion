import type { Metadata } from "next";
import { IschiaPortArrivalGuide } from "@/components/site/IschiaPortArrivalGuide";
import { canonicalUrl } from "@/lib/seo";

const title = "Arrivare a Ischia Porto: come muoversi dopo il traghetto";
const description = "Arrivi a Ischia Porto? Scopri come organizzare gli spostamenti dopo il traghetto, tra scooter, auto, taxi, bus e servizi per visitare l’isola.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: canonicalUrl("/it/arrivare-a-ischia-porto-come-muoversi-dopo-il-traghetto"),
    languages: {
      it: canonicalUrl("/it/arrivare-a-ischia-porto-come-muoversi-dopo-il-traghetto"),
      en: canonicalUrl("/en/arriving-at-ischia-porto-getting-around-after-the-ferry"),
      "x-default": canonicalUrl("/it/arrivare-a-ischia-porto-come-muoversi-dopo-il-traghetto")
    }
  },
  openGraph: {
    title,
    description,
    url: canonicalUrl("/it/arrivare-a-ischia-porto-come-muoversi-dopo-il-traghetto"),
    siteName: "IschiaMotion",
    type: "website",
    locale: "it_IT",
    images: [{ url: "/images/ischiamotion-logo.png", alt: "Arrivare a Ischia Porto - IschiaMotion" }]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/ischiamotion-logo.png"]
  }
};

export default function ArrivareAIschiaPortoPage() {
  return <IschiaPortArrivalGuide locale="it" />;
}
