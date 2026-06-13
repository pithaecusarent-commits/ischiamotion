import type { Metadata } from "next";
import { WhereToStayLanding } from "@/components/site/WhereToStayLanding";

export const metadata: Metadata = {
  title: "Where to stay in Ischia and how to get around | IschiaMotion",
  description: "Plan your stay in Ischia: where to stay, how to move around the island and useful local services. IschiaMotion and IschiaStars help you organize your trip.",
  alternates: {
    canonical: "/en/where-to-stay-in-ischia",
    languages: {
      it: "/it/dove-dormire-a-ischia",
      en: "/en/where-to-stay-in-ischia",
      "x-default": "/it/dove-dormire-a-ischia"
    }
  },
  openGraph: {
    title: "Where to stay in Ischia and how to get around | IschiaMotion",
    description: "Plan your stay in Ischia: where to stay, how to move around the island and useful local services. IschiaMotion and IschiaStars help you organize your trip.",
    url: "/en/where-to-stay-in-ischia",
    siteName: "IschiaMotion",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/ischiamotion-logo.png", alt: "Where to stay in Ischia - IschiaMotion" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Where to stay in Ischia and how to get around | IschiaMotion",
    description: "Plan your stay in Ischia: where to stay, how to move around the island and useful local services. IschiaMotion and IschiaStars help you organize your trip.",
    images: ["/images/ischiamotion-logo.png"]
  }
};

export default function WhereToStayInIschiaPage() {
  return <WhereToStayLanding locale="en" />;
}
