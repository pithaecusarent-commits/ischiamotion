import type { Metadata } from "next";
import { InfoPage } from "@/components/site/InfoPage";

export const metadata: Metadata = {
  title: "Contact | IschiaMotion",
  description: "Contact IschiaMotion for rental availability requests in Ischia through selected local partners.",
  alternates: {
    canonical: "/en/contact",
    languages: { it: "/it/contatti", en: "/en/contact", "x-default": "/it" }
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
        cardText: "Luigi Schiano, Via Fundera, 104, Lacco Ameno, Ischia. VAT number: 10784981218.",
        sections: [
          {
            title: "WhatsApp",
            body: "For a quick request you can use the WhatsApp CTA on the website or message +39 328 535 3722. Availability is still subject to review."
          },
          {
            title: "Email",
            body: "You can write to info@ischiamotion.com with dates, vehicle category, preferred area and number of guests, if relevant."
          },
          {
            title: "How it works",
            body: "IschiaMotion collects your request and checks options with selected rental partners. We do not promise instant confirmation or guaranteed availability."
          }
        ]
      }}
    />
  );
}
