import type { Locale } from "@/lib/types";

export function HowItWorks({ locale }: { locale: Locale }) {
  const steps = locale === "it"
    ? [
      ["Ci dici cosa ti serve", "Indichi date, zona, arrivo, hotel e tipo di vacanza: così capiamo quale soluzione può essere più adatta."],
      ["Verifichiamo con i partner", "IschiaMotion controlla disponibilità, prezzo e condizioni con operatori locali selezionati."],
      ["Ti ricontattiamo", "Dopo la verifica ti indichiamo opzioni disponibili, punto ritiro o consegna e prossimi passaggi."]
    ]
    : [
      ["Tell us what you need", "Share dates, area, arrival, hotel and trip style: this helps us understand which option may fit best."],
      ["We check with partners", "IschiaMotion reviews availability, price and conditions with selected local operators."],
      ["We contact you", "After the review, we share available options, pickup or delivery details and next steps."]
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
