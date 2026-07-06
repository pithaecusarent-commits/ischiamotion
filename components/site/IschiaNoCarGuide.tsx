import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { JsonLd } from "@/components/site/JsonLd";
import { SeoFaqSection } from "@/components/site/SeoFaqSection";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import type { Locale } from "@/lib/types";
import { breadcrumbJsonLd, faqJsonLd, siteUrl, webpageJsonLd } from "@/lib/seo";
import { ISCHIAMOTION_WHATSAPP_NUMBER } from "@/lib/whatsapp";

type ZoneItem = { title: string; text: string };
type DayItem = { day: string; title: string; text: string; note: string };
type TransportItem = { title: string; text: string; links: Array<[string, string]> };

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
  zonesEyebrow: string;
  zonesTitle: string;
  zones: ZoneItem[];
  itineraryEyebrow: string;
  itineraryTitle: string;
  days: DayItem[];
  gettingAroundEyebrow: string;
  gettingAroundTitle: string;
  transportItems: TransportItem[];
  stayEyebrow: string;
  stayTitle: string;
  stayItems: Array<[string, string]>;
  stayLink: [string, string];
  tableEyebrow: string;
  tableTitle: string;
  tableHeaders: [string, string, string];
  tableRows: Array<[string, string, string]>;
  faqs: Array<{ question: string; answer: string }>;
  finalTitle: string;
  finalText: string;
};

const content: Record<Locale, Content> = {
  it: {
    eyebrow: "Guida turistica",
    h1: "Cosa vedere a Ischia senza auto",
    intro: "Zone, itinerari e consigli pratici per organizzare gli spostamenti durante il soggiorno, con o senza auto.",
    ctaText: "Vuoi capire quale mezzo è più comodo per il tuo soggiorno? Indicaci date e zona: verifichiamo disponibilità e prezzo in pochi minuti.",
    cardTitle: "Vedere Ischia, un pezzo alla volta",
    cardText: "Ogni zona dell'isola ha un carattere diverso: questa guida ti aiuta a capire cosa vedere e quale mezzo può essere più pratico da valutare per raggiungerlo.",
    primaryCta: "Verifica disponibilità e prezzo",
    secondaryCta: "Verifica disponibilità su WhatsApp",
    whatsappMsg: "Ciao IschiaMotion, sto pianificando cosa vedere a Ischia e vorrei capire quale mezzo è più comodo per il mio soggiorno.",
    breadcrumbLabel: "Cosa vedere a Ischia senza auto",
    zonesEyebrow: "Isola da scoprire",
    zonesTitle: "Le zone da vedere a Ischia",
    zones: [
      {
        title: "Ischia Porto e Ischia Ponte",
        text: "È spesso il punto di arrivo dell'isola, con il centro, il porto e diversi servizi raggiungibili a piedi. Ischia Ponte, con il suo borgo marinaro, può essere una buona scelta per una passeggiata serale. Da valutare in base a hotel, bagagli e programma di viaggio se affiancare un mezzo per raggiungere le altre zone."
      },
      {
        title: "Castello Aragonese e Cartaromana",
        text: "Il Castello Aragonese, collegato a Ischia Ponte, può essere una buona scelta per chi cerca un momento più culturale e panoramico. La vicina Cartaromana è spesso apprezzata per la vista sul castello stesso. Zona spesso raggiungibile a piedi da Ischia Ponte, da valutare con calzature comode."
      },
      {
        title: "Forio e Citara",
        text: "Sul versante occidentale, Forio è nota per il centro storico, la vita serale e la spiaggia di Citara. Spesso può risultare più pratica con uno scooter o un'auto, soprattutto se il soggiorno non è nella stessa zona. Da valutare in base a periodo e programma, specialmente per chi vuole godersi il tramonto con calma."
      },
      {
        title: "Sant'Angelo",
        text: "Borgo pedonale sulla costa sud, con parcheggio e arrivo da organizzare fuori dal centro. Può essere una buona scelta per una tappa più tranquilla e panoramica. Spesso richiede un mezzo per raggiungerlo da altre zone dell'isola, per poi proseguire a piedi una volta arrivati."
      },
      {
        title: "Maronti e Barano",
        text: "I Maronti sono tra le spiagge più conosciute dell'isola, con il comune di Barano nell'entroterra vicino. Da valutare in base a hotel, esperienza di guida e programma di viaggio quale mezzo affiancare per raggiungerli comodamente."
      },
      {
        title: "Lacco Ameno e Baia di San Montano",
        text: "Lacco Ameno è un centro raccolto, spesso visitabile a piedi se si soggiorna in zona. La Baia di San Montano, nelle vicinanze, può essere una buona scelta per chi cerca una giornata di mare in una cornice naturale. Da valutare come raggiungerla in base al punto di partenza."
      },
      {
        title: "Casamicciola Terme",
        text: "Località sulla costa nord, spesso legata alle tradizioni termali dell'isola. Può essere una buona base per chi cerca una posizione più centrale rispetto ad altre zone, da valutare in base a itinerario e collegamenti verso Ischia Porto e Lacco Ameno."
      },
      {
        title: "Serrara Fontana e i panorami interni",
        text: "Zona interna dell'isola, spesso associata a punti panoramici verso la costa. Può essere una buona scelta per chi vuole aggiungere un momento più tranquillo e paesaggistico all'itinerario, da valutare in base a tempo disponibile ed esperienza di guida su strade interne."
      }
    ],
    itineraryEyebrow: "Idee di viaggio",
    itineraryTitle: "Un itinerario di 3 giorni per visitare Ischia",
    days: [
      {
        day: "Giorno 1",
        title: "Ischia Porto, Ischia Ponte, Castello Aragonese e Cartaromana",
        text: "Una prima giornata dedicata al centro dell'isola: il porto, il borgo di Ischia Ponte, il Castello Aragonese e la vicina Cartaromana.",
        note: "Spesso comoda a piedi o con uno scooter, soprattutto se il soggiorno è nella stessa zona."
      },
      {
        day: "Giorno 2",
        title: "Forio, Citara, costa ovest e momento panoramico al tramonto",
        text: "Una giornata dedicata al versante occidentale dell'isola, tra il centro di Forio, la spiaggia di Citara e un momento panoramico verso il tramonto.",
        note: "Uno scooter o un'auto possono essere più pratici per raggiungere Forio da altre zone e muoversi con più calma in serata."
      },
      {
        day: "Giorno 3",
        title: "Sant'Angelo, Maronti, Barano oppure una giornata in mare",
        text: "Una terza giornata da dedicare a Sant'Angelo e ai Maronti, oppure, in alternativa, a un'uscita in mare per vedere la costa da un'altra prospettiva.",
        note: "Auto o scooter possono essere utili per raggiungere Sant'Angelo e Barano; una barca o un gommone può essere una buona scelta per chi preferisce una giornata dal mare."
      }
    ],
    gettingAroundEyebrow: "Mobilità sull'isola",
    gettingAroundTitle: "Come muoversi a Ischia senza auto",
    transportItems: [
      {
        title: "Scooter",
        text: "Può essere adatto a coppie o viaggiatori leggeri che cercano autonomia e maggiore facilità negli spostamenti tra le zone dell'isola. Da valutare in base a esperienza di guida, requisiti richiesti e periodo del soggiorno.",
        links: [["Noleggio scooter Ischia", "/it/noleggio-scooter-ischia"]]
      },
      {
        title: "Auto",
        text: "Può essere più pratica per famiglie, bambini, bagagli o per chi preferisce spostamenti più comodi tra zone diverse dell'isola. Da valutare anche in base a parcheggio e accessibilità dell'alloggio.",
        links: [["Noleggio auto Ischia", "/it/noleggio-auto-ischia"]]
      },
      {
        title: "E-bike",
        text: "Può essere adatta a percorsi panoramici e a località meno impegnative, valutando sempre pendenze, autonomia della batteria, condizioni personali e tipo di itinerario previsto.",
        links: [["Noleggio e-bike Ischia", "/it/noleggio-bici-elettriche-ischia"]]
      },
      {
        title: "Barca o gommone",
        text: "Può essere una soluzione interessante per vivere una giornata in mare, esplorare la costa o raggiungere calette e panorami che si apprezzano meglio dall'acqua, in base a disponibilità e condizioni meteo-marine.",
        links: [["Noleggio gommoni Ischia", "/it/noleggio-gommoni-ischia"], ["Noleggio barche Ischia", "/it/noleggio-barche-ischia"]]
      },
      {
        title: "Bus e taxi",
        text: "Possono essere utili per alcuni spostamenti e per chi preferisce evitare la guida, con minore flessibilità soprattutto in alta stagione, nelle ore serali o per chi desidera visitare più zone nella stessa giornata.",
        links: []
      }
    ],
    stayEyebrow: "Dove soggiornare",
    stayTitle: "Dove dormire se vuoi visitare Ischia senza auto",
    stayItems: [
      ["Ischia Porto", "Comoda per arrivi, servizi e diversi punti raggiungibili a piedi."],
      ["Casamicciola e Lacco Ameno", "Una posizione spesso più centrale rispetto ad altre zone dell'isola."],
      ["Forio", "Da valutare per chi cerca spiagge e vita della costa ovest."],
      ["Sant'Angelo e Barano", "Per chi cerca tranquillità, ma deve organizzare meglio gli spostamenti verso le altre zone."]
    ],
    stayLink: ["Dove dormire a Ischia", "/it/dove-dormire-a-ischia"],
    tableEyebrow: "Confronto rapido",
    tableTitle: "Quale mezzo scegliere in base al tuo viaggio?",
    tableHeaders: ["Tipo di viaggio", "Mezzo da valutare", "Perché"],
    tableRows: [
      ["Coppia con pochi bagagli", "Scooter", "Più libertà negli spostamenti e maggiore facilità di parcheggio."],
      ["Famiglia con bambini", "Auto", "Più spazio e comodità per bagagli e spostamenti."],
      ["Soggiorno vicino al porto", "Bus, taxi o scooter", "Dipende dal programma e dalle zone che si vogliono visitare."],
      ["Vacanza a Forio o Sant'Angelo", "Scooter o auto", "Maggiore autonomia per raggiungere altre aree dell'isola."],
      ["Giornata al mare", "Barca o gommone", "Per vivere la costa da una prospettiva diversa."]
    ],
    faqs: [
      { question: "Si può visitare Ischia senza auto?", answer: "Sì. Molte zone si possono visitare a piedi, in bus o con mezzi come scooter ed e-bike; un'auto può essere utile per alcuni itinerari, ma non è indispensabile per tutto il soggiorno." },
      { question: "Qual è la zona migliore di Ischia per muoversi senza macchina?", answer: "Ischia Porto è spesso un punto di partenza comodo, perché diversi servizi si raggiungono a piedi. Da lì puoi valutare bus, scooter o e-bike per le altre zone in base al tuo programma." },
      { question: "Conviene noleggiare uno scooter a Ischia?", answer: "Può convenire a chi cerca autonomia e viaggia con pochi bagagli, valutando sempre esperienza di guida, requisiti richiesti e periodo del soggiorno." },
      { question: "Quanto tempo serve per visitare Ischia?", answer: "Dipende dal ritmo di viaggio e dagli interessi: un itinerario di alcuni giorni permette di vedere diverse zone dell'isola, ma può sempre essere adattato al tempo disponibile." },
      { question: "Quali sono le spiagge più facili da raggiungere?", answer: "Le spiagge vicine ai centri abitati sono in genere più semplici da raggiungere; altre calette possono richiedere un mezzo o un tratto a piedi, quindi conviene informarsi in base alla zona scelta." },
      { question: "Meglio scooter o auto per una vacanza a Ischia?", answer: "Dipende da bagagli, numero di persone ed esperienza di guida: lo scooter è più agile per spostamenti rapidi, l'auto è spesso più comoda per famiglie e bagagli." },
      { question: "Posso organizzare scooter, auto o barca prima dell'arrivo?", answer: "Puoi indicare date, zona del soggiorno e servizio che ti interessa. IschiaMotion verifica rapidamente le opzioni disponibili con partner locali selezionati e ti invia disponibilità, prezzo, condizioni e modalità di ritiro o consegna prima della conferma." }
    ],
    finalTitle: "Organizza i tuoi spostamenti a Ischia in pochi minuti",
    finalText: "Indicaci quando arrivi, dove soggiorni e cosa vuoi fare: verifichiamo la soluzione più pratica disponibile per le tue date."
  },
  en: {
    eyebrow: "Travel guide",
    h1: "What to See in Ischia Without a Car",
    intro: "Areas, itineraries and practical tips for planning your trips during your stay, with or without a car.",
    ctaText: "Want to find the most practical way to get around during your stay? Tell us your dates and area: we check availability and prices in just a few minutes.",
    cardTitle: "Seeing Ischia, one area at a time",
    cardText: "Every part of the island has its own character: this guide helps you understand what to see and which option may be worth considering to get there.",
    primaryCta: "Check Availability and Price",
    secondaryCta: "Check availability on WhatsApp",
    whatsappMsg: "Hi IschiaMotion, I'm planning what to see in Ischia and would like to understand the most practical way to get around during my stay.",
    breadcrumbLabel: "What to see in Ischia without a car",
    zonesEyebrow: "An island to discover",
    zonesTitle: "Areas to Visit in Ischia",
    zones: [
      {
        title: "Ischia Porto and Ischia Ponte",
        text: "Often the island's main arrival point, with the centre, port and several services within walking distance. Ischia Ponte, with its fishing-village feel, can be a good choice for an evening stroll. Whether to add a vehicle for the other areas is worth considering based on your hotel, luggage and itinerary."
      },
      {
        title: "Aragonese Castle and Cartaromana",
        text: "The Aragonese Castle, linked to Ischia Ponte, can be a good choice for a more cultural and scenic stop. Nearby Cartaromana is often appreciated for its view back towards the castle. This area is often reachable on foot from Ischia Ponte, so comfortable shoes are worth considering."
      },
      {
        title: "Forio and Citara",
        text: "On the western side of the island, Forio is known for its historic centre, evening atmosphere and Citara beach. It can often be more practical with a scooter or car, especially if your stay is in a different area. Worth planning around the season and your schedule, particularly if you want to enjoy sunset at an easy pace."
      },
      {
        title: "Sant'Angelo",
        text: "A pedestrian village on the southern coast, with parking and arrival to plan just outside the centre. It can be a good choice for a quieter, more scenic stop. Reaching it from other areas often calls for a vehicle, with the village itself explored on foot."
      },
      {
        title: "Maronti and Barano",
        text: "Maronti is one of the island's better-known beaches, with the inland town of Barano nearby. Which option to pair with it is worth weighing up based on your accommodation, riding or driving experience and itinerary."
      },
      {
        title: "Lacco Ameno and San Montano Bay",
        text: "Lacco Ameno is a compact centre, often walkable if you are staying nearby. The nearby San Montano Bay can be a good choice for a beach day in a more natural setting. How to reach it is worth checking based on your starting point."
      },
      {
        title: "Casamicciola Terme",
        text: "A north-coast town often associated with the island's thermal tradition. It can be a convenient base for a more central position relative to other areas, worth weighing against your itinerary and connections towards Ischia Porto and Lacco Ameno."
      },
      {
        title: "Serrara Fontana and the inland viewpoints",
        text: "An inland part of the island, often associated with scenic viewpoints over the coast. It can be a good choice for adding a quieter, more scenic moment to your itinerary, depending on the time available and your experience driving on inland roads."
      }
    ],
    itineraryEyebrow: "Trip ideas",
    itineraryTitle: "A 3-Day Itinerary for Ischia",
    days: [
      {
        day: "Day 1",
        title: "Ischia Porto, Ischia Ponte, Aragonese Castle and Cartaromana",
        text: "A first day around the island's centre: the port, the village of Ischia Ponte, the Aragonese Castle and nearby Cartaromana.",
        note: "Often comfortable on foot or by scooter, especially if you are staying in the same area."
      },
      {
        day: "Day 2",
        title: "Forio, Citara, the west coast and a sunset moment",
        text: "A day dedicated to the island's western side, taking in central Forio, Citara beach and a scenic sunset moment.",
        note: "A scooter or car can be more practical for reaching Forio from other areas and getting around at an easy pace in the evening."
      },
      {
        day: "Day 3",
        title: "Sant'Angelo, Maronti, Barano, or a day at sea",
        text: "A third day for Sant'Angelo and Maronti, or, as an alternative, a trip out to sea to see the coast from a different perspective.",
        note: "A car or scooter can help you reach Sant'Angelo and Barano; a boat or RIB can be a good choice if you prefer a day on the water."
      }
    ],
    gettingAroundEyebrow: "Island mobility",
    gettingAroundTitle: "Getting Around Ischia Without a Car",
    transportItems: [
      {
        title: "Scooter",
        text: "Can suit couples or light travellers looking for independence and easier movement between the island's areas. Worth weighing up against riding experience, licence requirements and the time of year.",
        links: [["Scooter rental Ischia", "/en/scooter-rental-ischia"]]
      },
      {
        title: "Car",
        text: "Can be more practical for families, children, luggage or those who prefer a more comfortable way to move between different areas of the island. Also worth considering alongside parking and access to your accommodation.",
        links: [["Car rental Ischia", "/en/car-rental-ischia"]]
      },
      {
        title: "E-bike",
        text: "Can suit scenic routes and less demanding areas, always weighing up hills, battery range, personal fitness and the planned itinerary.",
        links: [["E-bike rental Ischia", "/en/e-bike-rental-ischia"]]
      },
      {
        title: "Boat or RIB",
        text: "Can be an interesting option for a day at sea, exploring the coast or reaching coves and viewpoints best enjoyed from the water, depending on availability and sea conditions.",
        links: [["Rubber dinghy rental Ischia", "/en/rubber-dinghy-rental-ischia"], ["Boat rental Ischia", "/en/boat-rental-ischia"]]
      },
      {
        title: "Buses and taxis",
        text: "Can be useful for some journeys and for those who prefer not to drive, with less flexibility especially in high season, in the evening, or for visiting several areas in the same day.",
        links: []
      }
    ],
    stayEyebrow: "Where to stay",
    stayTitle: "Where to Stay in Ischia Without a Car",
    stayItems: [
      ["Ischia Porto", "Convenient for arrivals, services and several points within walking distance."],
      ["Casamicciola and Lacco Ameno", "Often a more central position relative to other areas of the island."],
      ["Forio", "Worth considering if you're after beaches and west-coast life."],
      ["Sant'Angelo and Barano", "For those seeking a quieter stay, while planning journeys to other areas a little more carefully."]
    ],
    stayLink: ["Where to stay in Ischia", "/en/where-to-stay-in-ischia"],
    tableEyebrow: "Quick comparison",
    tableTitle: "Which Transport Option Fits Your Trip?",
    tableHeaders: ["Type of trip", "Option to consider", "Why"],
    tableRows: [
      ["Couple with little luggage", "Scooter", "More freedom to get around and easier parking."],
      ["Family with children", "Car", "More space and comfort for luggage and journeys."],
      ["Staying near the port", "Bus, taxi or scooter", "Depends on your schedule and the areas you want to visit."],
      ["Holiday in Forio or Sant'Angelo", "Scooter or car", "More independence to reach other areas of the island."],
      ["A day at the beach", "Boat or RIB", "To experience the coast from a different perspective."]
    ],
    faqs: [
      { question: "Can you visit Ischia without a car?", answer: "Yes. Many areas can be visited on foot, by bus, or with a scooter or e-bike; a car can be useful for some itineraries, but it isn't essential for the whole stay." },
      { question: "What is the best area of Ischia for getting around without a car?", answer: "Ischia Porto is often a convenient base, since several services are within walking distance. From there you can consider buses, a scooter or an e-bike for other areas depending on your plans." },
      { question: "Is it worth renting a scooter in Ischia?", answer: "It can be worthwhile if you want independence and travel with little luggage, while always considering your riding experience, licence requirements and the time of year." },
      { question: "How much time do you need to visit Ischia?", answer: "It depends on your pace and interests: an itinerary of a few days lets you see several areas of the island, but it can always be adapted to the time you have available." },
      { question: "Which beaches are easiest to reach?", answer: "Beaches close to the main towns are usually easier to reach; other coves may need a vehicle or a short walk, so it's worth checking based on the area you choose." },
      { question: "Is a scooter or a car better for a holiday in Ischia?", answer: "It depends on luggage, group size and driving or riding experience: a scooter is more agile for quick trips, while a car is often more comfortable for families and luggage." },
      { question: "Can I arrange a scooter, car or boat before I arrive?", answer: "You can share your travel dates, accommodation area and the service you are looking for. IschiaMotion quickly checks available options with selected local partners and sends you availability, price, conditions and pickup or delivery details before confirmation." }
    ],
    finalTitle: "Plan Your Getting Around in Ischia in Just a Few Minutes",
    finalText: "Tell us when you are arriving, where you are staying and what you would like to do: we check the most practical available option for your dates."
  }
};

export function IschiaNoCarGuide({ locale }: { locale: Locale }) {
  const c = content[locale];
  const homePath = `/${locale}`;
  const path = locale === "it" ? "/it/cosa-vedere-a-ischia-senza-auto" : "/en/what-to-see-in-ischia-without-a-car";
  const alternatePath = locale === "it" ? "/en/what-to-see-in-ischia-without-a-car" : "/it/cosa-vedere-a-ischia-senza-auto";
  const searchPath = locale === "it" ? "/it/risultati" : "/en/results";
  const whatsappUrl = `https://wa.me/${ISCHIAMOTION_WHATSAPP_NUMBER}?text=${encodeURIComponent(c.whatsappMsg)}`;
  const description = locale === "it"
    ? "Scopri cosa vedere a Ischia senza auto: Ischia Porto, Forio, Sant'Angelo, Maronti, Castello Aragonese e spiagge. Consigli pratici su scooter, auto, bus e barche."
    : "Discover what to see in Ischia without a car: Ischia Porto, Forio, Sant'Angelo, Maronti, Aragonese Castle and beaches. Practical tips on scooters, cars, buses and boats.";

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "IschiaMotion", url: `${siteUrl}${homePath}` },
        { name: c.breadcrumbLabel, url: `${siteUrl}${path}` }
      ])} />
      <JsonLd data={faqJsonLd(c.faqs)} />
      <JsonLd data={webpageJsonLd(locale, path, locale === "it" ? "Cosa vedere a Ischia senza auto: itinerario, zone e come muoversi" : "What to See in Ischia Without a Car: Itinerary, Areas and Getting Around", description)} />
      <Header locale={locale} alternateHref={alternatePath} />
      <main className="seo-landing">
        <section className="seo-landing-hero guide-hero">
          <div>
            <div className="section-eyebrow">{c.eyebrow}</div>
            <h1 className="seo-landing-title">{c.h1}</h1>
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
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{c.itineraryEyebrow}</div>
              <h2 className="section-title">{c.itineraryTitle}</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {c.days.map((day) => (
              <article className="seo-card" key={day.day}>
                <span>{day.day}</span>
                <h3>{day.title}</h3>
                <p>{day.text}</p>
                <p>{day.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{c.gettingAroundEyebrow}</div>
              <h2 className="section-title">{c.gettingAroundTitle}</h2>
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
              <div className="section-eyebrow">{c.stayEyebrow}</div>
              <h2 className="section-title">{c.stayTitle}</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {c.stayItems.map(([title, text]) => (
              <article className="seo-card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className="hero-actions">
            <a href={c.stayLink[1]} className="ghost-btn">{c.stayLink[0]}</a>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{c.tableEyebrow}</div>
              <h2 className="section-title">{c.tableTitle}</h2>
            </div>
          </div>
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
                {c.tableRows.map(([trip, option, why]) => (
                  <tr key={trip} className="border-b last:border-b-0">
                    <td className="p-3 font-medium">{trip}</td>
                    <td className="p-3 whitespace-nowrap">{option}</td>
                    <td className="p-3">{why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
