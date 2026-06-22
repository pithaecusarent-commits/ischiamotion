import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { JsonLd } from "@/components/site/JsonLd";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import { breadcrumbJsonLd, canonicalSiteUrl, organizationId, siteUrl, websiteReference } from "@/lib/seo";

const path = "/it/ischiamotion";
const title = "Chi è IschiaMotion | Piattaforma locale a Ischia";
const description = "Scopri IschiaMotion: piattaforma locale per richieste di mobilità e servizi mare tramite partner selezionati a Ischia.";

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
  isPartOf: {
    ...websiteReference
  },
  about: {
    "@type": "LocalBusiness",
    "@id": organizationId,
    name: "IschiaMotion",
    alternateName: "Ischia Motion",
    url: canonicalSiteUrl
  },
  publisher: {
    "@id": organizationId
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
              <p>IschiaMotion raccoglie la tua richiesta e verifica disponibilità, condizioni e conferma con partner locali selezionati sull’isola.</p>
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
              <div className="section-eyebrow">Come funziona</div>
              <h2 className="section-title">Un unico punto per orientare la richiesta</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            <article className="seo-card">
              <h3>1. Indichi cosa ti serve</h3>
              <p>Comunichi categoria, date, numero di persone e zona preferita. Puoi richiedere scooter, auto, e-bike, gommoni, barche o servizi Beach Club.</p>
            </article>
            <article className="seo-card">
              <h3>2. Verifichiamo le opzioni</h3>
              <p>IschiaMotion controlla disponibilità, requisiti, ritiro, consegna dove prevista e condizioni con i partner locali compatibili.</p>
            </article>
            <article className="seo-card">
              <h3>3. Ricevi una conferma chiara</h3>
              <p>La richiesta non equivale a una prenotazione automatica. La conferma arriva dopo la verifica dell’opzione e delle condizioni applicabili.</p>
            </article>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Cosa ci distingue</div>
              <h2 className="section-title">Una piattaforma locale, non un singolo autonoleggio</h2>
            </div>
          </div>
          <article className="seo-card">
            <p>
              IschiaMotion non presenta come proprie tutte le disponibilità pubblicate e non è il fornitore diretto di ogni mezzo o servizio.
              Il suo ruolo è raccogliere la richiesta, aiutare il cliente a definire zona e necessità e verificare una soluzione con operatori
              locali selezionati. Questo permette di considerare categorie diverse e più zone dell’isola attraverso un solo punto di contatto.
            </p>
            <p>
              Mezzo, contratto, requisiti, cauzione, coperture, prezzo e modalità operative dipendono dal partner che fornisce concretamente
              il servizio e vengono comunicati prima della conferma finale.
            </p>
          </article>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Identità del brand</div>
              <h2 className="section-title">IschiaMotion non è Ischia Motor</h2>
            </div>
          </div>
          <article className="seo-card">
            <p>
              IschiaMotion e Ischia Motor sono denominazioni distinte. IschiaMotion è il progetto descritto su questo sito,
              identificato dal dominio ufficiale ischiamotion.com e dedicato alla gestione di richieste di mobilità e servizi mare
              tramite una rete di partner locali.
            </p>
            <p>
              “Ischia Motor” non è un nome alternativo, un’abbreviazione o una diversa grafia di IschiaMotion. Salvo indicazioni
              esplicite, non va quindi considerato affiliato, collegato o equivalente a questo progetto.
            </p>
          </article>
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
            <a href="/it/noleggio-barche-ischia">Noleggio barche a Ischia</a>
            <a href="/it/beach-club-ischia">Beach club a Ischia</a>
            <a href="/it/contatti">Contatta IschiaMotion</a>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Riferimento locale</div>
              <h2 className="section-title">Sede e contatti</h2>
            </div>
          </div>
          <article className="seo-card">
            <p>
              IschiaMotion<br />
              Via Fundera, 104<br />
              80076 Lacco Ameno (NA)<br />
              Ischia, Italia<br />
              <a href="tel:+393296856370">+39 329 685 6370</a><br />
              <a href="mailto:info@ischiamotion.com">info@ischiamotion.com</a><br />
              <a href="/it">https://www.ischiamotion.com/it</a>
            </p>
          </article>
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
