import type { Locale } from "@/lib/types";

export function HowItWorks({ locale }: { locale: Locale }) {
  const steps = locale === "it"
    ? [
      ["Inserisci date e zona", "Ci dici cosa cerchi, dove arrivi o dove soggiorni."],
      ["Controlliamo subito le opzioni", "Verifichiamo disponibilità, prezzo, condizioni e punto di ritiro con partner locali selezionati."],
      ["Ricevi la proposta in pochi minuti", "Ti inviamo le soluzioni disponibili per le tue date, con tutti i dettagli utili prima della conferma."]
    ]
    : [
      ["Enter your dates and area", "Tell us what you're looking for, where you're arriving or staying."],
      ["We check options right away", "We verify availability, price, conditions and pickup point with selected local partners."],
      ["Get your proposal in minutes", "We send you the available options for your dates, with all the details you need before confirming."]
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
