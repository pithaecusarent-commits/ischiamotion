import type { Locale, PublicPickupPoint } from "@/lib/types";

const preferredZones = ["Ischia Porto", "Forio", "Casamicciola", "Sant'Angelo", "Barano"];
const markerClasses: Record<string, string> = {
  "Ischia Porto": "pin-port",
  Forio: "pin-forio",
  Casamicciola: "pin-casamicciola",
  "Sant'Angelo": "pin-sant-angelo",
  Barano: "pin-barano"
};

function sortPickupPoints(points: PublicPickupPoint[]) {
  return [...points].sort((a, b) => {
    const aIndex = preferredZones.indexOf(a.zone);
    const bIndex = preferredZones.indexOf(b.zone);

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return a.zone.localeCompare(b.zone);
  });
}

function formatPickupLabel(label: string) {
  return label
    .replace(" - ", " — ")
    .replace("Porto d'Ischia", "Porto d’Ischia")
    .replace("Sant'Angelo", "Sant’Angelo");
}

export function PickupPointsSection({
  locale,
  pickupPoints
}: {
  locale: Locale;
  pickupPoints: PublicPickupPoint[];
}) {
  const points = sortPickupPoints(pickupPoints);

  return (
    <section className="pickup-section reveal" aria-label={locale === "it" ? "Punti ritiro IschiaMotion" : "IschiaMotion Pickup Points"}>
      <div className="pickup-section-header">
        <div>
          <div className="section-eyebrow">{locale === "it" ? "Punti ritiro" : "Pickup points"}</div>
          <h2 className="section-title">{locale === "it" ? "Punti ritiro IschiaMotion" : "IschiaMotion Pickup Points"}</h2>
        </div>
        <p>
          {locale === "it"
            ? "Ritira il tuo mezzo nei punti IschiaMotion distribuiti sull’isola. Il cliente vede solo il punto ritiro brandizzato, non il nome del singolo noleggiatore."
            : "Pick up your vehicle at branded IschiaMotion points across the island. Customers see only the branded pickup point, not the individual rental company name."}
        </p>
      </div>

      <div className="pickup-section-body">
        <div className="pickup-map" aria-hidden="true">
          <svg className="island-shape" viewBox="0 0 420 260" role="img" focusable="false">
            <path
              d="M39 139C56 101 88 78 126 66c28-9 52-8 79-22 24-13 56-24 94-15 38 10 67 37 78 73 11 38-2 77-24 105-24 30-58 45-99 45-32 0-56-12-82-16-31-5-59 7-88-3-38-13-60-45-45-94Z"
              className="island-main"
            />
            <path d="M97 108c31-16 70-11 103-27 34-17 77-31 113-13" className="island-line" />
            <path d="M118 188c33 10 60-6 94 0 26 5 48 19 82 10" className="island-line" />
            <circle cx="305" cy="70" r="11" className="island-lake" />
          </svg>
          {points.slice(0, 5).map((point, index) => (
            <span className={`map-pin ${markerClasses[point.zone] || `pin-${index + 1}`}`} key={point.id}>{index + 1}</span>
          ))}
        </div>

        <div className="pickup-list">
          {points.map((point, index) => {
            const label = locale === "it" ? point.public_label_it : point.public_label_en;
            const description = locale === "it" ? point.description_it : point.description_en;

            return (
              <article className="pickup-point-card" key={point.id}>
                <span className="pickup-index">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{formatPickupLabel(label)}</h3>
                  <p>{description || point.zone}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
