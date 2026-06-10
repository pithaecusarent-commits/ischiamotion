import { createRenterFromAdminAction } from "@/app/admin/renters/actions";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { HOTEL_MUNICIPALITIES, municipalityLabels } from "@/lib/delivery-zones";

type Props = {
  searchParams?: {
    error?: string;
  };
};

const categories = ["Scooter", "Auto", "Barche", "Gommoni", "E-bike", "Quad", "Beach Club"];

export default async function NewAdminRenterPage({ searchParams }: Props) {
  await requireAdmin("/admin/renters/new");

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-4xl rounded-[30px] bg-cream p-8 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Admin</p>
            <h1 className="mt-3 font-serif text-4xl font-bold">Nuovo renter</h1>
            <p className="mt-4 text-ink/65">
              Crea l&apos;anagrafica partner gestita dallo staff e invia una conferma al renter.
            </p>
          </div>
          <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="/admin/renters">
            Noleggiatori
          </a>
        </div>

        {searchParams?.error ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
            {searchParams.error}
          </div>
        ) : null}

        <form action={createRenterFromAdminAction} className="mt-8 grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-ink/70">
              Nome attivita
              <input className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50" name="business_name" required />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink/70">
              Referente
              <input className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50" name="contact_name" />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-ink/70">
              Email
              <input className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50" name="email" type="email" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink/70">
              Telefono
              <input className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50" name="phone" type="tel" />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-ink/70">
              Partita IVA
              <input className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50" name="vat_number" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink/70">
              Codice fiscale
              <input className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50" name="fiscal_code" />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Indirizzo attivita
            <input className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50" name="business_address" />
          </label>

          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Comune IschiaMotion Point
            <select className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50" name="ischiamotion_point_municipality">
              <option value="">-- Seleziona comune --</option>
              {HOTEL_MUNICIPALITIES.map((m) => (
                <option key={m} value={m}>{municipalityLabels.it[m]}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Comune / zona (testo libero)
            <input className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50" name="business_city" />
          </label>

          <fieldset className="grid gap-3 rounded-3xl border border-ink/10 bg-white/60 p-4">
            <legend className="px-1 text-sm font-bold text-ink/70">Categorie offerte</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {categories.map((category) => (
                <label className="flex items-center gap-2 text-sm font-semibold text-ink/65" key={category}>
                  <input className="h-4 w-4 accent-green-deep" name="service_categories" type="checkbox" value={category} />
                  {category}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Zone operative
            <input className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50" name="operating_zones" placeholder="Es. Ischia Porto, Forio" />
          </label>

          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Stagionalità
            <textarea
              className="min-h-28 rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
              name="seasonality_notes"
              placeholder="Es. bassa, media e alta stagione; periodi di chiusura; logiche di prezzo del partner"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Note interne
            <textarea className="min-h-28 rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50" name="admin_notes" />
          </label>

          <label className="flex items-start gap-3 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-semibold leading-6 text-green-deep">
            <input className="mt-1 h-4 w-4 shrink-0 accent-green-deep" name="create_auth_user" type="checkbox" value="1" />
            <span>Crea anche l&apos;accesso Auth solo se il renter deve entrare nella mini-area e impostare la password.</span>
          </label>

          <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" type="submit">
            Crea renter
          </button>
        </form>
      </section>
    </main>
  );
}
