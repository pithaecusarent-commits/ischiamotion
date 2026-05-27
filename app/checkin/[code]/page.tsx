import { notFound } from "next/navigation";
import { getPublicCheckinVoucher } from "@/lib/supabase/queries/vouchers";
import { generateQrDataUrl } from "@/lib/qr";
import { PrintVoucherButton } from "@/app/checkin/[code]/PrintVoucherButton";
import { deliveryMethodLabels, formatMoney, paymentStatusLabels, paymentTypeLabels } from "@/lib/booking-labels";

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
  const qrDataUrl = voucher ? await generateQrDataUrl(`/checkin/${voucher.voucher_code}`) : "";
  const locale = voucher?.customer_language === "en" ? "en" : "it";

  if (!voucher && !error) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="voucher-print-area mx-auto max-w-2xl rounded-[30px] bg-cream p-8 shadow-soft">
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
              <p className="mt-3 text-ink/65">
                {locale === "it"
                  ? "Mostra questo voucher al punto ritiro o al partner locale incaricato della consegna."
                  : "Show this voucher at the pickup point or to the local partner handling delivery."}
              </p>
              <PrintVoucherButton />
            </div>

            <div className="print-qr-card mx-auto mt-8 max-w-[240px] rounded-[28px] border border-ink/10 bg-white p-4">
              {qrDataUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrDataUrl} alt={`QR voucher ${voucher.voucher_code}`} className="h-auto w-full" />
                </>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-[22px] border border-amber-200 bg-amber-50 p-4 text-center text-sm font-semibold leading-6 text-amber-800">
                  {locale === "it" ? "QR non disponibile. Usa il codice voucher." : "QR unavailable. Use the voucher code."}
                </div>
              )}
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
              <div className="rounded-3xl border border-ink/10 bg-white/65 p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Servizio</div>
                <div className="mt-2 text-sm font-semibold">{deliveryMethodLabels[locale][voucher.delivery_method]}</div>
              </div>
              <div className="rounded-3xl border border-ink/10 bg-white/65 p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Luogo</div>
                <div className="mt-2 text-sm font-semibold">{voucher.delivery_location || voucher.pickup_point_label || "-"}</div>
              </div>
              {voucher.delivery_notes ? (
                <div className="rounded-3xl border border-ink/10 bg-white/65 p-5 sm:col-span-2">
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Note operative</div>
                  <div className="mt-2 text-sm font-semibold">{voucher.delivery_notes}</div>
                </div>
              ) : null}
              <div className="rounded-3xl border border-ink/10 bg-white/65 p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Pagamento</div>
                <div className="mt-2 text-sm font-semibold">{paymentTypeLabels[locale][voucher.payment_type]}</div>
              </div>
              <div className="rounded-3xl border border-ink/10 bg-white/65 p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Stato pagamento</div>
                <div className="mt-2 text-sm font-semibold">{paymentStatusLabels[locale][voucher.payment_status]}</div>
              </div>
              {(voucher.total_amount !== null || voucher.deposit_amount !== null || voucher.balance_due !== null) ? (
                <div className="rounded-3xl border border-ink/10 bg-white/65 p-5 sm:col-span-2">
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Importi</div>
                  <div className="mt-2 text-sm font-semibold">
                    {[
                      voucher.total_amount   !== null ? `Totale ${formatMoney(voucher.total_amount)}`     : "",
                      voucher.deposit_amount !== null ? `Acconto ${formatMoney(voucher.deposit_amount)}`  : "",
                      voucher.balance_due    !== null ? `Saldo ${formatMoney(voucher.balance_due)}`       : ""
                    ].filter(Boolean).join(" · ")}
                  </div>
                </div>
              ) : null}
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
