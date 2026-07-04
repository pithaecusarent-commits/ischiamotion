import type { Metadata } from "next";
import Link from "next/link";
import { deliveryMethodLabels } from "@/lib/booking-labels";

export const metadata: Metadata = {
  title: "Request received - IschiaMotion",
  description: "IschiaMotion request confirmation.",
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
  const whatsappText = `Hello IschiaMotion, I sent a request from the website. Request code: ${code}.`;
  const whatsappHref = `https://wa.me/393296856370?text=${encodeURIComponent(whatsappText)}`;

  return (
    <main className="min-h-screen bg-sand px-5 py-10 text-ink">
      <section className="mx-auto max-w-3xl rounded-[32px] bg-cream p-6 shadow-soft sm:p-10">
        <div className="section-eyebrow">Request received</div>
        <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">Thank you, we received your request.</h1>
        <p className="mt-4 text-ink/70">
          Availability is not confirmed yet: IschiaMotion reviews dates, area and conditions with selected local partners.
          We will contact you with confirmation, alternatives or next steps.
        </p>

        <div className="mt-8 rounded-[28px] border border-ink/10 bg-white/75 p-5">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Request code</div>
          <div className="mt-2 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">{code}</div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <SummaryItem label="Option" value={vehicle} />
          <SummaryItem label="Period" value={`${start} / ${end}`} />
          <SummaryItem label="Pickup / delivery" value={deliveryMethodLabels.en[deliveryMethod]} />
          <SummaryItem label="Location" value={deliveryLocation} />
        </div>

        <div className="mt-8 rounded-[28px] border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-ink/75">
          This confirms we received your request; it is not a final confirmation of availability or final price.
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a className="primary-btn justify-center" href={whatsappHref} target="_blank" rel="noopener noreferrer">
            Questions? Message us on WhatsApp
          </a>
          <Link className="ghost-btn justify-center" href="/en">
            Back to homepage
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
