import Image from "next/image";
import type { BookingDeliveryMethod, Locale, PublicPickupPoint, VehicleFilter } from "@/lib/types";
import { t } from "@/lib/i18n";
import { HeroSearch } from "@/components/site/HeroSearch";
import { VehicleFilters } from "@/components/site/VehicleFilters";

export function Hero({
  locale,
  activeFilter,
  onFilterChange,
  pickupPoints,
  startDate,
  endDate,
  deliveryMethod,
  onStartDateChange,
  onEndDateChange,
  onDeliveryMethodChange
}: {
  locale: Locale;
  activeFilter: VehicleFilter;
  onFilterChange: (filter: VehicleFilter) => void;
  pickupPoints: PublicPickupPoint[];
  startDate: string;
  endDate: string;
  deliveryMethod: BookingDeliveryMethod;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onDeliveryMethodChange: (value: BookingDeliveryMethod) => void;
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

        <HeroSearch
          locale={locale}
          category={activeFilter}
          startDate={startDate}
          endDate={endDate}
          deliveryMethod={deliveryMethod}
          onCategoryChange={onFilterChange}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onDeliveryMethodChange={onDeliveryMethodChange}
        />
        <VehicleFilters locale={locale} active={activeFilter} onChange={onFilterChange} />
      </div>

      <div className="hero-right">
        <Image
          className="hero-art-image"
          src="/images/hero-ischiamotion-castello-clean.png"
          alt={locale === "it" ? "Scooter IschiaMotion davanti al Castello Aragonese" : "IschiaMotion scooter in front of Castello Aragonese"}
          fill
          sizes="(max-width: 1080px) 520px, 46vw"
          priority
        />
        <div className="scooter-scene">
          <div className="hero-night" aria-hidden="true" />
          <div className="hero-stars" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="hero-orbit" aria-hidden="true" />
          <div className="hero-astro" aria-hidden="true" />
          <span className="light-dot light-dot-a" />
          <span className="light-dot light-dot-b" />
          <span className="light-dot light-dot-c" />
        </div>

        <div className="hero-stat-row">
          <div className="hero-stat">
            <span className="hero-stat-val">200+</span>
            <div className="hero-stat-label">{locale === "it" ? "Mezzi selezionati" : "Selected vehicles"}</div>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-val">✓</span>
            <div className="hero-stat-label">{locale === "it" ? "Partner selezionati" : "Selected partners"}</div>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-val">20+</span>
            <div className="hero-stat-label">{locale === "it" ? "Punti di ritiro" : "Pickup points"}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
