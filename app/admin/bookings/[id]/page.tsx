import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { assignBookingRenterAction, updateBookingStatusAction } from "@/app/admin/bookings/[id]/actions";
import { markBookingCheckedInAction } from "@/app/admin/bookings/[id]/checkin-actions";
import { PaymentForm } from "@/app/admin/bookings/[id]/PaymentForm";
import { generateVoucherAction } from "@/app/admin/bookings/[id]/voucher-actions";
import { VoucherPrintButton } from "@/app/admin/bookings/[id]/VoucherPrintButton";
import { signOutAdmin } from "@/app/admin/login/actions";
import { BookingIntelligencePanel } from "@/components/admin/BookingIntelligencePanel";
import {
  bookingAmountSummary,
  bookingCustomerNotes,
  bookingDeliveryLocation,
  bookingDeliveryMethod,
  bookingPaymentMethod,
  bookingPaymentStatus,
  bookingPaymentType,
  bookingPickupPoint,
  bookingVehicle,
  formatAdminDate,
  formatAdminDateTime,
  statusOptions,
  StatusBadge
} from "@/app/admin/bookings/booking-ui";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { getActiveAdminRenters, getAdminBookingById } from "@/lib/supabase/queries/admin-bookings";
import { getAdminCheckinByBookingId } from "@/lib/supabase/queries/checkins";
import { getAdminVoucherByBookingId } from "@/lib/supabase/queries/vouchers";
import { generateQrDataUrl, toAbsoluteCheckinUrl } from "@/lib/qr";

type Props = {
  params: {
    id: string;
  };
  searchParams?: {
    statusUpdate?: string;
    voucher?: string;
    checkin?: string;
    payment?: string;
    renterAssign?: string;
  };
};

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-3xl border border-ink/10 bg-white/65 p-5">
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">{label}</div>
      <div className="mt-2 text-sm font-semibold text-ink">{value || "-"}</div>
    </div>
  );
}

export default async function AdminBookingDetailPage({ params, searchParams }: Props) {
  const { accessToken } = await requireAdmin(`/admin/bookings/${params.id}`);
  const { booking, error } = await getAdminBookingById(accessToken, params.id);
  const { renters, error: rentersError } = await getActiveAdminRenters(accessToken);
  const { voucher, error: voucherLoadError } = booking ? await getAdminVoucherByBookingId(accessToken, booking.id) : { voucher: null, error: null };
  const { checkin } = booking ? await getAdminCheckinByBookingId(accessToken, booking.id) : { checkin: null };
  const statusMessage  = searchParams?.statusUpdate;
  const voucherMessage = searchParams?.voucher;
  const checkinMessage = searchParams?.checkin;
  const paymentMessage = searchParams?.payment;
  const renterAssignMessage = searchParams?.renterAssign;
  const voucherPath = voucher ? `/checkin/${voucher.voucher_code}` : "";
  const voucherUrl = voucher ? toAbsoluteCheckinUrl(voucherPath) : "";
  const voucherQrDataUrl = voucher ? await generateQrDataUrl(voucher.qr_payload || voucherPath) : "";

  if (!booking && !error) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-5xl rounded-[30px] bg-cream p-8 shadow-soft">
        <p className="section-kicker">Admin</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-bold">Dettaglio prenotazione</h1>
            <p className="mt-3 text-ink/65">Dati completi della richiesta ricevuta dal sito IschiaMotion.</p>
          </div>
          {booking ? <StatusBadge status={booking.status} /> : null}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="/admin/bookings">
            Torna alle prenotazioni
          </a>
          <form action={signOutAdmin}>
            <button className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" type="submit">
              Esci
            </button>
          </form>
        </div>

        {error ? (
          <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-ink/70">
            Impossibile caricare il dettaglio della prenotazione. Verifica che l&apos;utente abbia ruolo admin e che le policy Supabase siano applicate.
          </div>
        ) : null}

        {booking ? (
          <>
            <div className="mt-8 rounded-[28px] border border-ink/10 bg-white/75 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Codice</div>
                  <div className="mt-2 inline-flex whitespace-nowrap rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">
                    {booking.booking_code}
                  </div>
                </div>
                <div className="text-sm text-ink/60">Creata il {formatAdminDateTime(booking.created_at)}</div>
              </div>
            </div>

            <BookingIntelligencePanel booking={booking} voucher={voucher} checkin={checkin} />

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <DetailRow label="Cliente" value={`${booking.customer_first_name} ${booking.customer_last_name}`} />
              <DetailRow label="Email" value={booking.customer_email} />
              <DetailRow label="Telefono" value={booking.customer_phone || "-"} />
              <DetailRow label="Veicolo" value={bookingVehicle(booking)} />
              <DetailRow
                label="Date"
                value={`${formatAdminDate(booking.start_date)} - ${formatAdminDate(booking.end_date)}${booking.pickup_time ? `, ore ${booking.pickup_time}` : ""}`}
              />
              <DetailRow label="Pickup point" value={bookingPickupPoint(booking)} />
              <DetailRow label="Stato" value={<StatusBadge status={booking.status} />} />
              <DetailRow label="Data creazione" value={formatAdminDateTime(booking.created_at)} />
            </div>

            <div className="mt-4 rounded-[28px] border border-sea/10 bg-white/75 p-6">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Ritiro / consegna</div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <DetailRow label="Modalità" value={bookingDeliveryMethod(booking)} />
                <DetailRow label="Luogo" value={bookingDeliveryLocation(booking)} />
                <DetailRow label="Note consegna" value={booking.delivery_notes || "-"} />
              </div>
            </div>

            <div className="mt-4 rounded-[28px] border border-sea/10 bg-white/75 p-6">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Pagamento operativo</div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <DetailRow label="Tipo pagamento" value={bookingPaymentType(booking)} />
                <DetailRow label="Metodo preferito" value={bookingPaymentMethod(booking)} />
                <DetailRow label="Stato pagamento" value={bookingPaymentStatus(booking)} />
                <DetailRow label="Importi" value={bookingAmountSummary(booking)} />
                <DetailRow label="Note pagamento" value={booking.payment_notes || "-"} />
              </div>
            </div>

            {booking ? (
              <PaymentForm
                bookingId={booking.id}
                paymentType={booking.payment_type}
                paymentMethod={booking.payment_method}
                paymentStatus={booking.payment_status}
                totalAmount={booking.total_amount}
                depositAmount={booking.deposit_amount}
                balanceDue={booking.balance_due}
                paymentNotes={booking.payment_notes}
                successMessage={paymentMessage === "success"}
                errorMessage={paymentMessage === "error"}
              />
            ) : null}

            <div className="mt-4 rounded-[28px] border border-sea/10 bg-white/75 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Assegna noleggiatore</div>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-ink">Gestione partner interno</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
                    Il nome del noleggiatore resta visibile solo in admin. Dopo l&apos;assegnazione, la richiesta appare nell&apos;area renter collegata.
                  </p>
                </div>
              </div>

              {renterAssignMessage === "success" ? (
                <div className="mt-5 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-semibold text-green-deep">
                  Noleggiatore assegnato correttamente.
                </div>
              ) : null}

              {renterAssignMessage === "error" || rentersError ? (
                <div className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
                  Impossibile assegnare il noleggiatore. Verifica che esistano renter attivi e che le policy admin siano applicate.
                </div>
              ) : null}

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <DetailRow
                  label="Noleggiatore attuale"
                  value={booking.renters?.business_name_internal || (booking.renter_id ? "Renter collegato" : "Non assegnato")}
                />
                <DetailRow label="ID booking" value={booking.id} />
              </div>

              <form action={assignBookingRenterAction} className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                <input type="hidden" name="bookingId" value={booking.id} />
                <label className="grid gap-2 text-sm font-bold text-ink/70">
                  Noleggiatore attivo
                  <select
                    className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
                    name="renterId"
                    defaultValue={booking.renter_id || ""}
                    required
                  >
                    <option value="">Seleziona noleggiatore</option>
                    {renters.map((renter) => (
                      <option key={renter.id} value={renter.id}>
                        {renter.business_name_internal}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white" type="submit" disabled={renters.length === 0}>
                  Assegna
                </button>
              </form>
            </div>

            <div className="mt-4 rounded-[28px] border border-sea/10 bg-white/75 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Gestione stato</div>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-ink">Aggiorna stato prenotazione</h2>
                  <div className="mt-3 flex items-center gap-2 text-sm text-ink/60">
                    <span>Stato attuale:</span>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              </div>

              {statusMessage === "success" ? (
                <div className="mt-5 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-semibold text-green-deep">
                  Stato aggiornato correttamente.
                </div>
              ) : null}

              {statusMessage === "error" ? (
                <div className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
                  Impossibile aggiornare lo stato. Riprova.
                </div>
              ) : null}

              {statusMessage === "voucherRequired" ? (
                <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                  Genera prima il voucher cliente.
                </div>
              ) : null}

              <form action={updateBookingStatusAction} className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                <input type="hidden" name="bookingId" value={booking.id} />
                <label className="grid gap-2 text-sm font-bold text-ink/70">
                  Nuovo stato
                  <select
                    className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
                    name="status"
                    defaultValue={booking.status}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white" type="submit">
                  Aggiorna stato
                </button>
              </form>

              <div className="mt-5 flex flex-wrap gap-2">
                {["confirmed", "cancelled", "no_show", "completed"].map((status) => (
                  <form action={updateBookingStatusAction} key={status}>
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <input type="hidden" name="status" value={status} />
                    <button className="rounded-full border border-ink/10 px-4 py-2 text-xs font-bold text-ink/65 hover:border-sea/30 hover:text-green-deep" type="submit">
                      {statusOptions.find((option) => option.value === status)?.label}
                    </button>
                  </form>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[28px] border border-sea/10 bg-white/75 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Voucher cliente</div>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-ink">Voucher QR per il ritiro</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
                    Il voucher serve al cliente per presentarsi al punto ritiro IschiaMotion. In questa fase non viene inviata alcuna email.
                  </p>
                </div>
              </div>

              {voucherMessage === "success" ? (
                <div className="mt-5 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-semibold text-green-deep">
                  Voucher generato correttamente.
                </div>
              ) : null}

              {voucherMessage === "error" ? (
                <div className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
                  Impossibile generare il voucher. Verifica che la prenotazione sia confermata e che la migration 0006 sia applicata su Supabase.
                </div>
              ) : null}

              {voucherLoadError ? (
                <div className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
                  Impossibile leggere i voucher cliente. Verifica che la migration 0006 e le policy admin su booking_vouchers siano applicate.
                </div>
              ) : null}

              {booking.status === "pending" ? (
                <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                  Conferma la richiesta prima di generare il voucher.
                </div>
              ) : null}

              {booking.status === "confirmed" && !voucher ? (
                <div className="mt-5 rounded-3xl border border-sea/20 bg-sea/10 p-5">
                  <div className="text-sm font-semibold text-green-deep">
                    Prenotazione confermata: puoi generare il voucher cliente.
                  </div>
                  <form action={generateVoucherAction} className="mt-4">
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <button className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white" type="submit">
                      Genera voucher
                    </button>
                  </form>
                </div>
              ) : null}

              {["cancelled", "no_show"].includes(booking.status) ? (
                <div className="mt-5 rounded-3xl border border-stone-200 bg-stone-100 p-4 text-sm font-semibold text-stone-700">
                  Voucher non disponibile per prenotazioni annullate o no-show.
                </div>
              ) : null}

              {voucher ? (
                <div className="voucher-print-area mt-6 rounded-[28px] border border-ink/10 bg-white/70 p-5">
                  <div className="hidden print-voucher-header">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/ischiamotion-logo.png" alt="IschiaMotion" />
                    <h1>Voucher IschiaMotion</h1>
                    <p>Mostra questo voucher al punto ritiro o al personale incaricato della consegna.</p>
                  </div>

                  <div className="mb-5 flex flex-wrap gap-3 print-hidden">
                    <VoucherPrintButton />
                    <a
                      className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70 hover:border-sea/30 hover:text-green-deep"
                      href={voucherPath}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Apri voucher cliente
                    </a>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
                    <div className="rounded-[28px] border border-ink/10 bg-white p-4 print-qr-card">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={voucherQrDataUrl}
                        alt={`QR voucher ${voucher.voucher_code}`}
                        className="h-auto w-full"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 print-voucher-details">
                      <DetailRow label="Codice voucher" value={voucher.voucher_code} />
                      <DetailRow
                        label="Link check-in"
                        value={<a className="break-all text-green-deep underline" href={voucherPath}>{voucherUrl}</a>}
                      />
                      <DetailRow label="Cliente" value={`${booking.customer_first_name} ${booking.customer_last_name}`} />
                      <DetailRow label="Veicolo" value={bookingVehicle(booking)} />
                      <DetailRow
                        label="Date"
                        value={`${formatAdminDate(booking.start_date)} - ${formatAdminDate(booking.end_date)}${booking.pickup_time ? `, ore ${booking.pickup_time}` : ""}`}
                      />
                      <DetailRow label="Pickup point" value={bookingPickupPoint(booking)} />
                      <DetailRow label="Modalità servizio" value={bookingDeliveryMethod(booking)} />
                      <DetailRow label="Luogo" value={bookingDeliveryLocation(booking)} />
                      <DetailRow label="Note consegna" value={booking.delivery_notes || "-"} />
                      <DetailRow label="Pagamento" value={bookingPaymentType(booking)} />
                      <DetailRow label="Stato pagamento" value={bookingPaymentStatus(booking)} />
                      <DetailRow label="Importi" value={bookingAmountSummary(booking)} />
                      <DetailRow label="Stato" value={<StatusBadge status={booking.status} />} />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-4 rounded-[28px] border border-sea/10 bg-white/75 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Check-in cliente</div>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-ink">Registrazione ritiro</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
                    Usa questa azione quando il cliente si presenta al punto ritiro IschiaMotion con il voucher.
                  </p>
                </div>
                {booking.status === "checked_in" || checkin ? <StatusBadge status="checked_in" /> : null}
              </div>

              {checkinMessage === "success" ? (
                <div className="mt-5 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-semibold text-green-deep">
                  Check-in registrato correttamente.
                </div>
              ) : null}

              {checkinMessage === "error" ? (
                <div className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
                  Impossibile registrare il check-in. Verifica che esista un voucher valido.
                </div>
              ) : null}

              {booking.status === "pending" ? (
                <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                  Conferma la richiesta e genera il voucher prima del check-in.
                </div>
              ) : null}

              {booking.status === "confirmed" ? (
                <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                  Genera il voucher prima di registrare il check-in.
                </div>
              ) : null}

              {booking.status === "voucher_sent" ? (
                voucher ? (
                  <form action={markBookingCheckedInAction} className="mt-5">
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <button className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white" type="submit">
                      Segna check-in effettuato
                    </button>
                  </form>
                ) : (
                  <div className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
                    Voucher non trovato: genera o verifica il voucher prima del check-in.
                  </div>
                )
              ) : null}

              {booking.status === "checked_in" ? (
                <div className="mt-5 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-semibold text-green-deep">
                  Check-in effettuato{checkin?.checked_in_at ? ` il ${formatAdminDateTime(checkin.checked_in_at)}` : "."}
                </div>
              ) : null}

              {["cancelled", "no_show"].includes(booking.status) ? (
                <div className="mt-5 rounded-3xl border border-stone-200 bg-stone-100 p-4 text-sm font-semibold text-stone-700">
                  Check-in non disponibile per prenotazioni annullate o no-show.
                </div>
              ) : null}
            </div>

            <div className="mt-4 rounded-3xl border border-ink/10 bg-white/65 p-5">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Note</div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink/70">
                {bookingCustomerNotes(booking) || booking.notes || "Nessuna nota inserita."}
              </p>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
