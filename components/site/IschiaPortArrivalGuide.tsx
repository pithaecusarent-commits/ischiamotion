import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { JsonLd } from "@/components/site/JsonLd";
import { SeoFaqSection } from "@/components/site/SeoFaqSection";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import type { Locale } from "@/lib/types";
import { breadcrumbJsonLd, faqJsonLd, siteUrl, webpageJsonLd } from "@/lib/seo";
import { ISCHIAMOTION_WHATSAPP_NUMBER } from "@/lib/whatsapp";

type TransportItem = { title: string; text: string; links: Array<[string, string]> };
type ZoneItem = { title: string; text: string };

type Content = {
  eyebrow: string;
  h1: string;
  intro: string;
  ctaText: string;
  cardTitle: string;
  cardText: string;
  primaryCta: string;
  secondaryCta: string;
  whatsappMsg: string;
  breadcrumbLabel: string;
  afterArrivalEyebrow: string;
  afterArrivalTitle: string;
  afterArrivalIntro: string;
  afterArrivalItems: string[];
  dormireLinkBefore: string;
  dormireLinkLabel: string;
  dormireLinkHref: string;
  dormireLinkAfter: string;
  hotelEyebrow: string;
  hotelTitle: string;
  transportItems: TransportItem[];
  compareEyebrow: string;
  compareTitle: string;
  compareIntro: string;
  compareItems: string[];
  aroundLinkBefore: string;
  aroundLinkLabel: string;
  aroundLinkHref: string;
  aroundLinkAfter: string;
  tableHeaders: [string, string, string];
  tableRows: Array<[string, string, string]>;
  zonesEyebrow: string;
  zonesTitle: string;
  zones: ZoneItem[];
  sightseeingLinkBefore: string;
  sightseeingLinkLabel: string;
  sightseeingLinkHref: string;
  sightseeingLinkAfter: string;
  planEyebrow: string;
  planTitle: string;
  planItems: string[];
  planText: string;
  faqs: Array<{ question: string; answer: string }>;
  finalTitle: string;
  finalText: string;
};

const content: Record<Locale, Content> = {
  it: {
    eyebrow: "Guida all'arrivo",
    h1: "Arrivare a Ischia Porto: come muoversi dopo il traghetto",
    intro: "Ischia Porto è uno dei principali punti di arrivo sull'isola per chi viaggia in traghetto o aliscafo. Organizzare gli spostamenti prima o subito dopo lo sbarco può rendere l'inizio del soggiorno più semplice, soprattutto se l'hotel non è nella stessa zona del porto.",
    ctaText: "Indicaci quando arrivi e dove soggiorni: verifichiamo disponibilità e prezzo per la soluzione più pratica per le tue date.",
    cardTitle: "Organizzare l'arrivo con calma",
    cardText: "Zona dell'hotel, bagagli, numero di persone e programma di viaggio aiutano a capire quale mezzo può essere più pratico da valutare dopo lo sbarco.",
    primaryCta: "Verifica disponibilità e prezzo",
    secondaryCta: "Verifica disponibilità su WhatsApp",
    whatsappMsg: "Ciao IschiaMotion, sto per arrivare a Ischia Porto e vorrei capire come organizzare gli spostamenti per il mio soggiorno.",
    breadcrumbLabel: "Arrivare a Ischia Porto",
    afterArrivalEyebrow: "Prima di scegliere",
    afterArrivalTitle: "Cosa fare dopo lo sbarco a Ischia Porto",
    afterArrivalIntro: "Prima di scegliere come muoverti, può essere utile considerare alcuni aspetti pratici del tuo soggiorno:",
    afterArrivalItems: [
      "hotel o zona di soggiorno",
      "numero di persone",
      "presenza di bambini",
      "quantità di bagagli",
      "programma della vacanza",
      "eventuale desiderio di visitare zone diverse dell'isola",
      "esperienza di guida",
      "periodo del soggiorno"
    ],
    dormireLinkBefore: "Se non hai ancora scelto dove soggiornare, può esserti utile anche la guida su ",
    dormireLinkLabel: "dove dormire a Ischia",
    dormireLinkHref: "/it/dove-dormire-a-ischia",
    dormireLinkAfter: ".",
    hotelEyebrow: "Dal porto all'hotel",
    hotelTitle: "Come raggiungere il tuo hotel da Ischia Porto",
    transportItems: [
      {
        title: "Taxi e trasferimenti",
        text: "Possono essere una soluzione pratica per chi preferisce non guidare appena arrivato, viaggia con bagagli o ha bisogno di raggiungere direttamente l'hotel.",
        links: []
      },
      {
        title: "Autobus",
        text: "Possono essere una scelta utile per raggiungere alcune zone dell'isola, ma richiedono maggiore flessibilità e possono essere meno pratici per chi ha molti bagagli o desidera fare più tappe.",
        links: []
      },
      {
        title: "Scooter",
        text: "Può essere una soluzione da valutare per coppie o viaggiatori leggeri che desiderano autonomia durante il soggiorno.",
        links: [["Noleggio scooter Ischia", "/it/noleggio-scooter-ischia"]]
      },
      {
        title: "Auto",
        text: "Può essere più pratica per famiglie, bambini, bagagli e per chi preferisce maggiore comfort negli spostamenti.",
        links: [["Noleggio auto Ischia", "/it/noleggio-auto-ischia"]]
      }
    ],
    compareEyebrow: "Confronto pratico",
    compareTitle: "Scooter o auto dopo il traghetto?",
    compareIntro: "Non esiste una risposta valida per tutti: la scelta dipende dalla zona dell'hotel, dalle abitudini di guida, dal periodo e dall'itinerario previsto.",
    compareItems: [
      "Lo scooter può essere più adatto per chi viaggia leggero e vuole muoversi con più autonomia.",
      "L'auto può essere più comoda per famiglie, bagagli, bambini o soggiorni più lunghi.",
      "La scelta dipende sempre da zona dell'hotel, abitudini di guida, periodo e programma di viaggio."
    ],
    aroundLinkBefore: "Per una panoramica più ampia su tutte le opzioni di mobilità sull'isola, puoi consultare anche la guida su ",
    aroundLinkLabel: "come muoversi a Ischia",
    aroundLinkHref: "/it/come-muoversi-a-ischia",
    aroundLinkAfter: ".",
    tableHeaders: ["Situazione", "Opzione da valutare", "Perché"],
    tableRows: [
      ["Coppia con pochi bagagli", "Scooter", "Più autonomia per visitare zone diverse dell'isola."],
      ["Famiglia o gruppo", "Auto", "Più spazio per persone e bagagli."],
      ["Soggiorno vicino a Ischia Porto", "Taxi, bus o scooter", "Dipende dal programma e dalla zona da visitare."],
      ["Vacanza tra Forio, Sant'Angelo e altre località", "Scooter o auto", "Può offrire maggiore libertà negli spostamenti."],
      ["Arrivo serale o con bagagli importanti", "Taxi o trasferimento", "Può essere più pratico per raggiungere direttamente l'hotel."]
    ],
    zonesEyebrow: "Dopo il porto",
    zonesTitle: "Dove andare dopo Ischia Porto",
    zones: [
      {
        title: "Ischia Ponte e Castello Aragonese",
        text: "Zona spesso raggiungibile a piedi da Ischia Porto, può essere interessante per chi cerca il borgo marinaro e il Castello Aragonese. Da valutare in base a hotel, bagagli e programma se dedicarle una prima passeggiata."
      },
      {
        title: "Casamicciola Terme",
        text: "Località sulla costa nord, spesso legata alla tradizione termale dell'isola. Può adattarsi a soggiorni più centrali, da valutare in base a itinerario e mezzo scelto per raggiungerla da Ischia Porto."
      },
      {
        title: "Lacco Ameno",
        text: "Centro raccolto sul versante nord-ovest, può essere una buona scelta per chi cerca una base tranquilla. Il mezzo più pratico dipende da hotel, bagagli e programma di viaggio."
      },
      {
        title: "Forio e Citara",
        text: "Sul versante occidentale, può essere adatta a chi cerca vita serale e spiagge come Citara. Spesso richiede scooter o auto per raggiungerla comodamente da Ischia Porto."
      },
      {
        title: "Sant'Angelo",
        text: "Borgo pedonale sulla costa sud, può essere una buona scelta per una tappa più tranquilla. Da valutare un mezzo per raggiungerlo, con parcheggio e arrivo da organizzare fuori dal centro."
      },
      {
        title: "Maronti e Barano",
        text: "Zona con una delle spiagge più conosciute dell'isola. Il mezzo più pratico per raggiungerla da Ischia Porto dipende da hotel, esperienza di guida e programma di viaggio."
      }
    ],
    sightseeingLinkBefore: "Per organizzare meglio l'itinerario tra queste zone, leggi anche la guida su ",
    sightseeingLinkLabel: "cosa vedere a Ischia senza auto",
    sightseeingLinkHref: "/it/cosa-vedere-a-ischia-senza-auto",
    sightseeingLinkAfter: ".",
    planEyebrow: "Prima di partire",
    planTitle: "Come organizzare gli spostamenti prima dell'arrivo",
    planItems: [
      "date del soggiorno",
      "servizio desiderato",
      "zona dell'hotel o di arrivo",
      "numero di persone",
      "eventuali esigenze pratiche"
    ],
    planText: "Con una sola richiesta puoi verificare rapidamente le opzioni disponibili per le tue date. Prima della conferma ricevi disponibilità, prezzo, condizioni e indicazioni su ritiro o consegna.",
    faqs: [
      { question: "Dove arrivo con il traghetto a Ischia?", answer: "I collegamenti marittimi per Ischia fanno scalo principalmente a Ischia Porto, uno dei punti di arrivo più utilizzati dell'isola." },
      { question: "Come posso raggiungere il mio hotel da Ischia Porto?", answer: "In base a zona, bagagli e programma puoi valutare taxi, bus, scooter o auto: ogni opzione ha vantaggi diversi a seconda della situazione." },
      { question: "Conviene noleggiare uno scooter appena arrivati a Ischia?", answer: "Può convenire a chi viaggia leggero e cerca autonomia, valutando sempre esperienza di guida e requisiti richiesti." },
      { question: "È meglio noleggiare auto o scooter a Ischia?", answer: "Dipende da bagagli, numero di persone e itinerario: l'auto offre più spazio, lo scooter più agilità negli spostamenti brevi." },
      { question: "Posso organizzare il noleggio prima di arrivare?", answer: "Sì. Puoi inviare una richiesta con date e zona anche prima della partenza, così da arrivare con le opzioni già verificate." },
      { question: "Posso indicare hotel o zona di soggiorno nella richiesta?", answer: "Puoi indicare hotel, porto o zona di soggiorno nella richiesta. IschiaMotion verifica rapidamente le opzioni disponibili con partner locali selezionati e ti invia disponibilità, prezzo, condizioni e modalità di ritiro o consegna prima della conferma." },
      { question: "Come ricevo prezzo e disponibilità?", answer: "Dopo aver inviato la richiesta con le tue date e la zona del soggiorno, ricevi una proposta con disponibilità, prezzo e condizioni prima della conferma." }
    ],
    finalTitle: "Organizza i tuoi spostamenti dopo l'arrivo a Ischia",
    finalText: "Indicaci date, zona di soggiorno e servizio che ti interessa: verifichiamo la soluzione più pratica disponibile per il tuo viaggio."
  },
  en: {
    eyebrow: "Arrival guide",
    h1: "Arriving at Ischia Porto: Getting Around After the Ferry",
    intro: "Ischia Porto is one of the island's main arrival points for travellers coming by ferry or hydrofoil. Planning your onward transport before or right after landing can make the start of your stay easier, especially if your hotel isn't in the same area as the port.",
    ctaText: "Tell us when you are arriving and where you are staying: we check availability and prices for the most practical option for your dates.",
    cardTitle: "A calmer start to your stay",
    cardText: "Your hotel's area, luggage, group size and travel plans all help work out which option may be worth considering once you land.",
    primaryCta: "Check Availability and Price",
    secondaryCta: "Check availability on WhatsApp",
    whatsappMsg: "Hi IschiaMotion, I'm about to arrive at Ischia Porto and would like to understand how to plan transport for my stay.",
    breadcrumbLabel: "Arriving at Ischia Porto",
    afterArrivalEyebrow: "Before you choose",
    afterArrivalTitle: "What to Do After Arriving at Ischia Porto",
    afterArrivalIntro: "Before deciding how to get around, it can help to think through a few practical points about your stay:",
    afterArrivalItems: [
      "your hotel or accommodation area",
      "how many people are travelling",
      "whether children are with you",
      "how much luggage you have",
      "your holiday plans",
      "whether you'd like to visit different areas of the island",
      "your driving or riding experience",
      "the time of year"
    ],
    dormireLinkBefore: "If you haven't chosen where to stay yet, our guide on ",
    dormireLinkLabel: "where to stay in Ischia",
    dormireLinkHref: "/en/where-to-stay-in-ischia",
    dormireLinkAfter: " can also help.",
    hotelEyebrow: "From the port to your hotel",
    hotelTitle: "How to Reach Your Hotel from Ischia Porto",
    transportItems: [
      {
        title: "Taxis and transfers",
        text: "Can be a practical option for travellers who'd rather not drive right after arriving, are carrying luggage, or need to reach their hotel directly.",
        links: []
      },
      {
        title: "Buses",
        text: "Can be a useful choice for reaching some parts of the island, though they call for more flexibility and can be less practical with a lot of luggage or several stops planned.",
        links: []
      },
      {
        title: "Scooter",
        text: "Can be worth considering for couples or light travellers who want independence during their stay.",
        links: [["Scooter rental Ischia", "/en/scooter-rental-ischia"]]
      },
      {
        title: "Car",
        text: "Can be more practical for families, children, luggage and travellers who prefer greater comfort getting around.",
        links: [["Car rental Ischia", "/en/car-rental-ischia"]]
      }
    ],
    compareEyebrow: "A practical comparison",
    compareTitle: "Scooter or Car After the Ferry?",
    compareIntro: "There's no single right answer for everyone: it depends on your hotel's area, your driving or riding habits, the season and your planned itinerary.",
    compareItems: [
      "A scooter can suit travellers with light luggage who want more independence getting around.",
      "A car can be more comfortable for families, luggage, children or longer stays.",
      "The choice always depends on your hotel's area, driving habits, season and travel plans."
    ],
    aroundLinkBefore: "For a broader overview of all the island's transport options, you can also read our guide on ",
    aroundLinkLabel: "getting around Ischia",
    aroundLinkHref: "/en/how-to-get-around-ischia",
    aroundLinkAfter: ".",
    tableHeaders: ["Situation", "Option to Consider", "Why"],
    tableRows: [
      ["Couple with little luggage", "Scooter", "More independence to visit different areas of the island."],
      ["Family or group", "Car", "More space for people and luggage."],
      ["Staying near Ischia Porto", "Taxi, bus or scooter", "Depends on your plans and the area you want to visit."],
      ["Holiday around Forio, Sant'Angelo and other areas", "Scooter or car", "Can offer more freedom to get around."],
      ["Evening arrival or heavy luggage", "Taxi or transfer", "Can be more practical for reaching your hotel directly."]
    ],
    zonesEyebrow: "Beyond the port",
    zonesTitle: "Where to Go After Ischia Porto",
    zones: [
      {
        title: "Ischia Ponte and the Aragonese Castle",
        text: "Often reachable on foot from Ischia Porto, this area can be interesting for those looking for the fishing-village atmosphere and the Aragonese Castle. Worth considering for a first stroll depending on your hotel, luggage and plans."
      },
      {
        title: "Casamicciola Terme",
        text: "A north-coast town often linked to the island's thermal tradition. It can suit a more central stay, worth weighing up against your itinerary and how you plan to reach it from Ischia Porto."
      },
      {
        title: "Lacco Ameno",
        text: "A compact centre on the north-western side, it can be a good choice for a quieter base. The most practical option depends on your hotel, luggage and travel plans."
      },
      {
        title: "Forio and Citara",
        text: "On the western side of the island, it can suit those looking for evening life and beaches like Citara. Reaching it comfortably from Ischia Porto often calls for a scooter or car."
      },
      {
        title: "Sant'Angelo",
        text: "A pedestrian village on the southern coast, it can be a good choice for a quieter stop. Worth considering a vehicle to reach it, with parking and arrival planned just outside the centre."
      },
      {
        title: "Maronti and Barano",
        text: "Home to one of the island's better-known beaches. The most practical way to reach it from Ischia Porto depends on your hotel, driving experience and travel plans."
      }
    ],
    sightseeingLinkBefore: "To plan your itinerary between these areas more easily, read our guide on ",
    sightseeingLinkLabel: "what to see in Ischia without a car",
    sightseeingLinkHref: "/en/what-to-see-in-ischia-without-a-car",
    sightseeingLinkAfter: ".",
    planEyebrow: "Before you leave",
    planTitle: "How to Plan Your Transport Before Arrival",
    planItems: [
      "your travel dates",
      "the service you're looking for",
      "your hotel or arrival area",
      "how many people are travelling",
      "any practical needs"
    ],
    planText: "With one request, you can quickly check the options available for your dates. Before confirming, you receive availability, price, conditions and pickup or delivery details.",
    faqs: [
      { question: "Where do ferries to Ischia arrive?", answer: "Sea connections to Ischia mainly call at Ischia Porto, one of the island's most commonly used arrival points." },
      { question: "How can I reach my hotel from Ischia Porto?", answer: "Depending on your area, luggage and plans, you can consider a taxi, bus, scooter or car: each option has different advantages depending on your situation." },
      { question: "Is it worth renting a scooter right after arriving in Ischia?", answer: "It can be worthwhile for light travellers looking for independence, while always considering riding experience and licence requirements." },
      { question: "Is it better to rent a car or a scooter in Ischia?", answer: "It depends on luggage, group size and itinerary: a car offers more space, a scooter more agility for short trips." },
      { question: "Can I arrange the rental before I arrive?", answer: "Yes. You can send a request with your dates and area before you even leave, so you arrive with your options already checked." },
      { question: "Can I include my hotel or accommodation area in the request?", answer: "You can include your hotel, port or accommodation area in your request. IschiaMotion quickly checks available options with selected local partners and sends you availability, price, conditions and pickup or delivery details before confirmation." },
      { question: "How do I receive price and availability?", answer: "After sending your request with your dates and accommodation area, you receive a proposal with availability, price and conditions before confirmation." }
    ],
    finalTitle: "Plan Your Transport After Arriving in Ischia",
    finalText: "Tell us your dates, accommodation area and the service you need: we check the most practical available option for your trip."
  }
};

export function IschiaPortArrivalGuide({ locale }: { locale: Locale }) {
  const c = content[locale];
  const homePath = `/${locale}`;
  const path = locale === "it" ? "/it/arrivare-a-ischia-porto-come-muoversi-dopo-il-traghetto" : "/en/arriving-at-ischia-porto-getting-around-after-the-ferry";
  const alternatePath = locale === "it" ? "/en/arriving-at-ischia-porto-getting-around-after-the-ferry" : "/it/arrivare-a-ischia-porto-come-muoversi-dopo-il-traghetto";
  const searchPath = locale === "it" ? "/it/risultati" : "/en/results";
  const whatsappUrl = `https://wa.me/${ISCHIAMOTION_WHATSAPP_NUMBER}?text=${encodeURIComponent(c.whatsappMsg)}`;
  const description = locale === "it"
    ? "Arrivi a Ischia Porto? Scopri come organizzare gli spostamenti dopo il traghetto, tra scooter, auto, taxi, bus e servizi per visitare l'isola."
    : "Arriving at Ischia Porto by ferry? Discover practical ways to get around the island, including scooters, cars, taxis, buses and local travel options.";

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "IschiaMotion", url: `${siteUrl}${homePath}` },
        { name: c.breadcrumbLabel, url: `${siteUrl}${path}` }
      ])} />
      <JsonLd data={faqJsonLd(c.faqs)} />
      <JsonLd data={webpageJsonLd(locale, path, c.h1, description)} />
      <Header locale={locale} alternateHref={alternatePath} />
      <main className="seo-landing">
        <section className="seo-landing-hero">
          <div>
            <div className="section-eyebrow">{c.eyebrow}</div>
            <h1>{c.h1}</h1>
            <p>{c.intro}</p>
            <p>{c.ctaText}</p>
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
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{c.afterArrivalEyebrow}</div>
              <h2 className="section-title">{c.afterArrivalTitle}</h2>
            </div>
          </div>
          <article className="seo-card">
            <p>{c.afterArrivalIntro}</p>
            <ul className="list-disc pl-5 space-y-1">
              {c.afterArrivalItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>{c.dormireLinkBefore}<a href={c.dormireLinkHref}>{c.dormireLinkLabel}</a>{c.dormireLinkAfter}</p>
          </article>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{c.hotelEyebrow}</div>
              <h2 className="section-title">{c.hotelTitle}</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {c.transportItems.map((item) => (
              <article className="seo-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                {item.links.length > 0 ? (
                  <div className="hero-actions">
                    {item.links.map(([label, href]) => (
                      <a key={href} href={href} className="ghost-btn">{label}</a>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{c.compareEyebrow}</div>
              <h2 className="section-title">{c.compareTitle}</h2>
            </div>
          </div>
          <article className="seo-card">
            <p>{c.compareIntro}</p>
            <ul className="list-disc pl-5 space-y-1">
              {c.compareItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>{c.aroundLinkBefore}<a href={c.aroundLinkHref}>{c.aroundLinkLabel}</a>{c.aroundLinkAfter}</p>
          </article>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {c.tableHeaders.map((header) => (
                    <th key={header} className="text-left p-3 border-b-2 font-semibold whitespace-nowrap">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.tableRows.map(([situation, option, why]) => (
                  <tr key={situation} className="border-b last:border-b-0">
                    <td className="p-3 font-medium">{situation}</td>
                    <td className="p-3 whitespace-nowrap">{option}</td>
                    <td className="p-3">{why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{c.zonesEyebrow}</div>
              <h2 className="section-title">{c.zonesTitle}</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {c.zones.map((zone) => (
              <article className="seo-card" key={zone.title}>
                <h3>{zone.title}</h3>
                <p>{zone.text}</p>
              </article>
            ))}
          </div>
          <p>{c.sightseeingLinkBefore}<a href={c.sightseeingLinkHref}>{c.sightseeingLinkLabel}</a>{c.sightseeingLinkAfter}</p>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{c.planEyebrow}</div>
              <h2 className="section-title">{c.planTitle}</h2>
            </div>
          </div>
          <article className="seo-card">
            <ul className="list-disc pl-5 space-y-1">
              {c.planItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>{c.planText}</p>
          </article>
        </section>

        <SeoFaqSection locale={locale} faqs={c.faqs} />

        <section className="final-cta">
          <div className="final-box">
            <h2>{c.finalTitle}</h2>
            <p>{c.finalText}</p>
            <div className="hero-actions">
              <a href={searchPath} className="primary-btn">{c.primaryCta}</a>
              <a href={whatsappUrl} className="ghost-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">{c.secondaryCta}</a>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppCTA locale={locale} />
      <Footer locale={locale} />
    </>
  );
}
