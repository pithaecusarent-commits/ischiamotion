import { updateAdminPassword } from "@/app/admin/account/actions";
import { signOutAdmin } from "@/app/admin/login/actions";
import { LoggedInPasswordForm } from "@/components/auth/LoggedInPasswordForm";
import { requireAdmin } from "@/lib/supabase/admin-auth";

type Props = {
  searchParams?: {
    error?: string;
    updated?: string;
  };
};

export default async function AdminAccountPage({ searchParams }: Props) {
  const { profile } = await requireAdmin("/admin/account");

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-md rounded-[30px] bg-cream p-8 shadow-soft">
        <p className="section-kicker">Admin</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">Account</h1>
        <p className="mt-4 text-ink/65">Cambia la password del tuo accesso IschiaMotion.</p>
        <p className="mt-3 text-sm text-ink/50">Accesso: {profile.email || "admin"}</p>

        {searchParams?.updated ? (
          <div className="mt-6 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-bold text-green-deep">
            Password aggiornata correttamente.
          </div>
        ) : null}

        {searchParams?.error ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
            {searchParams.error}
          </div>
        ) : null}

        <LoggedInPasswordForm action={updateAdminPassword} />

        <div className="mt-6 flex flex-wrap gap-3">
          <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="/admin">
            Area admin
          </a>
          <form action={signOutAdmin}>
            <button className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" type="submit">
              Esci
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
