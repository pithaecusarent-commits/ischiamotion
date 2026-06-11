import { requestPasswordReset } from "@/app/auth/forgot-password/actions";
import { isRenterPortalEnabled } from "@/lib/renter-portal";

type Props = {
  searchParams?: {
    sent?: string;
  };
};

export default function ForgotPasswordPage({ searchParams }: Props) {
  const renterPortalEnabled = isRenterPortalEnabled();

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-md rounded-[30px] bg-cream p-8 shadow-soft">
        <p className="section-kicker">Accesso</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">Password dimenticata?</h1>
        <p className="mt-4 text-ink/65">Inserisci l&apos;email del tuo account IschiaMotion.</p>

        {searchParams?.sent ? (
          <div className="mt-6 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-bold text-green-deep">
            Se l&apos;email è registrata, riceverai un link per impostare una nuova password.
          </div>
        ) : null}

        <form action={requestPasswordReset} className="mt-8 grid gap-4">
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
          <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" type="submit">
            Invia link di reset
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a className="font-bold text-green-deep hover:text-ink" href="/admin/login">
            Login admin
          </a>
          {renterPortalEnabled ? (
            <a className="font-bold text-green-deep hover:text-ink" href="/renter/login">
              Login partner
            </a>
          ) : null}
        </div>
      </section>
    </main>
  );
}
