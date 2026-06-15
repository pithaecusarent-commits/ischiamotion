import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/site/JsonLd";
import { SeoFaqSection } from "@/components/site/SeoFaqSection";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import type { Locale, PublicPickupPoint } from "@/lib/types";
import { breadcrumbJsonLd, faqJsonLd, scooterFaq, serviceJsonLd, siteUrl } from "@/lib/seo";

function formatPickupLabel(label: string) {
  return label
    .replace(" - ", " — ")
    .replace("Porto d'Ischia", "Porto d’Ischia")
    .replace("Sant'Angelo", "Sant’Angelo");
}

function webpageJsonLd(locale: Locale, path: string, title: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${siteUrl}${path}`,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: "IschiaMotion",
      url: siteUrl
    }
  };
}

export function ScooterLanding({ locale, pickupPoints }: { locale: Locale; pickupPoints: PublicPickupPoint[] }) {
  const isIt = locale === "it";
  const path = isIt ? "/it/noleggio-scooter-ischia" : "/en/scooter-rental-ischia";
  const alternatePath = isIt ? "/en/scooter-rental-ischia" : "/it/noleggio-scooter-ischia";
  const homePath = isIt ? "/it" : "/en";
  const searchPath = isIt ? "/it/risultati?category=scooter" : "/en/results?category=scooter";
  const whatsappUrl = `https://wa.me/393296856370?text=${encodeURIComponent(isIt
    ? "Ciao IschiaMotion, vorrei verificare la disponibilità per uno scooter a Ischia."
    : "Hello IschiaMotion, I would like to check scooter availability in Ischia."
  )}`;
  const title = isIt ? "Noleggio scooter Ischia" : "Scooter rental Ischia";
  const description = isIt
    ? "Richiedi disponibilità per noleggio scooter a Ischia tramite partner locali selezionati. Una soluzione agile per coppie, porto, spiagge e borghi, con conferma solo dopo verifica."
    : "Request scooter rental availability in Ischia through selected local partners. A practical choice for couples, ports, beaches and villages, with confirmation only after review.";
  const advantages = isIt
    ? [
      ["Spostamenti rapidi", "Lo scooter è pratico per muoversi tra Ischia Porto, spiagge, centri abitati e punti panoramici senza la rigidità dell'auto."],
      ["Parcheggio più semplice", "Per coppie e viaggiatori leggeri può essere più comodo dell'auto, soprattutto nelle zone centrali e nei periodi affollati."],
      ["Richiesta verificata", "Indichi date, orario e punto ritiro: IschiaMotion controlla disponibilità e condizioni con partner locali selezionati."]
    ]
    : [
      ["Quick movement", "A scooter is practical for Ischia Port, beaches, town centers and viewpoints without the limits of a car."],
      ["Easier parking", "For couples and light travellers it can be easier than a car, especially in central areas and busy periods."],
      ["Reviewed request", "Choose dates, timing and pickup point: IschiaMotion checks availability and conditions with selected local partners."]
    ];
  const localItems = isIt
    ? [
      ["Ischia Porto", "È il punto più richiesto per chi arriva in aliscafo o traghetto e vuole muoversi subito verso spiagge, hotel o Ischia Ponte."],
      ["Casamicciola e Lacco Ameno", "Sono zone comode per soggiorni termali, lungomare e spostamenti brevi verso strutture ricettive del versante nord."],
      ["Forio, Barano e Sant'Angelo", "Lo scooter può aiutare a raggiungere spiagge e borghi, ma conviene valutare distanze, salite e orari prima della richiesta."]
    ]
    : [
      ["Ischia Port", "A key area for guests arriving by ferry or hydrofoil who want to move toward beaches, hotels or Ischia Ponte."],
      ["Casamicciola and Lacco Ameno", "Useful for thermal stays, seafront areas and short trips around north-side accommodation."],
      ["Forio, Barano and Sant'Angelo", "A scooter can help reach beaches and villages, but distance, hills and timing should be reviewed before request."]
    ];
  const whenItems = isIt
    ? [
      ["Ideale per coppie", "Funziona bene con poco bagaglio, soste frequenti e programmi flessibili tra mare, centro e borghi."],
      ["Quando scegliere altro", "Con bambini piccoli, molte valigie o hotel molto distante dal porto, l'auto può essere più comoda."],
      ["Attenzione a patente e casco", "Patente valida, casco, cauzione e requisiti dipendono da mezzo e partner; vengono comunicati dopo verifica."]
    ]
    : [
      ["Ideal for couples", "Works well with light luggage, frequent stops and flexible plans between sea, town centers and villages."],
      ["When to choose another option", "With small children, several bags or accommodation far from the port, a car may be more comfortable."],
      ["License and helmet", "Valid license, helmet, deposit and requirements depend on scooter and partner; they are shared after review."]
    ];
  const pickupItems = isIt
    ? [
      ["IschiaMotion Point", "Puoi indicare un punto ritiro comodo. La disponibilità effettiva viene verificata con il partner locale."],
      ["Porto dove previsto", "Per Ischia Porto o Casamicciola puoi segnalare arrivo e fascia oraria; ritiro e condizioni non sono automatici."],
      ["Hotel dove previsto", "Per alcune zone e partner puoi indicare hotel o struttura ricettiva, sempre soggetto a verifica."],
      ["Documenti e casco", "Patente, documento, casco, cauzione e condizioni dipendono dal mezzo e vengono confermati dal partner prima del ritiro."]
    ]
    : [
      ["IschiaMotion Point", "You can indicate a convenient pickup point. Actual availability is reviewed with the local partner."],
      ["Port where available", "For Ischia Port or Casamicciola, share arrival and timing; pickup and conditions are not automatic."],
      ["Hotel where available", "For some areas and partners, you can indicate hotel or accommodation, always subject to review."],
      ["Documents and helmet", "License, ID, helmet, deposit and conditions depend on the scooter and are confirmed by the partner before pickup."]
    ];
  const internalLinks = isIt
    ? [
      ["Home", "/it"],
      ["Verifica disponibilità scooter", searchPath],
      ["Auto", "/it/noleggio-auto-ischia"],
      ["E-bike", "/it/noleggio-bici-elettriche-ischia"],
      ["Gommoni", "/it/noleggio-gommoni-ischia"],
      ["Barche", "/it/noleggio-barche-ischia"],
      ["Beach Club", "/it/beach-club-ischia"],
      ["Contatti", "/it/contatti"]
    ]
    : [
      ["Home", "/en"],
      ["Check scooter availability", searchPath],
      ["Cars", "/en/car-rental-ischia"],
      ["E-bikes", "/en/e-bike-rental-ischia"],
      ["Rubber dinghies", "/en/rubber-dinghy-rental-ischia"],
      ["Boats", "/en/boat-rental-ischia"],
      ["Beach Club", "/en/ischia-beach-club"],
      ["Contact", "/en/contact"]
    ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "IschiaMotion", url: `${siteUrl}${homePath}` },
        { name: title, url: `${siteUrl}${path}` }
      ])} />
      <JsonLd data={faqJsonLd(scooterFaq[locale])} />
      <JsonLd data={serviceJsonLd(locale, path, title, description)} />
      <JsonLd data={webpageJsonLd(locale, path, title, description)} />
      <Header locale={locale} alternateHref={alternatePath} />
      <main className="seo-landing">
        <section className="seo-landing-hero">
          <div>
            <div className="section-eyebrow">{isIt ? "Scooter a Ischia" : "Scooters in Ischia"}</div>
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="hero-actions">
              <a href={searchPath} className="primary-btn">{isIt ? "Verifica disponibilità scooter" : "Check scooter availability"}</a>
              <a href={whatsappUrl} className="ghost-btn" target="_blank" rel="noopener noreferrer">{isIt ? "Scrivici su WhatsApp" : "Message us on WhatsApp"}</a>
            </div>
          </div>
          <div className="seo-landing-card">
            <span>{isIt ? "Ideale per" : "Best for"}</span>
            <strong>{isIt ? "Coppie e spostamenti veloci" : "Couples and quick trips"}</strong>
            <p>{isIt ? "Una richiesta semplice verso partner locali selezionati per muoverti sull'isola con più autonomia, senza conferma immediata." : "A simple request to selected local partners for moving around the island with more independence, without instant confirmation."}</p>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{isIt ? "Ischia locale" : "Local Ischia"}</div>
              <h2 className="section-title">{isIt ? "Zone di ritiro a Ischia" : "Scooter pickup areas in Ischia"}</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {localItems.map(([itemTitle, text]) => (
              <article className="seo-card" key={itemTitle}>
                <h3>{itemTitle}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{isIt ? "Guida pratica" : "Practical guide"}</div>
              <h2 className="section-title">{isIt ? "Quando conviene lo scooter" : "When a scooter makes sense"}</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {whenItems.map(([itemTitle, text]) => (
              <article className="seo-card" key={itemTitle}>
                <h3>{itemTitle}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{isIt ? "Vantaggi" : "Benefits"}</div>
              <h2
                className="section-title"
                dangerouslySetInnerHTML={{ __html: isIt ? "Perché scegliere<br><em>lo scooter</em>" : "Why choose<br><em>a scooter</em>" }}
              />
            </div>
          </div>
          <div className="seo-landing-grid">
            {advantages.map(([itemTitle, text]) => (
              <article className="seo-card" key={itemTitle}>
                <h3>{itemTitle}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{isIt ? "Ritiro" : "Pickup"}</div>
              <h2
                className="section-title"
                dangerouslySetInnerHTML={{ __html: isIt ? "Punti ritiro<br><em>IschiaMotion</em>" : "IschiaMotion<br><em>pickup points</em>" }}
              />
            </div>
          </div>
          <div className="seo-landing-pickups">
            {pickupPoints.slice(0, 5).map((point) => {
              const label = isIt ? point.public_label_it : point.public_label_en;
              return <span key={point.id}>{formatPickupLabel(label)}</span>;
            })}
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{isIt ? "Ritiro e consegna" : "Pickup and delivery"}</div>
              <h2 className="section-title">{isIt ? "Documenti, casco e ritiro" : "Documents, helmet and pickup"}</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {pickupItems.map(([itemTitle, text]) => (
              <article className="seo-card" key={itemTitle}>
                <h3>{itemTitle}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{isIt ? "Link utili" : "Useful links"}</div>
              <h2 className="section-title">{isIt ? "Esplora il noleggio a Ischia" : "Explore rental in Ischia"}</h2>
            </div>
          </div>
          <div className="seo-landing-pickups">
            {internalLinks.map(([label, href]) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </div>
        </section>

        <SeoFaqSection locale={locale} faqs={scooterFaq[locale]} />

        <section className="final-cta">
          <div className="final-box">
            <h2>{isIt ? "Verifica disponibilità tramite partner locali" : "Check availability through local partners"}</h2>
            <p>{isIt ? "Imposta le date, scegli un’opzione e invia una richiesta: riceverai conferma dopo verifica con il partner locale." : "Set your dates, choose an option and send a request: confirmation follows review with the local partner."}</p>
            <div className="hero-actions">
              <a href={searchPath} className="primary-btn">{isIt ? "Verifica disponibilità" : "Check availability"}</a>
              <a href={whatsappUrl} className="ghost-btn" target="_blank" rel="noopener noreferrer">{isIt ? "Contattaci su WhatsApp" : "Contact us on WhatsApp"}</a>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppCTA locale={locale} />
      <Footer locale={locale} />
    </>
  );
}
