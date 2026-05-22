import { requireRenter } from "@/lib/supabase/renter-auth";
import { getRenterBookings } from "@/lib/supabase/queries/renter";
import { AccessDenied, EmptyState, RenterShell, StatusBadge } from "@/app/renter/renter-ui";
import { deliveryMethodLabels, formatMoney, paymentMethodLabels, paymentStatusLabels, paymentTypeLabels } from "@/lib/booking-labels";
import { getBookingNoteValue } from "@/lib/supabase/queries/bookings";

function shortCustomer(firstName: string, lastName: string) {
  return `${firstName} ${lastName ? `${lastName.slice(0, 1)}.` : ""}`.trim();
}

function formatDateRange(startDate: string, endDate: string) {
  const start = new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "short" }).format(new Date(startDate));
  const end = new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(endDate));
  return startDate === endDate ? end : `${start} - ${end}`;
}

export default async function RenterBookingsPage() {
  const session = await requireRenter("/renter/bookings");

  if (session.denied) {
    return <AccessDenied />;
  }

  const { bookings, error } = await getRenterBookings(session.accessToken);

  return (
    <RenterShell title="Prenotazioni assegnate">
      {error ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">{error}</div>
      ) : null}

      {!error && bookings.length === 0 ? (
        <EmptyState
          title="Nessuna prenotazione assegnata"
          text="Nessuna prenotazione assegnata al tuo noleggio."
        />
      ) : null}

      {bookings.length > 0 ? (
        <div className="overflow-hidden rounded-[28px] border border-ink/10 bg-white/70">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-[0.12em] text-ink/50">
                <tr>
                  <th className="px-5 py-4">Codice</th>
                  <th className="px-5 py-4">Cliente</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Veicolo</th>
                  <th className="px-5 py-4">Servizio</th>
                  <th className="px-5 py-4">Stato</th>
                  <th className="px-5 py-4">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-5 py-4 font-bold">{booking.booking_code}</td>
                    <td className="px-5 py-4">{shortCustomer(booking.customer_first_name, booking.customer_last_name)}</td>
                    <td className="px-5 py-4">
                      {formatDateRange(booking.start_date, booking.end_date)}
                      {booking.pickup_time ? <span className="block text-xs text-ink/50">{booking.pickup_time}</span> : null}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold">{booking.vehicles?.title_it || getBookingNoteValue(booking.notes, "Vehicle") || "-"}</span>
                      {booking.vehicles?.internal_name ? (
                        <span className="mt-1 block text-xs text-ink/55">{booking.vehicles.internal_name}</span>
                      ) : null}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold">{deliveryMethodLabels.it[booking.delivery_method]}</span>
                      <span className="block text-xs text-ink/55">
                        {booking.delivery_location || booking.pickup_points?.public_label_it || booking.pickup_points?.zone || "IschiaMotion Point"}
                      </span>
                      {booking.delivery_notes ? <span className="mt-1 block text-xs text-ink/55">{booking.delivery_notes}</span> : null}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={booking.status} />
                      <span className="mt-2 block text-xs text-ink/55">
                        Pagamento: {paymentTypeLabels.it[booking.payment_type]}
                      </span>
                      <span className="block text-xs text-ink/55">
                        Metodo preferito: {paymentMethodLabels.it[booking.payment_method]}
                      </span>
                      <span className="block text-xs font-semibold text-green-deep">
                        {paymentStatusLabels.it[booking.payment_status]}
                      </span>
                      {(booking.deposit_amount !== null || booking.balance_due !== null) ? (
                        <span className="mt-1 block text-xs text-ink/55">
                          Acconto {formatMoney(booking.deposit_amount)} · Saldo {formatMoney(booking.balance_due)}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-4">
                      <a className="font-bold text-green-deep underline" href="/renter/checkin">
                        Check-in
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </RenterShell>
  );
}
