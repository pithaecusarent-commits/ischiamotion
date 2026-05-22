import {
  createRenterAvailabilityRuleAction,
  deleteRenterAvailabilityRuleAction,
  saveRenterAvailability,
  saveRenterDeliveryCapability
} from "@/app/renter/availability/actions";
import { AccessDenied, EmptyState, RenterShell } from "@/app/renter/renter-ui";
import { deliveryMethodLabels } from "@/lib/booking-labels";
import { requireRenter } from "@/lib/supabase/renter-auth";
import {
  getRenterAvailability,
  getRenterAvailabilityRules,
  getRenterDeliveryCapabilities,
  getRenterVehicles
} from "@/lib/supabase/queries/renter";

type Props = {
  searchParams?: {
    error?: string;
    saved?: string;
  };
};

export default async function RenterAvailabilityPage({ searchParams }: Props) {
  const session = await requireRenter("/renter/availability");

  if (session.denied) {
    return <AccessDenied />;
  }

  const [
    { availability, error },
    { capabilities, error: capabilitiesError },
    { vehicles, error: vehiclesError },
    { rules, error: rulesError }
  ] = await Promise.all([
    getRenterAvailability(session.accessToken),
    getRenterDeliveryCapabilities(session.accessToken),
    getRenterVehicles(session.accessToken),
    getRenterAvailabilityRules(session.accessToken)
  ]);
  const pageError = error || capabilitiesError || vehiclesError || rulesError;

  return (
    <RenterShell title="Disponibilita categorie">
      {searchParams?.saved ? (
        <div className="mb-5 rounded-3xl border border-green-deep/20 bg-green-deep/10 p-4 text-sm font-bold text-green-deep">
          Disponibilita aggiornata.
        </div>
      ) : null}

      {searchParams?.error || pageError ? (
        <div className="mb-5 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
          {searchParams?.error || pageError}
        </div>
      ) : null}

      {!pageError && availability.length === 0 && capabilities.length === 0 ? (
        <EmptyState
          title="Nessun noleggio collegato"
          text="Collega questo utente a un renter per gestire le disponibilita."
        />
      ) : null}

      <div className="mb-4">
        <h2 className="font-serif text-3xl font-bold">Categorie veicolo</h2>
      </div>

      <div className="grid gap-4">
        {availability.map((item) => (
          <form
            action={saveRenterAvailability}
            key={item.category_id}
            className="rounded-[28px] border border-ink/10 bg-white/70 p-5"
          >
            <input type="hidden" name="renterId" value={item.renter_id} />
            <input type="hidden" name="categoryId" value={item.category_id} />
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold">{item.category_name}</h2>
                <p className="mt-1 text-sm text-ink/55">
                  Stato attuale:{" "}
                  <span className={item.is_open ? "font-bold text-green-deep" : "font-bold text-red-700"}>
                    {item.is_open ? "Aperto" : "Chiuso"}
                  </span>
                </p>
              </div>
              <div className="flex rounded-full border border-ink/10 bg-cream p-1">
                <label className="cursor-pointer rounded-full px-4 py-2 text-sm font-bold has-[:checked]:bg-green-deep has-[:checked]:text-white">
                  <input className="sr-only" type="radio" name="isOpen" value="true" defaultChecked={item.is_open} />
                  Aperto
                </label>
                <label className="cursor-pointer rounded-full px-4 py-2 text-sm font-bold has-[:checked]:bg-ink has-[:checked]:text-white">
                  <input className="sr-only" type="radio" name="isOpen" value="false" defaultChecked={!item.is_open} />
                  Chiuso
                </label>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
                name="reason"
                placeholder="Motivo opzionale"
                defaultValue={item.reason || ""}
              />
              <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" type="submit">
                Salva
              </button>
            </div>
          </form>
        ))}
      </div>

      {capabilities.length > 0 ? (
        <>
          <div className="mb-4 mt-8">
            <h2 className="font-serif text-3xl font-bold">Ritiro e consegna</h2>
            <p className="mt-2 text-sm text-ink/60">
              Queste capacita serviranno per filtrare i noleggiatori compatibili quando i veicoli saranno collegati al database.
            </p>
          </div>
          <div className="grid gap-4">
            {capabilities.map((item) => (
              <form
                action={saveRenterDeliveryCapability}
                key={item.delivery_method}
                className="rounded-[28px] border border-ink/10 bg-white/70 p-5"
              >
                <input type="hidden" name="renterId" value={item.renter_id} />
                <input type="hidden" name="deliveryMethod" value={item.delivery_method} />
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <h3 className="font-serif text-2xl font-bold">{deliveryMethodLabels.it[item.delivery_method]}</h3>
                    <p className="mt-1 text-sm text-ink/55">
                      Stato attuale:{" "}
                      <span className={item.is_enabled ? "font-bold text-green-deep" : "font-bold text-red-700"}>
                        {item.is_enabled ? "Abilitato" : "Disabilitato"}
                      </span>
                    </p>
                  </div>
                  <div className="flex rounded-full border border-ink/10 bg-cream p-1">
                    <label className="cursor-pointer rounded-full px-4 py-2 text-sm font-bold has-[:checked]:bg-green-deep has-[:checked]:text-white">
                      <input className="sr-only" type="radio" name="isEnabled" value="true" defaultChecked={item.is_enabled} />
                      Abilitato
                    </label>
                    <label className="cursor-pointer rounded-full px-4 py-2 text-sm font-bold has-[:checked]:bg-ink has-[:checked]:text-white">
                      <input className="sr-only" type="radio" name="isEnabled" value="false" defaultChecked={!item.is_enabled} />
                      Disabilitato
                    </label>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
                    name="zones"
                    placeholder="Zone opzionali, separate da virgola"
                    defaultValue={item.zones.join(", ")}
                  />
                  <input
                    className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
                    name="notes"
                    placeholder="Note operative opzionali"
                    defaultValue={item.notes || ""}
                  />
                  <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" type="submit">
                    Salva
                  </button>
                </div>
              </form>
            ))}
          </div>
        </>
      ) : null}

      <div className="mb-4 mt-8">
        <h2 className="font-serif text-3xl font-bold">Calendario disponibilità mezzi</h2>
        <p className="mt-2 text-sm text-ink/60">
          Chiudi date non disponibili o imposta un minimo giorni noleggio per singolo mezzo.
        </p>
      </div>

      {vehicles.length === 0 ? (
        <EmptyState
          title="Nessun veicolo assegnato"
          text="Nessun veicolo assegnato al tuo noleggio."
        />
      ) : (
        <div className="grid gap-5">
          <form action={createRenterAvailabilityRuleAction} className="rounded-[28px] border border-ink/10 bg-white/70 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-ink/70">
                Veicolo
                <select
                  className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
                  name="vehicle"
                  required
                >
                  <option value="">Seleziona veicolo</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={`${vehicle.id}|${vehicle.renter_id}`}>
                      {vehicle.title_it}{vehicle.internal_name ? ` - ${vehicle.internal_name}` : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-ink/70">
                Minimo giorni noleggio
                <input
                  className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
                  name="minStayDays"
                  type="number"
                  min="1"
                  defaultValue="1"
                />
              </label>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-ink/70">
                Data inizio
                <input className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50" name="dateFrom" type="date" required />
              </label>
              <label className="grid gap-2 text-sm font-bold text-ink/70">
                Data fine
                <input className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50" name="dateTo" type="date" required />
              </label>
            </div>
            <label className="mt-4 inline-flex items-center gap-3 text-sm font-bold text-ink/70">
              <input className="h-5 w-5" name="isClosed" type="checkbox" defaultChecked />
              Chiudi disponibilità per queste date
            </label>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
                name="notes"
                placeholder="Note operative opzionali"
              />
              <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" type="submit">
                Salva regola
              </button>
            </div>
          </form>

          {rules.length > 0 ? (
            <div className="overflow-hidden rounded-[28px] border border-ink/10 bg-white/70">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-cream text-xs uppercase tracking-[0.12em] text-ink/50">
                    <tr>
                      <th className="px-5 py-4">Veicolo</th>
                      <th className="px-5 py-4">Dal / al</th>
                      <th className="px-5 py-4">Chiuso</th>
                      <th className="px-5 py-4">Min stay</th>
                      <th className="px-5 py-4">Note</th>
                      <th className="px-5 py-4">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10">
                    {rules.map((rule) => (
                      <tr key={rule.id}>
                        <td className="px-5 py-4 font-semibold">
                          {rule.vehicles?.title_it || "-"}
                          {rule.vehicles?.internal_name ? <span className="block text-xs text-ink/50">{rule.vehicles.internal_name}</span> : null}
                        </td>
                        <td className="px-5 py-4">{rule.date_from} / {rule.date_to}</td>
                        <td className="px-5 py-4">{rule.is_closed ? "Sì" : "No"}</td>
                        <td className="px-5 py-4">{rule.min_stay_days} giorni</td>
                        <td className="px-5 py-4">{rule.notes || "-"}</td>
                        <td className="px-5 py-4">
                          <form action={deleteRenterAvailabilityRuleAction}>
                            <input type="hidden" name="ruleId" value={rule.id} />
                            <button className="rounded-full border border-ink/10 px-4 py-2 text-xs font-bold text-ink/65 hover:border-sea/30 hover:text-green-deep" type="submit">
                              Elimina
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-[28px] border border-ink/10 bg-white/70 p-6 text-sm text-ink/60">
              Nessuna regola calendario creata.
            </div>
          )}
        </div>
      )}
    </RenterShell>
  );
}
