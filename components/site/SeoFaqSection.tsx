import type { Locale } from "@/lib/types";

export type SeoFaqItem = {
  question: string;
  answer: string;
};

export function SeoFaqSection({ locale, faqs }: { locale: Locale; faqs: SeoFaqItem[] }) {
  return (
    <section className="faq-section" aria-label={locale === "it" ? "Domande frequenti" : "Frequently asked questions"}>
      <div className="section-header">
        <div>
          <div className="section-eyebrow">FAQ</div>
          <h2 className="section-title">{locale === "it" ? "Domande frequenti" : "Frequently asked questions"}</h2>
        </div>
      </div>
      <div className="faq-grid">
        {faqs.map((item) => (
          <article className="faq-card" key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
