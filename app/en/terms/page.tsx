import type { Metadata } from "next";
import { InfoPage } from "@/components/site/InfoPage";

export const metadata: Metadata = {
  title: "Terms | IschiaMotion",
  description: "Basic IschiaMotion terms for availability requests through selected local rental partners.",
  alternates: {
    canonical: "/en/terms",
    languages: { it: "/it/termini", en: "/en/terms", "x-default": "/it" }
  }
};

export default function TermsEnPage() {
  return (
    <InfoPage
      locale="en"
      content={{
        eyebrow: "Terms",
        title: "Terms of use",
        intro: "These terms describe how IschiaMotion works as a local rental request platform and connector through selected local partners.",
        cardTitle: "Request, not instant confirmation",
        cardText: "Sending a request does not mean the booking is confirmed. IschiaMotion checks availability and details with selected partners.",
        sections: [
          {
            title: "Role of IschiaMotion",
            body: "IschiaMotion is a local platform connecting customers with selected rental partners in Ischia. It does not claim to directly own the vehicles shown."
          },
          {
            title: "Availability request",
            body: "The customer submits category, dates, pickup or delivery preference and contact details. The request is reviewed before any operational confirmation."
          },
          {
            title: "Confirmation after review",
            body: "Availability is not guaranteed until confirmed. A request is not an instant confirmed booking and final conditions are shared only after review."
          },
          {
            title: "Indicative prices",
            body: "Prices shown as “from” are indicative and may vary depending on dates, rental length, category, availability, partner conditions and pickup or delivery method."
          },
          {
            title: "Payments",
            body: "Automatic online payment is not included unless explicitly stated. Deposits, balances or payments are defined only after review with the selected local partner."
          },
          {
            title: "Customer responsibility",
            body: "The customer must provide accurate and updated data, including contact details, dates, service preferences and any requirements needed for the requested vehicle."
          },
          {
            title: "Owner details",
            body: "IschiaMotion refers to Luigi Schiano, Via Fundera, 104, Lacco Ameno, Ischia. VAT number: 10784981218. Email: info@ischiamotion.com."
          }
        ]
      }}
    />
  );
}
