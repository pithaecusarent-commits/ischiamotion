import { approveRenterAction, rejectRenterAction } from "@/app/admin/renters/actions";
import { signOutAdmin } from "@/app/admin/login/actions";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { getAdminRenterApplications, type AdminRenterApplication } from "@/lib/supabase/queries/admin-renters";

type Props = {
  searchParams?: {
    approved?: string;
    rejected?: string;
    error?: string;
  };
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function statusLabel(status: AdminRenterApplication["account_status"]) {
  if (status === "approved") return "Approvato";
  if (status === "rejected") return "Rifiutato";
  return "In attesa";
}

function statusClass(status: AdminRenterApplication["account_status"]) {
  if (status === "approved") return "border-sea/20 bg-sea/10 text-green-deep";
  if (status === "rejected") return "border-red-200 bg-red-50 text-red-700";
  return "border-amber-200 bg-amber-50 text-amber-800";
}

export default async function AdminRentersPage({ searchParams }: Props) {
  const { accessToken } = await requireAdmin("/admin/renters");
  const { applications, error } = await getAdminRenterApplications(accessToken);
  const pendingCount = applications.filter((item) => item.account_status === "pending").length;

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-7xl rounded-[30px] bg-cream p-8 shadow-soft">
        <p className="section-kicker">Admin</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-bold">Noleggiatori</h1>
            <p className="mt-4 text-ink/65">Autorizza le nuove registrazioni dei renter IschiaMotion.</p>
          </div>
          <div className="rounded-[24px] border border-ink/10 bg-white/70 px-5 py-4 text-right">
            <p className="section-kicker">In attesa</p>
            <p className="mt-1 text-3xl font-bold">{pendingCount}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="/admin">
            Area admin
          </a>
          <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="/admin/bookings">
            Prenotazioni
          </a>
          <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="/admin/vehicles">
            Veicoli
          </a>
          <form action={signOutAdmin}>
            <button className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" type="submit">
              Esci
            </button>
          </form>
        </div>

        {searchParams?.approved ? (
          <div className="mt-6 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-bold text-green-deep">
            Noleggiatore approvato e collegato correttamente.
          </div>
        ) : null}

        {searchParams?.rejected ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">
            Registrazione rifiutata.
          </div>
        ) : null}

        {searchParams?.error || error ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
            {searchParams?.error || error}
          </div>
        ) : null}

        {!error && applications.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-sea/10 bg-white/60 p-8 text-center">
            <h2 className="font-serif text-3xl font-bold">Nessuna registrazione</h2>
            <p className="mt-3 text-ink/60">Le richieste dei noleggiatori compariranno qui.</p>
          </div>
        ) : null}

        {applications.length > 0 ? (
          <div className="mt-8 overflow-hidden rounded-[28px] border border-ink/10 bg-white/75 shadow-card">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-sea/10 text-[11px] uppercase tracking-[0.14em] text-green-deep">
                  <tr>
                    <th className="px-4 py-4">Attivita</th>
                    <th className="px-4 py-4">Referente</th>
                    <th className="px-4 py-4">Contatti</th>
                    <th className="px-4 py-4">Richiesta</th>
                    <th className="px-4 py-4">Stato</th>
                    <th className="px-4 py-4">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {applications.map((application) => (
                    <tr className="align-top transition-colors hover:bg-sea/5" key={application.id}>
                      <td className="px-4 py-4">
                        <div className="font-bold">{application.business_name || "Noleggiatore"}</div>
                        <div className="mt-1 text-xs font-semibold text-ink/50">{application.email || "-"}</div>
                      </td>
                      <td className="px-4 py-4 text-ink/70">{application.contact_name || "-"}</td>
                      <td className="px-4 py-4 text-ink/70">{application.phone || "-"}</td>
                      <td className="px-4 py-4 text-ink/70">{formatDate(application.created_at)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusClass(application.account_status)}`}>
                          {statusLabel(application.account_status)}
                        </span>
                        {application.rejection_reason ? (
                          <div className="mt-2 max-w-xs text-xs text-ink/50">{application.rejection_reason}</div>
                        ) : null}
                      </td>
                      <td className="px-4 py-4">
                        {application.account_status === "pending" ? (
                          <div className="grid min-w-64 gap-2">
                            <form action={approveRenterAction}>
                              <input type="hidden" name="profile_id" value={application.id} />
                              <button className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-white" type="submit">
                                Approva
                              </button>
                            </form>
                            <form action={rejectRenterAction} className="flex flex-wrap gap-2">
                              <input type="hidden" name="profile_id" value={application.id} />
                              <input
                                className="min-w-0 flex-1 rounded-full border border-ink/10 bg-white/80 px-3 py-2 text-xs text-ink outline-none focus:border-sea/50"
                                name="reason"
                                placeholder="Motivo opzionale"
                                type="text"
                              />
                              <button className="rounded-full border border-ink/10 px-4 py-2 text-xs font-bold text-ink/70" type="submit">
                                Rifiuta
                              </button>
                            </form>
                          </div>
                        ) : (
                          <span className="text-xs text-ink/45">
                            {application.account_status === "approved"
                              ? `Approvato ${formatDate(application.approved_at)}`
                              : `Rifiutato ${formatDate(application.rejected_at)}`}
                          </span>
                        )}
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
