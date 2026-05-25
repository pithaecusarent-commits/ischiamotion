import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "/it",
    "/en",
    "/it/noleggio-scooter-ischia",
    "/en/scooter-rental-ischia",
    "/it/noleggio-auto-ischia",
    "/en/car-rental-ischia",
    "/it/noleggio-bici-elettriche-ischia",
    "/en/e-bike-rental-ischia",
    "/it/noleggio-gommoni-ischia",
    "/en/rubber-dinghy-rental-ischia",
    "/it/noleggio-barche-ischia",
    "/en/boat-rental-ischia",
    "/it/barca-con-skipper-ischia",
    "/en/boat-with-skipper-ischia",
    "/it/privacy",
    "/en/privacy",
    "/it/termini",
    "/en/terms",
    "/it/contatti",
    "/en/contact"
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "/it" || route === "/en" ? "weekly" : "monthly",
    priority: route === "/it" || route === "/en" ? 1 : route.includes("privacy") || route.includes("termini") || route.includes("terms") || route.includes("contatti") || route.includes("contact") ? 0.35 : 0.85
  }));
}
