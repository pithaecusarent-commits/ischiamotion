import type { Metadata } from "next";
import { HtmlLang } from "@/components/site/HtmlLang";
import "./globals.css";

export const metadata: Metadata = {
  title: "IschiaMotion",
  description: "Piattaforma locale per richieste di noleggio scooter, auto, e-bike, gommoni e barche a Ischia tramite partner selezionati.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ischiamotion.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.lang=location.pathname.split('/')[1]==='en'?'en':'it';"
          }}
        />
      </head>
      <body>
        <HtmlLang />
        {children}
      </body>
    </html>
  );
}
