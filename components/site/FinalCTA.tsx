import type { Locale } from "@/lib/types";

export function FinalCTA({ locale }: { locale: Locale }) {
  return (
    <section className="final-cta reveal">
      <div className="final-box">
        <h2 dangerouslySetInnerHTML={{ __html: locale === "it" ? "Muoviti a Ischia<br>con più semplicità." : "Plan your Ischia days<br>with less friction." }} />
        <p>{locale === "it" ? "Non devi capire tutto da solo: ci dici dove soggiorni, quando arrivi e cosa vuoi fare. In pochi minuti verifichiamo disponibilità, prezzo e condizioni con partner locali selezionati." : "You don’t have to figure it out alone: tell us where you’re staying, when you arrive and what you want to do. Within minutes we check availability, price and conditions with selected local partners."}</p>
        <a href="#prenota" className="primary-btn">
          {locale === "it" ? "Verifica disponibilità e prezzo →" : "Check availability and price →"}
        </a>
      </div>
    </section>
  );
}
