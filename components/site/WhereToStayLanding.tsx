import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { JsonLd } from "@/components/site/JsonLd";
import { SeoFaqSection } from "@/components/site/SeoFaqSection";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import type { Locale } from "@/lib/types";
import { breadcrumbJsonLd, faqJsonLd, siteUrl, webpageJsonLd } from "@/lib/seo";
import { Fragment } from "react";

type PageContent = {
  eyebrow: string;
  h1: string;
  intro: string;
  cardTitle: string;
  cardText: string;
  primaryCta: string;
  secondaryCta: string;
  whatsappMsg: string;
  breadcrumbLabel: string;
  zonesEyebrow: string;
  zonesTitle: string;
  zones: Array<[string, string]>;
  zonesTableEyebrow?: string;
  zonesTableTitle?: string;
  zonesTableHeaders?: [string, string, string, string];
  zonesTable?: Array<[string, string, string, string]>;
  mobilityEyebrow: string;
  mobilityTitle: string;
  mobilityItems: Array<[string, string]>;
  ischiastarsEyebrow: string;
  ischiastarsTitle: string;
  ischiastarsCardTitle: string;
  ischiastarsText: string;
  ischiastarsLinkLabel: string;
  afterStayEyebrow: string;
  afterStayTitle: string;
  afterStayItems: Array<[string, string, string?]>;
  linksTitle: string;
  categoryLinks: Array<[string, string]>;
  faqs: Array<{ question: string; answer: string }>;
  finalTitle: string;
  finalText: string;
};

const content: Record<Locale, PageContent> = {
  it: {
    eyebrow: "Guida alla vacanza",
    h1: "Dove dormire a Ischia: zone migliori e come muoversi sull'isola",
    intro: "Scegliere dove dormire a Ischia non riguarda solo l'alloggio: ogni zona dell'isola ha una distanza diversa dal porto, un accesso diverso alle spiagge e un bisogno diverso di muoversi. Chi soggiorna a Ischia Porto può cavarsela a piedi; chi sceglie Forio, Sant'Angelo o Barano ha quasi sempre bisogno di uno scooter, un'auto o un'e-bike per spostarsi in modo autonomo. Valutare insieme soggiorno e spostamenti aiuta a organizzare una vacanza più fluida, senza imprevisti.",
    cardTitle: "Soggiorno e mobilità insieme",
    cardText: "Scegliere la zona giusta e il mezzo adatto aiuta a organizzare una vacanza più fluida, senza imprevisti dell'ultimo momento.",
    primaryCta: "Trova il mezzo più adatto",
    secondaryCta: "Chiedi supporto su WhatsApp",
    whatsappMsg: "Ciao IschiaMotion, vorrei verificare la disponibilità per un noleggio a Ischia.",
    breadcrumbLabel: "Dove dormire a Ischia",
    zonesEyebrow: "Zone dell'isola",
    zonesTitle: "Scegliere la zona giusta a Ischia",
    zones: [
      ["Ischia Porto", "Porto naturale e principale punto di arrivo per aliscafi e traghetti da Napoli e Pozzuoli. Comoda per servizi, vita serale e spostamenti verso il resto dell'isola. Ideale per chi vuole tutto a portata di mano senza dipendere da un mezzo."],
      ["Forio", "Sul versante ovest, Forio è nota per i tramonti sul mare, le spiagge di Citara e Cava dell'Isola e una buona offerta ricettiva. Più distante dal porto principale, richiede quasi sempre uno scooter, un'auto o un'e-bike per i trasferimenti."],
      ["Lacco Ameno", "Elegante e centrale nel nord-ovest dell'isola, offre spiagge tranquille, terme e strutture curate. Buona base per chi vuole calma con accesso comodo sia verso Forio che verso Ischia Porto."],
      ["Casamicciola Terme", "Comune con porto proprio, utile per chi arriva da Napoli con Caremar. Posizione pratica tra Ischia Porto e Lacco Ameno, con accesso a terme e spiagge nella zona nord."],
      ["Sant'Angelo", "Piccolo borgo pedonale nel sud-ovest dell'isola, romantico e tranquillo. Ideale per coppie che cercano quiete e spiagge meno affollate. La posizione isolata richiede pianificazione per spostarsi verso altri comuni."],
      ["Barano e Maronti", "Barano d'Ischia ospita la spiaggia dei Maronti, tra le più lunghe dell'isola, raggiungibile anche in barca o taxi marino. Zona naturalistica lontana dal centro: chi soggiorna qui ha quasi sempre bisogno di un mezzo."],
      ["Zone collinari e interne", "Alcune strutture sorgono in posizioni panoramiche su colline o in zone interne dell'isola. Ottime per relax, silenzio e vedute sul golfo. Quasi sempre necessario un mezzo privato per raggiungere spiagge, borghi e servizi."]
    ],
    zonesTableEyebrow: "Riepilogo zone",
    zonesTableTitle: "Zone di Ischia a confronto: mezzo necessario e tipo consigliato",
    zonesTableHeaders: ["Zona", "Ideale per", "Serve un mezzo?", "Mezzo consigliato"],
    zonesTable: [
      ["Ischia Porto", "Arrivi, servizi, vita serale", "No (centro ben servito)", "Scooter o e-bike per escursioni"],
      ["Forio", "Tramonti, spiagge, coppie", "Sì", "Scooter, auto o e-bike"],
      ["Lacco Ameno", "Terme, calma, famiglie", "Consigliato", "Scooter o auto"],
      ["Casamicciola Terme", "Arrivi Caremar, terme, zona nord", "Consigliato", "Scooter o e-bike"],
      ["Sant'Angelo", "Coppie, quiete, spiagge isolate", "Sì (zona isolata)", "Auto o scooter"],
      ["Barano e Maronti", "Natura, spiaggia lunga, mare tranquillo", "Sì", "Auto o scooter"],
      ["Zone collinari/interne", "Panorama, relax, vedute sul golfo", "Indispensabile", "Auto"]
    ],
    mobilityEyebrow: "Spostamenti a Ischia",
    mobilityTitle: "Dormire e muoversi devono andare insieme",
    mobilityItems: [
      ["Zona e mezzo: un binomio importante", "Chi soggiorna lontano dal porto o dalle spiagge principali si trova spesso a dover noleggiare un mezzo. Valutare questo aspetto prima di scegliere l'alloggio aiuta a pianificare meglio la vacanza."],
      ["Scoprire calette e borghi", "Chi vuole esplorare l'isola in autonomia, raggiungere calette poco frequentate o visitare borghi lontani dall'hotel, si organizza meglio con lo scooter, l'auto o l'e-bike giusta."],
      ["IschiaMotion per la mobilità", "IschiaMotion è una piattaforma locale per richiedere disponibilità di scooter, auto, e-bike, gommoni, barche e beach club a Ischia. Raccoglie la richiesta e verifica disponibilità, condizioni e conferma con partner selezionati sull'isola."],
      ["Pianificare prima", "Richiedere un mezzo in anticipo, soprattutto in alta stagione, aiuta ad avere più scelta e a partire senza imprevisti il giorno dell'arrivo."]
    ],
    ischiastarsEyebrow: "Risorsa consigliata",
    ischiastarsTitle: "IschiaStars e IschiaMotion: due risorse complementari",
    ischiastarsCardTitle: "Soggiorno e spostamenti: un piano unico",
    ischiastarsText: "IschiaStars.it è una risorsa dedicata alla scelta del soggiorno a Ischia: hotel, strutture e preventivi personalizzati per chi vuole pianificare con cura la propria vacanza. IschiaMotion è il complemento naturale: serve a organizzare gli spostamenti una volta scelto dove dormire. Scooter, auto, e-bike, gommoni e beach club tramite partner locali selezionati. Le due risorse coprono aspetti diversi della stessa vacanza e si usano meglio insieme.",
    ischiastarsLinkLabel: "Organizzare il soggiorno a Ischia con IschiaStars",
    afterStayEyebrow: "Mobilità sull'isola",
    afterStayTitle: "Dopo aver scelto dove dormire",
    afterStayItems: [
      ["Scooter a Ischia", "Ideale per coppie e viaggiatori leggeri, pratico per parcheggio e spostamenti rapidi tra porto, spiagge e borghi.", "/it/noleggio-scooter-ischia"],
      ["Auto a Ischia", "Utile per famiglie, bagagli e strutture lontane dal porto. Più comfort per più persone su tratte lunghe.", "/it/noleggio-auto-ischia"],
      ["E-bike a Ischia", "Perfetta per percorsi panoramici, borghi e lungomare. Adatta per chi preferisce pedalare con assistenza elettrica sull'isola.", "/it/noleggio-bici-elettriche-ischia"],
      ["Gommone a Ischia", "Per vivere la costa dal mare, raggiungere calette inaccessibili via terra e organizzare una giornata fuori porta.", "/it/noleggio-gommoni-ischia"],
      ["Barca a Ischia", "Per chi vuole più comfort in mare. Disponibilità soggetta a requisiti, meteo e condizioni del partner.", "/it/noleggio-barche-ischia"],
      ["Beach Club a Ischia", "Lettini, ombrelloni e servizi mare presso strutture locali selezionate. Ideale per una giornata organizzata in spiaggia.", "/it/beach-club-ischia"]
    ],
    linksTitle: "Esplora i servizi di IschiaMotion",
    categoryLinks: [
      ["Home IschiaMotion", "/it"],
      ["Verifica disponibilità", "/it/risultati"],
      ["Scooter a Ischia", "/it/noleggio-scooter-ischia"],
      ["Auto a Ischia", "/it/noleggio-auto-ischia"],
      ["E-bike a Ischia", "/it/noleggio-bici-elettriche-ischia"],
      ["Gommoni a Ischia", "/it/noleggio-gommoni-ischia"],
      ["Barche a Ischia", "/it/noleggio-barche-ischia"],
      ["Beach Club a Ischia", "/it/beach-club-ischia"],
      ["Contatti", "/it/contatti"]
    ],
    faqs: [
      {
        question: "Dove conviene dormire a Ischia senza auto?",
        answer: "Ischia Porto è la zona più comoda per chi non vuole noleggiare un mezzo: servizi, porto e alcune spiagge sono raggiungibili a piedi. Lacco Ameno e Casamicciola Terme sono abbastanza centrali e collegate dal trasporto pubblico. Chi soggiorna a Forio, Sant'Angelo o Barano senza mezzo si trova spesso con meno flessibilità negli spostamenti."
      },
      {
        question: "Quale zona scegliere se voglio noleggiare uno scooter a Ischia?",
        answer: "Con uno scooter qualsiasi zona diventa comoda, ma le zone più distanti dal porto — Forio, Sant'Angelo, Barano — danno i vantaggi più concreti: parcheggio facile, strade panoramiche e accesso a spiagge meno affollate. Puoi indicare su IschiaMotion il punto ritiro più comodo rispetto al tuo alloggio."
      },
      {
        question: "Dove dormire a Ischia per visitare più spiagge?",
        answer: "Una posizione centrale come Lacco Ameno o Casamicciola, combinata con uno scooter o un'auto, permette di raggiungere facilmente sia le spiagge nord che quelle ovest. Con un gommone si può esplorare la costa anche via mare, raggiungendo calette non accessibili via terra. Forio dà accesso diretto alle spiagge di Citara e Cava dell'Isola."
      },
      {
        question: "Qual è la zona migliore dove dormire a Ischia?",
        answer: "Dipende dallo stile di vacanza: Ischia Porto è comoda per arrivi e servizi; Forio per tramonti e spiagge; Lacco Ameno per eleganza e calma; Sant'Angelo per tranquillità e romantismo; Barano e Maronti per la natura. Ogni zona ha caratteristiche diverse."
      },
      {
        question: "Serve noleggiare un mezzo se soggiorno a Ischia?",
        answer: "Non sempre: dipende dalla zona e dall'alloggio. Chi soggiorna vicino al porto o in centro può cavarsela senza mezzo; chi è a Forio, Barano, Sant'Angelo o in una posizione panoramica ha spesso bisogno di scooter, auto o e-bike per muoversi agevolmente."
      },
      {
        question: "IschiaMotion prenota direttamente hotel?",
        answer: "No. IschiaMotion è una piattaforma dedicata alla mobilità e ai servizi locali a Ischia: scooter, auto, e-bike, gommoni, barche e beach club. Per hotel e strutture ricettive è utile rivolgersi a risorse dedicate come IschiaStars.it."
      },
      {
        question: "Cos'è IschiaStars?",
        answer: "IschiaStars.it è un progetto dedicato all'organizzazione del soggiorno a Ischia: hotel, strutture ricettive, preventivi personalizzati e supporto per pianificare la vacanza sull'isola. È una risorsa utile per chi sta ancora scegliendo dove dormire."
      },
      {
        question: "Posso organizzare soggiorno e spostamenti separatamente?",
        answer: "Sì. Puoi valutare l'alloggio tramite una risorsa come IschiaStars.it e poi richiedere veicoli o servizi su IschiaMotion. Le due piattaforme si completano nella pianificazione della vacanza a Ischia."
      },
      {
        question: "Meglio scooter o auto a Ischia?",
        answer: "Lo scooter è più agile per coppie e viaggiatori leggeri, utile per parcheggio e spostamenti rapidi. L'auto è più comoda per famiglie, gruppi o chi ha bagagli numerosi. La scelta dipende anche dalla zona di soggiorno e dal tipo di itinerario previsto."
      }
    ],
    finalTitle: "Pronto a organizzare gli spostamenti a Ischia?",
    finalText: "Dopo aver scelto dove dormire, richiedi su IschiaMotion disponibilità per scooter, auto, e-bike, gommoni, barche e beach club tramite partner locali selezionati."
  },
  en: {
    eyebrow: "Ischia travel guide",
    h1: "Where to stay in Ischia and how to get around",
    intro: "Planning a holiday in Ischia means choosing the right area to stay and thinking about how to get around. Where you sleep on the island shapes your daily experience: some areas are close to everything, others require a vehicle to reach beaches, villages or the port.",
    cardTitle: "Accommodation and transport together",
    cardText: "Choosing the right location and the right vehicle helps you plan a smoother holiday, without wasted time or last-minute surprises.",
    primaryCta: "Find the right vehicle",
    secondaryCta: "Ask for help on WhatsApp",
    whatsappMsg: "Hello IschiaMotion, I would like to check availability for a rental in Ischia.",
    breadcrumbLabel: "Where to stay in Ischia",
    zonesEyebrow: "Island areas",
    zonesTitle: "Choosing the right area in Ischia",
    zones: [
      ["Ischia Porto", "The main natural harbour and primary arrival point for hydrofoils and ferries from Naples and Pozzuoli. Convenient for services, evening activities and connections across the island. A practical base if you want everything within reach without a vehicle."],
      ["Forio", "On the western side of the island, Forio is known for its sunsets, Citara beach and a wide range of accommodation. Further from the main port, it almost always requires a scooter, car or e-bike for transfers."],
      ["Lacco Ameno", "Elegant and central in the north-west of the island, with quieter beaches, thermal spas and well-kept accommodation. A good base for peaceful stays with easy access to both Forio and Ischia Port."],
      ["Casamicciola Terme", "A municipality with its own port, useful for those arriving from Naples via Caremar. Practical position between Ischia Port and Lacco Ameno, with access to thermal spas and northern beaches."],
      ["Sant'Angelo", "A small, pedestrian village in the south-west of the island, romantic and quiet. Ideal for couples seeking peace, coastal views and less crowded beaches. The isolated position requires more planning to reach other parts of the island."],
      ["Barano and Maronti", "Barano d'Ischia is home to Maronti beach, one of the longest on the island, reachable also by boat or sea taxi. A natural and quiet area: guests staying here usually need a vehicle to move around."],
      ["Hillside and inland areas", "Some accommodation sits in panoramic hillside or inland positions. Great for silence, relaxation and views over the gulf. A private vehicle is almost always needed to reach beaches, villages and services."]
    ],
    mobilityEyebrow: "Getting around",
    mobilityTitle: "Accommodation and transport go together",
    mobilityItems: [
      ["Location and transport: a key combination", "Guests staying far from the port or main beaches often need to rent a vehicle. Thinking about this before choosing accommodation helps plan a smoother holiday."],
      ["Exploring coves and villages", "Those who want to explore the island independently, reach less crowded coves or visit villages away from their hotel benefit from choosing the right scooter, car or e-bike."],
      ["IschiaMotion for local mobility", "IschiaMotion is a local platform for requesting availability of scooters, cars, e-bikes, rubber dinghies, boats and beach clubs in Ischia through selected partners. Not a direct rental company, but a single point for organising mobility on the island."],
      ["Plan ahead", "Requesting a vehicle in advance, especially in high season, means more choice and a smoother start to the trip on arrival day."]
    ],
    ischiastarsEyebrow: "Useful resource",
    ischiastarsTitle: "IschiaStars: for planning your stay in Ischia",
    ischiastarsCardTitle: "Hotels, accommodation and tailored travel proposals",
    ischiastarsText: "If you are still deciding where to stay in Ischia, IschiaStars.it is a useful resource for reviewing hotels, accommodation options and personalised travel proposals. The project focuses on helping travellers organise their stay on the island: hotel recommendations, tailored quotes and planning support for those who want to prepare their Ischia holiday with care.",
    ischiastarsLinkLabel: "Plan your stay in Ischia with IschiaStars",
    afterStayEyebrow: "Island mobility",
    afterStayTitle: "Once you've chosen where to stay",
    afterStayItems: [
      ["Scooter in Ischia", "Ideal for couples and light travellers, practical for parking and quick movement between port, beaches and villages.", "/en/scooter-rental-ischia"],
      ["Car in Ischia", "Useful for families, luggage and accommodation far from the port. More comfort for more people on longer routes.", "/en/car-rental-ischia"],
      ["E-bike in Ischia", "Great for scenic routes, villages and seafronts. Mind the hills and check battery range with the partner.", "/en/e-bike-rental-ischia"],
      ["Rubber dinghy in Ischia", "To enjoy the coast from the sea, reach coves and organise a day on the water. Pickup at a defined nautical point.", "/en/rubber-dinghy-rental-ischia"],
      ["Boat in Ischia", "For more comfort at sea. Availability subject to requirements, weather and partner conditions.", "/en/boat-rental-ischia"],
      ["Beach Club in Ischia", "Sunbeds, umbrellas and seaside services through selected local venues. Ideal for an organised day by the sea.", "/en/ischia-beach-club"]
    ],
    linksTitle: "Explore IschiaMotion services",
    categoryLinks: [
      ["IschiaMotion home", "/en"],
      ["Check availability", "/en/results"],
      ["Scooter rental Ischia", "/en/scooter-rental-ischia"],
      ["Car rental Ischia", "/en/car-rental-ischia"],
      ["E-bike rental Ischia", "/en/e-bike-rental-ischia"],
      ["Rubber dinghy rental Ischia", "/en/rubber-dinghy-rental-ischia"],
      ["Boat rental Ischia", "/en/boat-rental-ischia"],
      ["Ischia Beach Club", "/en/ischia-beach-club"],
      ["Contact", "/en/contact"]
    ],
    faqs: [
      {
        question: "Which is the best area to stay in Ischia?",
        answer: "It depends on your travel style: Ischia Port for arrivals and services; Forio for sunsets and beaches; Lacco Ameno for elegance and calm; Sant'Angelo for romance and quiet; Barano and Maronti for nature. Each area has different strengths."
      },
      {
        question: "Do I need to rent a vehicle if I stay in Ischia?",
        answer: "Not always — it depends on the area and accommodation. Guests close to the port or town centre can manage without one; those in Forio, Barano, Sant'Angelo or a panoramic hillside position often need a scooter, car or e-bike to get around comfortably."
      },
      {
        question: "Does IschiaMotion book hotels?",
        answer: "No. IschiaMotion is a platform focused on mobility and local services in Ischia: scooters, cars, e-bikes, rubber dinghies, boats and beach clubs. For hotels and accommodation, a dedicated resource like IschiaStars.it is more suitable."
      },
      {
        question: "What is IschiaStars?",
        answer: "IschiaStars.it is a project dedicated to organising stays in Ischia: hotels, accommodation, personalised quotes and planning support for those who want to prepare their island holiday with care. A useful reference for travellers still choosing where to stay."
      },
      {
        question: "Can I organise accommodation and transport separately?",
        answer: "Yes. You can review accommodation options through a resource like IschiaStars.it and then request vehicles or services on IschiaMotion. The two complement each other when planning an Ischia holiday."
      },
      {
        question: "Scooter or car in Ischia?",
        answer: "A scooter is more agile for couples and light travellers, easier for parking and quick movement. A car is more comfortable for families, groups or guests with luggage. The choice also depends on the area of stay and the type of routes planned."
      }
    ],
    finalTitle: "Ready to plan getting around Ischia?",
    finalText: "Once you've chosen where to stay, request availability on IschiaMotion for scooters, cars, e-bikes, rubber dinghies, boats and beach clubs — through selected local partners."
  }
};

export function WhereToStayLanding({ locale }: { locale: Locale }) {
  const c = content[locale];
  const homePath = locale === "it" ? "/it" : "/en";
  const path = locale === "it" ? "/it/dove-dormire-a-ischia" : "/en/where-to-stay-in-ischia";
  const alternatePath = locale === "it" ? "/en/where-to-stay-in-ischia" : "/it/dove-dormire-a-ischia";
  const searchPath = locale === "it" ? "/it/risultati" : "/en/results";
  const whatsappUrl = `https://wa.me/393296856370?text=${encodeURIComponent(c.whatsappMsg)}`;

  const pageDescription = locale === "it"
    ? "Guida alle zone migliori dove dormire a Ischia: Ischia Porto, Forio, Sant'Angelo, Lacco Ameno, Maronti e consigli su scooter, auto ed e-bike."
    : "Plan your stay in Ischia: where to stay, how to move around the island and useful local services. IschiaMotion and IschiaStars help you organize your trip.";

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "IschiaMotion", url: `${siteUrl}${homePath}` },
        { name: c.breadcrumbLabel, url: `${siteUrl}${path}` }
      ])} />
      <JsonLd data={faqJsonLd(c.faqs)} />
      <JsonLd data={webpageJsonLd(locale, path, c.h1, pageDescription)} />
      <Header locale={locale} alternateHref={alternatePath} />
      <main className="seo-landing">

        <section className="seo-landing-hero">
          <div>
            <div className="section-eyebrow">{c.eyebrow}</div>
            <h1>{c.h1}</h1>
            <p>{c.intro}</p>
            <div className="hero-actions">
              <a href={searchPath} className="primary-btn">{c.primaryCta}</a>
              <a href={whatsappUrl} className="ghost-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">
                {c.secondaryCta}
              </a>
            </div>
          </div>
          <div className="seo-landing-card">
            <span>{locale === "it" ? "Consigliato per" : "Best for"}</span>
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
            {c.zones.map(([name, text]) => (
              <article className="seo-card" key={name}>
                <h3>{name}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        {c.zonesTable && c.zonesTableHeaders && (
          <section className="seo-landing-section">
            <div className="section-header">
              <div>
                <div className="section-eyebrow">{c.zonesTableEyebrow}</div>
                <h2 className="section-title">{c.zonesTableTitle}</h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    {c.zonesTableHeaders.map((header) => (
                      <th key={header} className="text-left p-3 border-b-2 font-semibold whitespace-nowrap">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {c.zonesTable.map(([zona, idealePer, serveMezzo, mezzo]) => (
                    <tr key={zona} className="border-b last:border-b-0">
                      <td className="p-3 font-medium whitespace-nowrap">{zona}</td>
                      <td className="p-3">{idealePer}</td>
                      <td className="p-3 whitespace-nowrap">{serveMezzo}</td>
                      <td className="p-3">{mezzo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{c.mobilityEyebrow}</div>
              <h2 className="section-title">{c.mobilityTitle}</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {c.mobilityItems.map(([title, text]) => (
              <article className="seo-card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{c.ischiastarsEyebrow}</div>
              <h2 className="section-title">{c.ischiastarsTitle}</h2>
            </div>
          </div>
          <article className="seo-card">
            <h3>{c.ischiastarsCardTitle}</h3>
            <p>{c.ischiastarsText}</p>
            <div className="hero-actions">
              <a
                href="https://ischiastars.it"
                target="_blank"
                rel="noopener noreferrer"
                className="ghost-btn"
              >
                {c.ischiastarsLinkLabel}
              </a>
            </div>
          </article>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{c.afterStayEyebrow}</div>
              <h2 className="section-title">{c.afterStayTitle}</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {c.afterStayItems.map(([title, text, href]) => (
              <article className="seo-card" key={title}>
                <h3>{href ? <a href={href}>{title}</a> : title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">{locale === "it" ? "Link utili" : "Useful links"}</div>
              <h2 className="section-title">{c.linksTitle}</h2>
            </div>
          </div>
          <div className="seo-landing-pickups">
            {c.categoryLinks.map(([label, href], index) => (
              <Fragment key={href}>
                {index > 0 ? <span className="seo-link-separator" aria-hidden="true">·</span> : null}
                <a href={href}>{label}</a>
              </Fragment>
            ))}
          </div>
        </section>

        <SeoFaqSection locale={locale} faqs={c.faqs} />

        <section className="final-cta">
          <div className="final-box">
            <h2>{c.finalTitle}</h2>
            <p>{c.finalText}</p>
            <div className="hero-actions">
              <a href={searchPath} className="primary-btn">{c.primaryCta}</a>
              <a href={whatsappUrl} className="ghost-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">
                {c.secondaryCta}
              </a>
            </div>
          </div>
        </section>

      </main>
      <WhatsAppCTA locale={locale} />
      <Footer locale={locale} />
    </>
  );
}
