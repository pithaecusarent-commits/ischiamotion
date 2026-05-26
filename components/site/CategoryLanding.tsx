import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { JsonLd } from "@/components/site/JsonLd";
import { SeoFaqSection } from "@/components/site/SeoFaqSection";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import type { CategoryLandingContent } from "@/lib/category-landings";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd, siteUrl } from "@/lib/seo";

function getSearchPath(content: CategoryLandingContent) {
  const basePath = content.locale === "it" ? "/it/risultati" : "/en/results";
  return `${basePath}?category=${encodeURIComponent(content.categoryParam)}`;
}

function getWhatsAppUrl(locale: CategoryLandingContent["locale"]) {
  const message = locale === "it"
    ? "Ciao IschiaMotion, vorrei verificare la disponibilità per un noleggio a Ischia."
    : "Hello IschiaMotion, I would like to check availability for a rental in Ischia.";

  return `https://wa.me/393285353722?text=${encodeURIComponent(message)}`;
}

function getInternalLinks(locale: CategoryLandingContent["locale"]) {
  if (locale === "it") {
    return [
      ["Home", "/it"],
      ["Verifica disponibilità", "/it/risultati"],
      ["Scooter", "/it/noleggio-scooter-ischia"],
      ["Auto", "/it/noleggio-auto-ischia"],
      ["E-bike", "/it/noleggio-bici-elettriche-ischia"],
      ["Gommoni", "/it/noleggio-gommoni-ischia"],
      ["Barche", "/it/noleggio-barche-ischia"],
      ["Barca con skipper", "/it/barca-con-skipper-ischia"],
      ["Contatti", "/it/contatti"]
    ];
  }

  return [
    ["Home", "/en"],
    ["Check availability", "/en/results"],
    ["Scooter", "/en/scooter-rental-ischia"],
    ["Cars", "/en/car-rental-ischia"],
    ["E-bikes", "/en/e-bike-rental-ischia"],
    ["Rubber dinghies", "/en/rubber-dinghy-rental-ischia"],
    ["Boats", "/en/boat-rental-ischia"],
    ["Boat with skipper", "/en/boat-with-skipper-ischia"],
    ["Contact", "/en/contact"]
  ];
}

const landingGuides = {
  it: {
    auto: {
      pickupTitle: "Ritiro e consegna auto a Ischia",
      pickupItems: [
        ["Porto e arrivi", "Ischia Porto e Casamicciola sono zone decisive quando arrivi con traghetto, aliscafo o bagagli: puoi indicarle nella richiesta e attendere verifica del partner."],
        ["Hotel e strutture", "Per auto e spostamenti familiari può essere utile chiedere consegna in hotel o presso una struttura ricettiva, dove prevista dal partner locale."],
        ["Comuni più distanti", "Forio, Barano, Lacco Ameno e Sant'Angelo richiedono pianificazione migliore: ritiro, orari e disponibilità vengono confermati dopo controllo."]
      ],
      practicalTitle: "Cosa sapere prima di richiedere un'auto",
      practicalItems: [
        ["Documenti e patente", "Prepara patente valida, documento e dati di contatto. Età minima, categoria veicolo ed eventuali requisiti dipendono dal partner."],
        ["Cauzione e condizioni", "Cauzione, coperture e franchigie non vanno date per scontate: IschiaMotion le verifica prima della conferma finale."],
        ["Quando valutare altro", "Se viaggi leggero e resti tra porto, spiagge e centro, scooter o e-bike possono essere più agili; con famiglia e bagagli l'auto resta più comoda."]
      ]
    },
    ebike: {
      pickupTitle: "Ritiro e percorsi e-bike a Ischia",
      pickupItems: [
        ["Borghi e lungomare", "Ischia Porto, Casamicciola, Forio e Lacco Ameno sono pratici per tratti più leggeri, soste frequenti e percorsi panoramici vicino al mare."],
        ["Salite e distanze", "Barano e alcune zone interne possono richiedere più attenzione a pendenze, autonomia e traffico: meglio indicare il percorso previsto nella richiesta."],
        ["Hotel dove previsto", "La consegna presso hotel o struttura può essere disponibile solo per alcuni partner e zone; viene sempre verificata prima della conferma."]
      ],
      practicalTitle: "Cosa sapere prima di richiedere un'e-bike",
      practicalItems: [
        ["Autonomia", "Chiedi opzioni coerenti con durata e tragitto. Le salite dell'isola incidono su batteria e comfort."],
        ["Dotazioni", "Casco, lucchetto, caricatore e accessori dipendono dal partner selezionato e vengono confermati dopo verifica."],
        ["Quando valutare altro", "Per bagagli, bambini piccoli o hotel molto distanti dal porto può essere più indicata un'auto; per spostamenti rapidi uno scooter."]
      ]
    },
    gommone: {
      pickupTitle: "Ritiro gommoni e punti nautici",
      pickupItems: [
        ["Punto definito", "Per i gommoni non è prevista consegna in hotel: il ritiro avviene presso punto nautico indicato o IschiaMotion Point, secondo partner."],
        ["Costa e calette", "Ischia Porto, Casamicciola, Forio, Lacco Ameno e Sant'Angelo possono essere riferimenti utili per scegliere zona di partenza e rientro."],
        ["Meteo e mare", "Vento, mare e condizioni operative possono cambiare la disponibilità anche dopo la richiesta iniziale."]
      ],
      practicalTitle: "Cosa sapere prima di richiedere un gommone",
      practicalItems: [
        ["Patente nautica", "Dipende dal mezzo e dalla motorizzazione. Requisiti, documenti e capienza vengono verificati con il partner."],
        ["Gommone o barca", "Il gommone è spesso più agile per costa e calette; la barca può offrire più spazio e comfort, secondo modello."],
        ["Quando valutare skipper", "Se non vuoi gestire conduzione, rotta o condizioni marine, la barca con skipper è la scelta più rilassata."]
      ]
    },
    barca: {
      pickupTitle: "Ritiro barche e aree di partenza",
      pickupItems: [
        ["Punto nautico", "Il ritiro barca avviene presso un punto definito o IschiaMotion Point. Per le categorie nautiche non si parla di consegna in hotel."],
        ["Costa dell'isola", "Ischia Porto, Casamicciola, Forio, Lacco Ameno e Sant'Angelo aiutano a orientare partenza, tratte e tempi, ma la disponibilità dipende dai partner."],
        ["Condizioni marine", "Meteo, vento, orari e regole operative sono parte della verifica prima della conferma."]
      ],
      practicalTitle: "Cosa sapere prima di richiedere una barca",
      practicalItems: [
        ["Requisiti", "Barca senza skipper solo dove prevista dal partner e se requisiti, documenti e condizioni sono compatibili."],
        ["Barca o gommone", "La barca è utile se cerchi più comfort e spazio; il gommone può essere più essenziale e agile."],
        ["Quando scegliere skipper", "Se vuoi solo goderti costa e calette senza occuparti della conduzione, valuta la pagina barca con skipper."]
      ]
    },
    skipper: {
      pickupTitle: "Partenza con skipper a Ischia",
      pickupItems: [
        ["Punti nautici", "La partenza viene coordinata presso punto nautico definito o IschiaMotion Point, secondo disponibilità del partner."],
        ["Zone panoramiche", "Ischia Porto, Forio, Lacco Ameno e Sant'Angelo sono riferimenti utili per esperienze via mare, calette e costa più scenografica."],
        ["Orari e meteo", "Itinerario, fascia oraria e durata sono confermati solo dopo verifica di disponibilità e condizioni marine."]
      ],
      practicalTitle: "Cosa sapere prima di richiedere una barca con skipper",
      practicalItems: [
        ["Nessuna conduzione", "La formula è pensata per chi non vuole gestire mezzo, rotta o manovre. Le condizioni finali restano quelle del partner."],
        ["Preferenze", "Indica coppia, famiglia o gruppo, orari desiderati e tipo di esperienza: relax, calette, costa o occasione speciale."],
        ["Quando scegliere altro", "Se hai requisiti e vuoi autonomia, può bastare una barca senza skipper; se cerchi agilità essenziale, valuta il gommone."]
      ]
    }
  },
  en: {
    auto: {
      pickupTitle: "Car pickup and delivery in Ischia",
      pickupItems: [
        ["Ports and arrivals", "Ischia Port and Casamicciola matter when you arrive by ferry, hydrofoil or with luggage. Add them to the request and wait for partner review."],
        ["Hotels and stays", "For families, hotel or accommodation delivery may be useful where offered by the local partner."],
        ["Further towns", "Forio, Barano, Lacco Ameno and Sant'Angelo need better planning: pickup, timing and availability are confirmed after review."]
      ],
      practicalTitle: "What to know before requesting a car",
      practicalItems: [
        ["Documents and license", "Prepare a valid driving license, ID and contact details. Age, vehicle category and requirements depend on the partner."],
        ["Deposit and conditions", "Deposit, coverage and excess are not automatic: IschiaMotion checks them before final confirmation."],
        ["When to choose another option", "If you travel light around port, beaches and town centers, scooter or e-bike may be easier; with family and luggage, a car is more comfortable."]
      ]
    },
    ebike: {
      pickupTitle: "E-bike pickup and routes in Ischia",
      pickupItems: [
        ["Villages and seafronts", "Ischia Port, Casamicciola, Forio and Lacco Ameno work well for lighter rides, frequent stops and scenic seafront routes."],
        ["Hills and distance", "Barano and inland areas require more attention to gradients, range and traffic: share your planned route in the request."],
        ["Hotels where available", "Hotel or accommodation delivery may be available only with some partners and areas, always after review."]
      ],
      practicalTitle: "What to know before requesting an e-bike",
      practicalItems: [
        ["Range", "Ask for options that fit rental length and route. Ischia's hills affect battery and comfort."],
        ["Equipment", "Helmet, lock, charger and accessories depend on the selected partner and are confirmed after review."],
        ["When to choose another option", "For luggage, small children or accommodation far from the port, a car may fit better; for quick moves, a scooter."]
      ]
    },
    gommone: {
      pickupTitle: "Rubber dinghy pickup and nautical points",
      pickupItems: [
        ["Defined point", "Rubber dinghies are not delivered to hotels: pickup is at an indicated nautical point or IschiaMotion Point, depending on partner."],
        ["Coast and coves", "Ischia Port, Casamicciola, Forio, Lacco Ameno and Sant'Angelo help choose departure and return areas."],
        ["Weather and sea", "Wind, sea state and operational conditions can affect availability even after the first request."]
      ],
      practicalTitle: "What to know before requesting a rubber dinghy",
      practicalItems: [
        ["Boating license", "It depends on the vehicle and engine. Requirements, documents and capacity are reviewed with the partner."],
        ["Rubber dinghy or boat", "A rubber dinghy is often agile for coast and coves; a boat may offer more space and comfort, depending on model."],
        ["When to choose skipper", "If you do not want to manage navigation, route or sea conditions, boat with skipper is more relaxed."]
      ]
    },
    barca: {
      pickupTitle: "Boat pickup and departure areas",
      pickupItems: [
        ["Nautical point", "Boat pickup is at a defined point or IschiaMotion Point. Nautical categories do not use hotel delivery."],
        ["Island coast", "Ischia Port, Casamicciola, Forio, Lacco Ameno and Sant'Angelo help plan departure, route and timing, subject to partner availability."],
        ["Marine conditions", "Weather, wind, timing and operating rules are part of the review before confirmation."]
      ],
      practicalTitle: "What to know before requesting a boat",
      practicalItems: [
        ["Requirements", "Boat rental without skipper is available only where offered by the partner and when documents and conditions match."],
        ["Boat or rubber dinghy", "A boat is useful for more comfort and space; a rubber dinghy can be simpler and more agile."],
        ["When to choose skipper", "If you want coast and coves without handling navigation, consider boat with skipper."]
      ]
    },
    skipper: {
      pickupTitle: "Boat with skipper departure in Ischia",
      pickupItems: [
        ["Nautical points", "Departure is coordinated at a defined nautical point or IschiaMotion Point, depending on partner availability."],
        ["Scenic areas", "Ischia Port, Forio, Lacco Ameno and Sant'Angelo are useful references for sea experiences, coves and scenic coast."],
        ["Timing and weather", "Route, timing and duration are confirmed only after availability and marine conditions are reviewed."]
      ],
      practicalTitle: "What to know before requesting boat with skipper",
      practicalItems: [
        ["No navigation to manage", "This option is for guests who do not want to handle the boat, route or maneuvers. Final conditions remain partner-based."],
        ["Preferences", "Share couple, family or group size, preferred timing and experience type: relax, coves, coast or special occasion."],
        ["When to choose another option", "If you meet requirements and want autonomy, boat rental may fit; if you want a simpler agile option, consider a rubber dinghy."]
      ]
    }
  }
} satisfies Record<CategoryLandingContent["locale"], Record<CategoryLandingContent["key"], {
  pickupTitle: string;
  pickupItems: Array<[string, string]>;
  practicalTitle: string;
  practicalItems: Array<[string, string]>;
}>>;

function webpageJsonLd(content: CategoryLandingContent) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: content.title,
    description: content.metaDescription,
    url: `${siteUrl}${content.path}`,
    inLanguage: content.locale,
    isPartOf: {
      "@type": "WebSite",
      name: "IschiaMotion",
      url: siteUrl
    }
  };
}

export function CategoryLanding({ content }: { content: CategoryLandingContent }) {
  const homePath = content.locale === "it" ? "/it" : "/en";
  const searchPath = getSearchPath(content);
  const whatsappUrl = getWhatsAppUrl(content.locale);
  const internalLinks = [...getInternalLinks(content.locale), [content.primaryCta, searchPath]];
  const guide = landingGuides[content.locale][content.key];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "IschiaMotion", url: `${siteUrl}${homePath}` },
        { name: content.title, url: `${siteUrl}${content.path}` }
      ])} />
      <JsonLd data={faqJsonLd(content.faqs)} />
      <JsonLd data={serviceJsonLd(content.locale, content.path, content.title, content.description)} />
      <JsonLd data={webpageJsonLd(content)} />
      <Header locale={content.locale} />
      <main className="seo-landing">
        <section className="seo-landing-hero">
          <div>
            <div className="section-eyebrow">{content.eyebrow}</div>
            <h1>{content.title}</h1>
            <p>{content.description}</p>
            <div className="hero-actions">
              <a href={searchPath} className="primary-btn">{content.primaryCta}</a>
              <a href={whatsappUrl} className="ghost-btn" target="_blank" rel="noopener noreferrer">
                {content.secondaryCta}
              </a>
            </div>
          </div>
          <div className="seo-landing-card">
            <span>{content.locale === "it" ? "Consigliato per" : "Best for"}</span>
            <strong>{content.cardTitle}</strong>
            <p>{content.cardText}</p>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{content.locale === "it" ? "Vantaggi" : "Benefits"}</div>
              <h2 className="section-title">{content.benefitsTitle}</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {content.benefits.map(([title, text]) => (
              <article className="seo-card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{content.locale === "it" ? "Ritiro e consegna" : "Pickup and delivery"}</div>
              <h2 className="section-title">{guide.pickupTitle}</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {guide.pickupItems.map(([title, text]) => (
              <article className="seo-card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{content.locale === "it" ? "Ischia locale" : "Local Ischia"}</div>
              <h2 className="section-title">{content.zonesTitle}</h2>
            </div>
          </div>
          <article className="seo-card">
            <p>{content.zonesText}</p>
          </article>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{content.locale === "it" ? "Prima di richiedere" : "Before requesting"}</div>
              <h2 className="section-title">{guide.practicalTitle}</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {guide.practicalItems.map(([title, text]) => (
              <article className="seo-card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{content.locale === "it" ? "Processo" : "Process"}</div>
              <h2 className="section-title">{content.howTitle}</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {content.steps.map(([title, text], index) => (
              <article className="seo-card" key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{content.locale === "it" ? "Guida pratica" : "Practical guide"}</div>
              <h2 className="section-title">{content.whenTitle}</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {content.whenItems.map(([title, text]) => (
              <article className="seo-card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{content.locale === "it" ? "Link utili" : "Useful links"}</div>
              <h2 className="section-title">{content.locale === "it" ? "Esplora il noleggio a Ischia" : "Explore rental in Ischia"}</h2>
            </div>
          </div>
          <div className="seo-landing-pickups">
            {internalLinks.map(([label, href]) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </div>
        </section>

        <SeoFaqSection locale={content.locale} faqs={content.faqs} />

        <section className="final-cta reveal">
          <div className="final-box">
            <h2>{content.finalTitle}</h2>
            <p>{content.finalText}</p>
            <div className="hero-actions">
              <a href={searchPath} className="primary-btn">{content.primaryCta}</a>
              <a href={whatsappUrl} className="ghost-btn" target="_blank" rel="noopener noreferrer">
                {content.secondaryCta}
              </a>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppCTA locale={content.locale} />
      <Footer locale={content.locale} />
    </>
  );
}
