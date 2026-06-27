import type { Metadata } from "next";
import { LocalCarPortLanding, getLocalCarPortContent } from "@/components/site/LocalCarPortLanding";

const content = getLocalCarPortContent("it");

export const metadata: Metadata = {
  title: "Noleggio auto Ischia Porto | Richiesta disponibilità auto",
  description: content.metaDescription,
  alternates: {
    canonical: content.path,
    languages: {
      it: content.path,
      en: content.alternatePath,
      "x-default": content.path
    }
  },
  openGraph: {
    title: "Noleggio auto Ischia Porto | Richiesta disponibilità auto",
    description: content.metaDescription,
    url: content.path,
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
