import type { Locale } from "@/lib/types";

export function HowItWorks({ locale }: { locale: Locale }) {
  const steps = locale === "it"
    ? [
      ["Cerca e scegli", "Filtra per tipo di veicolo, date e zona dell'isola. Prezzi trasparenti, disponibilità in tempo reale."],
      ["Prenota online", "Paga subito con carta di credito o scegli di pagare al ritiro. Conferma istantanea via email."],
      ["Ritira e parti", "Presentati al punto di ritiro con la conferma. Niente code, niente sorprese. Solo strada aperta."]
    ]
    : [
      ["Search and choose", "Filter by vehicle type, dates and island area. Transparent prices and real-time availability."],
      ["Book online", "Pay by card or choose to pay at pickup. Instant confirmation by email."],
      ["Pick up and go", "Show up at the pickup point with your confirmation. No queues, no surprises. Just open road."]
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
