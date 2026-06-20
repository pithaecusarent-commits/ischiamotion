import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const seoRoutes: Array<{ path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/it", priority: 1.0, freq: "weekly" },
  { path: "/en", priority: 1.0, freq: "weekly" },
  { path: "/it/ischiamotion", priority: 0.9, freq: "monthly" },
  { path: "/it/noleggio-scooter-ischia", priority: 0.9, freq: "monthly" },
  { path: "/en/scooter-rental-ischia", priority: 0.9, freq: "monthly" },
  { path: "/it/noleggio-auto-ischia", priority: 0.85, freq: "monthly" },
  { path: "/en/car-rental-ischia", priority: 0.85, freq: "monthly" },
  { path: "/it/noleggio-bici-elettriche-ischia", priority: 0.85, freq: "monthly" },
  { path: "/en/e-bike-rental-ischia", priority: 0.85, freq: "monthly" },
  { path: "/it/noleggio-gommoni-ischia", priority: 0.85, freq: "monthly" },
  { path: "/en/rubber-dinghy-rental-ischia", priority: 0.85, freq: "monthly" },
  { path: "/it/noleggio-barche-ischia", priority: 0.85, freq: "monthly" },
  { path: "/en/boat-rental-ischia", priority: 0.85, freq: "monthly" },
  { path: "/it/beach-club-ischia", priority: 0.85, freq: "monthly" },
  { path: "/en/ischia-beach-club", priority: 0.85, freq: "monthly" },
  { path: "/it/dove-dormire-a-ischia", priority: 0.8, freq: "monthly" },
  { path: "/en/where-to-stay-in-ischia", priority: 0.8, freq: "monthly" },
  { path: "/it/come-muoversi-a-ischia", priority: 0.8, freq: "monthly" },
  { path: "/en/how-to-get-around-ischia", priority: 0.8, freq: "monthly" }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return seoRoutes.map(({ path, priority, freq }) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority
  }));
}
