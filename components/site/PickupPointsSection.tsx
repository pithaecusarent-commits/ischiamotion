import type { Locale, PublicPickupPoint } from "@/lib/types";
import { IschiaPickupMap } from "./IschiaPickupMap";

const publicPickupZones = ["Ischia Porto", "Casamicciola", "Lacco Ameno", "Forio"];
const preferredZones = publicPickupZones;

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

function formatPickupTitle(point: PublicPickupPoint, locale: Locale) {
  const titles: Record<string, Record<Locale, string>> = {
    "Ischia Porto": {
      it: "Point Porto d’Ischia",
      en: "Ischia Port Point"
    },
    Casamicciola: {
      it: "Point Casamicciola",
      en: "Casamicciola Point"
    },
    "Lacco Ameno": {
      it: "Point Lacco Ameno",
      en: "Lacco Ameno Point"
    },
    Forio: {
      it: "Point Forio",
      en: "Forio Point"
    }
  };

  return titles[point.zone]?.[locale] ?? formatPickupLabel(locale === "it" ? point.public_label_it : point.public_label_en);
}

export function PickupPointsSection({
  locale,
  pickupPoints
}: {
  locale: Locale;
  pickupPoints: PublicPickupPoint[];
}) {
  const points = sortPickupPoints(pickupPoints.filter((point) => publicPickupZones.includes(point.zone)));

  return (
    <section className="pickup-section reveal" aria-label={locale === "it" ? "Zone ritiro e consegna IschiaMotion" : "IschiaMotion pickup and delivery areas"}>
      <div className="pickup-section-header">
        <div>
          <div className="section-eyebrow">{locale === "it" ? "Ritiro e consegna" : "Pickup and delivery"}</div>
          <h2 className="section-title">
            {locale === "it" ? (
              <>
                Zone e punti di ritiro <span className="brand-title-accent">IschiaMotion Point</span>
              </>
            ) : (
              <>
                <span className="brand-title-accent">IschiaMotion Points</span> and delivery areas
              </>
            )}
          </h2>
        </div>
      </div>

      <div className="pickup-section-body">
        <IschiaPickupMap points={points.slice(0, 6)} />

        <div className="pickup-content">
          <div className="pickup-list">
            {points.map((point, index) => {
              const description = locale === "it" ? point.description_it : point.description_en;

              return (
                <article className="pickup-point-card" key={point.id}>
                  <span className="pickup-index">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{formatPickupTitle(point, locale)}</h3>
                    <p>{description || point.zone}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="pickup-note">
            {locale === "it"
              ? "Puoi scegliere uno dei 4 IschiaMotion Point per il ritiro. Se preferisci la consegna, indicaci hotel o indirizzo: la verifichiamo con il partner locale in tutta l’isola, secondo disponibilità e condizioni."
              : "Choose one of the 4 IschiaMotion Points for pickup. If you prefer delivery, tell us your hotel or address: we check island-wide delivery with the local partner, subject to availability and conditions."}
          </p>
        </div>
      </div>
    </section>
  );
}
