import { completeFirstRenterPasswordChange } from "@/app/renter/change-password/actions";
import { requireRenter } from "@/lib/supabase/renter-auth";

type Props = {
  searchParams?: {
    error?: string;
    next?: string;
  };
};

export default async function RenterChangePasswordPage({ searchParams }: Props) {
  const session = await requireRenter("/renter/change-password");

  if (session.denied) {
    return (
      <main className="min-h-screen bg-sand p-6 text-ink">
        <section className="mx-auto max-w-xl rounded-[30px] bg-cream p-8 shadow-soft">
          <p className="section-kicker">Accesso scaduto</p>
          <h1 className="mt-3 font-serif text-4xl font-bold">Contatta IschiaMotion</h1>
          <p className="mt-4 text-ink/65">
            L&apos;accesso temporaneo non è più valido. Richiedi un nuovo invito al team IschiaMotion.
          </p>
          <a className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" href="/renter/login">
            Torna al login
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-xl rounded-[30px] bg-cream p-8 shadow-soft">
        <p className="section-kicker">Primo accesso</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">Imposta la tua password</h1>
        <p className="mt-4 text-ink/65">
          Per entrare nella dashboard partner devi scegliere una nuova password personale.
        </p>

        {searchParams?.error ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
            {searchParams.error}
          </div>
        ) : null}

        <form action={completeFirstRenterPasswordChange} className="mt-8 grid gap-4">
          <input type="hidden" name="next" value={searchParams?.next || "/renter"} />
          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Nuova password
            <input
              className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
              name="password"
              type="password"
              autoComplete="new-password"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Conferma nuova password
            <input
              className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
              required
            />
          </label>
          <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" type="submit">
            Salva password
          </button>
        </form>
      </section>
    </main>
  );
}
