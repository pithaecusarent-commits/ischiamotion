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
  onDeliveryMethodChange,
  children
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
  children: React.ReactNode;
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

      {children}
    </section>
  );
}
