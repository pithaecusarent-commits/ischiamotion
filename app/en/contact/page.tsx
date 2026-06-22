import type { Metadata } from "next";
import { InfoPage } from "@/components/site/InfoPage";

export const metadata: Metadata = {
  title: "Contact IschiaMotion in Lacco Ameno, Ischia",
  description: "Contact IschiaMotion, a local Ischia platform connecting visitors with selected scooter, car, e-bike, boat and beach-service partners.",
  alternates: {
    canonical: "/en/contact",
    languages: { it: "/it/contatti", en: "/en/contact", "x-default": "/it/contatti" }
  }
};

export default function ContactEnPage() {
  return (
    <InfoPage
      locale="en"
      content={{
        eyebrow: "Contact",
        title: "Contact IschiaMotion",
        intro: "For availability requests, information about vehicles or operational support, you can contact us by email or WhatsApp.",
        cardTitle: "IschiaMotion",
        cardText: (
          <>
            Owner: Luigi Schiano<br />
            Via Fundera, 104<br />
            80076 Lacco Ameno (NA), Ischia, Italia<br />
            VAT number: 10784981218<br />
            <a href="tel:+393296856370">+39 329 685 6370</a><br />
            <a href="mailto:info@ischiamotion.com">info@ischiamotion.com</a><br />
            <a href="https://www.ischiamotion.com">https://www.ischiamotion.com</a>
          </>
        ),
        sections: [
          {
            title: "WhatsApp",
            body: <>For a quick request you can use the WhatsApp CTA on the website or call and message <a href="tel:+393296856370">+39 329 685 6370</a>. Availability is still subject to review.</>
          },
          {
            title: "Email",
            body: <>You can write to <a href="mailto:info@ischiamotion.com">info@ischiamotion.com</a> with dates, vehicle category, preferred area and number of guests, if relevant.</>
          },
          {
            title: "How it works",
            body: "IschiaMotion collects your request and checks availability, conditions and confirmation with selected local partners on the island."
          },
          {
            title: "Address and directions",
            body: <>View the reference on <a href="https://www.google.com/maps/search/?api=1&query=Via%20Fundera%20104%2C%2080076%20Lacco%20Ameno%20NA" target="_blank" rel="noopener noreferrer">Google Maps</a>. The address is IschiaMotion’s local and administrative reference. It is not an automatic pick-up point or a public walk-in office: please contact us before visiting or sending a request.</>
          }
        ],
        faqs: [
          {
            question: "Where is IschiaMotion located?",
            answer: "IschiaMotion’s local and administrative reference is at Via Fundera, 104, 80076 Lacco Ameno (NA), on the island of Ischia. It is not an automatic pick-up point or a public walk-in office: please contact us before visiting or sending a request."
          },
          {
            question: "Is IschiaMotion a direct rental provider?",
            answer: "IschiaMotion is a local platform that collects requests and checks availability and conditions through selected partners. Vehicles and services are provided by the respective local operators."
          },
          {
            question: "Which areas of Ischia does the service cover?",
            answer: "Requests may cover Ischia Port, Casamicciola, Lacco Ameno, Forio, Sant’Angelo and Barano. Actual coverage depends on the category, partner and period."
          },
          {
            question: "Can I pick up a scooter or car at the port or hotel?",
            answer: "You can indicate a port, hotel or preferred area in your request. Pickup and delivery depend on the vehicle, area and available partner and are confirmed only after review."
          }
        ]
      }}
    />
  );
}
