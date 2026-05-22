import type { Locale } from "@/lib/types";

export function ExperienceSection({ locale }: { locale: Locale }) {
  return (
    <section className="experience reveal">
      <div className="experience-card">
        <div className="exp-panel">
          <h2>{locale === "it" ? "Più libertà, meno attese." : "More freedom, less waiting."}</h2>
          <p>{locale === "it" ? "Un'esperienza pensata per chi arriva sull'isola e vuole organizzarsi senza complicazioni: scegli il mezzo, indica le date e ritira nel punto più comodo." : "An experience for guests arriving on the island who want to plan without friction: choose the ride, set the dates and pick up at the most convenient point."}</p>
          <div className="exp-list">
            <div><span>✓</span> {locale === "it" ? "Verifica disponibilità e dettagli chiari" : "Availability check and clear details"}</div>
            <div><span>✓</span> {locale === "it" ? "Punti ritiro nei luoghi più utili" : "Pickup points in the most useful places"}</div>
            <div><span>✓</span> {locale === "it" ? "Assistenza prima e durante il noleggio" : "Support before and during rental"}</div>
          </div>
        </div>
        <div className="exp-panel">
          <h2>{locale === "it" ? "Ischia diventa tua." : "Ischia becomes yours."}</h2>
          <p>{locale === "it" ? "Dal porto alle spiagge più nascoste, dai borghi alle terme: scooter, auto, bici e barche per vivere l'isola con il ritmo giusto." : "From the port to hidden beaches, villages and spas: scooters, cars, bikes and boats to enjoy the island at the right pace."}</p>
          <div className="exp-list">
            <a href="#spiagge-e-calette"><span>🌊</span> {locale === "it" ? "Spiagge e calette" : "Beaches and coves"}</a>
            <a href="#borghi-e-panorami"><span>🌿</span> {locale === "it" ? "Borghi e panorami" : "Villages and views"}</a>
            <a href="#giornate-in-mare"><span>☀️</span> {locale === "it" ? "Giornate in mare" : "Days at sea"}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
