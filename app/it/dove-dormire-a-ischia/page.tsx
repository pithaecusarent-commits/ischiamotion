import type { Metadata } from "next";
import { WhereToStayLanding } from "@/components/site/WhereToStayLanding";

export const metadata: Metadata = {
  title: "Dove dormire a Ischia e come muoversi sull'isola | IschiaMotion",
  description: "Scopri come organizzare il soggiorno a Ischia: scelta della zona, hotel, spostamenti e servizi utili. Con IschiaMotion e IschiaStars pianifichi meglio la vacanza.",
  alternates: {
    canonical: "/it/dove-dormire-a-ischia",
    languages: {
      it: "/it/dove-dormire-a-ischia",
      en: "/en/where-to-stay-in-ischia",
      "x-default": "/it/dove-dormire-a-ischia"
    }
  },
  openGraph: {
    title: "Dove dormire a Ischia e come muoversi sull'isola | IschiaMotion",
    description: "Scopri come organizzare il soggiorno a Ischia: scelta della zona, hotel, spostamenti e servizi utili. Con IschiaMotion e IschiaStars pianifichi meglio la vacanza.",
    url: "/it/dove-dormire-a-ischia",
    siteName: "IschiaMotion",
    type: "website",
    locale: "it_IT",
    images: [{ url: "/images/ischiamotion-logo.png", alt: "Dove dormire a Ischia - IschiaMotion" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dove dormire a Ischia e come muoversi sull'isola | IschiaMotion",
    description: "Scopri come organizzare il soggiorno a Ischia: scelta della zona, hotel, spostamenti e servizi utili. Con IschiaMotion e IschiaStars pianifichi meglio la vacanza.",
    images: ["/images/ischiamotion-logo.png"]
  }
};

export default function DoveDormireAIschiaPage() {
  return <WhereToStayLanding locale="it" />;
}
