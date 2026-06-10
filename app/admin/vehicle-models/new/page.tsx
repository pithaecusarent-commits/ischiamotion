import { createVehicleModelAction } from "@/app/admin/vehicle-models/actions";
import { VehicleModelForm } from "@/app/admin/vehicle-models/VehicleModelForm";
import { createSupabaseUserClient, requireAdmin } from "@/lib/supabase/admin-auth";

type Props = {
  searchParams?: {
    error?: string;
  };
};

export default async function NewVehicleModelPage({ searchParams }: Props) {
  const { accessToken } = await requireAdmin("/admin/vehicle-models/new");
  const supabase = createSupabaseUserClient(accessToken);
  const { data: categoriesData } = await supabase
    .from("vehicle_categories")
    .select("id, name_it")
    .order("name_it", { ascending: true });

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
            <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">Nuovo modello veicolo</h1>
            <p className="mt-4 text-ink/65">
              Crea la scheda pubblica condivisa del modello. I renter collegheranno le proprie offerte a questo modello.
            </p>
          </div>
          <a
            className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70"
            href="/admin/vehicle-models"
          >
            Modelli veicolo
          </a>
        </div>

        {searchParams?.error ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
            {searchParams.error}
          </div>
        ) : null}

        <VehicleModelForm
          action={createVehicleModelAction}
          categories={categories}
          submitLabel="Crea modello"
        />
      </section>
    </main>
  );
}
