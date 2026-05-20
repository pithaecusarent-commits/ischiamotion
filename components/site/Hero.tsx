import type { Locale } from "@/lib/types";
import { t } from "@/lib/i18n";
import { HeroSearch } from "@/components/site/HeroSearch";
import { VehicleFilters } from "@/components/site/VehicleFilters";

export function Hero({
  locale,
  activeFilter,
  onFilterChange
}: {
  locale: Locale;
  activeFilter: "all" | "scooter" | "auto" | "barca" | "bici";
  onFilterChange: (filter: "all" | "scooter" | "auto" | "barca" | "bici") => void;
}) {
  const copy = t(locale);

  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-tag">{copy.hero.kicker}</div>
        <h1 dangerouslySetInnerHTML={{ __html: copy.hero.title }} />
        <p className="hero-sub">{copy.hero.subtitle}</p>

        <div className="hero-actions">
          <a href="#prenota" className="primary-btn">{copy.hero.cta}</a>
          <a href="#come-funziona" className="ghost-btn">{copy.hero.secondary}</a>
        </div>

        <HeroSearch locale={locale} />
        <VehicleFilters locale={locale} active={activeFilter} onChange={onFilterChange} />
      </div>

      <div className="hero-right">
        <div className="island-map" />
        <div className="scooter-scene">
          <div className="sun" />
          <div className="orbit" />
          <span className="big-icon">🛵</span>

          <div className="route-card">
            <span className="mini-label">{locale === "it" ? "Itinerario top" : "Top route"}</span>
            <span className="mini-title">Porto → Sant’Angelo</span>
            <span className="mini-sub">{locale === "it" ? "Panorami, terme e mare" : "Views, spas and sea"}</span>
          </div>

          <div className="rating-card">
            <span className="mini-label">{locale === "it" ? "Clienti felici" : "Happy guests"}</span>
            <span className="mini-title">4.9★</span>
            <span className="mini-sub">{locale === "it" ? "Esperienza fluida" : "Smooth experience"}</span>
          </div>

          <div className="pickup-card">
            <span className="mini-label">{locale === "it" ? "Ritiro rapido" : "Fast pickup"}</span>
            <span className="mini-title">15+ punti</span>
            <span className="mini-sub">Porto, Forio, Casamicciola</span>
          </div>
        </div>

        <div className="hero-stat-row">
          <div className="hero-stat">
            <span className="hero-stat-val">200+</span>
            <div className="hero-stat-label">{locale === "it" ? "Veicoli disponibili" : "Available vehicles"}</div>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-val">4.9★</span>
            <div className="hero-stat-label">{locale === "it" ? "Recensioni clienti" : "Guest reviews"}</div>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-val">15+</span>
            <div className="hero-stat-label">{locale === "it" ? "Punti ritiro" : "Pickup points"}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
