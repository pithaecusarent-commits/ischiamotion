import type { Locale, PublicPickupPoint } from "@/lib/types";

const preferredZones = ["Ischia Porto", "Casamicciola", "Lacco Ameno", "Forio", "Sant'Angelo", "Barano"];
const markerClasses: Record<string, string> = {
  "Ischia Porto": "pin-port",
  Casamicciola: "pin-casamicciola",
  "Lacco Ameno": "pin-lacco",
  Forio: "pin-forio",
  "Sant'Angelo": "pin-sant-angelo",
  Barano: "pin-barano"
};
const labelClasses: Record<string, string> = {
  "Ischia Porto": "label-port",
  Casamicciola: "label-casamicciola",
  "Lacco Ameno": "label-lacco",
  Forio: "label-forio",
  "Sant'Angelo": "label-sant-angelo",
  Barano: "label-barano"
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
              d="M75 83c-12-8-13-24 1-31 10-5 18 5 28 7 23 4 39 7 61 5 29-2 38 12 61 16 22 4 36-4 51 11 11 11 11 25 28 31 15 5 27 10 29 27 2 16-8 27-24 29-32 4-55 2-84 17-27 14-57 29-94 20-24-6-49-2-72-11-18-7-31-21-26-35 3-10 15-9 20-17 7-11-8-22-4-36 3-11 17-20 25-33Z"
              className="island-fill"
            />
            <path
              d="M75 83c-12-8-13-24 1-31 10-5 18 5 28 7 23 4 39 7 61 5 29-2 38 12 61 16 22 4 36-4 51 11 11 11 11 25 28 31 15 5 27 10 29 27 2 16-8 27-24 29-32 4-55 2-84 17-27 14-57 29-94 20-24-6-49-2-72-11-18-7-31-21-26-35 3-10 15-9 20-17 7-11-8-22-4-36 3-11 17-20 25-33Z"
              className="island-main"
            />
            <path d="M330 228 Q353 218 378 228 Q396 235 412 226" className="island-wave island-wave-gold" />
            <path d="M348 244 Q368 236 390 244" className="island-wave island-wave-short island-wave-gold" />
          </svg>
          {points.slice(0, 6).map((point, index) => (
            <span className={`map-pin ${markerClasses[point.zone] || `pin-${index + 1}`}`} key={point.id}>{index + 1}</span>
          ))}
          {points.slice(0, 6).map((point, index) => (
            <span className={`map-label ${labelClasses[point.zone] || `label-${index + 1}`}`} key={`${point.id}-label`}>
              {point.zone}
            </span>
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
