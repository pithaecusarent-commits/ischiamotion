import { notFound } from "next/navigation";
import { updateVehicleModelAction } from "@/app/admin/vehicle-models/actions";
import { VehicleModelForm } from "@/app/admin/vehicle-models/VehicleModelForm";
import { createSupabaseUserClient, requireAdmin } from "@/lib/supabase/admin-auth";
import { getAdminVehicleModelById } from "@/lib/supabase/queries/admin-vehicle-models";

type Props = {
  params: { id: string };
  searchParams?: { error?: string; saved?: string; created?: string };
};

export default async function EditVehicleModelPage({ params, searchParams }: Props) {
  const { accessToken } = await requireAdmin(`/admin/vehicle-models/${params.id}`);
  const supabase = createSupabaseUserClient(accessToken);

  const [{ model, error }, { data: categoriesData }] = await Promise.all([
    getAdminVehicleModelById(accessToken, params.id),
    supabase
      .from("vehicle_categories")
      .select("id, name_it")
      .order("name_it", { ascending: true })
  ]);

  if (!model && !error) {
    notFound();
  }

  const categories = (categoriesData || []).map((row) => ({
    id: row.id as string,
    label: row.name_it as string
  }));

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-5xl rounded-[30px] bg-cream p-4 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Admin</p>
            <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">Modifica modello veicolo</h1>
            {model ? (
              <p className="mt-2 text-sm font-semibold text-ink/50">
                {model.offer_count} {model.offer_count === 1 ? "offerta collegata" : "offerte collegate"}
              </p>
            ) : null}
          </div>
          <a
            className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70"
            href="/admin/vehicle-models"
          >
            Modelli veicolo
          </a>
        </div>

        {searchParams?.created ? (
          <div className="mt-6 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-bold text-green-deep">
            Modello creato correttamente.
          </div>
        ) : null}

        {searchParams?.saved ? (
          <div className="mt-6 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-bold text-green-deep">
            Modello salvato correttamente.
          </div>
        ) : null}

        {searchParams?.error || error ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
            {searchParams?.error || error}
          </div>
        ) : null}

        {model ? (
          <VehicleModelForm
            action={updateVehicleModelAction}
            categories={categories}
            model={model}
            submitLabel="Salva modifiche"
          />
        ) : null}
      </section>
    </main>
  );
}
