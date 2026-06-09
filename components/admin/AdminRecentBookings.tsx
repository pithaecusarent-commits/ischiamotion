import type { AdminDashboardBooking } from "@/lib/supabase/queries/admin-dashboard";

type Props = {
  bookings: AdminDashboardBooking[];
  error: string | null;
};

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "In attesa", className: "bg-gold/15 text-amber-700 border-gold/20" },
  confirmed: { label: "Confermato", className: "bg-sea/10 text-sea border-sea/20" },
  voucher_sent: { label: "Voucher", className: "bg-mint/30 text-green-deep border-mint/30" },
  checked_in: { label: "Check-in", className: "bg-sea/15 text-green-deep border-sea/20" },
  completed: { label: "Completato", className: "bg-slate-100 text-ink/55 border-ink/10" },
  cancelled: { label: "Annullato", className: "bg-red-50 text-red-600 border-red-100" },
  no_show: { label: "No show", className: "bg-slate-50 text-ink/45 border-ink/10" },
};

const statusBarColors: Record<string, string> = {
  pending: "bg-gold",
  confirmed: "bg-sea",
  voucher_sent: "bg-mint",
  checked_in: "bg-green-deep",
  completed: "bg-slate-300",
  cancelled: "bg-red-400",
  no_show: "bg-slate-200",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function noteValue(notes: string | null, label: string) {
  if (!notes) return "";
  const line = notes.split("\n").find((item) => item.startsWith(`${label}: `));
  return line?.replace(`${label}: `, "") || "";
}

function vehicleLabel(booking: AdminDashboardBooking) {
  return booking.vehicles?.title_it || noteValue(booking.notes, "Vehicle") || "Richiesta generica";
}

function StatusMiniBar({ bookings }: { bookings: AdminDashboardBooking[] }) {
  if (!bookings.length) return null;
  const counts: Record<string, number> = {};
  for (const b of bookings) {
    counts[b.status] = (counts[b.status] || 0) + 1;
  }
  return (
    <div aria-hidden="true" className="mt-3 flex h-1.5 w-full overflow-hidden rounded-full bg-ink/5">
      {Object.entries(counts).map(([status, count]) => (
        <div
          className={`${statusBarColors[status] ?? "bg-slate-200"} transition-all`}
          key={status}
          style={{ width: `${(count / bookings.length) * 100}%` }}
        />
      ))}
    </div>
  );
}

export function AdminRecentBookings({ bookings, error }: Props) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sea/70">Timeline operativa</p>
          <h2 className="mt-1.5 font-serif text-2xl font-bold text-green-deep">Booking recenti</h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-ink/52">
            Le ultime richieste cliente, pronte da aprire.
          </p>
          {bookings.length > 0 && <StatusMiniBar bookings={bookings} />}
        </div>
        <a
          className="shrink-0 self-start rounded-full bg-green-deep px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sea sm:self-auto"
          href="/admin/bookings"
        >
          Vedi tutte
        </a>
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl border border-gold/20 bg-amber-50 p-4 text-sm font-semibold text-ink/65">
          Impossibile caricare le ultime richieste.
        </div>
      ) : null}

      {!error && bookings.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-ink/10 bg-sand/40 p-4 text-sm font-semibold text-ink/52">
          Nessuna richiesta cliente registrata.
        </div>
      ) : null}

      {bookings.length > 0 ? (
        <div className="mt-5 grid gap-2.5">
          {bookings.map((booking) => {
            const status = statusConfig[booking.status];
            return (
              <a
                className="group grid gap-3 rounded-2xl border border-ink/10 bg-gradient-to-br from-sand/40 to-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-sea/25 hover:shadow-sm sm:grid-cols-[1.1fr_1fr_auto]"
                href={`/admin/bookings/${booking.id}`}
                key={booking.id}
              >
                <div className="flex min-w-0 gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-green-deep text-xs font-black leading-none text-white"
                  >
                    {booking.booking_code.slice(-2)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-sea">
                      {booking.booking_code}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-bold text-ink">
                      {booking.customer_first_name} {booking.customer_last_name}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-ink/70">{vehicleLabel(booking)}</p>
                  <p className="mt-0.5 text-xs font-semibold text-ink/40">{formatDate(booking.created_at)}</p>
                </div>
                <div className="flex items-center justify-between gap-2.5 sm:justify-end">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-black shadow-sm ${
                      status?.className ?? "border-ink/10 bg-white text-ink/55"
                    }`}
                  >
                    {status?.label ?? booking.status}
                  </span>
                  <span className="rounded-full bg-sea/10 px-2.5 py-1 text-xs font-black text-sea transition group-hover:bg-sea/15">
                    Apri
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
