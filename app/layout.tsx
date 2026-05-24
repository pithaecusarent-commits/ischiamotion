import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IschiaMotion",
  description: "Piattaforma locale per richieste di noleggio scooter, auto, e-bike, gommoni e barche a Ischia tramite partner selezionati.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ischiamotion.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
