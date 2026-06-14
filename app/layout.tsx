import type { Metadata } from "next";
import { headers } from "next/headers";
import { DM_Sans, Fraunces } from "next/font/google";
import { CookieConsent } from "@/components/site/CookieConsent";
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
  metadataBase: new URL("https://www.ischiamotion.com"),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get("x-pathname") || "";
  const lang = pathname.split("/")[1] === "en" ? "en" : "it";

  return (
    <html lang={lang} className={`${fraunces.variable} ${dmSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
