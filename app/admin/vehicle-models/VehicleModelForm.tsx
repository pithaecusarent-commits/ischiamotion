import { ImageUploadField } from "@/app/admin/vehicles/ImageUploadField";
import type { AdminVehicleModel } from "@/lib/supabase/queries/admin-vehicle-models";

type CategoryOption = { id: string; label: string };

type Props = {
  action: (formData: FormData) => void;
  categories: CategoryOption[];
  model?: AdminVehicleModel | null;
  submitLabel: string;
};

function featuresValue(value?: string[]) {
  return (value || []).join("\n");
}

export function VehicleModelForm({ action, categories, model, submitLabel }: Props) {
  return (
    <form action={action} className="mt-6 grid gap-5" encType="multipart/form-data">
      {model ? <input type="hidden" name="model_id" value={model.id} /> : null}
      <input type="hidden" name="original_image_url" value={model?.image_url || ""} />

      <label className="grid gap-2 text-sm font-bold text-ink/70">
        Categoria
        <select
          className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
          name="category_id"
          defaultValue={model?.category_id || ""}
          required
        >
          <option value="">Seleziona categoria</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Titolo pubblico IT
          <input
            className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="title_it"
            defaultValue={model?.title_it || ""}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Titolo pubblico EN
          <input
            className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="title_en"
            defaultValue={model?.title_en || ""}
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
            defaultValue={model?.description_it || ""}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Descrizione EN
          <textarea
            className="min-h-[120px] rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="description_en"
            defaultValue={model?.description_en || ""}
          />
        </label>
      </div>

      <ImageUploadField currentImageUrl={model?.image_url} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Features IT
          <textarea
            className="min-h-[130px] rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="features_it"
            defaultValue={featuresValue(model?.features_it)}
            placeholder="Una caratteristica per riga"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Features EN
          <textarea
            className="min-h-[130px] rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="features_en"
            defaultValue={featuresValue(model?.features_en)}
            placeholder="One feature per line"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Ordine di visualizzazione
          <input
            className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
            name="sort_order"
            type="number"
            min="0"
            step="1"
            defaultValue={model?.sort_order ?? 0}
          />
        </label>
      </div>

      <label className="inline-flex items-center gap-3 text-sm font-bold text-ink/70">
        <input
          className="h-5 w-5 rounded border-ink/20"
          name="is_active"
          type="checkbox"
          defaultChecked={model?.is_active ?? true}
        />
        Modello attivo
      </label>

      <div className="flex flex-wrap gap-3">
        <button className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white" type="submit">
          {submitLabel}
        </button>
        <a
          className="rounded-full border border-ink/10 px-6 py-3 text-sm font-bold text-ink/70"
          href="/admin/vehicle-models"
        >
          Annulla
        </a>
      </div>
    </form>
  );
}
