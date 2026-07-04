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
  const isItalian = locale === "it";
  const heroWhatsAppText = encodeURIComponent(
    "Ciao IschiaMotion, vorrei un consiglio per muovermi a Ischia. Vi dico dove soggiorno, quando arrivo e cosa vorrei fare."
  );
  const heroWhatsAppHref = `https://wa.me/393296856370?text=${heroWhatsAppText}`;

  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-tag">{copy.hero.kicker}</div>
        <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: copy.hero.title }} />
        <p className="hero-sub">{copy.hero.subtitle}</p>

        <div className="hero-actions">
          <a href="#prenota" className="primary-btn">{copy.hero.cta}</a>
          {isItalian ? (
            <a
              href={heroWhatsAppHref}
              className="ghost-btn hero-whatsapp-btn"
              target="_blank"
              rel="noopener noreferrer"
              data-ga-event="click_whatsapp"
              data-ga-source="homepage_hero"
            >
              Scrivici su WhatsApp
            </a>
          ) : (
            <a href="#come-funziona" className="ghost-btn">{copy.hero.secondary}</a>
          )}
        </div>
        <p className="hero-request-note">
          {isItalian
            ? "Richiesta senza impegno. La disponibilità viene confermata solo dopo verifica con il partner locale."
            : "Not sure which option is right for you? Tell us where you’re staying, when you arrive and what you want to do: we’ll help you find the best way to get around Ischia."}
        </p>
        {isItalian ? (
          <ul className="hero-benefits" aria-label="Vantaggi IschiaMotion">
            <li>Partner locali selezionati</li>
            <li>Prezzi e condizioni verificati</li>
            <li>Supporto per scegliere il mezzo giusto</li>
          </ul>
        ) : null}

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
          <div className="hero-astro" aria-hidden="true">
            <div className="astro-layer astro-layer-sun" />
            <div className="astro-layer astro-layer-mid" />
            <div className="astro-layer astro-layer-moon" />
          </div>
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
    </section>
  );
}
