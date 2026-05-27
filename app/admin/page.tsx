import { signOutAdmin } from "@/app/admin/login/actions";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { getPendingRenterApplicationCount } from "@/lib/supabase/queries/admin-renters";

export default async function AdminPage() {
  const { accessToken, profile } = await requireAdmin("/admin");
  const { count: pendingRenterCount, error: pendingRenterError } = await getPendingRenterApplicationCount(accessToken);

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-3xl rounded-[30px] bg-cream p-8 shadow-soft">
        <p className="section-kicker">Admin</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">Area admin IschiaMotion</h1>
        <p className="mt-4 text-ink/65">Gestione veicoli, prenotazioni e operazioni IschiaMotion.</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" href="/admin/bookings">
            Vedi prenotazioni
          </a>
          <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="/admin/renters">
            Noleggiatori{pendingRenterCount > 0 ? ` (${pendingRenterCount})` : ""}
          </a>
          <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="/admin/vehicles">
            Gestione veicoli
          </a>
          <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="/admin/account">
            Account
          </a>
          <form action={signOutAdmin}>
            <button className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" type="submit">
              Esci
            </button>
          </form>
        </div>

        <div className="mt-8 rounded-[28px] border border-ink/10 bg-white/70 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="section-kicker">Richieste noleggiatori</p>
              <h2 className="mt-3 font-serif text-3xl font-bold">Richieste noleggiatori</h2>
              <p className="mt-3 text-sm leading-6 text-ink/65">
                {pendingRenterError
                  ? pendingRenterError
                  : pendingRenterCount > 0
                    ? `Ci sono ${pendingRenterCount} richieste di noleggiatori in attesa di approvazione.`
                    : "Nessuna richiesta noleggiatore in attesa."}
              </p>
            </div>
            <a className="inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" href="/admin/renters">
              Vai alle richieste
            </a>
          </div>
        </div>

        <p className="mt-6 text-sm text-ink/50">Accesso: {profile.email || "admin"}</p>
      </section>
    </main>
  );
}
