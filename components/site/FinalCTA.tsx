import type { Locale } from "@/lib/types";

export function FinalCTA({ locale }: { locale: Locale }) {
  return (
    <section className="final-cta reveal">
      <div className="final-box">
        <h2 dangerouslySetInnerHTML={{ __html: locale === "it" ? "Muoviti a Ischia<br>con più semplicità." : "Plan your Ischia days<br>with less friction." }} />
        <p>{locale === "it" ? "Non devi capire tutto da solo: ci dici dove soggiorni, quando arrivi e cosa vuoi fare. IschiaMotion ti aiuta a scegliere la soluzione più adatta e verifica disponibilità e condizioni con partner locali." : "You don’t have to figure it out alone: tell us where you’re staying, when you arrive and what you want to do. IschiaMotion helps you choose the right option and checks availability and conditions with local partners."}</p>
        <a href="#prenota" className="primary-btn">
          {locale === "it" ? "Trova la soluzione giusta →" : "Find the right option →"}
        </a>
      </div>
    </section>
  );
}
