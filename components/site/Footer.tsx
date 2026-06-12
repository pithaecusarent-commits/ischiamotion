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
          <li><a href={links.privacy}>{locale === "it" ? "Privacy" : "Privacy"}</a></li>
          <li><a href={links.terms}>{locale === "it" ? "Termini" : "Terms"}</a></li>
          <li><a href={links.contact}>{locale === "it" ? "Contatti" : "Contact"}</a></li>
          {renterPortalEnabled ? (
            <li><a href="/renter">{locale === "it" ? "Area partner" : "Partner area"}</a></li>
          ) : null}
        </ul>
        <div className="footer-copy">© 2026 IschiaMotion.com</div>
      </div>
    </footer>
  );
}
