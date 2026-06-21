import type { Metadata } from "next";
import { InfoPage } from "@/components/site/InfoPage";

export const metadata: Metadata = {
  title: "Privacy | IschiaMotion",
  description: "Basic privacy information for IschiaMotion, a local rental request platform through selected partners.",
  alternates: {
    canonical: "/en/privacy",
    languages: { it: "/it/privacy", en: "/en/privacy", "x-default": "/it/privacy" }
  }
};

export default function PrivacyEnPage() {
  return (
    <InfoPage
      locale="en"
      content={{
        eyebrow: "Privacy",
        title: "Privacy notice",
        intro: "This notice explains how data submitted through IschiaMotion is handled. IschiaMotion is a local rental request platform and connector, not a direct rental provider.",
        cardTitle: "Data controller",
        cardText: "Luigi Schiano, Via Fundera, 104, Lacco Ameno, Ischia. VAT number: 10784981218. Email: info@ischiamotion.com.",
        sections: [
          {
            title: "Data collected",
            body: "When you send a request we may collect first name, last name, email, phone, rental dates, requested vehicle, pickup or delivery method and notes submitted by the user."
          },
          {
            title: "Purpose",
            body: "We use this data to manage availability requests, contact the customer, organize the service through selected local partners and send operational communications related to the request."
          },
          {
            title: "Legal basis",
            body: "Processing is based on pre-contractual steps requested by the user and on legitimate interest for operational management, security and proper functioning of the service."
          },
          {
            title: "Recipients",
            body: "Data may be processed by authorized personnel, selected local partners only when necessary to manage the request, and technical providers such as hosting, database and email services."
          },
          {
            title: "Retention",
            body: "Data is kept for the time necessary to manage the request and for any applicable organizational, administrative or legal obligations."
          },
          {
            title: "Rights",
            body: "You may request access, rectification, erasure, restriction, objection and lodge a complaint with the competent authority. For privacy requests write to info@ischiamotion.com."
          }
        ]
      }}
    />
  );
}
