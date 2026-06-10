import { signOutAdmin } from "@/app/admin/login/actions";
import { getActiveAdminRenters, getAdminBookingCategories, getAdminBookingRequests, type AdminBookingFilters } from "@/lib/supabase/queries/admin-bookings";
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
  StatusBadge,
  statusOptions
} from "@/app/admin/bookings/booking-ui";
import { requireAdmin } from "@/lib/supabase/admin-auth";

type Props = {
  searchParams?: {
    status?: string;
    renter?: string;
    category?: string;
    from?: string;
    to?: string;
    q?: string;
  };
};

function clean(value?: string) {
  return String(value || "").trim();
}

function buildExportHref(filters: AdminBookingFilters) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.renterId) params.set("renter", filters.renterId);
  if (filters.category) params.set("category", filters.category);
  if (filters.dateFrom) params.set("from", filters.dateFrom);
  if (filters.dateTo) params.set("to", filters.dateTo);
  if (filters.q) params.set("q", filters.q);
  const query = params.toString();
  return `/admin/bookings/export${query ? `?${query}` : ""}`;
}

export default async function AdminBookingsPage({ searchParams }: Props) {
  const { accessToken } = await requireAdmin("/admin/bookings");
  const filters: AdminBookingFilters = {
    status: clean(searchParams?.status),
    renterId: clean(searchParams?.renter),
    category: clean(searchParams?.category),
    dateFrom: clean(searchParams?.from),
    dateTo: clean(searchParams?.to),
    q: clean(searchParams?.q)
  };
  const [
    { bookings, error },
    { renters },
    { categories }
  ] = await Promise.all([
    getAdminBookingRequests(accessToken, filters),
    getActiveAdminRenters(accessToken),
    getAdminBookingCategories(accessToken)
  ]);
  const exportHref = buildExportHref(filters);

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-7xl rounded-[30px] bg-cream p-4 shadow-soft sm:p-8">
        <p className="section-kicker">Admin</p>
        <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">Prenotazioni</h1>
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

        <form className="mt-8 grid gap-3 rounded-[28px] border border-ink/10 bg-white/70 p-4 md:grid-cols-[1.4fr_repeat(5,minmax(0,1fr))_auto_auto]" action="/admin/bookings">
          <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-ink/50">
            Cerca
            <input className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink outline-none focus:border-sea/50" name="q" defaultValue={filters.q} placeholder="Codice, cliente, email" />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-ink/50">
            Stato
            <select className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink outline-none focus:border-sea/50" name="status" defaultValue={filters.status}>
              <option value="">Tutti</option>
              {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-ink/50">
            Renter
            <select className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink outline-none focus:border-sea/50" name="renter" defaultValue={filters.renterId}>
              <option value="">Tutti</option>
              {renters.map((renter) => <option key={renter.id} value={renter.id}>{renter.business_name_internal}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-ink/50">
            Categoria
            <select className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink outline-none focus:border-sea/50" name="category" defaultValue={filters.category}>
              <option value="">Tutte</option>
              {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name_it}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-ink/50">
            Da
            <input className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink outline-none focus:border-sea/50" name="from" type="date" defaultValue={filters.dateFrom} />
          </label>
          <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-ink/50">
            A
            <input className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink outline-none focus:border-sea/50" name="to" type="date" defaultValue={filters.dateTo} />
          </label>
          <button className="self-end rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white" type="submit">
            Filtra
          </button>
          <a className="self-end rounded-full border border-ink/10 px-5 py-2.5 text-center text-sm font-bold text-ink/70" href={exportHref}>
            CSV
          </a>
        </form>

        {error ? (
          <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-ink/70">
            Impossibile caricare le prenotazioni. Verifica che l&apos;utente abbia ruolo admin e che le policy Supabase siano applicate.
          </div>
        ) : null}

        {!error && bookings.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-sea/10 bg-white/60 p-8 text-center text-ink/60">
            Nessuna prenotazione trovata.
          </div>
        ) : null}

        {bookings.length > 0 ? (
          <div className="mt-8 overflow-hidden rounded-[28px] border border-ink/10 bg-white/75 shadow-card">
            <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full table-fixed border-collapse text-left text-xs xl:text-sm">
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
          </div>
        ) : null}
      </section>
    </main>
  );
}
