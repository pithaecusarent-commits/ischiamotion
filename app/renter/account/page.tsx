import { updateRenterPassword } from "@/app/renter/account/actions";
import { AccessDenied, RenterShell } from "@/app/renter/renter-ui";
import { LoggedInPasswordForm } from "@/components/auth/LoggedInPasswordForm";
import { requireRenter } from "@/lib/supabase/renter-auth";

type Props = {
  searchParams?: {
    error?: string;
    updated?: string;
  };
};

export default async function RenterAccountPage({ searchParams }: Props) {
  const session = await requireRenter("/renter/account");

  if (session.denied) {
    return <AccessDenied accountStatus={session.profile?.account_status} />;
  }

  return (
    <RenterShell title="Account">
      <section className="max-w-md rounded-[28px] border border-ink/10 bg-white/70 p-6">
        <h2 className="font-serif text-3xl font-bold">Cambia password</h2>
        <p className="mt-3 text-sm text-ink/60">Accesso: {session.profile?.email || "noleggiatore"}</p>

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

        <LoggedInPasswordForm action={updateRenterPassword} />
      </section>
    </RenterShell>
  );
}
