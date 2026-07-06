import type { Metadata } from "next";
import Link from "next/link";
import { deliveryMethodLabels } from "@/lib/booking-labels";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Richiesta ricevuta - IschiaMotion",
  description: "Conferma ricezione richiesta IschiaMotion.",
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

type Props = {
  searchParams?: {
    code?: string;
    vehicle?: string;
    start?: string;
    end?: string;
    delivery_method?: string;
    delivery_location?: string;
  };
};

function valueOrDash(value: string | undefined) {
  return value?.trim() || "-";
}

export default function RequestReceivedPage({ searchParams }: Props) {
  const code = valueOrDash(searchParams?.code);
  const vehicle = valueOrDash(searchParams?.vehicle);
  const start = valueOrDash(searchParams?.start);
  const end = valueOrDash(searchParams?.end);
  const deliveryMethod = searchParams?.delivery_method === "pickup_point" ||
    searchParams?.delivery_method === "port_delivery" ||
    searchParams?.delivery_method === "hotel_delivery"
    ? searchParams.delivery_method
    : "pickup_point";
  const deliveryLocation = valueOrDash(searchParams?.delivery_location);
  const whatsappHref = getWhatsAppUrl("it", "requestReceived");

  return (
    <main className="min-h-screen bg-sand px-5 py-10 text-ink">
      <section className="mx-auto max-w-3xl rounded-[32px] bg-cream p-6 shadow-soft sm:p-10">
        <div className="section-eyebrow">Richiesta ricevuta</div>
        <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">Grazie, abbiamo ricevuto la tua richiesta.</h1>
        <p className="mt-4 text-ink/70">
          La disponibilità non è ancora confermata: IschiaMotion verifica date, zona e condizioni con i partner locali selezionati.
          Ti ricontatteremo con conferma, alternative o prossimi passaggi.
        </p>

        <div className="mt-8 rounded-[28px] border border-ink/10 bg-white/75 p-5">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Codice richiesta</div>
          <div className="mt-2 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">{code}</div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <SummaryItem label="Opzione" value={vehicle} />
          <SummaryItem label="Periodo" value={`${start} / ${end}`} />
          <SummaryItem label="Ritiro / consegna" value={deliveryMethodLabels.it[deliveryMethod]} />
          <SummaryItem label="Luogo" value={deliveryLocation} />
        </div>

        <div className="mt-8 rounded-[28px] border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-ink/75">
          Questa è una conferma di ricezione, non una conferma definitiva di disponibilità o prezzo finale.
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a className="primary-btn justify-center" href={whatsappHref} target="_blank" rel="noopener noreferrer">
            Hai dubbi? Scrivici su WhatsApp
          </a>
          <Link className="ghost-btn justify-center" href="/it">
            Torna alla homepage
          </Link>
        </div>
      </section>
    </main>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-ink/10 bg-white/65 p-5">
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">{label}</div>
      <div className="mt-2 text-sm font-semibold">{value}</div>
    </div>
  );
}
