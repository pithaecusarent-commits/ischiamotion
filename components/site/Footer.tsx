import type { Locale } from "@/lib/types";

export function Footer({ locale }: { locale: Locale }) {
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ischiamotion-logo.png"
            alt="IschiaMotion"
            className="logo-img footer-logo-img"
          />
        </div>
        <ul className="footer-links">
          <li><a href={links.privacy}>{locale === "it" ? "Privacy" : "Privacy"}</a></li>
          <li><a href={links.terms}>{locale === "it" ? "Termini" : "Terms"}</a></li>
          <li><a href={links.contact}>{locale === "it" ? "Contatti" : "Contact"}</a></li>
          <li><a href="/renter">{locale === "it" ? "Sei un noleggiatore?" : "Are you a renter?"}</a></li>
        </ul>
        <div className="footer-copy">© 2026 IschiaMotion.com</div>
      </div>
    </footer>
  );
}
