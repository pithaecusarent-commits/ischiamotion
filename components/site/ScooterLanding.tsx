import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/site/JsonLd";
import { SeoFaqSection } from "@/components/site/SeoFaqSection";
import type { Locale, PublicPickupPoint } from "@/lib/types";
import { breadcrumbJsonLd, faqJsonLd, scooterFaq, serviceJsonLd, siteUrl } from "@/lib/seo";

function formatPickupLabel(label: string) {
  return label
    .replace(" - ", " — ")
    .replace("Porto d'Ischia", "Porto d’Ischia")
    .replace("Sant'Angelo", "Sant’Angelo");
}

export function ScooterLanding({ locale, pickupPoints }: { locale: Locale; pickupPoints: PublicPickupPoint[] }) {
  const isIt = locale === "it";
  const path = isIt ? "/it/noleggio-scooter-ischia" : "/en/scooter-rental-ischia";
  const homePath = isIt ? "/it" : "/en";
  const title = isIt ? "Noleggio scooter Ischia" : "Scooter rental Ischia";
  const description = isIt
    ? "Richiedi disponibilità per scooter a Ischia tramite una rete di noleggiatori selezionati e scegli un punto ritiro comodo per porto, spiagge e borghi."
    : "Request scooter availability in Ischia through selected local rental partners and choose a pickup point close to ports, beaches and villages.";
  const advantages = isIt
    ? [
      ["Network locale", "IschiaMotion collega la tua richiesta a noleggiatori selezionati sull’isola."],
      ["Richiesta online", "Indichi date, orario e punto ritiro: ricevi conferma dopo verifica disponibilità."],
      ["Ritiro semplice", "Scegli un punto IschiaMotion comodo per porto, spiagge e borghi."]
    ]
    : [
      ["Local network", "IschiaMotion connects your request with selected rental partners on the island."],
      ["Online request", "Choose dates, time and pickup point: confirmation follows availability review."],
      ["Simple pickup", "Choose an IschiaMotion point close to ports, beaches and villages."]
    ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "IschiaMotion", url: `${siteUrl}${homePath}` },
        { name: title, url: `${siteUrl}${path}` }
      ])} />
      <JsonLd data={faqJsonLd(scooterFaq[locale])} />
      <JsonLd data={serviceJsonLd(locale, path, title, description)} />
      <Header locale={locale} />
      <main className="seo-landing">
        <section className="seo-landing-hero">
          <div>
            <div className="section-eyebrow">{isIt ? "Scooter a Ischia" : "Scooters in Ischia"}</div>
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="hero-actions">
              <a href={`${homePath}#veicoli`} className="primary-btn">{isIt ? "Vedi opzioni scooter" : "View scooter options"}</a>
              <a href={`${homePath}#prenota`} className="ghost-btn">{isIt ? "Imposta le date" : "Set dates"}</a>
            </div>
          </div>
          <div className="seo-landing-card">
            <span>{isIt ? "Ideale per" : "Best for"}</span>
            <strong>{isIt ? "Spiagge, porti e borghi" : "Beaches, ports and villages"}</strong>
            <p>{isIt ? "Una richiesta semplice verso partner locali selezionati per muoverti sull’isola con più autonomia." : "A simple request to selected local partners for exploring the island with more independence."}</p>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{isIt ? "Vantaggi" : "Benefits"}</div>
              <h2 className="section-title">{isIt ? "Perché scegliere<br><em>lo scooter</em>" : "Why choose<br><em>a scooter</em>"}</h2>
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
              <h2 className="section-title">{isIt ? "Punti ritiro<br><em>IschiaMotion</em>" : "IschiaMotion<br><em>pickup points</em>"}</h2>
            </div>
          </div>
          <div className="seo-landing-pickups">
            {pickupPoints.slice(0, 5).map((point) => {
              const label = isIt ? point.public_label_it : point.public_label_en;
              return <span key={point.id}>{formatPickupLabel(label)}</span>;
            })}
          </div>
        </section>

        <SeoFaqSection locale={locale} faqs={scooterFaq[locale]} />

        <section className="final-cta reveal">
          <div className="final-box">
            <h2>{isIt ? "Pronto a muoverti a Ischia?" : "Ready to move around Ischia?"}</h2>
            <p>{isIt ? "Imposta le date, scegli un’opzione e invia una richiesta: riceverai conferma dopo verifica con il partner locale." : "Set your dates, choose an option and send a request: confirmation follows review with the local partner."}</p>
            <a href={`${homePath}#veicoli`} className="primary-btn">{isIt ? "Vai alle opzioni scooter" : "View scooter options"}</a>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
