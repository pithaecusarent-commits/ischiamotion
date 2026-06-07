import type { Metadata } from "next";
import type { CategoryLandingContent } from "@/lib/category-landings";

export function categoryLandingMetadata(content: CategoryLandingContent): Metadata {
  const socialImage = {
    url: "/images/ischiamotion-logo.png",
    alt: `${content.title} - IschiaMotion`
  };

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: content.path,
      languages: {
        it: content.locale === "it" ? content.path : content.alternatePath,
        en: content.locale === "en" ? content.path : content.alternatePath,
        "x-default": content.locale === "it" ? content.path : content.alternatePath
      }
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: content.path,
      siteName: "IschiaMotion",
      type: "website",
      locale: content.locale === "it" ? "it_IT" : "en_US",
      images: [socialImage]
    },
    twitter: {
      card: "summary_large_image",
      title: content.metaTitle,
      description: content.metaDescription,
      images: [socialImage.url]
    }
  };
}
