import { approveRenterAction, deactivateRenterAction, rejectRenterAction } from "@/app/admin/renters/actions";
import { DeactivateRenterForm } from "@/app/admin/renters/DeactivateRenterForm";
import { signOutAdmin } from "@/app/admin/login/actions";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { getRenterDetailByProfileId, type AdminRenterDetail } from "@/lib/supabase/queries/admin-renters";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
  searchParams?: { approved?: string; rejected?: string; disabled?: string; error?: string };
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("it-IT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function statusLabel(status: AdminRenterDetail["profile"]["account_status"]) {
  if (status === "approved") return "Approvato";
  if (status === "rejected") return "Rifiutato";
  if (status === "disabled") return "Disattivato";
  return "In attesa";
}

function statusClass(status: AdminRenterDetail["profile"]["account_status"]) {
  if (status === "approved") return "border-sea/20 bg-sea/10 text-green-deep";
  if (status === "rejected") return "border-red-200 bg-red-50 text-red-700";
  if (status === "disabled") return "border-ink/10 bg-ink/5 text-ink/55";
  return "border-amber-200 bg-amber-50 text-amber-800";
}

export default async function AdminRenterDetailPage({ params, searchParams }: Props) {
  const { accessToken } = await requireAdmin(`/admin/renters/${params.id}`);
  const { detail, error } = await getRenterDetailByProfileId(accessToken, params.id);

  if (!detail) {
    notFound();
  }

  const { profile, renter, vehicles, bookingStats } = detail;
  const displayName = renter?.business_name_internal || profile.business_name || "Noleggiatore";
  const initial = displayName.slice(0, 1).toUpperCase();

  return (
    <main className="min-h-screen bg-sand p-4 text-ink sm:p-6">
      <section className="mx-auto max-w-5xl">

        {/* Back + nav */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <a
            className="rounded-full border border-ink/10 px-4 py-2 text-sm font-bold text-ink/65 transition hover:border-sea/30 hover:text-sea"
            href="/admin/renters"
          >
            ← Noleggiatori
          </a>
          <a
            className="rounded-full border border-ink/10 px-4 py-2 text-sm font-bold text-ink/65 transition hover:border-sea/30 hover:text-sea"
            href="/admin"
          >
            Dashboard
          </a>
          <form action={signOutAdmin} className="ml-auto">
            <button
              className="rounded-full border border-ink/10 px-4 py-2 text-sm font-bold text-ink/55 transition hover:border-ink/20 hover:text-ink"
              type="submit"
            >
              Esci
            </button>
          </form>
        </div>

        {/* Flash messages */}
        {searchParams?.approved && (
          <div className="mb-5 rounded-2xl border border-sea/20 bg-sea/10 p-4 text-sm font-bold text-green-deep">
            Noleggiatore approvato e collegato correttamente.
          </div>
        )}
        {searchParams?.rejected && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">
            Registrazione rifiutata.
          </div>
        )}
        {searchParams?.disabled && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
            Noleggiatore disattivato. Lo storico resta disponibile.
          </div>
        )}
        {(searchParams?.error || error) && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
            {searchParams?.error || error}
          </div>
        )}

        {/* Hero identity card */}
        <div className="rounded-2xl border border-ink/10 bg-gradient-to-br from-white via-cream to-mint/20 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-green-deep text-2xl font-black text-white shadow-sm">
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-3xl font-bold text-ink">{displayName}</h1>
                <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(profile.account_status)}`}>
                  {statusLabel(profile.account_status)}
                </span>
              </div>
              {renter && renter.business_name_internal !== profile.business_name && (
                <p className="mt-1 text-sm font-semibold text-ink/50">
                  Profilo: {profile.business_name || "-"}
                </p>
              )}
              <div className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
                <p className="text-ink/60">
                  <span className="font-black">Email:</span> {profile.email || "-"}
                </p>
                <p className="text-ink/60">
                  <span className="font-black">Referente:</span> {profile.contact_name || "-"}
                </p>
                <p className="text-ink/60">
                  <span className="font-black">Telefono:</span> {profile.phone || "-"}
                </p>
                <p className="text-ink/60">
                  <span className="font-black">Registrato:</span> {formatDate(profile.created_at)}
                </p>
                {profile.approved_at && (
                  <p className="text-ink/60">
                    <span className="font-black">Approvato:</span> {formatDate(profile.approved_at)}
                  </p>
                )}
                {profile.rejected_at && (
                  <p className="text-ink/60">
                    <span className="font-black">Rifiutato:</span> {formatDate(profile.rejected_at)}
                  </p>
                )}
                {profile.rejection_reason && (
                  <p className="col-span-2 text-ink/60">
                    <span className="font-black">Motivo:</span> {profile.rejection_reason}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 border-t border-ink/10 pt-5">
            {profile.account_status === "pending" ? (
              <div className="flex flex-wrap gap-3">
                <form action={approveRenterAction}>
                  <input type="hidden" name="profile_id" value={profile.id} />
                  <button
                    className="rounded-full bg-green-deep px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sea"
                    type="submit"
                  >
                    Approva noleggiatore
                  </button>
                </form>
                <form action={rejectRenterAction} className="flex flex-wrap gap-2">
                  <input type="hidden" name="profile_id" value={profile.id} />
                  <input
                    className="min-w-[180px] rounded-full border border-ink/10 bg-white/80 px-4 py-2.5 text-sm text-ink outline-none focus:border-sea/50"
                    name="reason"
                    placeholder="Motivo opzionale"
                    type="text"
                  />
                  <button
                    className="rounded-full border border-ink/10 px-5 py-2.5 text-sm font-bold text-ink/65 transition hover:border-ink/20 hover:text-ink"
                    type="submit"
                  >
                    Rifiuta
                  </button>
                </form>
                <DeactivateRenterForm action={deactivateRenterAction} profileId={profile.id} />
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs font-semibold text-ink/45">
                  {profile.account_status === "approved"
                    ? `Approvato il ${formatDate(profile.approved_at)}`
                    : profile.account_status === "rejected"
                      ? `Rifiutato il ${formatDate(profile.rejected_at)}`
                      : "Accesso disattivato"}
                </p>
                {profile.account_status !== "disabled" && (
                  <DeactivateRenterForm action={deactivateRenterAction} profileId={profile.id} />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-[1fr_280px]">
          {/* Vehicles list */}
          <section className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-sea/70">Catalogo</p>
                <h2 className="mt-1.5 font-serif text-xl font-bold text-green-deep">Mezzi assegnati</h2>
                <p className="mt-1 text-xs font-semibold leading-5 text-ink/50">
                  {vehicles.length === 0
                    ? "Nessun mezzo ancora associato a questo partner."
                    : `${vehicles.filter((v) => v.is_active).length} attivi su ${vehicles.length} totali`}
                </p>
              </div>
              <a
                className="shrink-0 rounded-full border border-ink/10 bg-white/80 px-3.5 py-1.5 text-xs font-bold text-ink/55 transition hover:border-sea/30 hover:text-sea"
                href="/admin/vehicles"
              >
                Tutti i mezzi
              </a>
            </div>

            {vehicles.length === 0 ? (
              <div className="mt-4 rounded-xl border border-ink/10 bg-sand/40 p-4 text-xs font-semibold text-ink/50">
                Nessun mezzo associato. Aggiungi un veicolo assegnandolo a questo noleggiatore.
              </div>
            ) : (
              <div className="mt-4 grid gap-2">
                {vehicles.map((vehicle) => (
                  <a
                    className="group flex items-center gap-3 rounded-xl border border-ink/10 bg-gradient-to-br from-sand/30 to-white p-3.5 transition hover:-translate-y-0.5 hover:border-sea/25 hover:shadow-sm"
                    href={`/admin/vehicles/${vehicle.id}`}
                    key={vehicle.id}
                  >
                    <span
                      aria-hidden="true"
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-black ${
                        vehicle.is_active ? "bg-sea/10 text-sea" : "bg-ink/5 text-ink/35"
                      }`}
                    >
                      M
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink">{vehicle.title_it}</p>
                      {vehicle.vehicle_categories && (
                        <p className="mt-0.5 text-xs font-semibold text-ink/45">
                          {vehicle.vehicle_categories.name_it}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-black ${
                          vehicle.is_active
                            ? "border-sea/20 bg-sea/10 text-sea"
                            : "border-ink/10 bg-ink/5 text-ink/40"
                        }`}
                      >
                        {vehicle.is_active ? "Attivo" : "Inattivo"}
                      </span>
                      <span className="rounded-full bg-sea/10 px-2 py-0.5 text-[10px] font-black text-sea transition group-hover:bg-sea/15">
                        Apri →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <a
                className="rounded-full bg-green-deep px-4 py-2 text-xs font-bold text-white transition hover:bg-sea"
                href="/admin/vehicles/new"
              >
                + Aggiungi mezzo
              </a>
            </div>
          </section>

          {/* Booking stats */}
          <section className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sea/70">Statistiche</p>
            <h2 className="mt-1.5 font-serif text-xl font-bold text-green-deep">Booking</h2>
            <p className="mt-1 text-xs font-semibold leading-5 text-ink/50">
              Storico richieste assegnate a questo partner.
            </p>

            {bookingStats.total === 0 ? (
              <div className="mt-4 rounded-xl border border-ink/10 bg-sand/40 p-4 text-xs font-semibold text-ink/50">
                Nessun booking ancora assegnato a questo noleggiatore.
              </div>
            ) : (
              <div className="mt-4 grid gap-2.5">
                {[
                  { label: "Totale richieste", value: bookingStats.total, color: "bg-ink/10 text-ink" },
                  { label: "Confermati / attivi", value: bookingStats.confirmed, color: "bg-sea/10 text-sea" },
                  { label: "In attesa", value: bookingStats.pending, color: "bg-gold/15 text-amber-700" },
                  { label: "Completati", value: bookingStats.completed, color: "bg-mint/30 text-green-deep" },
                  { label: "Annullati / no-show", value: bookingStats.cancelled, color: "bg-red-50 text-red-600" },
                ].map((row) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-sand/30 px-3.5 py-2.5"
                    key={row.label}
                  >
                    <span className="text-xs font-semibold text-ink/60">{row.label}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${row.color}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <a
                className="block w-full rounded-full border border-ink/10 py-2.5 text-center text-xs font-bold text-ink/55 transition hover:border-sea/30 hover:text-sea"
                href="/admin/bookings"
              >
                Vai a tutti i booking →
              </a>
            </div>
          </section>
        </div>

        {/* Internal renter record (if linked) */}
        {renter && (
          <section className="mt-5 rounded-2xl border border-ink/10 bg-gradient-to-br from-mint/10 via-white to-cream p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sea/70">Record interno</p>
            <h2 className="mt-1.5 font-serif text-xl font-bold text-green-deep">Dati renter</h2>
            <div className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
              <p className="text-ink/60">
                <span className="font-black">Nome interno:</span> {renter.business_name_internal || "-"}
              </p>
              <p className="text-ink/60">
                <span className="font-black">Email record:</span> {renter.email || "-"}
              </p>
              <p className="text-ink/60">
                <span className="font-black">Telefono record:</span> {renter.phone || "-"}
              </p>
              <p className="text-ink/60">
                <span className="font-black">Stato renter:</span>{" "}
                <span className="capitalize">{renter.status}</span>
              </p>
            </div>
          </section>
        )}

      </section>
    </main>
  );
}
