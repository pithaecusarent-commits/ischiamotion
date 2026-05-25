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
      ["Scooter", "/it/noleggio-scooter-ischia"],
      ["Auto", "/it/noleggio-auto-ischia"],
      ["E-bike", "/it/noleggio-bici-elettriche-ischia"],
      ["Gommoni", "/it/noleggio-gommoni-ischia"],
      ["Barche", "/it/noleggio-barche-ischia"],
      ["Barca con skipper", "/it/barca-con-skipper-ischia"],
      ["Contatti", "/it/contatti"]
    ];
  }

  return [
    ["Home", "/en"],
    ["Scooter", "/en/scooter-rental-ischia"],
    ["Cars", "/en/car-rental-ischia"],
    ["E-bikes", "/en/e-bike-rental-ischia"],
    ["Rubber dinghies", "/en/rubber-dinghy-rental-ischia"],
    ["Boats", "/en/boat-rental-ischia"],
    ["Boat with skipper", "/en/boat-with-skipper-ischia"],
    ["Contact", "/en/contact"]
  ];
}

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
  const internalLinks = getInternalLinks(content.locale);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "IschiaMotion", url: `${siteUrl}${homePath}` },
        { name: content.title, url: `${siteUrl}${content.path}` }
      ])} />
      <JsonLd data={faqJsonLd(content.faqs)} />
      <JsonLd data={serviceJsonLd(content.locale, content.path, content.title, content.description)} />
      <JsonLd data={webpageJsonLd(content)} />
      <Header locale={content.locale} />
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

        <section className="final-cta reveal">
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
