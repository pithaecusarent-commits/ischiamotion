import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/site/JsonLd";
import { SeoFaqSection } from "@/components/site/SeoFaqSection";
import { ValueProposition } from "@/components/site/ValueProposition";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { Locale, PublicPickupPoint } from "@/lib/types";
import { breadcrumbJsonLd, faqJsonLd, scooterFaq, serviceJsonLd, siteUrl, webpageJsonLd } from "@/lib/seo";
import { Fragment } from "react";

function formatPickupLabel(label: string) {
  return label
    .replace(" - ", " — ")
    .replace("Porto d'Ischia", "Porto d’Ischia")
    .replace("Sant'Angelo", "Sant’Angelo");
}

export function ScooterLanding({ locale, pickupPoints }: { locale: Locale; pickupPoints: PublicPickupPoint[] }) {
  const isIt = locale === "it";
  const path = isIt ? "/it/noleggio-scooter-ischia" : "/en/scooter-rental-ischia";
  const alternatePath = isIt ? "/en/scooter-rental-ischia" : "/it/noleggio-scooter-ischia";
  const homePath = isIt ? "/it" : "/en";
  const searchPath = isIt ? "/it/risultati?category=scooter" : "/en/results?category=scooter";
  const whatsappUrl = getWhatsAppUrl(locale, "scooter");
  const title = isIt ? "Noleggio scooter a Ischia: trova il tuo in pochi minuti" : "Scooter rental in Ischia: find yours in minutes";
  const h1Display = isIt ? "Noleggio scooter a Ischia: muoviti in libertà" : "Scooter Rental in Ischia: Explore with More Freedom";
  const description = isIt
    ? "Inserisci date e zona del soggiorno: verifichiamo rapidamente con partner locali selezionati e ti inviamo disponibilità, prezzo e condizioni dello scooter più adatto. Muoviti liberamente tra spiagge, terme, borghi e panorami dell'isola senza perdere tempo a contattare tanti noleggiatori: con una sola richiesta troviamo per te le soluzioni disponibili nella tua zona. Soluzioni disponibili a partire da € 25 al giorno, in base al periodo, alla durata del noleggio e alla tipologia di scooter. Ritiro presso porto, punto convenzionato o consegna in hotel dove disponibile."
    : "Share your dates and area of stay: we quickly check with selected local partners and send you availability, price and conditions for the right scooter. Get around freely between beaches, thermal parks, villages and viewpoints without wasting time contacting several rental operators — one request is enough for us to find the available options in your area. Options available from €25 a day, depending on season, rental length and scooter type. Pickup at the port, a partner point or hotel delivery where available.";
  const subtitleDisplay = isIt
    ? "Indicaci date e zona del soggiorno: verifichiamo rapidamente disponibilità, prezzo e punto di ritiro o consegna con partner locali selezionati."
    : "Tell us your dates and area of stay: we quickly check availability, price and pickup or delivery with selected local partners.";
  const advantages = isIt
    ? [
      ["Spostamenti rapidi", "L’affitto di uno scooter a Ischia è pratico per muoversi tra Ischia Porto, spiagge, centri abitati e punti panoramici senza la rigidità dell'auto."],
      ["Parcheggio più semplice", "Per coppie e viaggiatori leggeri può essere più comodo dell'auto, soprattutto nelle zone centrali e nei periodi affollati."],
      ["Richiesta verificata", "Indichi date, orario e punto ritiro: IschiaMotion controlla disponibilità e condizioni con partner locali selezionati."]
    ]
    : [
      ["Quick movement", "Scooter hire in Ischia is practical for moving between Ischia Port, beaches, town centers and viewpoints without the limits of a car."],
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
      ["Porto dove previsto", "Per Ischia Porto o Casamicciola segnala arrivo e fascia oraria: controlliamo subito ritiro e condizioni disponibili."],
      ["Hotel dove previsto", "Per alcune zone puoi indicare hotel o struttura ricettiva: verifichiamo rapidamente l'opzione con il partner."],
      ["Documenti e casco", "Patente, documento, casco, cauzione e condizioni dipendono dal mezzo e vengono confermati dal partner prima del ritiro."]
    ]
    : [
      ["IschiaMotion Point", "You can indicate a convenient pickup point. Actual availability is reviewed with the local partner."],
      ["Port where available", "For Ischia Port or Casamicciola, share arrival and timing; pickup and conditions are not automatic."],
      ["Hotel where available", "For some areas and partners, you can request hotel or accommodation delivery — we confirm it quickly after your request."],
      ["Documents and helmet", "License, ID, helmet, deposit and conditions depend on the scooter and are confirmed by the partner before pickup."]
    ];
  const practicalItems = isIt
    ? [
      ["Prezzi e durata", "Il prezzo dipende da periodo, durata, cilindrata e disponibilità. Puoi richiedere un noleggio giornaliero o per più giorni; il totale viene confermato dal partner."],
      ["Scooter 50cc o 125cc", "La categoria disponibile varia in base a disponibilità e requisiti di guida. Indica patente ed esperienza e ti proponiamo subito l'opzione più adatta."],
      ["Età minima e patente", "Età minima e patente necessaria variano in base al mezzo e alle regole applicabili. I requisiti vengono controllati prima della conferma."],
      ["Casco e passeggero", "Casco, secondo casco e dotazioni dipendono dall’opzione disponibile. Chiedi conferma se viaggi in due."],
      ["Cauzione e assicurazione", "Cauzione, copertura assicurativa, franchigia e modalità di pagamento sono condizioni del partner e vengono comunicate prima del ritiro."],
      ["Parcheggio e ZTL", "Nei centri di Ischia presta attenzione a segnaletica, aree pedonali, ZTL e parcheggi. Le regole locali possono cambiare per zona e periodo."]
    ]
    : [
      ["Prices and rental length", "Price depends on season, rental length, scooter type and availability. You can request a daily or multi-day rental; the partner confirms the total."],
      ["50cc or 125cc scooter", "The available category varies by availability and driving requirements. Share your license and experience and we'll offer the right option right away."],
      ["Minimum age and license", "Minimum age and required license vary by scooter and applicable rules. Requirements are checked before confirmation."],
      ["Helmet and passenger", "Helmet, second helmet and equipment depend on the available option. Ask for confirmation when travelling as a pair."],
      ["Deposit and insurance", "Deposit, insurance coverage, excess and payment method are partner conditions communicated before pickup."],
      ["Parking and restricted areas", "Follow local signs, pedestrian areas, restricted traffic zones and parking rules, which may vary by area and season."]
    ];
  const internalLinks = isIt
    ? [
      ["servizi IschiaMotion a Ischia", "/it/ischiamotion"],
      ["Verifica disponibilità scooter", searchPath],
      ["Noleggio auto Ischia", "/it/noleggio-auto-ischia"],
      ["Noleggio e-bike Ischia", "/it/noleggio-bici-elettriche-ischia"],
      ["Noleggio gommoni Ischia", "/it/noleggio-gommoni-ischia"],
      ["Noleggio barche Ischia", "/it/noleggio-barche-ischia"],
      ["Beach Club", "/it/beach-club-ischia"],
      ["Contatti", "/it/contatti"]
    ]
    : [
      ["Home", "/en"],
      ["Check scooter availability", searchPath],
      ["Car rental Ischia", "/en/car-rental-ischia"],
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
            <h1 className="seo-landing-title">{h1Display}</h1>
            <p>{subtitleDisplay}</p>
            <p>
              {isIt ? "Se vuoi capire quali zone visitare e quando può essere utile uno scooter, leggi la guida su " : "If you want to understand which areas to visit and when a scooter can be useful, read our guide on "}
              <a href={isIt ? "/it/cosa-vedere-a-ischia-senza-auto" : "/en/what-to-see-in-ischia-without-a-car"}>
                {isIt ? "cosa vedere a Ischia senza auto" : "what to see in Ischia without a car"}
              </a>.
            </p>
            <div className="hero-actions">
              <a href={searchPath} className="primary-btn">{isIt ? "Verifica scooter disponibili" : "Check available scooters"}</a>
              <a href={whatsappUrl} className="ghost-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">{isIt ? "Ricevi disponibilità su WhatsApp" : "Get availability on WhatsApp"}</a>
            </div>
          </div>
          <div className="seo-landing-card">
            <span>{isIt ? "Ideale per" : "Best for"}</span>
            <strong>{isIt ? "Coppie e spostamenti veloci" : "Couples and quick trips"}</strong>
            <p>{isIt ? "Risposta in pochi minuti negli orari operativi, con disponibilità, prezzo e condizioni pronti prima della conferma." : "A reply within minutes during operating hours, with availability, price and conditions ready before you confirm."}</p>
          </div>
        </section>

        <ValueProposition locale={locale} category="scooter" />

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
              <div className="section-eyebrow">{isIt ? "Costi e requisiti" : "Costs and requirements"}</div>
              <h2 className="section-title">
                {isIt ? "Prezzi e condizioni del noleggio scooter a Ischia" : "Scooter rental prices and conditions in Ischia"}
              </h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {practicalItems.map(([itemTitle, text]) => (
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
            {internalLinks.map(([label, href], index) => (
              <Fragment key={href}>
                {index > 0 ? <span className="seo-link-separator" aria-hidden="true">·</span> : null}
                <a href={href}>{label}</a>
              </Fragment>
            ))}
          </div>
        </section>

        <SeoFaqSection locale={locale} faqs={scooterFaq[locale]} />

        <section className="final-cta">
          <div className="final-box">
            <h2>{isIt ? "Verifica scooter disponibili in pochi minuti" : "Check available scooters in minutes"}</h2>
            <p>{isIt ? "Imposta le date e invia la richiesta: ti rispondiamo in pochi minuti con disponibilità, prezzo e condizioni." : "Set your dates and send the request: we reply within minutes with availability, price and conditions."}</p>
            <div className="hero-actions">
              <a href={searchPath} className="primary-btn">{isIt ? "Verifica scooter disponibili" : "Check available scooters"}</a>
              <a href={whatsappUrl} className="ghost-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">{isIt ? "Ricevi disponibilità su WhatsApp" : "Get availability on WhatsApp"}</a>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppCTA locale={locale} category="scooter" />
      <Footer locale={locale} />
    </>
  );
}
