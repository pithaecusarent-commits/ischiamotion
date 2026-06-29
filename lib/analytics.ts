declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    __gaLoaded?: boolean;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-GP3T5XHSM4";

export const CONSENT_KEY = "im_cookie_consent";
export type ConsentValue = "granted" | "denied" | null;

export function getStoredConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(CONSENT_KEY);
  if (v === "granted" || v === "denied") return v;
  return null;
}

export function saveConsent(value: "granted" | "denied"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, value);
}

export function loadGa(): void {
  if (!GA_ID || typeof window === "undefined" || window.__gaLoaded) return;
  window.__gaLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: true });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

export function trackPageview(path: string): void {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_ID, { page_path: path });
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

const CATEGORY_SLUG_MAP: Record<string, string> = {
  "noleggio-scooter-ischia": "scooter",
  "scooter-rental-ischia": "scooter",
  "noleggio-auto-ischia": "auto",
  "car-rental-ischia": "auto",
  "noleggio-bici-elettriche-ischia": "ebike",
  "e-bike-rental-ischia": "ebike",
  "noleggio-gommoni-ischia": "gommone",
  "rubber-dinghy-rental-ischia": "gommone",
  "noleggio-barche-ischia": "barca",
  "boat-rental-ischia": "barca",
  "beach-club-ischia": "beach_club",
  "ischia-beach-club": "beach_club",
};

export function getCategoryFromPath(pathname: string): string | null {
  const slug = pathname.split("/").pop() ?? "";
  return CATEGORY_SLUG_MAP[slug] ?? null;
}
