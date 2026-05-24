import type { Locale } from "@/lib/types";

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
      title: "Noleggio barche Ischia, gommoni e barca con skipper.",
      text: "Per chi vuole vedere l'isola dal mare, IschiaMotion raccoglie richieste per noleggio gommoni Ischia, noleggio barche Ischia e barca con skipper Ischia tramite partner nautici selezionati."
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
      title: "Boat rental Ischia, rubber dinghies and boat with skipper.",
      text: "For guests who want to see the island from the water, IschiaMotion collects requests for rubber dinghy rental Ischia, boat rental Ischia and boat with skipper Ischia through selected nautical partners."
    }
  ]
} satisfies Record<Locale, Array<{ id: string; eyebrow: string; title: string; text: string }>>;

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
            <a href="#prenota">{locale === "it" ? "Richiedi disponibilità →" : "Request availability →"}</a>
          </article>
        ))}
      </div>
    </section>
  );
}
