import Image from "next/image";
import type { Locale } from "@/lib/types";
import { isRenterPortalEnabled } from "@/lib/renter-portal";

export function Footer({ locale }: { locale: Locale }) {
  const renterPortalEnabled = isRenterPortalEnabled();
  const links = locale === "it"
    ? {
      privacy: "/it/privacy",
      terms: "/it/termini",
      contact: "/it/contatti"
    }
    : {
      privacy: "/en/privacy",
      terms: "/en/terms",
      contact: "/en/contact"
    };

  return (
    <footer>
      <div className="footer-wrap">
        <div className="footer-logo">
          <Image
            src="/images/ischiamotion-logo.webp"
            alt="IschiaMotion"
            width={384}
            height={148}
            loading="lazy"
            className="logo-img footer-logo-img"
          />
        </div>
        <ul className="footer-links">
          <li>
            <a href={locale === "it" ? "/it/dove-dormire-a-ischia" : "/en/where-to-stay-in-ischia"}>
              {locale === "it" ? "Dove dormire a Ischia" : "Where to stay in Ischia"}
            </a>
          </li>
          <li><a href={links.privacy}>{locale === "it" ? "Privacy" : "Privacy"}</a></li>
          <li>
            <a href={locale === "it" ? "/it/cookie-policy" : "/en/cookie-policy"}>Cookie Policy</a>
          </li>
          <li><a href={links.terms}>{locale === "it" ? "Termini" : "Terms"}</a></li>
          <li><a href={links.contact}>{locale === "it" ? "Contatti" : "Contact"}</a></li>
          <li>
            <a
              aria-label={locale === "it" ? "Vai alla pagina Trustpilot ufficiale di IschiaMotion" : "Visit the official IschiaMotion Trustpilot page"}
              href="https://it.trustpilot.com/review/ischiamotion.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Trustpilot
            </a>
          </li>
          {renterPortalEnabled ? (
            <li><a href="/renter">{locale === "it" ? "Area partner" : "Partner area"}</a></li>
          ) : null}
        </ul>
        <div className="footer-copy">© 2026 IschiaMotion.com</div>
      </div>
    </footer>
  );
}
