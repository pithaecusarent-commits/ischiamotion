import { t } from "@/lib/i18n";
import { getCategoryLandingPath } from "@/lib/category-landing-paths";
import type { Locale, PublicVehicle } from "@/lib/types";
import type { KeyboardEvent } from "react";

export function VehicleCard({
  vehicle,
  locale,
  visible = true,
  onBook
}: {
  vehicle: PublicVehicle;
  locale: Locale;
  visible?: boolean;
  onBook: (vehicle: PublicVehicle) => void;
}) {
  const title = locale === "it" ? vehicle.title_it : vehicle.title_en;
  const description = locale === "it" ? vehicle.description_it : vehicle.description_en;
  const features = locale === "it" ? vehicle.features_it : vehicle.features_en;
  const location = locale === "it" ? vehicle.location_it : vehicle.location_en;
  const hasPrice = vehicle.price_from > 0;
  const typeLabels: Record<string, string> = {
    scooter: vehicle.emoji === "🏍️" ? (locale === "it" ? "Moto" : "Motorbike") : "Scooter",
    auto: locale === "it" ? "Auto" : "Car",
    gommone: locale === "it" ? "Gommone" : "Rubber dinghy",
    barca: locale === "it" ? "Barca" : "Boat",
    bici: locale === "it" ? "Bici elettrica" : "E-bike",
    beach_club: "Beach Club"
  };
  const ctaLabel = locale === "it" ? "Verifica" : "Check";
  const landingPath = getCategoryLandingPath(locale, vehicle.category);
  const handleSelect = () => onBook(vehicle);
  const openLanding = () => {
    window.location.href = landingPath;
  };

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLanding();
    }
  }

  return (
    <article
      className="vcard"
      data-category={vehicle.category}
      style={{ display: visible ? undefined : "none" }}
      role="link"
      tabIndex={visible ? 0 : -1}
      onClick={openLanding}
      onKeyDown={handleKeyDown}
      aria-label={locale === "it" ? `Apri landing: ${title}` : `Open landing: ${title}`}
    >
      <div className="vcard-img">
        {vehicle.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={vehicle.image_url} alt={title} />
        ) : (
          <span>{vehicle.emoji}</span>
        )}
        <span className="avail">{locale === "it" ? "Su richiesta" : "On request"}</span>
      </div>
      <div className="vcard-body">
        <div className="vcard-type">{typeLabels[vehicle.category]}</div>
        <div className="vcard-name">{title}</div>
        {description ? <p className="vcard-description">{description}</p> : null}
        <div className="vcard-loc">📍 {location}</div>
        <div className="vcard-features">
          {features.map((feature) => <span className="feature" key={feature}>{feature}</span>)}
        </div>
        <div className="vcard-foot">
          <div className="vcard-price">
            {hasPrice ? (
              <>
                <small>{t(locale).common.from}</small> €{vehicle.price_from} <small>/ {t(locale).common.day}</small>
              </>
            ) : (
              <small>{locale === "it" ? "Su richiesta" : "On request"}</small>
            )}
          </div>
          <button className="book-btn" type="button" onClick={(event) => {
            event.stopPropagation();
            handleSelect();
          }}>
            {ctaLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
