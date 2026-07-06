import { Fragment } from "react";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { JsonLd } from "@/components/site/JsonLd";
import { SeoFaqSection } from "@/components/site/SeoFaqSection";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import type { Locale } from "@/lib/types";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd, siteUrl, webpageJsonLd } from "@/lib/seo";
import { getWhatsAppUrl } from "@/lib/whatsapp";

type LocalCarPortContent = {
  locale: Locale;
  path: string;
  alternatePath: string;
  title: string;
  metaDescription: string;
  eyebrow: string;
  intro: string;
  supportText: string;
  cardTitle: string;
  cardText: string;
  primaryCta: string;
  secondaryCta: string;
  benefitsTitle: string;
  benefitsText: string;
  howTitle: string;
  steps: Array<[string, string]>;
  pricesTitle: string;
  pricesText: string;
  placesTitle: string;
  placesText: string;
  requestTitle: string;
  requestItems: string[];
  linksTitle: string;
  internalLinks: Array<[string, string]>;
  faqs: Array<{ question: string; answer: string }>;
  finalTitle: string;
  finalText: string;
};

const content = {
  it: {
    locale: "it",
    path: "/it/noleggio-auto-ischia-porto",
    alternatePath: "/en/car-rental-ischia-port",
    title: "Noleggio auto Ischia Porto",
    metaDescription: "Richiedi un'auto a noleggio a Ischia Porto con IschiaMotion. Verifichiamo disponibilità, condizioni e ritiro con partner locali selezionati sull'isola.",
    eyebrow: "Auto a Ischia Porto",
    intro: "Se arrivi a Ischia Porto e vuoi muoverti liberamente sull'isola, IschiaMotion ti aiuta a inviare una richiesta per il noleggio auto con ritiro in zona o presso un punto concordato. Verifichiamo disponibilità, condizioni e conferma con partner locali selezionati, così puoi ricevere una proposta chiara prima di organizzare i tuoi spostamenti.",
    supportText: "IschiaMotion non è un autonoleggio diretto: raccoglie la richiesta e controlla le opzioni disponibili con partner selezionati sull'isola.",
    cardTitle: "Arrivi, bagagli e autonomia",
    cardText: "Soluzione utile se sbarchi a Ischia Porto e vuoi raggiungere hotel, spiagge o più comuni con maggiore libertà.",
    primaryCta: "Verifica disponibilità auto",
    secondaryCta: "Chiedi supporto su WhatsApp",
    benefitsTitle: "Perché richiedere un'auto a Ischia Porto",
    benefitsText: "Ischia Porto è uno dei principali punti di arrivo dell'isola ed è una zona comoda per iniziare subito a muoversi verso Ischia Ponte, Casamicciola, Lacco Ameno, Forio, Sant'Angelo e le principali località turistiche. Un'auto può essere utile se soggiorni lontano dal porto, viaggi con bambini, bagagli o vuoi raggiungere più zone durante la vacanza.",
    howTitle: "Come funziona con IschiaMotion",
    steps: [
      ["Invia la richiesta", "Indichi date, orari, numero di persone e preferenze utili per orientare la verifica."],
      ["Verifichiamo disponibilità", "Controlliamo disponibilità e condizioni con partner locali selezionati a Ischia."],
      ["Ricevi conferma dopo verifica", "Ti comunichiamo dettagli di ritiro e informazioni utili prima del noleggio."]
    ],
    pricesTitle: "Prezzi noleggio auto Ischia Porto",
    pricesText: "I prezzi del noleggio auto a Ischia Porto possono variare in base a periodo, durata, categoria del veicolo, disponibilità, assicurazione, cauzione e condizioni del partner. Nei mesi estivi e nei periodi di alta richiesta è consigliabile inviare la richiesta con anticipo.",
    placesTitle: "Dove puoi andare da Ischia Porto",
    placesText: "Da Ischia Porto puoi raggiungere facilmente Ischia Ponte, Casamicciola Terme, Lacco Ameno, Forio, Barano, Serrara Fontana, Sant'Angelo e le spiagge principali dell'isola. La scelta dell'auto è particolarmente comoda per chi vuole visitare più zone in autonomia.",
    requestTitle: "Cosa indicare nella richiesta",
    requestItems: [
      "data e ora di ritiro",
      "data e ora di riconsegna",
      "numero di passeggeri",
      "presenza di bagagli",
      "eventuale seggiolino bambini",
      "preferenza cambio manuale o automatico",
      "eventuale arrivo in traghetto o aliscafo a Ischia Porto"
    ],
    linksTitle: "Approfondisci prima di richiedere",
    internalLinks: [
      ["Noleggio auto Ischia", "/it/noleggio-auto-ischia"],
      ["Come muoversi a Ischia", "/it/come-muoversi-a-ischia"],
      ["Dove dormire a Ischia", "/it/dove-dormire-a-ischia"],
      ["IschiaMotion", "/it/ischiamotion"],
      ["Contatti", "/it/contatti"]
    ],
    faqs: [
      {
        question: "Posso ritirare l'auto direttamente a Ischia Porto?",
        answer: "La disponibilità del ritiro a Ischia Porto dipende dal periodo, dal partner e dalle condizioni operative. Con IschiaMotion invii una richiesta e ricevi conferma dopo verifica."
      },
      {
        question: "Quanto costa noleggiare un'auto a Ischia Porto?",
        answer: "Il prezzo può variare in base a date, durata, categoria dell'auto, disponibilità, assicurazione e condizioni del partner. Per questo è meglio richiedere una verifica aggiornata."
      },
      {
        question: "Conviene noleggiare un'auto a Ischia?",
        answer: "Può convenire se vuoi visitare più zone dell'isola, se soggiorni lontano dal porto, se viaggi con bambini o bagagli, o se preferisci muoverti con maggiore autonomia."
      },
      {
        question: "IschiaMotion è un autonoleggio?",
        answer: "IschiaMotion è una piattaforma locale che raccoglie richieste e verifica disponibilità con partner selezionati. La conferma avviene dopo controllo di disponibilità e condizioni."
      }
    ],
    finalTitle: "Verifica disponibilità auto a Ischia Porto",
    finalText: "Ti aiutiamo a trovare una soluzione disponibile a Ischia Porto tramite partner locali selezionati, con conferma dopo verifica."
  },
  en: {
    locale: "en",
    path: "/en/car-rental-ischia-port",
    alternatePath: "/it/noleggio-auto-ischia-porto",
    title: "Car rental Ischia Port",
    metaDescription: "Request a rental car near Ischia Port with IschiaMotion. We check availability, conditions and pickup with selected local partners.",
    eyebrow: "Cars at Ischia Port",
    intro: "If you arrive at Ischia Port and want to move freely around the island, IschiaMotion helps you send a car rental request for pickup in the area or at an agreed point. We check availability, conditions and confirmation with selected local partners before you organize your island travel.",
    supportText: "IschiaMotion is not a direct car rental desk: it collects requests and checks available options with selected partners on the island.",
    cardTitle: "Arrival, luggage and freedom",
    cardText: "Useful if you land at Ischia Port and want to reach hotels, beaches or several towns with more independence.",
    primaryCta: "Check car availability",
    secondaryCta: "Ask for help on WhatsApp",
    benefitsTitle: "Why request a car at Ischia Port",
    benefitsText: "Ischia Port is one of the island's main arrival points and a convenient area to start moving toward Ischia Ponte, Casamicciola, Lacco Ameno, Forio, Sant'Angelo and the main visitor areas. A car can be useful if you stay far from the port, travel with children or luggage, or want to visit several areas during your trip.",
    howTitle: "How it works with IschiaMotion",
    steps: [
      ["Send the request", "Share dates, times, passenger count and useful preferences."],
      ["We check availability", "We review availability and conditions with selected local partners in Ischia."],
      ["Receive confirmation after review", "We share pickup details and useful information before the rental."]
    ],
    pricesTitle: "Car rental prices at Ischia Port",
    pricesText: "Car rental prices at Ischia Port may vary by season, rental length, vehicle category, availability, insurance, deposit and partner conditions. During summer and high-demand periods it is better to send the request in advance.",
    placesTitle: "Where you can go from Ischia Port",
    placesText: "From Ischia Port you can easily reach Ischia Ponte, Casamicciola Terme, Lacco Ameno, Forio, Barano, Serrara Fontana, Sant'Angelo and the island's main beaches. A car is especially convenient if you want to visit several areas independently.",
    requestTitle: "What to include in your request",
    requestItems: [
      "pickup date and time",
      "return date and time",
      "number of passengers",
      "luggage needs",
      "child seat request if needed",
      "manual or automatic transmission preference",
      "arrival by ferry or hydrofoil at Ischia Port"
    ],
    linksTitle: "Useful pages before requesting",
    internalLinks: [
      ["Car rental in Ischia", "/en/car-rental-ischia"],
      ["How to get around Ischia", "/en/how-to-get-around-ischia"],
      ["Where to stay in Ischia", "/en/where-to-stay-in-ischia"],
      ["IschiaMotion", "/en"],
      ["Contact", "/en/contact"]
    ],
    faqs: [
      {
        question: "Can I pick up the car directly at Ischia Port?",
        answer: "Pickup availability at Ischia Port depends on season, partner and operating conditions. With IschiaMotion you send a request and receive confirmation after review."
      },
      {
        question: "How much does car rental at Ischia Port cost?",
        answer: "The price can vary by dates, rental length, car category, availability, insurance and partner conditions. It is best to request an updated check."
      },
      {
        question: "Is renting a car in Ischia convenient?",
        answer: "It can be useful if you want to visit several island areas, stay far from the port, travel with children or luggage, or prefer more independence."
      },
      {
        question: "Is IschiaMotion a car rental company?",
        answer: "IschiaMotion is a local platform that collects requests and checks availability with selected partners. Confirmation follows availability and conditions review."
      }
    ],
    finalTitle: "Check car availability at Ischia Port",
    finalText: "We help you find an available solution near Ischia Port through selected local partners, with confirmation after review."
  }
} satisfies Record<Locale, LocalCarPortContent>;

function getSearchPath(locale: Locale) {
  return locale === "it" ? "/it/risultati?category=auto" : "/en/results?category=auto";
}

export function getLocalCarPortContent(locale: Locale) {
  return content[locale];
}

export function LocalCarPortLanding({ locale }: { locale: Locale }) {
  const c = getLocalCarPortContent(locale);
  const homePath = locale === "it" ? "/it" : "/en";
  const searchPath = getSearchPath(locale);
  const whatsappUrl = getWhatsAppUrl(locale, "auto", {
    arrivalPoint: locale === "it" ? "Ischia Porto" : "Ischia Port"
  });

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "IschiaMotion", url: `${siteUrl}${homePath}` },
        { name: c.title, url: `${siteUrl}${c.path}` }
      ])} />
      <JsonLd data={faqJsonLd(c.faqs)} />
      <JsonLd data={serviceJsonLd(c.locale, c.path, c.title, c.metaDescription)} />
      <JsonLd data={webpageJsonLd(c.locale, c.path, c.title, c.metaDescription)} />
      <Header locale={locale} alternateHref={c.alternatePath} />
      <main className="seo-landing">
        <section className="seo-landing-hero">
          <div>
            <div className="section-eyebrow">{c.eyebrow}</div>
            <h1>{c.title}</h1>
            <p>{c.intro}</p>
            <p>{c.supportText}</p>
            <div className="hero-actions">
              <a href={searchPath} className="primary-btn" data-ga-event="click_request_availability" data-ga-category="auto">
                {c.primaryCta}
              </a>
              <a href={whatsappUrl} className="ghost-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">
                {c.secondaryCta}
              </a>
            </div>
          </div>
          <div className="seo-landing-card">
            <span>{locale === "it" ? "Consigliato per" : "Best for"}</span>
            <strong>{c.cardTitle}</strong>
            <p>{c.cardText}</p>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{locale === "it" ? "Arrivo al porto" : "Port arrival"}</div>
              <h2 className="section-title">{c.benefitsTitle}</h2>
            </div>
          </div>
          <article className="seo-card">
            <p>{c.benefitsText}</p>
          </article>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{locale === "it" ? "Processo" : "Process"}</div>
              <h2 className="section-title">{c.howTitle}</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {c.steps.map(([title, text], index) => (
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
              <div className="section-eyebrow">{locale === "it" ? "Prezzi" : "Prices"}</div>
              <h2 className="section-title">{c.pricesTitle}</h2>
            </div>
          </div>
          <article className="seo-card">
            <p>{c.pricesText}</p>
            <div className="hero-actions">
              <a href={searchPath} className="primary-btn" data-ga-event="click_request_availability" data-ga-category="auto">
                {c.primaryCta}
              </a>
            </div>
          </article>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{locale === "it" ? "Itinerari" : "Routes"}</div>
              <h2 className="section-title">{c.placesTitle}</h2>
            </div>
          </div>
          <article className="seo-card">
            <p>{c.placesText}</p>
          </article>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{locale === "it" ? "Prima di richiedere" : "Before requesting"}</div>
              <h2 className="section-title">{c.requestTitle}</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {c.requestItems.map((item) => (
              <article className="seo-card" key={item}>
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{locale === "it" ? "Link utili" : "Useful links"}</div>
              <h2 className="section-title">{c.linksTitle}</h2>
            </div>
          </div>
          <div className="seo-landing-pickups">
            {c.internalLinks.map(([label, href], index) => (
              <Fragment key={href}>
                {index > 0 ? <span className="seo-link-separator" aria-hidden="true">·</span> : null}
                <a href={href}>{label}</a>
              </Fragment>
            ))}
          </div>
        </section>

        <SeoFaqSection locale={locale} faqs={c.faqs} />

        <section className="final-cta">
          <div className="final-box">
            <h2>{c.finalTitle}</h2>
            <p>{c.finalText}</p>
            <div className="hero-actions">
              <a href={searchPath} className="primary-btn" data-ga-event="click_request_availability" data-ga-category="auto">
                {c.primaryCta}
              </a>
              <a href={whatsappUrl} className="ghost-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">
                {c.secondaryCta}
              </a>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppCTA locale={locale} category="auto" context={{ arrivalPoint: locale === "it" ? "Ischia Porto" : "Ischia Port" }} />
      <Footer locale={locale} />
    </>
  );
}
