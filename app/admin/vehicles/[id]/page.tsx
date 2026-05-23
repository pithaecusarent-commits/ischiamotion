import { notFound } from "next/navigation";
import { updateAdminVehicleAction } from "@/app/admin/vehicles/actions";
import { AdminPriceRulesSection } from "@/app/admin/vehicles/AdminPriceRulesSection";
import { VehicleForm } from "@/app/admin/vehicles/VehicleForm";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { getAdminVehicleById, getAdminVehiclePriceRules } from "@/lib/supabase/queries/admin-vehicles";

type Props = {
  params: {
    id: string;
  };
  searchParams?: {
    error?: string;
    saved?: string;
  };
};

export default async function EditAdminVehiclePage({ params, searchParams }: Props) {
  const { accessToken } = await requireAdmin(`/admin/vehicles/${params.id}`);
  const [{ vehicle, options, error }, { rules: priceRules }] = await Promise.all([
    getAdminVehicleById(accessToken, params.id),
    getAdminVehiclePriceRules(accessToken, params.id)
  ]);

  if (!vehicle && !error) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-5xl rounded-[30px] bg-cream p-8 shadow-soft">
        <p className="section-kicker">Admin</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">Modifica veicolo</h1>
        <p className="mt-4 text-ink/65">Aggiorna i dati interni del mezzo.</p>

        {searchParams?.saved ? (
          <div className="mt-6 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-bold text-green-deep">
            Veicolo salvato correttamente.
          </div>
        ) : null}

        {searchParams?.error || error ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
            {searchParams?.error || error}
          </div>
        ) : null}

        {vehicle ? (
          <VehicleForm action={updateAdminVehicleAction} options={options} vehicle={vehicle} submitLabel="Salva modifiche" />
        ) : null}

        {vehicle?.renter_id ? (
          <AdminPriceRulesSection
            vehicleId={params.id}
            renterId={vehicle.renter_id}
            rules={priceRules}
          />
        ) : null}
      </section>
    </main>
  );
}
