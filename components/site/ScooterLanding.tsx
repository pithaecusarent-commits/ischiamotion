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
    ? "Richiedi online il tuo scooter a Ischia e scegli un punto ritiro IschiaMotion comodo per porto, spiagge e borghi."
    : "Request your scooter in Ischia online and choose an IschiaMotion pickup point close to ports, beaches and villages.";
  const advantages = isIt
    ? [
      ["Libertà nei movimenti", "Raggiungi Maronti, Citara, Sant’Angelo e Ischia Ponte con tempi più flessibili."],
      ["Richiesta online", "Indichi date, orario e punto ritiro: ti ricontattiamo per confermare la disponibilità."],
      ["Punti brandizzati", "Il cliente vede solo il punto IschiaMotion, senza nomi di singoli noleggiatori."]
    ]
    : [
      ["More freedom", "Reach Maronti, Citara, Sant’Angelo and Ischia Ponte with more flexible timing."],
      ["Online request", "Choose dates, time and pickup point: we contact you to confirm availability."],
      ["Branded pickup points", "Customers see only the IschiaMotion point, not individual rental company names."]
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
              <a href={`${homePath}#veicoli`} className="primary-btn">{isIt ? "Scegli uno scooter" : "Choose a scooter"}</a>
              <a href={`${homePath}#prenota`} className="ghost-btn">{isIt ? "Imposta le date" : "Set dates"}</a>
            </div>
          </div>
          <div className="seo-landing-card">
            <span>{isIt ? "Ideale per" : "Best for"}</span>
            <strong>{isIt ? "Spiagge, porti e borghi" : "Beaches, ports and villages"}</strong>
            <p>{isIt ? "Una richiesta semplice per muoverti sull’isola con più autonomia." : "A simple request to explore the island with more independence."}</p>
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
            <p>{isIt ? "Imposta le date, scegli il mezzo e invia una richiesta: ti contatteremo per confermare la disponibilità." : "Set your dates, choose a ride and send a request: we will contact you to confirm availability."}</p>
            <a href={`${homePath}#veicoli`} className="primary-btn">{isIt ? "Vai agli scooter" : "View scooters"}</a>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
