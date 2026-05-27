import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "IschiaMotion",
  description: "Piattaforma locale per richieste di noleggio scooter, auto, e-bike, gommoni e barche a Ischia tramite partner selezionati.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ischiamotion.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get("x-pathname") || "";
  const lang = pathname.split("/")[1] === "en" ? "en" : "it";

  return (
    <html lang={lang}>
      <body>
        {children}
      </body>
    </html>
  );
}
