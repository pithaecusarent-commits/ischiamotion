import { notFound } from "next/navigation";
import { getPublicCheckinVoucher } from "@/lib/supabase/queries/vouchers";
import { createQrSvgDataUrl } from "@/lib/qr";

type Props = {
  params: {
    code: string;
  };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

export default async function PublicCheckinPage({ params }: Props) {
  const { voucher, error } = await getPublicCheckinVoucher(params.code);

  if (!voucher && !error) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-2xl rounded-[30px] bg-cream p-8 shadow-soft">
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ischiamotion-logo.png" alt="IschiaMotion" className="h-20 w-auto" />
        </div>

        {error ? (
          <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-ink/70">
            Voucher non disponibile. Verifica il codice o contatta IschiaMotion.
          </div>
        ) : null}

        {voucher ? (
          <>
            <div className="mt-8 text-center">
              <p className="section-kicker">Voucher IschiaMotion</p>
              <h1 className="mt-3 font-serif text-4xl font-bold">Check-in ritiro</h1>
              <p className="mt-3 text-ink/65">Presenta questa schermata al punto ritiro IschiaMotion.</p>
            </div>

            <div className="mx-auto mt-8 max-w-[240px] rounded-[28px] border border-ink/10 bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={createQrSvgDataUrl(`/checkin/${voucher.voucher_code}`)} alt={`QR voucher ${voucher.voucher_code}`} className="h-auto w-full" />
            </div>

            <div className="mt-8 rounded-[28px] border border-ink/10 bg-white/70 p-6">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Codice voucher</div>
              <div className="mt-2 inline-flex whitespace-nowrap rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">
                {voucher.voucher_code}
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-ink/10 bg-white/65 p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Cliente</div>
                <div className="mt-2 text-sm font-semibold">{voucher.customer_display_name || "-"}</div>
              </div>
              <div className="rounded-3xl border border-ink/10 bg-white/65 p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Stato</div>
                <div className="mt-2 text-sm font-semibold">{voucher.booking_status}</div>
              </div>
              <div className="rounded-3xl border border-ink/10 bg-white/65 p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Veicolo</div>
                <div className="mt-2 text-sm font-semibold">{voucher.vehicle_label || "-"}</div>
              </div>
              <div className="rounded-3xl border border-ink/10 bg-white/65 p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Pickup point</div>
                <div className="mt-2 text-sm font-semibold">{voucher.pickup_point_label || "-"}</div>
              </div>
              <div className="rounded-3xl border border-ink/10 bg-white/65 p-5 sm:col-span-2">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Date</div>
                <div className="mt-2 text-sm font-semibold">
                  {formatDate(voucher.start_date)} - {formatDate(voucher.end_date)}
                  {voucher.pickup_time ? `, ore ${voucher.pickup_time}` : ""}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
