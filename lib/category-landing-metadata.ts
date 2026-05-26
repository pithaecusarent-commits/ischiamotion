import type { Metadata } from "next";
import type { CategoryLandingContent } from "@/lib/category-landings";

export function categoryLandingMetadata(content: CategoryLandingContent): Metadata {
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: content.path,
      languages: {
        it: content.locale === "it" ? content.path : content.alternatePath,
        en: content.locale === "en" ? content.path : content.alternatePath,
        "x-default": "/it"
      }
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: content.path,
      siteName: "IschiaMotion",
      type: "website",
      locale: content.locale === "it" ? "it_IT" : "en_US"
    }
  };
}
