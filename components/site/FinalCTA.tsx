import type { Locale } from "@/lib/types";

export function FinalCTA({ locale }: { locale: Locale }) {
  return (
    <section className="final-cta reveal">
      <div className="final-box">
        <h2 dangerouslySetInnerHTML={{ __html: locale === "it" ? "Pronto a vivere<br>l'isola senza limiti?" : "Ready to explore<br>the island freely?" }} />
        <p>{locale === "it" ? "Scegli un’opzione, invia la richiesta e attendi la verifica della disponibilità con i partner locali selezionati. IschiaMotion rende la ricerca del noleggio più semplice e chiara." : "Choose an option, send your request and wait for availability review with selected local partners. IschiaMotion makes the rental search simpler and clearer."}</p>
        <a href="#prenota" className="primary-btn">
          {locale === "it" ? "Richiedi disponibilità →" : "Request availability →"}
        </a>
      </div>
    </section>
  );
}
