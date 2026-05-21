import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "/it",
    "/en",
    "/it/noleggio-scooter-ischia",
    "/en/scooter-rental-ischia"
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "/it" || route === "/en" ? "weekly" : "monthly",
    priority: route === "/it" || route === "/en" ? 1 : 0.85
  }));
}
