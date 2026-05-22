import { signOutAdmin } from "@/app/admin/login/actions";
import { requireAdmin } from "@/lib/supabase/admin-auth";

export default async function AdminPage() {
  const { profile } = await requireAdmin("/admin");

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
          <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="/admin/vehicles">
            Gestione veicoli
          </a>
          <form action={signOutAdmin}>
            <button className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" type="submit">
              Esci
            </button>
          </form>
        </div>
        <p className="mt-6 text-sm text-ink/50">Accesso: {profile.email || "admin"}</p>
      </section>
    </main>
  );
}
