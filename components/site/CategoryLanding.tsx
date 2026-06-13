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
      ["Beach Club", "/it/beach-club-ischia"],
      ["Dove dormire a Ischia", "/it/dove-dormire-a-ischia"],
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
    ["Beach Club", "/en/ischia-beach-club"],
    ["Where to stay in Ischia", "/en/where-to-stay-in-ischia"],
    ["Contact", "/en/contact"]
  ];
}

const landingGuides = {
  it: {
    auto: {
      pickupTitle: "Ritiro al porto e consegna dove prevista",
      pickupItems: [
        ["Porto e arrivi", "Ischia Porto e Casamicciola sono zone decisive quando arrivi con traghetto, aliscafo o bagagli: puoi indicarle nella richiesta e attendere verifica del partner."],
        ["Hotel e strutture", "Per auto e spostamenti familiari può essere utile chiedere consegna in hotel o presso una struttura ricettiva, dove prevista dal partner locale."],
        ["Comuni più distanti", "Forio, Barano, Lacco Ameno e Sant'Angelo richiedono pianificazione migliore: ritiro, orari e disponibilità vengono confermati dopo controllo."]
      ],
      practicalTitle: "Parcheggi, strade e consigli di guida",
      practicalItems: [
        ["Documenti e patente", "Prepara patente valida, documento e dati di contatto. Età minima, categoria veicolo ed eventuali requisiti dipendono dal partner."],
        ["Cauzione e condizioni", "Cauzione, coperture e franchigie non vanno date per scontate: IschiaMotion le verifica prima della conferma finale."],
        ["Parcheggi e strade", "Strade strette, traffico e parcheggi cambiano tra porto, centri e borghi: valuta itinerario e zona prima della richiesta."],
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
      pickupTitle: "Meteo, requisiti e punti nautici",
      pickupItems: [
        ["Punto definito", "Per i gommoni non è prevista consegna in hotel: il ritiro avviene presso punto nautico indicato o IschiaMotion Point, secondo partner."],
        ["Costa e calette", "Ischia Porto, Casamicciola, Forio, Lacco Ameno e Sant'Angelo possono essere riferimenti utili per scegliere zona di partenza e rientro."],
        ["Meteo e mare", "Vento, mare e condizioni operative possono cambiare la disponibilità anche dopo la richiesta iniziale."]
      ],
      practicalTitle: "Gommoni con o senza patente",
      practicalItems: [
        ["Patente nautica", "Dipende dal mezzo e dalla motorizzazione. Requisiti, documenti e capienza vengono verificati con il partner."],
        ["Gommone o barca", "Il gommone è spesso più agile per costa e calette; la barca può offrire più spazio e comfort, secondo modello."],
        ["Quando valutare un beach club", "Se preferisci servizi a terra, lettini e ombrelloni, un beach club può essere più comodo."]
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
        ["Requisiti", "Barca disponibile solo dove prevista dal partner e se requisiti, documenti e condizioni sono compatibili."],
        ["Barca o gommone", "La barca è utile se cerchi più comfort e spazio; il gommone può essere più essenziale e agile."],
        ["Quando scegliere un beach club", "Se cerchi comfort in spiaggia, valuta la pagina Beach Club."]
      ]
    },
    beach_club: {
      pickupTitle: "Zone e disponibilità Beach Club",
      pickupItems: [
        ["Data e persone", "Indica giorno richiesto, numero persone, adulti e bambini per verificare soluzioni coerenti."],
        ["Zona preferita", "Forio, Lacco Ameno, Ischia Porto, Sant'Angelo e altre zone possono orientare la ricerca tra strutture locali."],
        ["Servizi desiderati", "Puoi segnalare lettini, ombrelloni, giornata intera, pranzo, aperitivo o altri servizi dove disponibili."]
      ],
      practicalTitle: "Lettini, ombrelloni e servizi mare",
      practicalItems: [
        ["Accesso giornaliero", "Richiedi disponibilità per accesso, lettini, ombrelloni e servizi spiaggia."],
        ["Food e drink", "Puoi indicare pranzo o aperitivo vista mare, se disponibili presso la struttura selezionata."],
        ["Partner locali", "IschiaMotion facilita il contatto con strutture selezionate e verifica condizioni prima della conferma."]
      ]
    }
  },
  en: {
    auto: {
      pickupTitle: "Port pickup and delivery where offered",
      pickupItems: [
        ["Ports and arrivals", "Ischia Port and Casamicciola matter when you arrive by ferry, hydrofoil or with luggage. Add them to the request and wait for partner review."],
        ["Hotels and stays", "For families, hotel or accommodation delivery may be useful where offered by the local partner."],
        ["Further towns", "Forio, Barano, Lacco Ameno and Sant'Angelo need better planning: pickup, timing and availability are confirmed after review."]
      ],
      practicalTitle: "Parking, roads and driving advice",
      practicalItems: [
        ["Documents and license", "Prepare a valid driving license, ID and contact details. Age, vehicle category and requirements depend on the partner."],
        ["Deposit and conditions", "Deposit, coverage and excess are not automatic: IschiaMotion checks them before final confirmation."],
        ["Parking and roads", "Narrow roads, traffic and parking vary between ports, towns and villages: consider route and area before requesting."],
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
      pickupTitle: "Weather, requirements and nautical points",
      pickupItems: [
        ["Defined point", "Rubber dinghies are not delivered to hotels: pickup is at an indicated nautical point or IschiaMotion Point, depending on partner."],
        ["Coast and coves", "Ischia Port, Casamicciola, Forio, Lacco Ameno and Sant'Angelo help choose departure and return areas."],
        ["Weather and sea", "Wind, sea state and operational conditions can affect availability even after the first request."]
      ],
      practicalTitle: "Rubber dinghies with or without a license",
      practicalItems: [
        ["Boating license", "It depends on the vehicle and engine. Requirements, documents and capacity are reviewed with the partner."],
        ["Rubber dinghy, RIB or boat", "A rubber dinghy or RIB is often agile for coast and coves; a boat may offer more space and comfort, depending on model."],
        ["When to choose a beach club", "If you prefer reserved seaside services on shore, beach club access may fit better."]
      ]
    },
    barca: {
      pickupTitle: "Marine conditions, requirements and nautical points",
      pickupItems: [
        ["Nautical point", "Boat pickup is at a defined point or IschiaMotion Point. Nautical categories do not use hotel delivery."],
        ["Island coast", "Ischia Port, Casamicciola, Forio, Lacco Ameno and Sant'Angelo help plan departure, route and timing, subject to partner availability."],
        ["Marine conditions", "Weather, wind, timing and operating rules are part of the review before confirmation."]
      ],
      practicalTitle: "Boats with or without a license",
      practicalItems: [
        ["License and requirements", "Availability with or without a boating license depends on the boat, documents and conditions confirmed by the partner."],
        ["Boat or rubber dinghy", "A boat is useful for more comfort and space; a rubber dinghy can be simpler and more agile."],
        ["When to choose a beach club", "If you want comfort on shore, consider beach club access with selected local venues."]
      ]
    },
    beach_club: {
      pickupTitle: "Beach Club areas and availability",
      pickupItems: [
        ["Date and guests", "Share requested date, guest count, adults and children to review suitable options."],
        ["Preferred area", "Forio, Lacco Ameno, Ischia Port, Sant'Angelo and other areas can guide the search among local venues."],
        ["Requested services", "Mention sunbeds, umbrellas, full day access, lunch, aperitif or other services where available."]
      ],
      practicalTitle: "Sunbeds, umbrellas and seaside services",
      practicalItems: [
        ["Daily access", "Request availability for access, sunbeds, umbrellas and beach services."],
        ["Food and drinks", "You can mention seaside lunch or aperitif where available at the selected venue."],
        ["Local partners", "IschiaMotion facilitates contact with selected venues and reviews conditions before confirmation."]
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
      <Header locale={content.locale} alternateHref={content.alternatePath} />
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

        <section className="final-cta">
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
