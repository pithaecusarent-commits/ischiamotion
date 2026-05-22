import type { Locale, PublicVehicle } from "@/lib/types";

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
  const features = locale === "it" ? vehicle.features_it : vehicle.features_en;
  const location = locale === "it" ? vehicle.location_it : vehicle.location_en;
  const typeLabels: Record<string, string> = {
    scooter: vehicle.emoji === "🏍️" ? (locale === "it" ? "Moto" : "Motorbike") : "Scooter",
    auto: locale === "it" ? "Auto" : "Car",
    barca: locale === "it" ? "Barca" : "Boat",
    bici: locale === "it" ? "Bici elettrica" : "E-bike"
  };

  return (
    <article className="vcard" data-category={vehicle.category} style={{ display: visible ? undefined : "none" }}>
      <div className="vcard-img">
        {vehicle.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={vehicle.image_url} alt={title} className="h-full w-full object-cover" />
        ) : (
          <span>{vehicle.emoji}</span>
        )}
        <span className="avail">{locale === "it" ? "Su richiesta" : "On request"}</span>
      </div>
      <div className="vcard-body">
        <div className="vcard-type">{typeLabels[vehicle.category]}</div>
        <div className="vcard-name">{title}</div>
        <div className="vcard-loc">📍 {location}</div>
        <div className="vcard-features">
          {features.map((feature) => <span className="feature" key={feature}>{feature}</span>)}
        </div>
        <div className="vcard-foot">
          <div className="vcard-price">€{vehicle.price_from} <small>/ {locale === "it" ? "giorno" : "day"}</small></div>
          <button className="book-btn" type="button" onClick={() => onBook(vehicle)}>
            {locale === "it" ? "Richiedi" : "Request"}
          </button>
        </div>
      </div>
    </article>
  );
}
