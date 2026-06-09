import { PriceRulesSection } from "@/app/renter/availability/PriceRulesSection";
import { AccessDenied, EmptyState, RenterShell } from "@/app/renter/renter-ui";
import { requireRenter } from "@/lib/supabase/renter-auth";
import { getRenterPriceRules, getRenterVehicles } from "@/lib/supabase/queries/renter";

type Props = {
  searchParams?: {
    error?: string;
    saved?: string;
  };
};

export default async function RenterPricingPage({ searchParams }: Props) {
  const session = await requireRenter("/renter/pricing");

  if (session.denied) {
    return <AccessDenied accountStatus={session.profile?.account_status} />;
  }

  const [
    { vehicles, error: vehiclesError },
    { rules, error: rulesError }
  ] = await Promise.all([
    getRenterVehicles(session.accessToken),
    getRenterPriceRules(session.accessToken)
  ]);
  const pageError = vehiclesError || rulesError;

  return (
    <RenterShell title="Listino stagionale">
      {searchParams?.saved ? (
        <div className="mb-5 rounded-3xl border border-green-deep/20 bg-green-deep/10 p-4 text-sm font-bold text-green-deep">
          Listino aggiornato.
        </div>
      ) : null}

      {searchParams?.error || pageError ? (
        <div className="mb-5 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
          {searchParams?.error || pageError}
        </div>
      ) : null}

      <div className="mb-5 rounded-[28px] border border-ink/10 bg-white/70 p-5">
        <h2 className="font-serif text-3xl font-bold">Prezzi dal/al</h2>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          Inserisci le fasce di prezzo per stagione su ogni mezzo. Nei risultati pubblici, quando il cliente seleziona le date, viene mostrato il prezzo stagionale attivo nel periodo richiesto.
        </p>
      </div>

      {vehicles.length === 0 ? (
        <EmptyState
          title="Nessun veicolo assegnato"
          text="Aggiungi o assegna almeno un mezzo prima di compilare il listino."
        />
      ) : (
        <PriceRulesSection vehicles={vehicles} rules={rules} returnPath="/renter/pricing" />
      )}
    </RenterShell>
  );
}
