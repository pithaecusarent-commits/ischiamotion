import type { Locale } from "@/lib/types";

const content = {
  it: [
    {
      id: "spiagge-e-calette",
      eyebrow: "Spiagge e calette",
      title: "Noleggia uno scooter a Ischia e raggiungi il mare piu' bello.",
      text: "Con IschiaMotion puoi scegliere scooter, bici elettriche o auto per muoverti tra Maronti, Citara, San Montano e le calette piu' tranquille dell'isola. I punti ritiro brandizzati rendono la partenza semplice e riconoscibile."
    },
    {
      id: "borghi-e-panorami",
      eyebrow: "Borghi e panorami",
      title: "Auto, scooter ed e-bike per scoprire Ischia oltre il porto.",
      text: "Da Ischia Ponte a Forio, da Casamicciola a Barano, il noleggio veicoli a Ischia diventa piu' comodo quando puoi scegliere la categoria giusta e ritirare presso un IschiaMotion Point vicino al tuo itinerario."
    },
    {
      id: "giornate-in-mare",
      eyebrow: "Giornate in mare",
      title: "Barche e gommoni a Ischia per vivere la costa dal mare.",
      text: "Per chi vuole vedere l'isola da un'altra prospettiva, IschiaMotion raccoglie richieste per barche e gommoni con punti ritiro chiari, informazioni essenziali e un'esperienza coerente con il resto del viaggio."
    }
  ],
  en: [
    {
      id: "spiagge-e-calette",
      eyebrow: "Beaches and coves",
      title: "Rent a scooter in Ischia and reach the island's best beaches.",
      text: "With IschiaMotion you can choose scooters, e-bikes or cars to move between Maronti, Citara, San Montano and quieter coves. Branded pickup points make every start simple and recognizable."
    },
    {
      id: "borghi-e-panorami",
      eyebrow: "Villages and views",
      title: "Cars, scooters and e-bikes to explore beyond the port.",
      text: "From Ischia Ponte to Forio, from Casamicciola to Barano, vehicle rental in Ischia becomes easier when you can choose the right category and pick up at an IschiaMotion Point near your route."
    },
    {
      id: "giornate-in-mare",
      eyebrow: "Days at sea",
      title: "Boat and rib rental in Ischia for a different view of the coast.",
      text: "For guests who want to see the island from the water, IschiaMotion collects requests for boats and ribs with clear pickup points, essential information and a consistent travel experience."
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
            <a href="#prenota">{locale === "it" ? "Cerca disponibilita' →" : "Search availability →"}</a>
          </article>
        ))}
      </div>
    </section>
  );
}
