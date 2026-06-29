import Image from "next/image";
import type { Locale } from "@/lib/types";

export function HeroVisual({ locale }: { locale: Locale }) {
  return (
    <div className="hero-right">
      <Image
        className="hero-art-image"
        src="/images/ischiamotion-noleggi-esperienze-ischia.webp"
        alt={locale === "it"
          ? "Noleggio mezzi a Ischia con scooter, auto, e-bike, gommoni e barche"
          : "Vehicle rental in Ischia with scooters, cars, e-bikes and boats"}
        fill
        sizes="(max-width: 760px) 240px, (max-width: 1080px) 520px, min(46vw, 662px)"
        quality={82}
        priority={true}
      />
      <div className="scooter-scene">
        <div className="hero-night" aria-hidden="true" />
        <div className="hero-stars" aria-hidden="true">
          <span /><span /><span /><span /><span /><span />
          <span /><span /><span /><span /><span /><span />
          <span /><span /><span /><span /><span /><span />
          <span /><span /><span /><span /><span /><span />
        </div>
        <div className="hero-orbit" aria-hidden="true" />
        <div className="hero-astro" aria-hidden="true" />
        <span className="light-dot light-dot-a" />
        <span className="light-dot light-dot-b" />
        <span className="light-dot light-dot-c" />
      </div>

      <div className="hero-stat-row">
        <div className="hero-stat">
          <span className="hero-stat-val">✓</span>
          <div className="hero-stat-label">{locale === "it" ? "Soluzioni di noleggio" : "Rental options"}</div>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-val">✓</span>
          <div className="hero-stat-label">{locale === "it" ? "Partner selezionati" : "Selected partners"}</div>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-val">✓</span>
          <div className="hero-stat-label">{locale === "it" ? "Conferma rapida" : "Quick confirmation"}</div>
        </div>
      </div>
    </div>
  );
}
