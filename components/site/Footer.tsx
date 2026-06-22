import Image from "next/image";
import type { Locale } from "@/lib/types";
import { isRenterPortalEnabled } from "@/lib/renter-portal";
import { ManageCookiesButton } from "@/components/site/ManageCookiesButton";

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
        <div className="footer-brand">
          <a className="footer-logo" href={locale === "it" ? "/it/ischiamotion" : "/en"}>
          <Image
            src="/images/ischiamotion-logo.webp"
            alt="IschiaMotion"
            width={384}
            height={148}
            loading="lazy"
            className="logo-img footer-logo-img"
          />
          </a>
          <div className="footer-brand-details">
            <strong><a href={locale === "it" ? "/it/ischiamotion" : "/en"}>IschiaMotion</a></strong>
            <span>
              {locale === "it"
                ? "Piattaforma locale per richieste di mobilità e servizi mare a Ischia."
                : "Local platform for mobility and marine-service requests in Ischia."}
            </span>
            <span>
              {locale === "it"
                ? "IschiaMotion raccoglie la tua richiesta e verifica disponibilità, condizioni e conferma con partner locali selezionati sull’isola."
                : "IschiaMotion collects your request and checks availability, conditions and confirmation with selected local partners on the island."}
            </span>
            <span>Via Fundera, 104, 80076 Lacco Ameno (NA), Italia</span>
            <a href="tel:+393296856370">+39 329 685 6370</a>
            <a href="mailto:info@ischiamotion.com">info@ischiamotion.com</a>
            <a href="https://www.ischiamotion.com">https://www.ischiamotion.com</a>
          </div>
        </div>
        <ul className="footer-links">
          {locale === "it" ? (
            <li><a href="/it/ischiamotion">piattaforma locale IschiaMotion</a></li>
          ) : null}
          <li>
            <a href={locale === "it" ? "/it/come-muoversi-a-ischia" : "/en/how-to-get-around-ischia"}>
              {locale === "it" ? "Come muoversi a Ischia" : "How to get around Ischia"}
            </a>
          </li>
          <li>
            <a href={locale === "it" ? "/it/dove-dormire-a-ischia" : "/en/where-to-stay-in-ischia"}>
              {locale === "it" ? "Dove dormire a Ischia" : "Where to stay in Ischia"}
            </a>
          </li>
          <li><a href={links.privacy}>{locale === "it" ? "Privacy" : "Privacy"}</a></li>
          <li>
            <a href={locale === "it" ? "/it/cookie-policy" : "/en/cookie-policy"}>Cookie Policy</a>
          </li>
          <li><ManageCookiesButton locale={locale} /></li>
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
