import type { MetadataRoute } from "next";
import { canonicalSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/auth", "/renter", "/checkin"]
    },
    sitemap: `${canonicalSiteUrl}sitemap.xml`
  };
}
