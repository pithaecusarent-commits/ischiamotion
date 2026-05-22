import { toggleAdminVehicleActiveAction } from "@/app/admin/vehicles/actions";
import { signOutAdmin } from "@/app/admin/login/actions";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { getAdminVehicles } from "@/lib/supabase/queries/admin-vehicles";

type Props = {
  searchParams?: {
    created?: string;
    updated?: string;
    error?: string;
  };
};

function formatPrice(value: number | null) {
  if (value === null) return "-";
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

export default async function AdminVehiclesPage({ searchParams }: Props) {
  const { accessToken } = await requireAdmin("/admin/vehicles");
  const { vehicles, error } = await getAdminVehicles(accessToken);

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-7xl rounded-[30px] bg-cream p-8 shadow-soft">
        <p className="section-kicker">Admin</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-bold">Veicoli</h1>
            <p className="mt-4 text-ink/65">Gestione interna dei mezzi reali disponibili su IschiaMotion.</p>
          </div>
          <a className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" href="/admin/vehicles/new">
            Nuovo veicolo
          </a>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="/admin">
            Area admin
          </a>
          <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="/admin/bookings">
            Prenotazioni
          </a>
          <form action={signOutAdmin}>
            <button className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" type="submit">
              Esci
            </button>
          </form>
        </div>

        {searchParams?.created ? (
          <div className="mt-6 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-bold text-green-deep">
            Veicolo creato correttamente.
          </div>
        ) : null}

        {searchParams?.updated ? (
          <div className="mt-6 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-bold text-green-deep">
            Veicolo aggiornato correttamente.
          </div>
        ) : null}

        {searchParams?.error || error ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
            {searchParams?.error || error}
          </div>
        ) : null}

        {!error && vehicles.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-sea/10 bg-white/60 p-8 text-center">
            <h2 className="font-serif text-3xl font-bold">Nessun veicolo</h2>
            <p className="mt-3 text-ink/60">Crea il primo veicolo reale da gestire in admin.</p>
            <a className="mt-5 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" href="/admin/vehicles/new">
              Nuovo veicolo
            </a>
          </div>
        ) : null}

        {vehicles.length > 0 ? (
          <div className="mt-8 overflow-hidden rounded-[28px] border border-ink/10 bg-white/75 shadow-card">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-sea/10 text-[11px] uppercase tracking-[0.14em] text-green-deep">
                  <tr>
                    <th className="px-4 py-4">Foto</th>
                    <th className="px-4 py-4">Titolo pubblico</th>
                    <th className="px-4 py-4">Categoria</th>
                    <th className="px-4 py-4">Prezzo da</th>
                    <th className="px-4 py-4">Pickup point</th>
                    <th className="px-4 py-4">Noleggiatore interno</th>
                    <th className="px-4 py-4">Stato</th>
                    <th className="px-4 py-4">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {vehicles.map((vehicle) => (
                    <tr className="align-top transition-colors hover:bg-sea/5" key={vehicle.id}>
                      <td className="px-4 py-4">
                        {vehicle.image_url ? (
                          <div className="h-16 w-20 overflow-hidden rounded-2xl border border-ink/10 bg-cream">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={vehicle.image_url} alt={vehicle.title_it} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="grid h-16 w-20 place-items-center rounded-2xl border border-ink/10 bg-cream text-[10px] font-bold uppercase tracking-[0.12em] text-ink/35">
                            No foto
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold">{vehicle.title_it}</div>
                        {vehicle.internal_name ? (
                          <div className="mt-1 text-xs font-semibold text-ink/50">{vehicle.internal_name}</div>
                        ) : null}
                      </td>
                      <td className="px-4 py-4 text-ink/70">{vehicle.category_name}</td>
                      <td className="px-4 py-4 text-ink/70">{formatPrice(vehicle.price_from)}</td>
                      <td className="px-4 py-4 text-ink/70">{vehicle.pickup_point_label}</td>
                      <td className="px-4 py-4 text-ink/70">{vehicle.renter_name}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${vehicle.is_active ? "border-sea/20 bg-sea/10 text-green-deep" : "border-stone-200 bg-stone-100 text-stone-700"}`}>
                          {vehicle.is_active ? "Attivo" : "Non attivo"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <a className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-bold text-ink/70 hover:border-sea/30 hover:text-green-deep" href={`/admin/vehicles/${vehicle.id}`}>
                            Modifica
                          </a>
                          <form action={toggleAdminVehicleActiveAction}>
                            <input type="hidden" name="vehicle_id" value={vehicle.id} />
                            <input type="hidden" name="is_active" value={String(!vehicle.is_active)} />
                            <button className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-bold text-ink/70 hover:border-sea/30 hover:text-green-deep" type="submit">
                              {vehicle.is_active ? "Disattiva" : "Attiva"}
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
