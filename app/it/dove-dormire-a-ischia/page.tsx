import type { Metadata } from "next";
import { WhereToStayLanding } from "@/components/site/WhereToStayLanding";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Dove dormire a Ischia: guida alle zone | IschiaMotion",
  description: "Guida a Ischia Porto, Forio, Lacco Ameno, Sant’Angelo e Maronti, con consigli per muoversi sull’isola.",
  alternates: {
    canonical: canonicalUrl("/it/dove-dormire-a-ischia"),
    languages: {
      it: canonicalUrl("/it/dove-dormire-a-ischia"),
      en: canonicalUrl("/en/where-to-stay-in-ischia"),
      "x-default": canonicalUrl("/it/dove-dormire-a-ischia")
    }
  },
  openGraph: {
    title: "Dove dormire a Ischia: guida alle zone | IschiaMotion",
    description: "Guida a Ischia Porto, Forio, Lacco Ameno, Sant’Angelo e Maronti, con consigli per muoversi sull’isola.",
    url: canonicalUrl("/it/dove-dormire-a-ischia"),
    siteName: "IschiaMotion",
    type: "website",
    locale: "it_IT",
    images: [{ url: "/images/ischiamotion-logo.png", alt: "Dove dormire a Ischia - IschiaMotion" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dove dormire a Ischia: guida alle zone | IschiaMotion",
    description: "Guida a Ischia Porto, Forio, Lacco Ameno, Sant’Angelo e Maronti, con consigli per muoversi sull’isola.",
    images: ["/images/ischiamotion-logo.png"]
  }
};

export default function DoveDormireAIschiaPage() {
  return <WhereToStayLanding locale="it" />;
}
