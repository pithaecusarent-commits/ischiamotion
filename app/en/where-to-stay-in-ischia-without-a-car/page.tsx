import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { JsonLd } from "@/components/site/JsonLd";
import { SeoFaqSection } from "@/components/site/SeoFaqSection";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, siteUrl, webpageJsonLd } from "@/lib/seo";
import { ISCHIAMOTION_WHATSAPP_NUMBER } from "@/lib/whatsapp";

const path = "/en/where-to-stay-in-ischia-without-a-car";
const title = "Where to Stay in Ischia Without a Car | Best Areas + Transport Tips";
const description = "Planning Ischia without a car? Discover the best areas to stay, how to get around by bus, scooter, e-bike or taxi, and when renting a vehicle makes sense.";

const areas = [
  {
    name: "Ischia Porto",
    pros: "Best for first-time visitors, ferry arrivals, restaurants, evening walks and easy access to buses, taxis and services.",
    cons: "It can feel busier in high season, especially around ferry times.",
    transport: "Often manageable on foot for short stays; scooter, e-bike or taxi helps when you want to explore beaches and villages beyond the port."
  },
  {
    name: "Ischia Ponte",
    pros: "Atmospheric and walkable, close to the Aragonese Castle and a good base for slow evenings without driving.",
    cons: "Less convenient than Ischia Porto if you plan frequent island-wide trips.",
    transport: "Good on foot locally; scooter or taxi is useful for Forio, Sant’Angelo, Maronti and the west coast."
  },
  {
    name: "Forio",
    pros: "Great for beaches, sunsets, restaurants and a more holiday-like west-coast feeling.",
    cons: "Without a vehicle, reaching other parts of the island can take more planning.",
    transport: "Bus and taxi can work; scooter or car often makes Forio more flexible, especially for evening plans."
  },
  {
    name: "Casamicciola Terme",
    pros: "Practical north-coast base with its own port, thermal tradition and a position between Ischia Porto and Lacco Ameno.",
    cons: "Some hotels and beaches may still require a bus, taxi or vehicle depending on the exact address.",
    transport: "A balanced option without a car; e-bike, scooter or taxi can cover shorter trips comfortably."
  },
  {
    name: "Lacco Ameno",
    pros: "Elegant, compact and calmer, with San Montano and several hotels in a refined setting.",
    cons: "Quieter evenings and fewer direct connections than Ischia Porto.",
    transport: "Good if you want a softer pace; scooter, taxi or bus helps for Forio, Ischia Porto and Sant’Angelo."
  },
  {
    name: "Sant’Angelo",
    pros: "Romantic, pedestrian and scenic, ideal if you want quiet rather than constant island-hopping.",
    cons: "The least flexible base without a vehicle; arrival and luggage need planning.",
    transport: "Best for a slow stay; taxi, bus connections or a pre-planned vehicle may be useful for wider exploration."
  }
];

const faqs = [
  {
    question: "What is the best place to stay in Ischia without a car?",
    answer: "Ischia Porto is usually the easiest base without a car because ferries, restaurants, services, buses and taxis are close together. Ischia Ponte, Casamicciola and Lacco Ameno can also work well depending on your travel style."
  },
  {
    question: "Do you need a car in Ischia?",
    answer: "You do not always need a car in Ischia. A car can help with luggage, family travel and longer island-wide itineraries, but many visitors use buses, taxis, scooters or e-bikes depending on their area and plans."
  },
  {
    question: "Is a scooter useful if I stay in Ischia without a car?",
    answer: "A scooter can be useful for couples or light travellers who want more freedom between beaches, villages and viewpoints. Requirements, pickup point and availability are always checked with selected local partners."
  },
  {
    question: "Can I stay in Forio without a car?",
    answer: "Yes, especially if you want beaches and west-coast evenings. For wider exploration, a scooter, car, taxi or bus planning can make the stay easier."
  },
  {
    question: "Can IschiaMotion help me choose between scooter, e-bike and car?",
    answer: "Yes. IschiaMotion collects your request and checks availability, conditions and confirmation with selected local partners on the island."
  }
];

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: canonicalUrl(path),
    languages: {
      en: canonicalUrl(path),
      "x-default": canonicalUrl(path)
    }
  },
  openGraph: {
    title,
    description,
    url: canonicalUrl(path),
    siteName: "IschiaMotion",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/ischiamotion-logo.png", alt: "Where to stay in Ischia without a car - IschiaMotion" }]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/ischiamotion-logo.png"]
  }
};

export default function WhereToStayInIschiaWithoutACarPage() {
  const whatsappUrl = `https://wa.me/${ISCHIAMOTION_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi IschiaMotion, I am planning Ischia without a car and would like advice on where to stay and which transport option makes sense.")}`;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "IschiaMotion", url: `${siteUrl}/en` },
        { name: "Where to stay in Ischia without a car", url: `${siteUrl}${path}` }
      ])} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webpageJsonLd("en", path, title, description)} />
      <Header locale="en" alternateHref="/it/dove-dormire-a-ischia" />
      <main className="seo-landing">
        <section className="seo-landing-hero guide-hero">
          <div>
            <div className="section-eyebrow">Car-free Ischia guide</div>
            <h1 className="seo-landing-title">Where to Stay in Ischia Without a Car</h1>
            <p>Choosing the right area matters more than choosing the “perfect” hotel when you visit Ischia without a car. Some towns are easy for arrivals, restaurants and short walks; others are quieter but need better transport planning.</p>
            <p>This guide compares the main areas and explains when walking, buses or taxis may be enough — and when a scooter, e-bike or car can make the island easier.</p>
            <div className="hero-actions">
              <a href="/en/scooter-rental-ischia" className="primary-btn">Check scooter options</a>
              <a href={whatsappUrl} className="ghost-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">Ask on WhatsApp</a>
            </div>
          </div>
          <div className="seo-landing-card">
            <span>Quick answer</span>
            <strong>Ischia Porto is usually the easiest base without a car.</strong>
            <p>Forio, Lacco Ameno, Casamicciola and Sant’Angelo can be excellent too, but each one changes how you move around the island.</p>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Best areas</div>
              <h2 className="section-title">Best places to stay in Ischia without a car</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            {areas.map((area) => (
              <article className="seo-card" key={area.name}>
                <h3>{area.name}</h3>
                <p><strong>Why it works:</strong> {area.pros}</p>
                <p><strong>Watch out for:</strong> {area.cons}</p>
                <p><strong>Transport tip:</strong> {area.transport}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Transport choices</div>
              <h2 className="section-title">When walking, buses or taxis are enough</h2>
            </div>
          </div>
          <div className="seo-landing-grid">
            <article className="seo-card">
              <h3>Walking</h3>
              <p>Works well if you stay around Ischia Porto, Ischia Ponte, central Forio, Lacco Ameno or Sant’Angelo and plan a slow holiday with restaurants, beaches and evening walks nearby.</p>
            </article>
            <article className="seo-card">
              <h3>Buses and taxis</h3>
              <p>Useful when you prefer not to drive, especially for single transfers or simple days out. In high season or late evening, flexibility can be lower than with your own vehicle.</p>
            </article>
            <article className="seo-card">
              <h3>Scooter or e-bike</h3>
              <p>Often practical for couples and light travellers who want beaches, villages and viewpoints without relying only on schedules. Suitability depends on experience, route, luggage and conditions.</p>
            </article>
            <article className="seo-card">
              <h3>Car</h3>
              <p>Can make sense for families, children, luggage, rainy days or accommodation outside the most walkable centres. Parking and partner conditions should always be checked before confirmation.</p>
            </article>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Plan the next step</div>
              <h2 className="section-title">Turn your area choice into a transport plan</h2>
            </div>
          </div>
          <div className="seo-landing-pickups">
            <a href="/en/scooter-rental-ischia">Scooter rental Ischia</a>
            <span className="seo-link-separator" aria-hidden="true">·</span>
            <a href="/en/car-rental-ischia">Car rental Ischia</a>
            <span className="seo-link-separator" aria-hidden="true">·</span>
            <a href="/en/e-bike-rental-ischia">E-bike rental Ischia</a>
            <span className="seo-link-separator" aria-hidden="true">·</span>
            <a href="/en/rubber-dinghy-rental-ischia">Rubber dinghies</a>
            <span className="seo-link-separator" aria-hidden="true">·</span>
            <a href="/en/ischia-beach-club">Beach clubs</a>
            <span className="seo-link-separator" aria-hidden="true">·</span>
            <a href="/en/contact">Contact</a>
          </div>
        </section>

        <SeoFaqSection locale="en" faqs={faqs} />

        <section className="final-cta">
          <div className="final-box">
            <h2>Need help choosing the right area and transport?</h2>
            <p>Tell us where you are staying, your dates and how you want to move around. We check available options with selected local partners.</p>
            <div className="hero-actions">
              <a href="/en/results" className="primary-btn">Check availability</a>
              <a href={whatsappUrl} className="ghost-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppCTA locale="en" />
      <Footer locale="en" />
    </>
  );
}
