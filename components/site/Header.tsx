import Link from "next/link";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/i18n";

export function Header({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const otherLocale = locale === "it" ? "en" : "it";

  return (
    <nav>
      <Link href={`/${locale}`} className="logo" aria-label="IschiaMotion home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ischiamotion-logo.png"
          alt="IschiaMotion"
          className="logo-img"
        />
      </Link>
      <ul className="nav-links" aria-label={locale === "it" ? "Menu principale" : "Main menu"}>
        <li><a href="#veicoli">{copy.nav.scooters}</a></li>
        <li><a href="#veicoli">{copy.nav.cars}</a></li>
        <li><a href="#veicoli">{copy.nav.boats}</a></li>
        <li><a href="#veicoli">{copy.nav.ebikes}</a></li>
        <li><Link className="lang-link" href={`/${otherLocale}`}>{otherLocale.toUpperCase()}</Link></li>
        <li><a href="#prenota" className="nav-cta">{copy.nav.book}</a></li>
      </ul>
    </nav>
  );
}
