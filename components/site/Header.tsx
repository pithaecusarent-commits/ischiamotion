"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/i18n";

type MenuLink = {
  href: string;
  label: string;
};

export function Header({ locale, alternateHref }: { locale: Locale; alternateHref?: string }) {
  const copy = t(locale);
  const otherLocale = locale === "it" ? "en" : "it";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const categoryLinks = locale === "it"
    ? {
      scooters: "/it/noleggio-scooter-ischia",
      cars: "/it/noleggio-auto-ischia",
      boats: "/it/noleggio-barche-ischia",
      ebikes: "/it/noleggio-bici-elettriche-ischia",
      request: "/it#prenota"
    }
    : {
      scooters: "/en/scooter-rental-ischia",
      cars: "/en/car-rental-ischia",
      boats: "/en/boat-rental-ischia",
      ebikes: "/en/e-bike-rental-ischia",
      request: "/en#prenota"
    };

  const mobileLinks: MenuLink[] = locale === "it"
    ? [
      { href: categoryLinks.scooters, label: "Noleggio scooter" },
      { href: categoryLinks.cars, label: "Noleggio auto" },
      { href: categoryLinks.ebikes, label: "E-bike" },
      { href: "/it/noleggio-gommoni-ischia", label: "Gommoni" },
      { href: categoryLinks.boats, label: "Barche" },
      { href: "/it/beach-club-ischia", label: "Beach Club" },
      { href: "/it/dove-dormire-a-ischia", label: "Dove soggiornare a Ischia" },
      { href: "/it/come-muoversi-a-ischia", label: "Come muoversi a Ischia" },
      { href: "/it/contatti", label: "Contatti" },
      { href: "/it/privacy", label: "Privacy" },
      { href: "/it/cookie-policy", label: "Cookie Policy" },
      { href: "/it/termini", label: "Termini" }
    ]
    : [
      { href: categoryLinks.scooters, label: "Scooter rental" },
      { href: categoryLinks.cars, label: "Car rental" },
      { href: categoryLinks.ebikes, label: "E-bike rental" },
      { href: "/en/rubber-dinghy-rental-ischia", label: "Rubber dinghies" },
      { href: categoryLinks.boats, label: "Boats" },
      { href: "/en/ischia-beach-club", label: "Beach Club" },
      { href: "/en/where-to-stay-in-ischia", label: "Where to stay in Ischia" },
      { href: "/en/how-to-get-around-ischia", label: "How to get around Ischia" },
      { href: "/en/contact", label: "Contact" },
      { href: "/en/privacy", label: "Privacy" },
      { href: "/en/cookie-policy", label: "Cookie Policy" },
      { href: "/en/terms", label: "Terms" }
    ];

  function closeMenu(restoreFocus = true) {
    setMenuOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  }

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }

      if (event.key !== "Tab" || !menuPanelRef.current) return;
      const focusable = Array.from(
        menuPanelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function handleDesktopResize(event: MediaQueryListEvent) {
      if (event.matches) setMenuOpen(false);
    }

    const desktopMedia = window.matchMedia("(min-width: 1081px)");
    document.addEventListener("keydown", handleKeyDown);
    desktopMedia.addEventListener("change", handleDesktopResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      desktopMedia.removeEventListener("change", handleDesktopResize);
    };
  }, [menuOpen]);

  const mobileMenu = menuOpen ? createPortal(
    <div
      className="mobile-menu-backdrop"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) closeMenu();
      }}
    >
      <div
        id="mobile-navigation-panel"
        ref={menuPanelRef}
        className="mobile-menu-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="mobile-menu-head">
          <strong id="mobile-menu-title">Menu</strong>
          <button
            ref={closeButtonRef}
            type="button"
            className="mobile-menu-close"
            aria-label={locale === "it" ? "Chiudi menu" : "Close menu"}
            onClick={() => closeMenu()}
          >
            <span aria-hidden="true">&#215;</span>
          </button>
        </div>

        <ul className="mobile-menu-links">
          {mobileLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => closeMenu(false)}>{link.label}</Link>
            </li>
          ))}
        </ul>

        <div className="mobile-menu-actions">
          <Link
            className="mobile-language-link"
            href={alternateHref || `/${otherLocale}`}
            data-ga-event="change_language"
            onClick={() => closeMenu(false)}
          >
            {locale === "it" ? "English (EN)" : "Italiano (IT)"}
          </Link>
          <Link href={categoryLinks.request} className="nav-cta mobile-menu-cta" onClick={() => closeMenu(false)}>
            {copy.nav.book}
          </Link>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <nav aria-label={locale === "it" ? "Navigazione principale" : "Main navigation"}>
        <Link href={`/${locale}`} className="logo" aria-label="IschiaMotion home">
          <Image
            src="/images/ischiamotion-logo.webp"
            alt="IschiaMotion"
            width={384}
            height={148}
            loading="eager"
            className="logo-img"
          />
        </Link>
      <ul className="nav-links" aria-label={locale === "it" ? "Menu principale" : "Main menu"}>
          <li><Link href={categoryLinks.scooters}>{copy.nav.scooters}</Link></li>
          <li><Link href={categoryLinks.cars}>{copy.nav.cars}</Link></li>
          <li><Link href={locale === "it" ? "/it/noleggio-gommoni-ischia" : "/en/rubber-dinghy-rental-ischia"}>{locale === "it" ? "Gommoni" : "RIBs"}</Link></li>
          <li><Link href={categoryLinks.boats}>{copy.nav.boats}</Link></li>
          <li><Link href={categoryLinks.ebikes}>{copy.nav.ebikes}</Link></li>
          <li className="nav-guides">
            <details>
              <summary>{locale === "it" ? "Guide" : "Guides"}</summary>
              <ul className="nav-guides-menu">
                <li>
                  <Link href={locale === "it" ? "/it/dove-dormire-a-ischia" : "/en/where-to-stay-in-ischia"}>
                    {locale === "it" ? "Dove soggiornare a Ischia" : "Where to stay in Ischia"}
                  </Link>
                </li>
                <li>
                  <Link href={locale === "it" ? "/it/come-muoversi-a-ischia" : "/en/how-to-get-around-ischia"}>
                    {locale === "it" ? "Come muoversi a Ischia" : "How to get around Ischia"}
                  </Link>
                </li>
              </ul>
            </details>
          </li>
          <li><Link className="lang-link" href={alternateHref || `/${otherLocale}`} data-ga-event="change_language">{otherLocale.toUpperCase()}</Link></li>
          <li><Link href={categoryLinks.request} className="nav-cta">{copy.nav.book}</Link></li>
        </ul>
        <button
          ref={menuButtonRef}
          type="button"
          className="mobile-menu-toggle"
          aria-label={locale === "it" ? "Apri menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation-panel"
          onClick={() => setMenuOpen(true)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </nav>
      {mobileMenu}
    </>
  );
}
