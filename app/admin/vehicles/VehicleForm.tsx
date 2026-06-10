import type { AdminVehicle, AdminVehicleOptions } from "@/lib/supabase/queries/admin-vehicles";
import { ImageUploadField } from "@/app/admin/vehicles/ImageUploadField";

type Props = {
  action: (formData: FormData) => void;
  options: AdminVehicleOptions;
  vehicle?: AdminVehicle | null;
  submitLabel: string;
};

function featuresValue(value?: string[]) {
  return (value || []).join("\n");
}

export function VehicleForm({ action, options, vehicle, submitLabel }: Props) {
  return (
    <form action={action} className="mt-6 grid gap-5" encType="multipart/form-data">
      {vehicle ? <input type="hidden" name="vehicle_id" value={vehicle.id} /> : null}
      <input type="hidden" name="original_image_url" value={vehicle?.image_url || ""} />

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Categoria
          <select
            className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="category_id"
            defaultValue={vehicle?.category_id || ""}
            required
          >
            <option value="">Seleziona categoria</option>
            {options.categories.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Noleggiatore interno
          <select
            className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="renter_id"
            defaultValue={vehicle?.renter_id || ""}
            required
          >
            <option value="">Seleziona noleggiatore</option>
            {options.renters.map((item) => (
              <option key={item.id} value={item.id}>{item.label}{item.meta ? ` (${item.meta})` : ""}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Pickup point
          <select
            className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="pickup_point_id"
            defaultValue={vehicle?.pickup_point_id || ""}
            required
          >
            <option value="">Seleziona pickup point</option>
            {options.pickupPoints.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Titolo pubblico IT
          <input
            className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="title_it"
            defaultValue={vehicle?.title_it || ""}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Titolo pubblico EN
          <input
            className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="title_en"
            defaultValue={vehicle?.title_en || ""}
            required
          />
        </label>
      </div>

      {options.vehicleModels.length > 0 ? (
        <div className="rounded-[28px] border border-sea/10 bg-white/65 p-5">
          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Modello base
            <select
              className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
              name="vehicle_model_id"
              defaultValue={vehicle?.vehicle_model_id || ""}
            >
              <option value="">Nessun modello base</option>
              {options.vehicleModels.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
            <span className="text-xs font-semibold leading-5 text-ink/50">
              Opzionale. Collega questa offerta a un modello veicolo condiviso.
            </span>
          </label>
        </div>
      ) : null}

      <div className="rounded-[28px] border border-sea/10 bg-white/65 p-5">
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Nome interno veicolo
          <input
            className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="internal_name"
            defaultValue={vehicle?.internal_name || ""}
            placeholder="Es. Vespa Primavera 125 - mezzo 01"
          />
          <span className="text-xs font-semibold leading-5 text-ink/50">
            Visibile solo ad admin e noleggiatore. Il cliente vedra solo il titolo pubblico, ad esempio Scooter 125.
          </span>
        </label>
        <div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-ink/70">
          Per il pubblico usa nomi generici come Scooter 125, Auto, E-bike, Gommone, Barca. Il nome interno serve solo per l&apos;organizzazione.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Descrizione IT
          <textarea
            className="min-h-[120px] rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="description_it"
            defaultValue={vehicle?.description_it || ""}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Descrizione EN
          <textarea
            className="min-h-[120px] rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="description_en"
            defaultValue={vehicle?.description_en || ""}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Prezzo da
          <input
            className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="price_from"
            type="number"
            min="0"
            step="0.01"
            defaultValue={vehicle?.price_from ?? ""}
          />
        </label>
      </div>

      <ImageUploadField currentImageUrl={vehicle?.image_url} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Features IT
          <textarea
            className="min-h-[130px] rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="features_it"
            defaultValue={featuresValue(vehicle?.features_it)}
            placeholder="Una caratteristica per riga"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Features EN
          <textarea
            className="min-h-[130px] rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="features_en"
            defaultValue={featuresValue(vehicle?.features_en)}
            placeholder="One feature per line"
          />
        </label>
      </div>

      <label className="inline-flex items-center gap-3 text-sm font-bold text-ink/70">
        <input
          className="h-5 w-5 rounded border-ink/20"
          name="is_active"
          type="checkbox"
          defaultChecked={vehicle?.is_active ?? true}
        />
        Veicolo attivo
      </label>

      <div className="flex flex-wrap gap-3">
        <button className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white" type="submit">
          {submitLabel}
        </button>
        <a className="rounded-full border border-ink/10 px-6 py-3 text-sm font-bold text-ink/70" href="/admin/vehicles">
          Annulla
        </a>
      </div>
    </form>
  );
}
