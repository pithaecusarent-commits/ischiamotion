import { submitRenterCheckin } from "@/app/renter/checkin/actions";
import { AccessDenied, RenterShell } from "@/app/renter/renter-ui";
import { requireRenter } from "@/lib/supabase/renter-auth";

type Props = {
  searchParams?: {
    outcome?: string;
    message?: string;
    booking?: string;
  };
};

function messageTone(outcome?: string) {
  if (outcome === "checked_in") {
    return "border-green-deep/20 bg-green-deep/10 text-green-deep";
  }

  if (outcome === "already_checked_in") {
    return "border-sea/20 bg-sea/10 text-green-deep";
  }

  return "border-amber-200 bg-amber-50 text-ink/70";
}

export default async function RenterCheckinPage({ searchParams }: Props) {
  const session = await requireRenter("/renter/checkin");

  if (session.denied) {
    return <AccessDenied accountStatus={session.profile?.account_status} />;
  }

  return (
    <RenterShell title="Check-in voucher">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <section className="rounded-[28px] border border-ink/10 bg-white/70 p-6">
          <h2 className="font-serif text-3xl font-bold">Inserisci codice voucher</h2>
          <form action={submitRenterCheckin} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-ink/70">
              Codice voucher
              <input
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-base font-normal uppercase text-ink outline-none focus:border-sea/50"
                name="voucherCode"
                placeholder="IM-2026-..."
                autoComplete="off"
                required
              />
            </label>
            <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" type="submit">
              Registra check-in
            </button>
          </form>
        </section>

        <aside className="rounded-[28px] border border-ink/10 bg-cream p-6">
          <p className="section-kicker">Esito</p>
          {searchParams?.message ? (
            <div className={`mt-5 rounded-3xl border p-4 text-sm font-bold ${messageTone(searchParams.outcome)}`}>
              {searchParams.message}
              {searchParams.booking ? <span className="mt-2 block text-xs">Prenotazione: {searchParams.booking}</span> : null}
            </div>
          ) : (
            <p className="mt-5 text-sm leading-6 text-ink/65">
              Inserisci un codice voucher per verificare che appartenga al tuo noleggio e registrare il check-in.
            </p>
          )}
        </aside>
      </div>
    </RenterShell>
  );
}
