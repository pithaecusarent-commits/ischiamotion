import { signInRenter } from "@/app/renter/login/actions";
import { PasswordField } from "@/app/admin/login/PasswordField";
import { isRenterPortalEnabled, renterPortalDisabledMessage } from "@/lib/renter-portal";

type Props = {
  searchParams?: {
    error?: string;
    next?: string;
    registered?: string;
    confirmed?: string;
    disabled?: string;
  };
};

export default function RenterLoginPage({ searchParams }: Props) {
  const portalEnabled = isRenterPortalEnabled();
  const error = searchParams?.error;
  const nextPath = searchParams?.next || "/renter";

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-md rounded-[30px] bg-cream p-8 shadow-soft">
        <p className="section-kicker">Partner</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">
          {portalEnabled ? "Accesso operativo" : "Area partner non attiva"}
        </h1>
        <p className="mt-4 text-ink/65">
          {portalEnabled
            ? "Entra nella mini-area IschiaMotion per disponibilita e check-in."
            : renterPortalDisabledMessage}
        </p>

        {!portalEnabled ? (
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" href="/it">
              Vai al sito
            </a>
            <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="mailto:info@ischiamotion.com">
              Contatta IschiaMotion
            </a>
          </div>
        ) : null}

        {portalEnabled && error ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
            {error}
          </div>
        ) : null}

        {portalEnabled && searchParams?.registered ? (
          <div className="mt-6 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-bold text-green-deep">
            Registrazione ricevuta. L&apos;admin deve autorizzare l&apos;account prima dell&apos;accesso.
          </div>
        ) : null}

        {portalEnabled && searchParams?.confirmed ? (
          <div className="mt-6 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-bold text-green-deep">
            Email confermata. Se l&apos;account e stato approvato puoi accedere.
          </div>
        ) : null}

        {portalEnabled ? (
          <>
            <form action={signInRenter} className="mt-8 grid gap-4">
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

            <p className="mt-3 text-sm text-ink/60">
              Non hai ancora un account?{" "}
              <a className="font-bold text-green-deep hover:text-ink" href="/renter/register">
                Registrati come partner
              </a>
            </p>
          </>
        ) : null}
      </section>
    </main>
  );
}
