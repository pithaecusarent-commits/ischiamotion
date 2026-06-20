import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { JsonLd } from "@/components/site/JsonLd";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import { breadcrumbJsonLd, siteUrl } from "@/lib/seo";

const path = "/it/ischiamotion";
const title = "IschiaMotion | Piattaforma locale per noleggi e servizi turistici a Ischia";
const description = "Scopri IschiaMotion, piattaforma locale per richiedere scooter, auto, e-bike, gommoni e beach club a Ischia tramite partner selezionati.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: path,
    languages: {
      it: path,
      "x-default": path
    }
  },
  openGraph: {
    title,
    description,
    url: path,
    siteName: "IschiaMotion",
    type: "website",
    locale: "it_IT",
    images: [{ url: "/images/ischiamotion-logo.png", alt: "IschiaMotion, piattaforma locale a Ischia" }]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/ischiamotion-logo.png"]
  }
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "IschiaMotion",
  description,
  url: `${siteUrl}${path}`,
  inLanguage: "it",
  about: {
    "@type": "LocalBusiness",
    name: "IschiaMotion",
    url: "https://www.ischiamotion.com"
  }
};

export default function IschiaMotionPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "IschiaMotion", url: `${siteUrl}/it` },
        { name: "Chi è IschiaMotion", url: `${siteUrl}${path}` }
      ])} />
      <JsonLd data={webPageJsonLd} />
      <Header locale="it" />
      <main className="seo-landing">
        <section className="seo-landing-hero">
          <div>
            <div className="section-eyebrow">Piattaforma locale a Ischia</div>
            <h1>IschiaMotion</h1>
            <p>
              IschiaMotion è una piattaforma locale dedicata alla mobilità turistica e ai servizi mare sull’isola d’Ischia.
              Raccogliamo le richieste dei visitatori e verifichiamo le opzioni disponibili con partner locali selezionati.
            </p>
          </div>
          <div className="seo-landing-card">
            <span>Un riferimento locale</span>
            <strong>Richieste semplici, partner selezionati</strong>
            <p>Un unico punto di contatto per orientarsi tra noleggi e servizi turistici a Ischia, con condizioni verificate prima della conferma.</p>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Cos’è IschiaMotion</div>
              <h2 className="section-title">Mobilità e servizi mare sull’isola</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            <article className="seo-card">
              <h3>Una piattaforma indipendente</h3>
              <p>IschiaMotion è un servizio autonomo e non è una concessionaria. Aiuta turisti e visitatori a inviare richieste chiare, senza promettere disponibilità immediata.</p>
            </article>
            <article className="seo-card">
              <h3>Operativa a Ischia</h3>
              <p>Conosciamo le esigenze di chi arriva sull’isola, dalle zone portuali ai comuni, dalle spiagge ai punti di ritiro concordati con gli operatori.</p>
            </article>
            <article className="seo-card">
              <h3>Partner locali selezionati</h3>
              <p>Collaboriamo con realtà locali per verificare disponibilità, requisiti, condizioni e modalità di ritiro prima della conferma finale.</p>
            </article>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">I servizi IschiaMotion a Ischia</div>
              <h2 className="section-title">Scegli il servizio e richiedi disponibilità</h2>
            </div>
          </div>
          <div className="seo-landing-pickups">
            <a href="/it/noleggio-scooter-ischia">Noleggio scooter a Ischia</a>
            <a href="/it/noleggio-auto-ischia">Noleggio auto a Ischia</a>
            <a href="/it/noleggio-bici-elettriche-ischia">Noleggio e-bike a Ischia</a>
            <a href="/it/noleggio-gommoni-ischia">Noleggio gommoni a Ischia</a>
            <a href="/it/beach-club-ischia">Beach club a Ischia</a>
            <a href="/it/contatti">Contatta IschiaMotion</a>
          </div>
        </section>

        <section className="final-cta">
          <div className="final-box">
            <h2>Un punto di contatto locale, chiaro e rapido</h2>
            <p>Indica date, servizio e preferenze: la piattaforma locale IschiaMotion verifica la richiesta con i partner selezionati sull’isola.</p>
            <div className="hero-actions">
              <a href="/it/risultati" className="primary-btn">Verifica disponibilità</a>
              <a href="/it/contatti" className="ghost-btn">Contatta IschiaMotion</a>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppCTA locale="it" />
      <Footer locale="it" />
    </>
  );
}
