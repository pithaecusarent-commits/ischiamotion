import type { Metadata } from "next";
import { WhereToStayLanding } from "@/components/site/WhereToStayLanding";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Where to stay in Ischia: area guide | IschiaMotion",
  description: "Compare Ischia Port, Forio, Lacco Ameno, Sant’Angelo and Maronti, with practical transport tips.",
  alternates: {
    canonical: canonicalUrl("/en/where-to-stay-in-ischia"),
    languages: {
      it: canonicalUrl("/it/dove-dormire-a-ischia"),
      en: canonicalUrl("/en/where-to-stay-in-ischia"),
      "x-default": canonicalUrl("/it/dove-dormire-a-ischia")
    }
  },
  openGraph: {
    title: "Where to stay in Ischia: area guide | IschiaMotion",
    description: "Compare Ischia Port, Forio, Lacco Ameno, Sant’Angelo and Maronti, with practical transport tips.",
    url: canonicalUrl("/en/where-to-stay-in-ischia"),
    siteName: "IschiaMotion",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/ischiamotion-logo.png", alt: "Where to stay in Ischia - IschiaMotion" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Where to stay in Ischia: area guide | IschiaMotion",
    description: "Compare Ischia Port, Forio, Lacco Ameno, Sant’Angelo and Maronti, with practical transport tips.",
    images: ["/images/ischiamotion-logo.png"]
  }
};

export default function WhereToStayInIschiaPage() {
  return <WhereToStayLanding locale="en" />;
}
