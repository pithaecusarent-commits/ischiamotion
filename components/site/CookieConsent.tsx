"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getStoredConsent,
  saveConsent,
  loadGa,
  trackPageview,
  trackEvent,
  getCategoryFromPath,
  type ConsentValue,
} from "@/lib/analytics";

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentValue>(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);
  const locale = pathname?.startsWith("/en") ? "en" : "it";

  // Read stored consent on mount
  useEffect(() => {
    const stored = getStoredConsent();
    setConsent(stored);
    if (stored === "granted") {
      loadGa();
    } else if (stored === null) {
      setBannerVisible(true);
    }
  }, []);

  // Reopen banner when "Gestisci cookie" is clicked
  useEffect(() => {
    const handler = () => setBannerVisible(true);
    window.addEventListener("im_manage_cookies", handler);
    return () => window.removeEventListener("im_manage_cookies", handler);
  }, []);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!bannerVisible || !banner) return;

    function updateBannerHeight(height: number) {
      if (height) {
        document.documentElement.style.setProperty("--cookie-banner-height", `${height}px`);
      }
    }

    document.body.classList.add("cookie-banner-visible");
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) updateBannerHeight(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height);
    });
    observer.observe(banner);

    return () => {
      observer.disconnect();
      document.body.classList.remove("cookie-banner-visible");
      document.documentElement.style.removeProperty("--cookie-banner-height");
    };
  }, [bannerVisible]);

  // SPA pageview tracking — skip the very first render (GA config already fires it)
  useEffect(() => {
    if (consent !== "granted") return;
    if (prevPathRef.current === null) {
      prevPathRef.current = pathname;
      return;
    }
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      trackPageview(pathname);
    }
  }, [pathname, consent]);

  // view_vehicle_category — fire 1s after landing on a category page
  useEffect(() => {
    if (consent !== "granted") return;
    const category = getCategoryFromPath(pathname);
    if (!category) return;
    const timer = setTimeout(() => {
      trackEvent("view_vehicle_category", { category });
    }, 1000);
    return () => clearTimeout(timer);
  }, [pathname, consent]);

  // Global click listener — reads data-ga-event and sibling data-ga-* attributes
  useEffect(() => {
    if (consent !== "granted") return;
    const handler = (e: MouseEvent) => {
      const el = (e.target as Element).closest("[data-ga-event]");
      if (!el) return;
      const eventName = el.getAttribute("data-ga-event");
      if (!eventName) return;
      const params: Record<string, unknown> = {};
      for (const attr of Array.from(el.attributes)) {
        if (attr.name.startsWith("data-ga-") && attr.name !== "data-ga-event") {
          const key = attr.name.slice("data-ga-".length).replace(/-/g, "_");
          params[key] = attr.value;
        }
      }
      trackEvent(eventName, Object.keys(params).length ? params : undefined);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [consent]);

  // Form submit tracking — reads data-ga-submit attribute on <form>
  useEffect(() => {
    if (consent !== "granted") return;
    const handler = (e: Event) => {
      const form = (e.target as Element).closest("form[data-ga-submit]");
      if (!form) return;
      const eventName = form.getAttribute("data-ga-submit");
      if (eventName) trackEvent(eventName);
    };
    document.addEventListener("submit", handler);
    return () => document.removeEventListener("submit", handler);
  }, [consent]);

  function handleAccept() {
    saveConsent("granted");
    setConsent("granted");
    loadGa();
    setBannerVisible(false);
  }

  function handleReject() {
    saveConsent("denied");
    setConsent("denied");
    setBannerVisible(false);
  }

  if (!bannerVisible) return null;

  const cookiePolicyHref = locale === "en" ? "/en/cookie-policy" : "/it/cookie-policy";
  const privacyHref = locale === "en" ? "/en/privacy" : "/it/privacy";

  const text =
    locale === "en"
      ? "We use Google Analytics to understand how visitors use the site and improve the experience."
      : "Utilizziamo Google Analytics per capire come i visitatori usano il sito e migliorare l'esperienza.";
  const acceptLabel = locale === "en" ? "Accept" : "Accetta";
  const rejectLabel = locale === "en" ? "Reject" : "Rifiuta";

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-label={locale === "en" ? "Cookie consent" : "Consenso cookie"}
      className="cookie-consent"
    >
      <p className="cookie-consent-text">
        {text}{" "}
        <a href={cookiePolicyHref} style={{ color: "inherit" }}>Cookie Policy</a>
        {" · "}
        <a href={privacyHref} style={{ color: "inherit" }}>Privacy</a>
      </p>
      <div className="cookie-consent-actions">
        <button
          type="button"
          className="ghost-btn cookie-consent-button"
          onClick={handleReject}
        >
          {rejectLabel}
        </button>
        <button
          type="button"
          className="primary-btn cookie-consent-button"
          onClick={handleAccept}
        >
          {acceptLabel}
        </button>
      </div>
    </div>
  );
}
