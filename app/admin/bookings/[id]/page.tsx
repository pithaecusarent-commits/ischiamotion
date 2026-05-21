import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { updateBookingStatusAction } from "@/app/admin/bookings/[id]/actions";
import { signOutAdmin } from "@/app/admin/login/actions";
import {
  bookingCustomerNotes,
  bookingPickupPoint,
  bookingVehicle,
  formatAdminDate,
  formatAdminDateTime,
  statusOptions,
  StatusBadge
} from "@/app/admin/bookings/booking-ui";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { getAdminBookingById } from "@/lib/supabase/queries/admin-bookings";

type Props = {
  params: {
    id: string;
  };
  searchParams?: {
    statusUpdate?: string;
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
  const statusMessage = searchParams?.statusUpdate;

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
