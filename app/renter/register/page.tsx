import { registerRenter } from "@/app/renter/login/actions";
import { PasswordField } from "@/app/admin/login/PasswordField";

type Props = {
  searchParams?: {
    error?: string;
  };
};

export default function RenterRegisterPage({ searchParams }: Props) {
  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-2xl rounded-[30px] bg-cream p-8 shadow-soft">
        <p className="section-kicker">Noleggiatore</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">Registrazione noleggiatore</h1>
        <p className="mt-4 text-ink/65">
          Richiedi l&apos;accesso alla mini-area IschiaMotion. Dopo l&apos;invio, l&apos;admin dovra autorizzare l&apos;account.
        </p>

        {searchParams?.error ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
            {searchParams.error}
          </div>
        ) : null}

        <form action={registerRenter} className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Nome attivita
            <input
              className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
              name="business_name"
              type="text"
              autoComplete="organization"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Referente
            <input
              className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
              name="contact_name"
              type="text"
              autoComplete="name"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Telefono
            <input
              className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
              name="phone"
              type="tel"
              autoComplete="tel"
            />
          </label>

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

          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Conferma password
            <input
              className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
              required
            />
          </label>

          <button className="mt-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" type="submit">
            Invia richiesta
          </button>
        </form>

        <p className="mt-6 text-sm text-ink/60">
          Hai gia un account?{" "}
          <a className="font-bold text-green-deep hover:text-ink" href="/renter/login">
            Accedi
          </a>
        </p>
      </section>
    </main>
  );
}
