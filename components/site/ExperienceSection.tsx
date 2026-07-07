import type { Locale } from "@/lib/types";

export function ExperienceSection({ locale }: { locale: Locale }) {
  return (
    <section className="experience reveal">
      <div className="experience-card">
        <div className="exp-panel">
          <h2>{locale === "it" ? "Più libertà, meno attese." : "More freedom, less waiting."}</h2>
          <p>{locale === "it" ? "Un’esperienza pensata per chi arriva sull’isola e vuole orientarsi tra opzioni locali selezionate: scegli la categoria, indica le date e ricevi in pochi minuti una proposta con disponibilità, prezzo e condizioni." : "An experience for guests arriving on the island who want to navigate selected local options: choose the category, set the dates and get a proposal with availability, price and conditions within minutes."}</p>
          <div className="exp-list">
            <div><span aria-hidden="true">✓</span> {locale === "it" ? "Verifica disponibilità e dettagli chiari" : "Availability check and clear details"}</div>
            <div><span aria-hidden="true">✓</span> {locale === "it" ? "Punti ritiro nei luoghi più utili" : "Pickup points in the most useful places"}</div>
            <div><span aria-hidden="true">✓</span> {locale === "it" ? "Supporto prima e durante la richiesta" : "Support before and during the request"}</div>
          </div>
        </div>
        <div className="exp-panel">
          <h2>{locale === "it" ? "Ischia diventa tua." : "Ischia becomes yours."}</h2>
          <p>{locale === "it" ? "Dal porto alle spiagge più nascoste, dai borghi alle terme: IschiaMotion collega la tua richiesta a partner locali per scooter, auto, bici e barche." : "From the port to hidden beaches, villages and spas: IschiaMotion connects your request with local partners for scooters, cars, bikes and boats."}</p>
          <div className="exp-list">
            <div><span aria-hidden="true">🌊</span> {locale === "it" ? "Spiagge e calette" : "Beaches and coves"}</div>
            <div><span aria-hidden="true">🌿</span> {locale === "it" ? "Borghi e panorami" : "Villages and views"}</div>
            <div><span aria-hidden="true">☀️</span> {locale === "it" ? "Giornate in mare" : "Days at sea"}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
