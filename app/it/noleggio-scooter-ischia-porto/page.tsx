import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { JsonLd } from "@/components/site/JsonLd";
import { SeoFaqSection } from "@/components/site/SeoFaqSection";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, serviceJsonLd, siteUrl, webpageJsonLd } from "@/lib/seo";
import { ISCHIAMOTION_WHATSAPP_NUMBER } from "@/lib/whatsapp";

const path = "/it/noleggio-scooter-ischia-porto";
const title = "Noleggio Scooter Ischia Porto | Richiedi Disponibilità";
const description = "Richiedi disponibilità per noleggio scooter a Ischia Porto tramite partner locali selezionati. Ideale per muoversi sull’isola appena arrivato in traghetto o aliscafo.";

const faqs = [
  {
    question: "Posso richiedere uno scooter direttamente a Ischia Porto?",
    answer: "Puoi indicare Ischia Porto come zona preferita. Disponibilità, punto di ritiro, orario e condizioni vengono verificati con partner locali selezionati prima della conferma."
  },
  {
    question: "Lo scooter è comodo se arrivo in traghetto o aliscafo?",
    answer: "Per coppie o viaggiatori leggeri può essere molto pratico, perché permette di muoversi tra porto, spiagge e borghi con più autonomia. Va valutato in base a bagagli, esperienza di guida e periodo."
  },
  {
    question: "Quali documenti servono per noleggiare uno scooter a Ischia?",
    answer: "Servono documento, patente valida per la categoria richiesta e gli eventuali requisiti indicati dal partner. Le condizioni vengono comunicate prima della conferma."
  },
  {
    question: "Il casco è incluso?",
    answer: "Casco, cauzione, documenti e condizioni dipendono dal mezzo e dal partner locale. IschiaMotion verifica e comunica i dettagli nella proposta."
  },
  {
    question: "IschiaMotion è il noleggiatore diretto?",
    answer: "IschiaMotion è una piattaforma locale che raccoglie richieste e verifica disponibilità e condizioni tramite partner selezionati. I mezzi sono forniti dai rispettivi operatori locali."
  }
];

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: canonicalUrl(path),
    languages: {
      it: canonicalUrl(path),
      "x-default": canonicalUrl(path)
    }
  },
  openGraph: {
    title,
    description,
    url: canonicalUrl(path),
    siteName: "IschiaMotion",
    type: "website",
    locale: "it_IT",
    images: [{ url: "/images/ischiamotion-logo.png", alt: "Noleggio scooter Ischia Porto - IschiaMotion" }]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/ischiamotion-logo.png"]
  }
};

export default function NoleggioScooterIschiaPortoPage() {
  const whatsappUrl = `https://wa.me/${ISCHIAMOTION_WHATSAPP_NUMBER}?text=${encodeURIComponent("Ciao IschiaMotion, vorrei un consiglio per scegliere la soluzione più adatta al mio soggiorno a Ischia.\n\nArrivo il [data] a Ischia Porto, soggiorno in zona [zona/hotel] e sto valutando uno scooter.\n\nPotete aiutarmi a capire la soluzione migliore in base ai miei spostamenti?")}`;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "IschiaMotion", url: `${siteUrl}/it` },
        { name: "Noleggio scooter Ischia Porto", url: `${siteUrl}${path}` }
      ])} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={serviceJsonLd("it", path, "Noleggio scooter Ischia Porto", description)} />
      <JsonLd data={webpageJsonLd("it", path, title, description)} />
      <Header locale="it" alternateHref="/en/scooter-rental-ischia" />
      <main className="seo-landing">
        <section className="seo-landing-hero">
          <div>
            <div className="section-eyebrow">Scooter a Ischia Porto</div>
            <h1 className="seo-landing-title">Noleggio scooter Ischia Porto</h1>
            <p>Arrivare a Ischia Porto in traghetto o aliscafo e muoversi subito con uno scooter può essere una soluzione pratica per coppie e viaggiatori leggeri.</p>
            <p>Con IschiaMotion invii una richiesta senza impegno: verifichiamo disponibilità, punto di ritiro, orario, documenti e condizioni con partner locali selezionati.</p>
            <div className="hero-actions">
              <a href="/it/risultati?category=scooter&port_slug=ischia_porto" className="primary-btn">Richiedi disponibilità</a>
              <a href={whatsappUrl} className="ghost-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">Chiedi un consiglio su WhatsApp</a>
            </div>
          </div>
          <div className="seo-landing-card">
            <span>Ideale per</span>
            <strong>Arrivi al porto e spostamenti rapidi</strong>
            <p>Lo scooter è spesso comodo per raggiungere spiagge, borghi e zone panoramiche partendo da Ischia Porto, con ritiro e condizioni sempre da confermare.</p>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Dopo lo sbarco</div>
              <h2 className="section-title">Perché richiedere uno scooter a Ischia Porto</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            <article className="seo-card">
              <h3>Arrivo comodo da traghetti e aliscafi</h3>
              <p>Ischia Porto è uno dei principali punti di arrivo dell’isola. Indicando orario e data, è possibile verificare le opzioni disponibili in zona o nei punti ritiro compatibili.</p>
            </article>
            <article className="seo-card">
              <h3>Più autonomia sull’isola</h3>
              <p>Uno scooter può rendere più semplici gli spostamenti verso Ischia Ponte, Casamicciola, Lacco Ameno, Forio, Maronti e altre zone, soprattutto con pochi bagagli.</p>
            </article>
            <article className="seo-card">
              <h3>Ritiro o consegna da verificare</h3>
              <p>Punto di ritiro, eventuale consegna, orari e modalità dipendono dal partner, dal periodo e dalla disponibilità effettiva.</p>
            </article>
            <article className="seo-card">
              <h3>Documenti e casco</h3>
              <p>Patente, documento, casco, cauzione e condizioni vengono indicati nella proposta prima della conferma finale.</p>
            </article>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Zone raggiungibili</div>
              <h2 className="section-title">Da Ischia Porto verso spiagge, borghi e hotel</h2>
            </div>
          </div>
          <article className="seo-card">
            <p>Partendo da Ischia Porto puoi valutare lo scooter per raggiungere il Castello Aragonese e Ischia Ponte, le zone termali di Casamicciola, Lacco Ameno e San Montano, Forio e Citara, oppure le aree più panoramiche verso Barano e Maronti.</p>
            <p>Se viaggi con famiglia, molti bagagli o preferisci più comfort, può essere utile confrontare anche il <a href="/it/noleggio-auto-ischia">noleggio auto a Ischia</a>.</p>
          </article>
          <div className="seo-landing-pickups">
            <a href="/it/noleggio-scooter-ischia">Noleggio scooter Ischia</a>
            <span className="seo-link-separator" aria-hidden="true">·</span>
            <a href="/it/noleggio-auto-ischia">Noleggio auto Ischia</a>
            <span className="seo-link-separator" aria-hidden="true">·</span>
            <a href="/it/noleggio-bici-elettriche-ischia">E-bike Ischia</a>
            <span className="seo-link-separator" aria-hidden="true">·</span>
            <a href="/it/noleggio-gommoni-ischia">Gommoni</a>
            <span className="seo-link-separator" aria-hidden="true">·</span>
            <a href="/it/contatti">Contatti</a>
          </div>
        </section>

        <SeoFaqSection locale="it" faqs={faqs} />

        <section className="final-cta">
          <div className="final-box">
            <h2>Arrivi a Ischia Porto e vuoi uno scooter?</h2>
            <p>Invia date, orario di arrivo e zona di soggiorno: verifichiamo disponibilità e condizioni con partner locali selezionati.</p>
            <div className="hero-actions">
              <a href="/it/risultati?category=scooter&port_slug=ischia_porto" className="primary-btn">Richiedi disponibilità</a>
              <a href={whatsappUrl} className="ghost-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">Chiedi un consiglio su WhatsApp</a>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppCTA locale="it" category="scooter" />
      <Footer locale="it" />
    </>
  );
}
