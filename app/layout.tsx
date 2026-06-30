import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { CookieConsent } from "@/components/site/CookieConsent";
import { HtmlLang } from "@/components/site/HtmlLang";
import { JsonLd } from "@/components/site/JsonLd";
import { organizationJsonLd } from "@/lib/seo";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces"
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans"
});

export const metadata: Metadata = {
  title: "IschiaMotion",
  description: "Piattaforma locale per richieste di noleggio scooter, auto, e-bike, gommoni e barche a Ischia tramite partner selezionati.",
  metadataBase: new URL("https://www.ischiamotion.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>
        <HtmlLang />
        <JsonLd data={organizationJsonLd()} />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
