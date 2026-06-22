import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { JsonLd } from "@/components/site/JsonLd";
import { SeoFaqSection, type SeoFaqItem } from "@/components/site/SeoFaqSection";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import { faqJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/types";

type InfoPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  cardTitle: string;
  cardText: React.ReactNode;
  sections: Array<{
    title: string;
    body: React.ReactNode;
  }>;
  faqs?: SeoFaqItem[];
};

export function InfoPage({ locale, content }: { locale: Locale; content: InfoPageContent }) {
  return (
    <>
      {content.faqs?.length ? <JsonLd data={faqJsonLd(content.faqs)} /> : null}
      <Header locale={locale} />
      <main className="seo-landing">
        <section className="seo-landing-hero">
          <div>
            <div className="section-eyebrow">{content.eyebrow}</div>
            <h1>{content.title}</h1>
            <p>{content.intro}</p>
          </div>
          <div className="seo-landing-card">
            <span>IschiaMotion</span>
            <strong>{content.cardTitle}</strong>
            <p>{content.cardText}</p>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="seo-landing-grid">
            {content.sections.map((section) => (
              <article className="seo-card" key={section.title}>
                <h3>{section.title}</h3>
                <p>{section.body}</p>
              </article>
            ))}
          </div>
        </section>
        {content.faqs?.length ? <SeoFaqSection locale={locale} faqs={content.faqs} /> : null}
      </main>
      <WhatsAppCTA locale={locale} />
      <Footer locale={locale} />
    </>
  );
}
