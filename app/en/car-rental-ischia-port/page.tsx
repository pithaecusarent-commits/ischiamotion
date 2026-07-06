import type { Metadata } from "next";
import { LocalCarPortLanding, getLocalCarPortContent } from "@/components/site/LocalCarPortLanding";
import { canonicalUrl } from "@/lib/seo";

const content = getLocalCarPortContent("en");

export const metadata: Metadata = {
  title: "Car rental Ischia Port | Request car availability",
  description: content.metaDescription,
  alternates: {
    canonical: canonicalUrl(content.path),
    languages: {
      it: canonicalUrl(content.alternatePath),
      en: canonicalUrl(content.path),
      "x-default": canonicalUrl(content.alternatePath)
    }
  },
  openGraph: {
    title: "Car rental Ischia Port | Request car availability",
    description: content.metaDescription,
    url: canonicalUrl(content.path),
    siteName: "IschiaMotion",
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Car rental Ischia Port | Request car availability",
    description: content.metaDescription
  }
};

export default function Page() {
  return <LocalCarPortLanding locale="en" />;
}
