import type { Metadata } from "next";
import { WhereToStayLanding } from "@/components/site/WhereToStayLanding";

export const metadata: Metadata = {
  title: "Dove dormire a Ischia: zone migliori e come muoversi | IschiaMotion",
  description: "Guida alle zone migliori dove dormire a Ischia: Ischia Porto, Forio, Sant'Angelo, Lacco Ameno, Maronti e consigli su scooter, auto ed e-bike.",
  alternates: {
    canonical: "/it/dove-dormire-a-ischia",
    languages: {
      it: "/it/dove-dormire-a-ischia",
      en: "/en/where-to-stay-in-ischia",
      "x-default": "/it/dove-dormire-a-ischia"
    }
  },
  openGraph: {
    title: "Dove dormire a Ischia: zone migliori e come muoversi | IschiaMotion",
    description: "Guida alle zone migliori dove dormire a Ischia: Ischia Porto, Forio, Sant'Angelo, Lacco Ameno, Maronti e consigli su scooter, auto ed e-bike.",
    url: "/it/dove-dormire-a-ischia",
    siteName: "IschiaMotion",
    type: "website",
    locale: "it_IT",
    images: [{ url: "/images/ischiamotion-logo.png", alt: "Dove dormire a Ischia - IschiaMotion" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dove dormire a Ischia: zone migliori e come muoversi | IschiaMotion",
    description: "Guida alle zone migliori dove dormire a Ischia: Ischia Porto, Forio, Sant'Angelo, Lacco Ameno, Maronti e consigli su scooter, auto ed e-bike.",
    images: ["/images/ischiamotion-logo.png"]
  }
};

export default function DoveDormireAIschiaPage() {
  return <WhereToStayLanding locale="it" />;
}
