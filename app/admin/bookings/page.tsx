import { signOutAdmin } from "@/app/admin/login/actions";
import { getAdminBookingRequests } from "@/lib/supabase/queries/admin-bookings";
import {
  bookingAmountSummary,
  bookingDeliveryLocation,
  bookingDeliveryMethod,
  bookingPaymentStatus,
  bookingPaymentType,
  bookingPickupPoint,
  bookingVehicle,
  formatAdminDate,
  formatAdminDateTime,
  StatusBadge
} from "@/app/admin/bookings/booking-ui";
import { requireAdmin } from "@/lib/supabase/admin-auth";

export default async function AdminBookingsPage() {
  const { accessToken } = await requireAdmin("/admin/bookings");
  const { bookings, error } = await getAdminBookingRequests(accessToken);

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-7xl rounded-[30px] bg-cream p-8 shadow-soft">
        <p className="section-kicker">Admin</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">Prenotazioni</h1>
        <p className="mt-4 text-ink/65">Richieste ricevute dal sito IschiaMotion.</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="/admin">
            Area admin
          </a>
          <form action={signOutAdmin}>
            <button className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" type="submit">
              Esci
            </button>
          </form>
        </div>

        {error ? (
          <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-ink/70">
            Impossibile caricare le prenotazioni. Verifica che l&apos;utente abbia ruolo admin e che le policy Supabase siano applicate.
          </div>
        ) : null}

        {!error && bookings.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-sea/10 bg-white/60 p-8 text-center text-ink/60">
            Nessuna prenotazione ricevuta per ora.
          </div>
        ) : null}

        {bookings.length > 0 ? (
          <div className="mt-8 overflow-hidden rounded-[28px] border border-ink/10 bg-white/75 shadow-card">
            <table className="w-full table-fixed border-collapse text-left text-xs xl:text-sm">
              <colgroup>
                <col className="w-[15%]" />
                <col className="w-[12%]" />
                <col className="w-[16%]" />
                <col className="w-[12%]" />
                <col className="w-[11%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[10%]" />
              </colgroup>
              <thead className="bg-sea/10 text-[11px] uppercase tracking-[0.14em] text-green-deep">
                <tr>
                  <th className="px-3 py-4">Codice</th>
                  <th className="px-3 py-4">Cliente</th>
                  <th className="px-3 py-4">Email</th>
                  <th className="px-3 py-4">Telefono</th>
                  <th className="px-3 py-4">Veicolo</th>
                  <th className="px-3 py-4">Date</th>
                  <th className="px-3 py-4">Servizio</th>
                  <th className="px-3 py-4">Stato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {bookings.map((booking) => (
                  <tr className="align-top transition-colors hover:bg-sea/5" key={booking.id}>
                    <td className="px-3 py-4">
                      <span className="inline-flex whitespace-nowrap rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">
                        {booking.booking_code}
                      </span>
                      <div className="mt-2 text-[11px] leading-4 text-ink/50">{formatAdminDateTime(booking.created_at)}</div>
                      <a className="mt-2 inline-flex rounded-full border border-ink/10 px-3 py-1.5 text-[11px] font-bold text-ink/70 hover:border-sea/30 hover:text-green-deep" href={`/admin/bookings/${booking.id}`}>
                        Dettagli
                      </a>
                    </td>
                    <td className="break-words px-3 py-4 font-semibold text-ink">{booking.customer_first_name} {booking.customer_last_name}</td>
                    <td className="break-words px-3 py-4 text-ink/70">{booking.customer_email}</td>
                    <td className="break-words px-3 py-4 text-ink/70">{booking.customer_phone || "-"}</td>
                    <td className="break-words px-3 py-4 text-ink/75">{bookingVehicle(booking)}</td>
                    <td className="px-3 py-4">
                      <div className="grid gap-1 whitespace-nowrap">
                        <span className="font-semibold text-ink">{formatAdminDate(booking.start_date)}</span>
                        <span className="text-xs text-ink/50">fino al {formatAdminDate(booking.end_date)}</span>
                        {booking.pickup_time ? <span className="text-xs text-green-deep">ore {booking.pickup_time}</span> : null}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span className="inline-flex max-w-full rounded-2xl bg-sand px-3 py-2 text-xs font-bold leading-4 text-green-deep">
                        {bookingDeliveryMethod(booking)}
                      </span>
                      <div className="mt-2 text-xs leading-4 text-ink/55">{bookingDeliveryLocation(booking) || bookingPickupPoint(booking)}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <StatusBadge status={booking.status} />
                      <div className="mt-2 whitespace-normal text-xs leading-4 text-ink/55">
                        {bookingPaymentType(booking)}
                        <span className="block font-semibold text-green-deep">{bookingPaymentStatus(booking)}</span>
                        {bookingAmountSummary(booking) !== "-" ? (
                          <span className="block text-ink/70">{bookingAmountSummary(booking)}</span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  );
}
