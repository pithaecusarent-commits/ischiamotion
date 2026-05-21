import { signOutAdmin } from "@/app/admin/login/actions";
import { getAdminBookingRequests } from "@/lib/supabase/queries/admin-bookings";
import { getBookingNoteValue } from "@/lib/supabase/queries/bookings";
import { requireAdmin } from "@/lib/supabase/admin-auth";

export default async function AdminBookingsPage() {
  const { accessToken } = await requireAdmin("/admin/bookings");
  const { bookings, error } = await getAdminBookingRequests(accessToken);

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-6xl rounded-[30px] bg-cream p-8 shadow-soft">
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
          <div className="mt-8 overflow-x-auto rounded-3xl border border-ink/10 bg-white/70">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="bg-sea/10 text-xs uppercase tracking-[0.16em] text-green-deep">
                <tr>
                  <th className="p-4">Codice</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Telefono</th>
                  <th className="p-4">Veicolo</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Pickup point</th>
                  <th className="p-4">Stato</th>
                  <th className="p-4">Creata</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr className="border-t border-ink/10" key={booking.booking_code}>
                    <td className="p-4 font-semibold">{booking.booking_code}</td>
                    <td className="p-4">{booking.customer_first_name} {booking.customer_last_name}</td>
                    <td className="p-4">{booking.customer_email}</td>
                    <td className="p-4">{booking.customer_phone || "-"}</td>
                    <td className="p-4">{getBookingNoteValue(booking.notes, "Vehicle") || "-"}</td>
                    <td className="p-4">{booking.start_date} → {booking.end_date}</td>
                    <td className="p-4">{getBookingNoteValue(booking.notes, "Pickup point") || "-"}</td>
                    <td className="p-4"><span className="rounded-full bg-sea/10 px-3 py-1 text-xs font-bold text-green-deep">{booking.status}</span></td>
                    <td className="p-4">{new Date(booking.created_at).toLocaleDateString("it-IT")}</td>
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
