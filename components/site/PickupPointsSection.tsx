import type { Locale, PublicPickupPoint } from "@/lib/types";
import { IschiaPickupMap } from "./IschiaPickupMap";

const preferredZones = ["Ischia Porto", "Casamicciola", "Lacco Ameno", "Forio", "Sant'Angelo", "Barano"];

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
          <h2 className="section-title">
            {locale === "it" ? (
              <>
                Punti ritiro <span className="brand-title-accent">IschiaMotion</span>
              </>
            ) : (
              <>
                <span className="brand-title-accent">IschiaMotion</span> Pickup Points
              </>
            )}
          </h2>
        </div>
        <p>
          {locale === "it"
            ? "Organizziamo ritiro o consegna nella zona più comoda per il tuo soggiorno, secondo disponibilità: indicaci porto, hotel o località e verifichiamo subito la soluzione più pratica."
            : "We organize pickup or delivery in the most convenient area for your stay, based on availability: tell us the port, hotel or area and we'll check the most practical option right away."}
        </p>
      </div>

      <div className="pickup-section-body">
        <IschiaPickupMap points={points.slice(0, 6)} />

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
