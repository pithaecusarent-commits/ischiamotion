import type { Locale, VehicleFilter } from "@/lib/types";

type ValueItem = {
  title: string;
  text: string;
};

const homeItems: Record<Locale, ValueItem[]> = {
  it: [
    {
      title: "Un’unica richiesta, più soluzioni locali",
      text: "Invece di contattare diversi noleggiatori, invii una sola richiesta e verifichiamo le opzioni disponibili con partner locali selezionati."
    },
    {
      title: "Ti aiutiamo a scegliere in base alla zona",
      text: "Porto di arrivo, hotel, spiagge, bagagli e durata del soggiorno possono cambiare il mezzo più adatto."
    },
    {
      title: "Risposta in pochi minuti",
      text: "Verifichiamo subito disponibilità, prezzo, condizioni e punto di ritiro con i nostri partner locali. Ricevi rapidamente la soluzione più comoda per le tue date."
    },
    {
      title: "Supporto locale su WhatsApp",
      text: "Puoi ricevere indicazioni pratiche prima del ritiro, della consegna o della giornata in mare."
    }
  ],
  en: [
    {
      title: "One request, multiple local options",
      text: "Instead of contacting several rental providers, you send one request and we review available options with selected local partners."
    },
    {
      title: "We help you choose by area",
      text: "Arrival port, hotel location, beaches, luggage and stay length can change which option fits best."
    },
    {
      title: "A reply within minutes",
      text: "We instantly check availability, price, conditions and pickup point with our local partners. Get the most convenient option for your dates, fast."
    },
    {
      title: "Local WhatsApp support",
      text: "You can get practical guidance before pickup, delivery or your day at sea."
    }
  ]
};

const categoryItems: Record<Locale, Partial<Record<VehicleFilter, ValueItem[]>>> = {
  it: {
    scooter: [
      {
        title: "Non sai se lo scooter è adatto alla tua zona?",
        text: "Ti aiutiamo a valutare distanza, bagagli, salite, porto di arrivo e punto di ritiro prima della conferma."
      },
      {
        title: "Una richiesta, verifica reale",
        text: "Indichi date e preferenze: IschiaMotion controlla disponibilità e condizioni con partner locali selezionati."
      },
      {
        title: "Supporto pratico",
        text: "Se hai dubbi su casco, patente, consegna o ritiro, puoi chiedere supporto locale su WhatsApp."
      }
    ],
    auto: [
      {
        title: "Utile se hai bagagli o famiglia",
        text: "L’auto può essere più adatta se dormi lontano dai centri principali, viaggi con bambini o hai molte valigie."
      },
      {
        title: "Zona e ritiro contano",
        text: "Porto, hotel, Forio, Barano o Sant’Angelo cambiano disponibilità e condizioni: le verifichiamo con il partner."
      },
      {
        title: "Risposta in pochi minuti",
        text: "Controlliamo subito disponibilità, prezzo e condizioni operative e ti inviamo rapidamente la proposta."
      }
    ],
    bici: [
      {
        title: "Percorsi e autonomia",
        text: "Ti aiutiamo a capire se l’e-bike è adatta a zona, salite, distanza e durata del noleggio."
      },
      {
        title: "Opzione leggera, se compatibile",
        text: "È pratica per lungomare e borghi, ma va valutata con bagagli, bambini o strutture lontane dal porto."
      },
      {
        title: "Disponibilità verificata",
        text: "Ritiro, eventuale consegna e dotazioni dipendono dal partner e vengono confermati dopo controllo."
      }
    ],
    gommone: [
      {
        title: "Meteo, durata e punto nautico",
        text: "Disponibilità, itinerari e condizioni dipendono da periodo, meteo, durata e tipologia di uscita."
      },
      {
        title: "Sicurezza prima di tutto",
        text: "Meteo, requisiti nautici, capienza e punto di partenza vengono verificati subito, per offrirti una soluzione sicura e adatta alla tua giornata."
      },
      {
        title: "Aiuto nella scelta",
        text: "Se hai dubbi tra gommone, barca o Beach / Pool Club, ti aiutiamo a orientare la richiesta."
      }
    ],
    barca: [
      {
        title: "Uscita in mare da verificare",
        text: "Disponibilità, itinerari e condizioni dipendono da periodo, meteo, durata, requisiti e tipologia di uscita."
      },
      {
        title: "Punto di partenza chiaro",
        text: "Per le categorie nautiche il punto di imbarco viene confermato dopo verifica con il partner."
      },
      {
        title: "Supporto locale",
        text: "Ti aiutiamo a chiarire differenze tra barca, gommone e soluzioni più comode per la giornata."
      }
    ],
    beach_club: [
      {
        title: "La giornata giusta, nella zona giusta",
        text: "Ti aiutiamo a verificare disponibilità, zona, servizi inclusi e soluzione più adatta alla giornata."
      },
      {
        title: "Servizi da confermare",
        text: "Lettini, ombrelloni, pranzo, accesso e orari dipendono dalla struttura e dalla disponibilità reale."
      },
      {
        title: "Richiesta semplice",
        text: "Indichi data, persone e preferenze: IschiaMotion controlla le opzioni con partner locali selezionati."
      }
    ]
  },
  en: {
    scooter: [
      {
        title: "Not sure a scooter fits your area?",
        text: "We help you review distance, luggage, hills, arrival port and pickup point before confirmation."
      },
      {
        title: "One request, real review",
        text: "Share dates and preferences: IschiaMotion checks availability and conditions with selected local partners."
      },
      {
        title: "Practical support",
        text: "If you have questions about helmet, license, delivery or pickup, you can ask for local WhatsApp support."
      }
    ],
    auto: [
      {
        title: "Useful with luggage or family",
        text: "A car may fit better if you stay away from main towns, travel with children or carry several bags."
      },
      {
        title: "Area and pickup matter",
        text: "Port, hotel, Forio, Barano or Sant’Angelo can change availability and conditions: we review them with the partner."
      },
      {
        title: "A reply within minutes",
        text: "We instantly check availability, price and operating conditions and quickly send you the proposal."
      }
    ],
    bici: [
      {
        title: "Routes and battery range",
        text: "We help you understand whether an e-bike fits your area, hills, distance and rental length."
      },
      {
        title: "Light option, when suitable",
        text: "It works well for seafronts and villages, but luggage, children or remote hotels may change the best choice."
      },
      {
        title: "Availability is reviewed",
        text: "Pickup, possible delivery and equipment depend on the partner and are confirmed after review."
      }
    ],
    gommone: [
      {
        title: "Weather, length and nautical point",
        text: "Availability, itineraries and conditions depend on season, weather, rental length and type of sea outing."
      },
      {
        title: "Safety comes first",
        text: "Weather, boating requirements, capacity and departure point are checked right away, for a safe option that fits your day."
      },
      {
        title: "Help choosing",
        text: "If you are unsure between rubber dinghy, boat or Beach / Pool Club, we help orient your request."
      }
    ],
    barca: [
      {
        title: "Sea outing to review",
        text: "Availability, itineraries and conditions depend on season, weather, duration, requirements and type of outing."
      },
      {
        title: "Clear departure point",
        text: "For nautical categories, the boarding point is confirmed after partner review."
      },
      {
        title: "Local support",
        text: "We help clarify differences between boat, rubber dinghy and more comfortable options for the day."
      }
    ],
    beach_club: [
      {
        title: "The right day, in the right area",
        text: "We help review availability, area, included services and the option that best fits your day."
      },
      {
        title: "Services to confirm",
        text: "Sunbeds, umbrellas, lunch, access and timing depend on the venue and real availability."
      },
      {
        title: "Simple request",
        text: "Share date, guests and preferences: IschiaMotion checks options with selected local partners."
      }
    ]
  }
};

export function ValueProposition({
  locale,
  category
}: {
  locale: Locale;
  category?: VehicleFilter;
}) {
  const items = category ? categoryItems[locale][category] ?? homeItems[locale] : homeItems[locale];
  const isHome = !category;

  return (
    <section className={isHome ? "value-section reveal" : "seo-landing-section value-section-landing"} aria-labelledby={isHome ? "value-title" : "category-value-title"}>
      <div className="section-header">
        <div>
          <div className="section-eyebrow">
            {locale === "it" ? "Perché passare da noi" : "Why use us"}
          </div>
          <h2 id={isHome ? "value-title" : "category-value-title"} className="section-title">
            {isHome
              ? (locale === "it" ? "Un solo punto per trovare il mezzo giusto a Ischia" : "One place to find the right option in Ischia")
              : (locale === "it" ? "Prima scegliamo la soluzione adatta, poi confermiamo" : "First we find the right fit, then we confirm")}
          </h2>
        </div>
      </div>
      <div className="value-grid">
        {items.map((item) => (
          <article className="value-card" key={item.title}>
            <span aria-hidden="true">✓</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
