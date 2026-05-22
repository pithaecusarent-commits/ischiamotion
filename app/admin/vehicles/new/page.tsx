import { createAdminVehicleAction } from "@/app/admin/vehicles/actions";
import { VehicleForm } from "@/app/admin/vehicles/VehicleForm";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { getAdminVehicleOptions } from "@/lib/supabase/queries/admin-vehicles";

type Props = {
  searchParams?: {
    error?: string;
  };
};

export default async function NewAdminVehiclePage({ searchParams }: Props) {
  const { accessToken } = await requireAdmin("/admin/vehicles/new");
  const { options, error } = await getAdminVehicleOptions(accessToken);

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-5xl rounded-[30px] bg-cream p-8 shadow-soft">
        <p className="section-kicker">Admin</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">Nuovo veicolo</h1>
        <p className="mt-4 text-ink/65">Crea un mezzo reale collegato a categoria, noleggiatore e pickup point.</p>

        {searchParams?.error || error ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
            {searchParams?.error || error}
          </div>
        ) : null}

        <VehicleForm action={createAdminVehicleAction} options={options} submitLabel="Crea veicolo" />
      </section>
    </main>
  );
}
