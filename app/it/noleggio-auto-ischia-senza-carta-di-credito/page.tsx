import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { JsonLd } from "@/components/site/JsonLd";
import { SeoFaqSection } from "@/components/site/SeoFaqSection";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, serviceJsonLd, siteUrl, webpageJsonLd } from "@/lib/seo";
import { ISCHIAMOTION_WHATSAPP_NUMBER } from "@/lib/whatsapp";

const path = "/it/noleggio-auto-ischia-senza-carta-di-credito";
const title = "Noleggio Auto Ischia Senza Carta di Credito | Richiesta Disponibilità";
const description = "Cerchi un noleggio auto a Ischia senza carta di credito? Con IschiaMotion puoi richiedere disponibilità tramite partner locali selezionati, secondo condizioni e periodo.";

const faqs = [
  {
    question: "È possibile noleggiare un’auto a Ischia senza carta di credito?",
    answer: "In alcuni casi può essere possibile, ma dipende sempre dal partner, dal periodo, dalla categoria auto e dalle condizioni applicate. IschiaMotion verifica la richiesta senza promettere disponibilità certa."
  },
  {
    question: "Quali alternative possono essere richieste alla carta di credito?",
    answer: "A seconda del partner possono essere valutati deposito, cauzione, pagamento in loco o altre modalità. Le condizioni vengono comunicate prima della conferma."
  },
  {
    question: "Posso pagare in contanti o con bancomat?",
    answer: "Eventuali pagamenti in loco, contanti o bancomat dipendono dal partner selezionato e dalla disponibilità per le date richieste."
  },
  {
    question: "La cauzione è sempre richiesta?",
    answer: "La cauzione e le modalità di deposito variano in base a partner, auto, periodo e condizioni assicurative. Vengono verificate e comunicate nella proposta."
  },
  {
    question: "IschiaMotion conferma subito l’auto senza carta?",
    answer: "No. IschiaMotion raccoglie la richiesta e verifica disponibilità e condizioni con partner locali selezionati. La conferma arriva solo dopo il controllo del partner."
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
    images: [{ url: "/images/ischiamotion-logo.png", alt: "Noleggio auto Ischia senza carta di credito - IschiaMotion" }]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/ischiamotion-logo.png"]
  }
};

export default function NoleggioAutoIschiaSenzaCartaPage() {
  const whatsappUrl = `https://wa.me/${ISCHIAMOTION_WHATSAPP_NUMBER}?text=${encodeURIComponent("Ciao IschiaMotion, vorrei richiedere disponibilità per noleggio auto a Ischia senza carta di credito, se disponibile.")}`;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "IschiaMotion", url: `${siteUrl}/it` },
        { name: "Noleggio auto Ischia senza carta di credito", url: `${siteUrl}${path}` }
      ])} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={serviceJsonLd("it", path, "Noleggio auto Ischia senza carta di credito", description)} />
      <JsonLd data={webpageJsonLd("it", path, title, description)} />
      <Header locale="it" alternateHref="/en/car-rental-ischia" />
      <main className="seo-landing">
        <section className="seo-landing-hero">
          <div>
            <div className="section-eyebrow">Auto a Ischia</div>
            <h1 className="seo-landing-title">Noleggio auto Ischia senza carta di credito</h1>
            <p>Se cerchi un’auto a Ischia ma non vuoi o non puoi usare una carta di credito, puoi inviare una richiesta specifica: IschiaMotion verifica con partner locali selezionati se esistono opzioni compatibili per le tue date.</p>
            <p>La disponibilità non è automatica e le condizioni possono cambiare in base a periodo, categoria auto, durata, cauzione e modalità richieste dal partner.</p>
            <div className="hero-actions">
              <a href="/it/risultati?category=auto" className="primary-btn">Richiedi disponibilità</a>
              <a href={whatsappUrl} className="ghost-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">Chiedi su WhatsApp</a>
            </div>
          </div>
          <div className="seo-landing-card">
            <span>Importante</span>
            <strong>Nessuna promessa automatica senza carta.</strong>
            <p>Verifichiamo condizioni reali con partner locali: deposito, cauzione o pagamento in loco sono possibili solo se accettati dal partner per la richiesta specifica.</p>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Condizioni</div>
              <h2 className="section-title">Cosa significa richiedere un’auto senza carta di credito</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            <article className="seo-card">
              <h3>Dipende dal partner</h3>
              <p>Ogni operatore locale può applicare regole diverse su carta, cauzione, deposito, documenti e assicurazione.</p>
            </article>
            <article className="seo-card">
              <h3>Dipende dal periodo</h3>
              <p>In alta stagione le condizioni possono essere più rigide; in altri periodi può esserci maggiore flessibilità, sempre previa verifica.</p>
            </article>
            <article className="seo-card">
              <h3>Dipende dall’auto</h3>
              <p>Categoria, durata del noleggio, valore del mezzo e disponibilità incidono sulle modalità richieste dal partner.</p>
            </article>
            <article className="seo-card">
              <h3>Conferma solo dopo controllo</h3>
              <p>La richiesta è senza impegno: prima della conferma ricevi condizioni, prezzo, modalità e documenti richiesti.</p>
            </article>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Alternative possibili</div>
              <h2 className="section-title">Deposito, cauzione o pagamento in loco</h2>
            </div>
          </div>
          <article className="seo-card">
            <p>Quando la carta di credito non è disponibile, puoi indicarlo subito nella richiesta. In base al partner, possono essere valutate alternative come cauzione, deposito, pagamento in loco o altre modalità compatibili.</p>
            <p>IschiaMotion non modifica le condizioni degli operatori: raccoglie la tua esigenza e verifica se un partner locale può gestirla in modo chiaro per le date richieste.</p>
          </article>
          <div className="seo-landing-pickups">
            <a href="/it/noleggio-auto-ischia">Noleggio auto Ischia</a>
            <span className="seo-link-separator" aria-hidden="true">·</span>
            <a href="/it/noleggio-auto-ischia-porto">Auto Ischia Porto</a>
            <span className="seo-link-separator" aria-hidden="true">·</span>
            <a href="/it/noleggio-scooter-ischia">Noleggio scooter</a>
            <span className="seo-link-separator" aria-hidden="true">·</span>
            <a href="/it/noleggio-bici-elettriche-ischia">E-bike</a>
            <span className="seo-link-separator" aria-hidden="true">·</span>
            <a href="/it/contatti">Contatti</a>
          </div>
        </section>

        <SeoFaqSection locale="it" faqs={faqs} />

        <section className="final-cta">
          <div className="final-box">
            <h2>Vuoi verificare un’auto senza carta di credito?</h2>
            <p>Invia date, zona, durata e modalità preferita: controlliamo se esistono opzioni disponibili con partner locali selezionati.</p>
            <div className="hero-actions">
              <a href="/it/risultati?category=auto" className="primary-btn">Richiedi disponibilità</a>
              <a href={whatsappUrl} className="ghost-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">Chiedi su WhatsApp</a>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppCTA locale="it" category="auto" />
      <Footer locale="it" />
    </>
  );
}
