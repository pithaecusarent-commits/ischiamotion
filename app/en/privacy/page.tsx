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
        intro: "This notice explains how data submitted through IschiaMotion is handled. IschiaMotion is a local platform that collects requests and checks availability and conditions through selected partners. Vehicles and services are provided by the respective local operators.",
        cardTitle: "Data controller",
        cardText: (
          <>
            IschiaMotion<br />
            Owner: Luigi Schiano<br />
            Via Fundera, 104<br />
            80076 Lacco Ameno (NA), Ischia, Italia<br />
            VAT number: 10784981218<br />
            Tel. <a href="tel:+393296856370">+39 329 685 6370</a><br />
            Email: <a href="mailto:info@ischiamotion.com">info@ischiamotion.com</a><br />
            Website: <a href="/en">https://www.ischiamotion.com/en</a>
          </>
        ),
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
