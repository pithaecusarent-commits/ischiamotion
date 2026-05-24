import type { Locale } from "@/lib/types";

export function HowItWorks({ locale }: { locale: Locale }) {
  const steps = locale === "it"
    ? [
      ["Cerca le opzioni", "Filtra per tipo di veicolo, date e zona dell'isola tra mezzi proposti da partner selezionati."],
      ["Richiedi disponibilità", "Invia la richiesta online: IschiaMotion verifica date e opzioni con il network locale."],
      ["Ricevi conferma", "Dopo la verifica ti indichiamo disponibilità, punto ritiro e prossimi passaggi."]
    ]
    : [
      ["Browse options", "Filter by vehicle type, dates and island area among options from selected local partners."],
      ["Request availability", "Send your request online: IschiaMotion checks dates and options with the local network."],
      ["Receive confirmation", "After review, we share availability, pickup point and next steps."]
    ];

  return (
    <section className="how-section reveal" id="come-funziona">
      <div className="how-wrap">
        <div className="section-eyebrow">{locale === "it" ? "Come funziona" : "How it works"}</div>
        <h2 className="section-title" dangerouslySetInnerHTML={{ __html: locale === "it" ? "Tre passi e sei<br><em>pronto a partire</em>" : "Three steps and you are<br><em>ready to go</em>" }} />

        <div className="steps">
          {steps.map(([title, text], index) => (
            <div className="step" key={title}>
              <div className="step-num">0{index + 1}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
