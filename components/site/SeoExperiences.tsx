import type { Locale } from "@/lib/types";
import { Fragment } from "react";

const content = {
  it: [
    {
      id: "spiagge-e-calette",
      eyebrow: "Spiagge e calette",
      title: "Noleggio scooter Ischia: trova l’opzione giusta per le spiagge.",
      text: "IschiaMotion ti aiuta a richiedere scooter, bici elettriche o auto tramite partner locali selezionati per muoverti tra Maronti, Citara, San Montano e le calette più tranquille dell'isola."
    },
    {
      id: "borghi-e-panorami",
      eyebrow: "Borghi e panorami",
      title: "Noleggio auto Ischia ed e-bike per scoprire l’isola oltre il porto.",
      text: "Da Ischia Ponte a Forio, da Casamicciola a Barano, IschiaMotion facilita richieste per noleggio auto Ischia, noleggio e-bike Ischia e scooter tramite partner selezionati."
    },
    {
      id: "giornate-in-mare",
      eyebrow: "Giornate in mare",
      title: "Noleggio barche Ischia, gommoni e Beach Club.",
      text: "Per chi vuole vivere il mare, IschiaMotion raccoglie richieste per noleggio gommoni Ischia, noleggio barche Ischia e Beach Club tramite partner e strutture locali selezionate."
    }
  ],
  en: [
    {
      id: "spiagge-e-calette",
      eyebrow: "Beaches and coves",
      title: "Scooter rental Ischia: find the right option for the beaches.",
      text: "IschiaMotion helps you request scooters, e-bikes or cars through selected local partners to move between Maronti, Citara, San Montano and quieter coves."
    },
    {
      id: "borghi-e-panorami",
      eyebrow: "Villages and views",
      title: "Car rental Ischia and e-bike rental to explore beyond the port.",
      text: "From Ischia Ponte to Forio, from Casamicciola to Barano, IschiaMotion facilitates requests for car rental Ischia, e-bike rental Ischia and scooter options through selected partners."
    },
    {
      id: "giornate-in-mare",
      eyebrow: "Days at sea",
      title: "Boat rental Ischia, rubber dinghies and Beach Clubs.",
      text: "For guests who want to enjoy the sea, IschiaMotion collects requests for rubber dinghy rental Ischia, boat rental Ischia and Beach Clubs through selected local partners and venues."
    }
  ]
} satisfies Record<Locale, Array<{ id: string; eyebrow: string; title: string; text: string }>>;

const categoryLinks = {
  it: [
    ["Noleggio scooter Ischia", "/it/noleggio-scooter-ischia"],
    ["Noleggio auto Ischia", "/it/noleggio-auto-ischia"],
    ["Noleggio bici elettriche Ischia", "/it/noleggio-bici-elettriche-ischia"],
    ["Noleggio gommoni Ischia", "/it/noleggio-gommoni-ischia"],
    ["Noleggio barche Ischia", "/it/noleggio-barche-ischia"],
    ["Beach Club Ischia", "/it/beach-club-ischia"],
    ["Cosa vedere a Ischia senza auto", "/it/cosa-vedere-a-ischia-senza-auto"]
  ],
  en: [
    ["Scooter rental Ischia", "/en/scooter-rental-ischia"],
    ["Car rental Ischia", "/en/car-rental-ischia"],
    ["E-bike rental Ischia", "/en/e-bike-rental-ischia"],
    ["Rubber dinghy rental Ischia", "/en/rubber-dinghy-rental-ischia"],
    ["Boat rental Ischia", "/en/boat-rental-ischia"],
    ["Ischia Beach Club", "/en/ischia-beach-club"],
    ["What to See in Ischia Without a Car", "/en/what-to-see-in-ischia-without-a-car"]
  ]
} satisfies Record<Locale, Array<[string, string]>>;

export function SeoExperiences({ locale }: { locale: Locale }) {
  return (
    <section className="seo-section reveal" aria-label={locale === "it" ? "Esperienze a Ischia" : "Ischia experiences"}>
      <div className="section-header">
        <div>
          <div className="section-eyebrow">{locale === "it" ? "Guide rapide" : "Quick guides"}</div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: locale === "it" ? "Vivi Ischia<br><em>con il mezzo giusto</em>" : "Experience Ischia<br><em>with the right ride</em>" }} />
        </div>
      </div>

      <div className="seo-grid">
        {content[locale].map((item) => (
          <article className="seo-card" id={item.id} key={item.id}>
            <div className="section-eyebrow">{item.eyebrow}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <a href={
              item.id === "giornate-in-mare"
                ? locale === "it" ? "/it/noleggio-gommoni-ischia" : "/en/rubber-dinghy-rental-ischia"
                : "#prenota"
            }>
              {item.id === "giornate-in-mare"
                ? locale === "it" ? "Scopri i gommoni →" : "Explore rubber dinghies →"
                : locale === "it" ? "Trova il mezzo più adatto →" : "Find the right vehicle →"}
            </a>
          </article>
        ))}
      </div>

      <div className="mt-6 seo-landing-pickups" aria-label={locale === "it" ? "Categorie noleggio Ischia" : "Ischia rental categories"}>
        {categoryLinks[locale].map(([label, href], index) => (
          <Fragment key={href}>
            {index > 0 ? <span className="seo-link-separator" aria-hidden="true">·</span> : null}
            <a href={href}>{label}</a>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
