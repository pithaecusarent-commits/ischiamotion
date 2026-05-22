import type { AdminVehicle, AdminVehicleOptions } from "@/lib/supabase/queries/admin-vehicles";

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
    <form action={action} className="mt-6 grid gap-5">
      {vehicle ? <input type="hidden" name="vehicle_id" value={vehicle.id} /> : null}

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
          Titolo IT
          <input
            className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="title_it"
            defaultValue={vehicle?.title_it || ""}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Titolo EN
          <input
            className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="title_en"
            defaultValue={vehicle?.title_en || ""}
            required
          />
        </label>
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
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Image URL
          <input
            className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="image_url"
            defaultValue={vehicle?.image_url || ""}
            placeholder="/images/..."
          />
        </label>
      </div>

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
