import { signInAdmin } from "@/app/admin/login/actions";
import { PasswordField } from "@/app/admin/login/PasswordField";

type Props = {
  searchParams?: {
    error?: string;
    next?: string;
  };
};

export default function AdminLoginPage({ searchParams }: Props) {
  const error = searchParams?.error;
  const nextPath = searchParams?.next || "/admin";

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-md rounded-[30px] bg-cream p-8 shadow-soft">
        <p className="section-kicker">Admin</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">Accesso admin</h1>
        <p className="mt-4 text-ink/65">Accedi con un utente autorizzato per gestire IschiaMotion.</p>

        {error ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
            {error}
          </div>
        ) : null}

        <form action={signInAdmin} className="mt-8 grid gap-4">
          <input type="hidden" name="next" value={nextPath} />
          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Email
            <input
              className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </label>
          <PasswordField />
          <button className="mt-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" type="submit">
            Entra
          </button>
        </form>

        <p className="mt-6 text-sm text-ink/60">
          <a className="font-bold text-green-deep hover:text-ink" href="/auth/forgot-password">
            Password dimenticata?
          </a>
        </p>
      </section>
    </main>
  );
}
