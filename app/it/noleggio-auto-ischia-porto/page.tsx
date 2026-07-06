import type { Metadata } from "next";
import { LocalCarPortLanding, getLocalCarPortContent } from "@/components/site/LocalCarPortLanding";
import { canonicalUrl } from "@/lib/seo";

const content = getLocalCarPortContent("it");

export const metadata: Metadata = {
  title: "Noleggio auto Ischia Porto | Richiesta disponibilità auto",
  description: content.metaDescription,
  alternates: {
    canonical: canonicalUrl(content.path),
    languages: {
      it: canonicalUrl(content.path),
      en: canonicalUrl(content.alternatePath),
      "x-default": canonicalUrl(content.path)
    }
  },
  openGraph: {
    title: "Noleggio auto Ischia Porto | Richiesta disponibilità auto",
    description: content.metaDescription,
    url: canonicalUrl(content.path),
    siteName: "IschiaMotion",
    type: "website",
    locale: "it_IT"
  },
  twitter: {
    card: "summary_large_image",
    title: "Noleggio auto Ischia Porto | Richiesta disponibilità auto",
    description: content.metaDescription
  }
};

export default function Page() {
  return <LocalCarPortLanding locale="it" />;
}
