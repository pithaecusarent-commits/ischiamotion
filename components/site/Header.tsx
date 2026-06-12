import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/i18n";

export function Header({ locale, alternateHref }: { locale: Locale; alternateHref?: string }) {
  const copy = t(locale);
  const otherLocale = locale === "it" ? "en" : "it";
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

  return (
    <nav>
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
        <li><Link href={categoryLinks.boats}>{copy.nav.boats}</Link></li>
        <li><Link href={categoryLinks.ebikes}>{copy.nav.ebikes}</Link></li>
        <li><Link className="lang-link" href={alternateHref || `/${otherLocale}`}>{otherLocale.toUpperCase()}</Link></li>
        <li><Link href={categoryLinks.request} className="nav-cta">{copy.nav.book}</Link></li>
      </ul>
    </nav>
  );
}
