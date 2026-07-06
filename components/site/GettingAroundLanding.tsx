import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { JsonLd } from "@/components/site/JsonLd";
import { SeoFaqSection } from "@/components/site/SeoFaqSection";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import type { Locale } from "@/lib/types";
import { breadcrumbJsonLd, faqJsonLd, siteUrl, webpageJsonLd } from "@/lib/seo";
import { Fragment } from "react";

type Content = {
  eyebrow: string;
  h1: string;
  intro: string;
  cardTitle: string;
  cardText: string;
  primaryCta: string;
  secondaryCta: string;
  whatsappMsg: string;
  breadcrumbLabel: string;
  choiceEyebrow: string;
  choiceTitle: string;
  choiceHeaders: [string, string, string];
  choices: Array<[string, string, string]>;
  sections: Array<{ title: string; paragraphs: string[]; links: Array<[string, string]> }>;
  guideLinkBefore: string;
  guideLinkLabel: string;
  guideLinkAfter: string;
  alternativesTitle: string;
  alternativesText: string;
  areasEyebrow: string;
  areasTitle: string;
  areasHeaders: [string, string, string];
  areas: Array<[string, string, string]>;
  beachTitle: string;
  beachText: string;
  beachLink: [string, string];
  linksTitle: string;
  usefulLinks: Array<[string, string]>;
  faqs: Array<{ question: string; answer: string }>;
  finalTitle: string;
  finalText: string;
};

const content: Record<Locale, Content> = {
  it: {
    eyebrow: "Guida alla mobilità",
    h1: "Come muoversi a Ischia",
    intro: "Il modo migliore per muoversi a Ischia dipende dalla zona dell'alloggio, dal periodo, dalle spiagge che vuoi raggiungere e dal tipo di vacanza. Bagagli, bambini, distanze e programmi giornalieri possono rendere più adatto uno scooter, un'auto, un'e-bike oppure i mezzi pubblici. Per esplorare la costa, invece, barche e gommoni offrono una prospettiva diversa, sempre in base a disponibilità, meteo e condizioni confermate dal partner locale.",
    guideLinkBefore: "Se stai ancora organizzando il tuo itinerario, leggi anche la guida su ",
    guideLinkLabel: "cosa vedere a Ischia senza auto",
    guideLinkAfter: ", con zone, tappe e consigli pratici sugli spostamenti.",
    cardTitle: "Scegliere in base alla vacanza",
    cardText: "Confronta esigenze, zona di soggiorno e itinerario prima di richiedere la disponibilità del mezzo più adatto.",
    primaryCta: "Trova il mezzo più adatto",
    secondaryCta: "Chiedi supporto su WhatsApp",
    whatsappMsg: "Ciao IschiaMotion, vorrei verificare la disponibilità di un mezzo per muovermi a Ischia.",
    breadcrumbLabel: "Come muoversi a Ischia",
    choiceEyebrow: "Confronto rapido",
    choiceTitle: "Quale mezzo scegliere",
    choiceHeaders: ["Esigenza", "Mezzo consigliato", "Ideale per"],
    choices: [
      ["Muoversi velocemente tra comuni", "Scooter", "Coppie e viaggiatori leggeri"],
      ["Famiglie e bagagli", "Auto", "Comfort, gruppi e tratte più lunghe"],
      ["Percorsi panoramici leggeri", "E-bike", "Lungomare, borghi e soste frequenti"],
      ["Spiagge e calette dal mare", "Barca o gommone", "Giornate lungo la costa"],
      ["Zone centrali", "A piedi o bus", "Soggiorni vicino a servizi e fermate"],
      ["Giornata relax", "Beach club", "Mare con servizi già organizzati"]
    ],
    sections: [
      {
        title: "Muoversi a Ischia in scooter",
        paragraphs: ["Lo scooter è spesso la soluzione più agile per spostarsi tra i comuni, cercare parcheggio e raggiungere spiagge o borghi con maggiore autonomia. Il noleggio scooter a Ischia è particolarmente pratico per coppie e viaggiatori con pochi bagagli.", "Chi arriva via mare può richiedere un noleggio scooter a Ischia Porto; sul versante occidentale, il noleggio scooter a Forio può essere utile per Citara, il centro e le località vicine. Indica la tua zona: controlliamo subito cilindrata, requisiti e punto di ritiro disponibili con il partner locale."],
        links: [["Noleggio scooter Ischia", "/it/noleggio-scooter-ischia"]]
      },
      {
        title: "Muoversi a Ischia in auto",
        paragraphs: ["L'auto a Ischia offre più comfort a famiglie, piccoli gruppi e viaggiatori con valigie, passeggini o attrezzatura da mare. Può essere utile anche per alloggi collinari o itinerari con molte tappe.", "Prima di scegliere il noleggio auto a Ischia conviene considerare dimensioni del veicolo, parcheggio e accessibilità dell'alloggio. Invia una richiesta: controlliamo subito le opzioni disponibili e ti inviamo in pochi minuti prezzo e condizioni."],
        links: [["Noleggio auto Ischia", "/it/noleggio-auto-ischia"]]
      },
      {
        title: "Muoversi a Ischia in e-bike",
        paragraphs: ["Un'e-bike a Ischia è adatta a chi ama pedalare lungo tratti panoramici, lungomare e percorsi con soste frequenti. Le salite dell'isola richiedono comunque una valutazione realistica di allenamento, autonomia della batteria e itinerario.", "Per il noleggio e-bike a Ischia, compresa la zona di Forio, è utile indicare altezza, durata e percorso previsto: verifichiamo subito modello, autonomia e disponibilità con il partner locale."],
        links: [["Noleggio bici elettriche Ischia", "/it/noleggio-bici-elettriche-ischia"]]
      },
      {
        title: "Vivere Ischia dal mare: barche e gommoni",
        paragraphs: ["Il noleggio barche a Ischia e il noleggio gommoni a Ischia permettono di osservare la costa, fermarsi nelle baie consentite e costruire una giornata diversa rispetto agli spostamenti via terra.", "Una barca con skipper a Ischia può essere richiesta quando il servizio è disponibile, così come un gommone senza patente in base al tipo di mezzo e alla normativa applicabile. Indicaci data, numero di persone e tipo di esperienza: controlliamo subito meteo, requisiti e porto di partenza e ti inviamo una proposta in pochi minuti."],
        links: [["Noleggio barche Ischia", "/it/noleggio-barche-ischia"], ["Noleggio gommoni Ischia", "/it/noleggio-gommoni-ischia"]]
      }
    ],
    alternativesTitle: "Bus, taxi e alternative per muoversi a Ischia",
    alternativesText: "Bus e taxi sono opzioni utili, soprattutto per chi soggiorna in una zona centrale o preferisce non guidare. La rete pubblica collega i principali comuni, mentre il taxi può essere comodo per trasferimenti mirati. In alta stagione traffico, affluenza e tempi di attesa possono allungare gli spostamenti: pianificare con margine e combinare più soluzioni aiuta a viaggiare con maggiore tranquillità.",
    areasEyebrow: "Consigli locali",
    areasTitle: "Come muoversi in base alla zona",
    areasHeaders: ["Zona", "Consiglio pratico", "Mezzo più comodo"],
    areas: [
      ["Ischia Porto", "Centro, porto e servizi sono spesso raggiungibili a piedi; un mezzo aiuta a esplorare il resto dell'isola.", "A piedi, bus o scooter"],
      ["Forio", "Le distanze tra centro, Citara e altre spiagge rendono utile una soluzione flessibile.", "Scooter, auto o e-bike"],
      ["Casamicciola", "Buona base sulla costa nord, con collegamenti verso Ischia Porto e Lacco Ameno.", "Bus, scooter o e-bike"],
      ["Lacco Ameno", "Il centro si visita facilmente a piedi; per le altre zone conviene affiancare un mezzo.", "A piedi, scooter o auto"],
      ["Sant'Angelo", "Il borgo è pedonale: occorre pianificare arrivo, parcheggio e trasferimenti esterni.", "A piedi nel borgo, bus o taxi fuori"],
      ["Barano e Maronti", "Spiaggia e aree interne possono richiedere cambi o tragitti più lunghi.", "Auto, scooter, bus o taxi marino"]
    ],
    beachTitle: "Beach club a Ischia: quando conviene organizzarsi prima",
    beachText: "Chi desidera una giornata al mare più comoda può richiedere disponibilità per beach club selezionati. Nei periodi più richiesti è utile muoversi in anticipo: indica data e numero di persone e verifichiamo subito lettini, servizi e condizioni con la struttura locale.",
    beachLink: ["Beach club Ischia", "/it/beach-club-ischia"],
    linksTitle: "Servizi utili per organizzare gli spostamenti",
    usefulLinks: [["Scooter", "/it/noleggio-scooter-ischia"], ["Auto", "/it/noleggio-auto-ischia"], ["E-bike", "/it/noleggio-bici-elettriche-ischia"], ["Gommoni", "/it/noleggio-gommoni-ischia"], ["Barche", "/it/noleggio-barche-ischia"], ["Beach club", "/it/beach-club-ischia"]],
    faqs: [
      { question: "Qual è il modo migliore per muoversi a Ischia?", answer: "Dipende da zona, stagione e programma. Lo scooter è agile per coppie e spostamenti frequenti; l'auto è più comoda per famiglie e bagagli; bus, taxi ed e-bike funzionano bene per esigenze e itinerari specifici." },
      { question: "Serve l'auto a Ischia?", answer: "Non sempre. In zone centrali si può camminare e usare il bus. L'auto diventa utile per famiglie, bagagli, alloggi collinari o giornate con molte tappe, tenendo conto di traffico e parcheggio." },
      { question: "Conviene noleggiare uno scooter a Ischia?", answer: "Può convenire a coppie e viaggiatori leggeri che cercano autonomia e facilità di parcheggio. Bisogna avere i requisiti di guida corretti e valutare esperienza, meteo e condizioni stradali." },
      { question: "Si può girare Ischia senza auto?", answer: "Sì. A piedi, bus e taxi permettono di visitare molte zone. La scelta dell'alloggio e una pianificazione con tempi realistici diventano ancora più importanti, soprattutto in alta stagione." },
      { question: "Meglio scooter o auto a Ischia?", answer: "Lo scooter è più agile e adatto a una o due persone con pochi bagagli. L'auto offre più spazio e protezione ed è generalmente più pratica per famiglie, gruppi e trasferimenti con valigie." },
      { question: "Come muoversi da Ischia Porto?", answer: "Il centro si esplora bene a piedi. Per raggiungere altri comuni si possono usare bus, taxi, scooter, auto o e-bike, scegliendo in base a bagagli, numero di persone e destinazione." },
      { question: "Come raggiungere le spiagge più belle di Ischia?", answer: "Molte spiagge sono raggiungibili via strada con bus, taxi o mezzo privato; alcune baie si apprezzano anche dal mare. Accessi, parcheggi e servizi cambiano da zona a zona, quindi conviene verificarli prima." },
      { question: "È possibile richiedere un mezzo senza carta di credito?", answer: "Indica questa esigenza nella richiesta: verifichiamo subito metodi di pagamento, deposito e documenti richiesti in base a partner e mezzo, e ti rispondiamo in pochi minuti." }
    ],
    finalTitle: "Organizza i tuoi spostamenti a Ischia",
    finalText: "Invia una richiesta a IschiaMotion: verifichiamo disponibilità e condizioni con partner locali selezionati e ti diamo conferma quando una soluzione è disponibile."
  },
  en: {
    eyebrow: "Island mobility guide",
    h1: "How to get around Ischia",
    intro: "The best way to get around Ischia depends on where you are staying, the time of year, the beaches you plan to visit and your travel style. Luggage, children, hills and daily distances can make a scooter, car, e-bike or public transport the better option. Boats and RIBs offer another way to discover the coast, subject to local availability, weather and partner conditions.",
    guideLinkBefore: "If you are still planning your itinerary, you can also read our guide on ",
    guideLinkLabel: "what to see in Ischia without a car",
    guideLinkAfter: ", with areas, stops and practical tips for getting around.",
    cardTitle: "Match transport to your trip",
    cardText: "Compare your base, itinerary and practical needs before requesting availability for a vehicle or service.",
    primaryCta: "Find the right vehicle",
    secondaryCta: "Ask for help on WhatsApp",
    whatsappMsg: "Hello IschiaMotion, I would like to check transport availability for getting around Ischia.",
    breadcrumbLabel: "How to get around Ischia",
    choiceEyebrow: "Quick comparison",
    choiceTitle: "Which option should you choose?",
    choiceHeaders: ["Need", "Suggested option", "Best for"],
    choices: [
      ["Quick trips between towns", "Scooter", "Couples and light travellers"],
      ["Families and luggage", "Car", "Comfort, groups and longer routes"],
      ["Easy scenic rides", "E-bike", "Seafronts, villages and frequent stops"],
      ["Beaches and coves from the sea", "Boat or RIB", "Days along the coast"],
      ["Central areas", "Walking or bus", "Stays near services and bus stops"],
      ["A relaxed beach day", "Beach club", "Pre-arranged seaside services"]
    ],
    sections: [
      { title: "Getting around Ischia by scooter", paragraphs: ["A scooter is often the most agile choice for moving between towns, parking and reaching beaches or villages independently. Scooter rental in Ischia suits couples and travellers carrying light luggage.", "Scooter rental at Ischia Porto is practical after a ferry arrival, while scooter rental in Forio works well for exploring the western coast. Engine size, licence requirements, pickup point and availability are confirmed after a check with the local partner."], links: [["Scooter rental Ischia", "/en/scooter-rental-ischia"]] },
      { title: "Getting around Ischia by car", paragraphs: ["A car in Ischia gives families, small groups and travellers with luggage or beach equipment more comfort. It can also be useful for hillside accommodation and days with several stops.", "Before choosing car rental in Ischia, consider vehicle size, parking and access to your accommodation. IschiaMotion checks current availability with local partners; the final terms are confirmed before the rental."], links: [["Car rental Ischia", "/en/car-rental-ischia"]] },
      { title: "Getting around Ischia by e-bike", paragraphs: ["An e-bike in Ischia is a pleasant option for scenic stretches, seafronts and routes with regular stops. The island is hilly, so fitness, battery range and the planned route still matter.", "When requesting e-bike rental in Ischia or an e-bike in Forio, share your height, rental duration and intended route. The partner confirms the available model, range and pickup details."], links: [["E-bike rental Ischia", "/en/e-bike-rental-ischia"]] },
      { title: "See Ischia from the sea: boats and RIBs", paragraphs: ["Boat rental in Ischia and RIB rental in Ischia open up a different view of the coast, with stops in permitted bays and a day planned around the sea.", "A boat with a skipper can be requested where that service is offered. Licence-free RIB options depend on the craft, applicable rules and partner terms. Weather, requirements, departure point and service details must always be checked and confirmed before setting out."], links: [["Boat rental Ischia", "/en/boat-rental-ischia"], ["RIB rental Ischia", "/en/rubber-dinghy-rental-ischia"]] }
    ],
    alternativesTitle: "Buses, taxis and other ways to get around Ischia",
    alternativesText: "Buses and taxis are useful choices, especially if you stay centrally or prefer not to drive. Public routes connect the main towns, while taxis suit targeted transfers. During high season, traffic, passenger numbers and waiting times can make journeys longer, so allow extra time and combine options when useful.",
    areasEyebrow: "Local pointers",
    areasTitle: "Getting around from each area",
    areasHeaders: ["Area", "Practical advice", "Most convenient option"],
    areas: [
      ["Ischia Porto", "The port, centre and services are often walkable; transport helps when exploring farther away.", "Walking, bus or scooter"],
      ["Forio", "Distances between the centre, Citara and other beaches make flexibility valuable.", "Scooter, car or e-bike"],
      ["Casamicciola", "A practical north-coast base with connections towards Ischia Porto and Lacco Ameno.", "Bus, scooter or e-bike"],
      ["Lacco Ameno", "The centre is easy on foot; add transport for trips around the island.", "Walking, scooter or car"],
      ["Sant'Angelo", "The village is pedestrianised, so plan arrival, parking and trips beyond it.", "Walking locally, bus or taxi outside"],
      ["Barano and Maronti", "The beach and inland areas can involve changes or longer journeys.", "Car, scooter, bus or sea taxi"]
    ],
    beachTitle: "Ischia beach clubs: when to plan ahead",
    beachText: "Travellers looking for an easier beach day can request availability at selected beach clubs. During popular periods it helps to enquire early; sunbeds, services, terms and confirmation depend on a check with the local venue.",
    beachLink: ["Ischia beach clubs", "/en/ischia-beach-club"],
    linksTitle: "Useful services for planning your journeys",
    usefulLinks: [["Scooters", "/en/scooter-rental-ischia"], ["Cars", "/en/car-rental-ischia"], ["E-bikes", "/en/e-bike-rental-ischia"], ["RIBs", "/en/rubber-dinghy-rental-ischia"], ["Boats", "/en/boat-rental-ischia"], ["Beach clubs", "/en/ischia-beach-club"]],
    faqs: [
      { question: "What is the best way to get around Ischia?", answer: "It depends on your base, season and plans. Scooters are agile for frequent trips, cars suit families and luggage, while buses, taxis and e-bikes work well for particular routes and travel styles." },
      { question: "Do you need a car in Ischia?", answer: "Not always. Central areas can be explored on foot and by bus. A car is useful for families, luggage, hillside accommodation or multi-stop days, provided you account for traffic and parking." },
      { question: "Is it worth renting a scooter in Ischia?", answer: "It can be a practical choice for couples and light travellers who value independence and easier parking. You need the correct licence and should consider your riding experience, weather and road conditions." },
      { question: "Can you explore Ischia without a car?", answer: "Yes. Walking, buses and taxis cover many journeys. Choosing a well-located base and allowing realistic travel times is particularly important during high season." },
      { question: "Is a scooter or car better in Ischia?", answer: "A scooter is more agile for one or two people with little luggage. A car provides more space and shelter and is generally more practical for families, groups and transfers with suitcases." },
      { question: "How do you get around from Ischia Porto?", answer: "The centre is easy to explore on foot. For other towns, choose between buses, taxis, scooters, cars and e-bikes according to your destination, luggage and group size." },
      { question: "How can you reach Ischia's best beaches?", answer: "Many beaches can be reached by road using buses, taxis or a private vehicle; some bays can also be enjoyed from the sea. Access, parking and services vary, so check the details before leaving." },
      { question: "Can I request a vehicle without a credit card?", answer: "You can submit a request mentioning this need, but payment methods, deposits and required documents vary by partner and vehicle. The applicable terms are confirmed after availability is checked." }
    ],
    finalTitle: "Plan how you will get around Ischia",
    finalText: "Send a request to IschiaMotion. We check availability and terms with selected local partners and provide confirmation when a suitable option is available."
  }
};

export function GettingAroundLanding({ locale }: { locale: Locale }) {
  const c = content[locale];
  const homePath = `/${locale}`;
  const path = locale === "it" ? "/it/come-muoversi-a-ischia" : "/en/how-to-get-around-ischia";
  const alternatePath = locale === "it" ? "/en/how-to-get-around-ischia" : "/it/come-muoversi-a-ischia";
  const searchPath = locale === "it" ? "/it/risultati" : "/en/results";
  const guideHref = locale === "it" ? "/it/cosa-vedere-a-ischia-senza-auto" : "/en/what-to-see-in-ischia-without-a-car";
  const whatsappUrl = `https://wa.me/393296856370?text=${encodeURIComponent(c.whatsappMsg)}`;
  const description = locale === "it"
    ? "Guida pratica su come muoversi a Ischia: quando conviene scooter, auto, e-bike, bus, taxi o barca. Consigli per zone, porti, spiagge e richiesta disponibilità."
    : "A practical guide to getting around Ischia by scooter, car, e-bike, bus, taxi or boat, with tips by area, port, beach and travel style.";

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "IschiaMotion", url: `${siteUrl}${homePath}` }, { name: c.breadcrumbLabel, url: `${siteUrl}${path}` }])} />
      <JsonLd data={faqJsonLd(c.faqs)} />
      <JsonLd data={webpageJsonLd(locale, path, c.h1, description)} />
      <Header locale={locale} alternateHref={alternatePath} />
      <main className="seo-landing">
        <section className="seo-landing-hero">
          <div>
            <div className="section-eyebrow">{c.eyebrow}</div>
            <h1>{c.h1}</h1>
            <p>{c.intro}</p>
            <p>{c.guideLinkBefore}<a href={guideHref}>{c.guideLinkLabel}</a>{c.guideLinkAfter}</p>
            <div className="hero-actions">
              <a href={searchPath} className="primary-btn">{c.primaryCta}</a>
              <a href={whatsappUrl} className="ghost-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">{c.secondaryCta}</a>
            </div>
          </div>
          <div className="seo-landing-card">
            <span>{locale === "it" ? "In breve" : "In short"}</span>
            <strong>{c.cardTitle}</strong>
            <p>{c.cardText}</p>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header"><div><div className="section-eyebrow">{c.choiceEyebrow}</div><h2 className="section-title">{c.choiceTitle}</h2></div></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead><tr>{c.choiceHeaders.map((header) => <th key={header} className="text-left p-3 border-b-2 font-semibold whitespace-nowrap">{header}</th>)}</tr></thead>
              <tbody>{c.choices.map(([need, option, ideal]) => <tr key={need} className="border-b last:border-b-0"><td className="p-3 font-medium">{need}</td><td className="p-3 whitespace-nowrap">{option}</td><td className="p-3">{ideal}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        {c.sections.map((section) => (
          <section className="seo-landing-section" key={section.title}>
            <div className="section-header"><div><h2 className="section-title">{section.title}</h2></div></div>
            <article className="seo-card">
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="hero-actions">{section.links.map(([label, href]) => <a key={href} href={href} className="ghost-btn">{label}</a>)}</div>
            </article>
          </section>
        ))}

        <section className="seo-landing-section">
          <div className="section-header"><div><h2 className="section-title">{c.alternativesTitle}</h2></div></div>
          <article className="seo-card"><p>{c.alternativesText}</p></article>
        </section>

        <section className="seo-landing-section">
          <div className="section-header"><div><div className="section-eyebrow">{c.areasEyebrow}</div><h2 className="section-title">{c.areasTitle}</h2></div></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead><tr>{c.areasHeaders.map((header) => <th key={header} className="text-left p-3 border-b-2 font-semibold whitespace-nowrap">{header}</th>)}</tr></thead>
              <tbody>{c.areas.map(([area, advice, option]) => <tr key={area} className="border-b last:border-b-0"><td className="p-3 font-medium whitespace-nowrap">{area}</td><td className="p-3">{advice}</td><td className="p-3">{option}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header"><div><h2 className="section-title">{c.beachTitle}</h2></div></div>
          <article className="seo-card"><p>{c.beachText}</p><div className="hero-actions"><a href={c.beachLink[1]} className="ghost-btn">{c.beachLink[0]}</a></div></article>
        </section>

        <section className="seo-landing-section">
          <div className="section-header"><div><div className="section-eyebrow">{locale === "it" ? "Link utili" : "Useful links"}</div><h2 className="section-title">{c.linksTitle}</h2></div></div>
          <div className="seo-landing-pickups">
            {c.usefulLinks.map(([label, href], index) => (
              <Fragment key={href}>
                {index > 0 ? <span className="seo-link-separator" aria-hidden="true">·</span> : null}
                <a href={href}>{label}</a>
              </Fragment>
            ))}
          </div>
        </section>

        <SeoFaqSection locale={locale} faqs={c.faqs} />

        <section className="final-cta"><div className="final-box"><h2>{c.finalTitle}</h2><p>{c.finalText}</p><div className="hero-actions"><a href={searchPath} className="primary-btn">{c.primaryCta}</a><a href={whatsappUrl} className="ghost-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">{c.secondaryCta}</a></div></div></section>
      </main>
      <WhatsAppCTA locale={locale} />
      <Footer locale={locale} />
    </>
  );
}
