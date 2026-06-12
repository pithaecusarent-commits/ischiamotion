import { toggleVehicleModelStatusAction } from "@/app/admin/vehicle-models/actions";
import { signOutAdmin } from "@/app/admin/login/actions";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { getAdminVehicleModels } from "@/lib/supabase/queries/admin-vehicle-models";

type Props = {
  searchParams?: {
    updated?: string;
    error?: string;
  };
};

export default async function AdminVehicleModelsPage({ searchParams }: Props) {
  const { accessToken } = await requireAdmin("/admin/vehicle-models");
  const { models, error } = await getAdminVehicleModels(accessToken);

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-7xl rounded-[30px] bg-cream p-4 shadow-soft sm:p-8">
        <p className="section-kicker">Admin</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold sm:text-4xl">Modelli veicolo</h1>
            <p className="mt-4 text-ink/65">
              Schede pubbliche condivise tra i renter. Ogni modello raggruppa titolo, foto e caratteristiche del mezzo.
            </p>
          </div>
          <a className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" href="/admin/vehicle-models/new">
            Nuovo modello
          </a>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="/admin">
            Area admin
          </a>
          <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="/admin/vehicles">
            Offerte partner
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

        <div className="mt-6 rounded-[28px] border border-sea/10 bg-sea/5 p-4">
          <p className="text-sm font-semibold text-ink/60">
            <span className="font-bold text-green-deep">Modelli veicolo</span> — scheda pubblica condivisa (titolo, foto, caratteristiche).{" "}
            <span className="font-bold text-green-deep">Offerte / mezzi dei renter</span> — prezzo, pickup point, renter, disponibilità. Collega un&apos;offerta a un modello dalla sezione <a className="underline" href="/admin/vehicles">Veicoli</a>.
          </p>
        </div>

        {searchParams?.updated ? (
          <div className="mt-6 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-bold text-green-deep">
            Modello aggiornato correttamente.
          </div>
        ) : null}

        {searchParams?.error || error ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
            {searchParams?.error || error}
          </div>
        ) : null}

        {!error && models.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-sea/10 bg-white/60 p-8 text-center">
            <h2 className="font-serif text-3xl font-bold">Nessun modello</h2>
            <p className="mt-3 text-ink/60">
              Crea il primo modello veicolo condiviso tra i renter.
            </p>
            <a
              className="mt-5 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"
              href="/admin/vehicle-models/new"
            >
              Nuovo modello
            </a>
          </div>
        ) : null}

        {models.length > 0 ? (
          <div className="mt-8 overflow-hidden rounded-[28px] border border-ink/10 bg-white/75 shadow-card">
            <div className="overflow-x-auto">
              <table className="min-w-[640px] w-full text-left text-sm">
                <thead className="bg-sea/10 text-[11px] uppercase tracking-[0.14em] text-green-deep">
                  <tr>
                    <th className="px-4 py-4">Foto</th>
                    <th className="px-4 py-4">Modello</th>
                    <th className="px-4 py-4">Categoria</th>
                    <th className="px-4 py-4">Ordine</th>
                    <th className="px-4 py-4">Offerte</th>
                    <th className="px-4 py-4">Stato</th>
                    <th className="px-4 py-4">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {models.map((model) => (
                    <tr className="align-top transition-colors hover:bg-sea/5" key={model.id}>
                      <td className="px-4 py-4">
                        {model.image_url ? (
                          <div className="h-16 w-20 overflow-hidden rounded-2xl border border-ink/10 bg-cream">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={model.image_url}
                              alt={model.title_it}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="grid h-16 w-20 place-items-center rounded-2xl border border-ink/10 bg-cream text-[10px] font-bold uppercase tracking-[0.12em] text-ink/35">
                            No foto
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold">{model.title_it}</div>
                        <div className="mt-0.5 text-xs text-ink/50">{model.title_en}</div>
                      </td>
                      <td className="px-4 py-4 text-ink/70">{model.category_name}</td>
                      <td className="px-4 py-4 text-ink/70">{model.sort_order}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${model.offer_count > 0 ? "border-sea/20 bg-sea/10 text-green-deep" : "border-ink/10 bg-white/60 text-ink/50"}`}>
                          {model.offer_count} {model.offer_count === 1 ? "offerta" : "offerte"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${model.is_active ? "border-sea/20 bg-sea/10 text-green-deep" : "border-stone-200 bg-stone-100 text-stone-700"}`}>
                          {model.is_active ? "Attivo" : "Non attivo"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <a
                            className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-bold text-ink/70 hover:border-sea/30 hover:text-green-deep"
                            href={`/admin/vehicle-models/${model.id}`}
                          >
                            Modifica
                          </a>
                          <a
                            className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-bold text-ink/70 hover:border-sea/30 hover:text-green-deep"
                            href={`/admin/vehicles/new?model_id=${model.id}`}
                          >
                            Aggiungi offerta partner
                          </a>
                          <form action={toggleVehicleModelStatusAction}>
                            <input type="hidden" name="model_id" value={model.id} />
                            <input type="hidden" name="is_active" value={String(!model.is_active)} />
                            <button
                              className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-bold text-ink/70 hover:border-sea/30 hover:text-green-deep"
                              type="submit"
                            >
                              {model.is_active ? "Disattiva" : "Attiva"}
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
