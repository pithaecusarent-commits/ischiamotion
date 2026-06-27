import type { Metadata } from "next";
import { LocalCarPortLanding, getLocalCarPortContent } from "@/components/site/LocalCarPortLanding";

const content = getLocalCarPortContent("en");

export const metadata: Metadata = {
  title: "Car rental Ischia Port | Request car availability",
  description: content.metaDescription,
  alternates: {
    canonical: content.path,
    languages: {
      it: content.alternatePath,
      en: content.path,
      "x-default": content.alternatePath
    }
  },
  openGraph: {
    title: "Car rental Ischia Port | Request car availability",
    description: content.metaDescription,
    url: content.path,
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
