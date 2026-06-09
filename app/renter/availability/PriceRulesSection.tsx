"use client";

import { useMemo, useState } from "react";
import { deletePriceRuleAction, savePriceRuleAction } from "@/app/renter/availability/actions";
import type { RenterPriceRuleItem, RenterVehicleItem } from "@/lib/supabase/queries/renter";

type Props = {
  vehicles: RenterVehicleItem[];
  rules: RenterPriceRuleItem[];
  returnPath?: string;
};

type Draft = {
  priceRuleId: string;
  vehicleValue: string;
  name: string;
  dateFrom: string;
  dateTo: string;
  pricePerDay: string;
  minRentalDays: string;
  isActive: string;
  notes: string;
};

const emptyDraft: Draft = {
  priceRuleId: "",
  vehicleValue: "",
  name: "",
  dateFrom: "",
  dateTo: "",
  pricePerDay: "",
  minRentalDays: "1",
  isActive: "true",
  notes: ""
};

const maxPriceRulesPerVehicle = 5;

export function PriceRulesSection({ vehicles, rules, returnPath = "/renter/pricing" }: Props) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const vehicleById = useMemo(() => new Map(vehicles.map((v) => [v.id, v])), [vehicles]);
  const isEditing = Boolean(draft.priceRuleId);
  const selectedVehicleId = draft.vehicleValue.split("|")[0] || "";
  const selectedVehicleRuleCount = selectedVehicleId
    ? rules.filter((rule) => rule.vehicle_id === selectedVehicleId).length
    : 0;
  const hasReachedRuleLimit = !isEditing && Boolean(selectedVehicleId) && selectedVehicleRuleCount >= maxPriceRulesPerVehicle;

  function editRule(rule: RenterPriceRuleItem) {
    setDraft({
      priceRuleId: rule.id,
      vehicleValue: `${rule.vehicle_id}|${rule.renter_id}`,
      name: rule.name || "",
      dateFrom: rule.date_from,
      dateTo: rule.date_to,
      pricePerDay: String(rule.price_per_day),
      minRentalDays: String(rule.min_rental_days),
      isActive: String(rule.is_active),
      notes: rule.notes || ""
    });
  }

  function copyRule(rule: RenterPriceRuleItem) {
    setDraft({
      priceRuleId: "",
      vehicleValue: `${rule.vehicle_id}|${rule.renter_id}`,
      name: rule.name || "",
      dateFrom: "",
      dateTo: "",
      pricePerDay: String(rule.price_per_day),
      minRentalDays: String(rule.min_rental_days),
      isActive: String(rule.is_active),
      notes: rule.notes || ""
    });
  }

  if (vehicles.length === 0) {
    return (
      <div className="rounded-[28px] border border-ink/10 bg-white/70 p-6 text-sm text-ink/60">
        Nessun veicolo assegnato al tuo noleggio.
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <form action={savePriceRuleAction} className="rounded-[28px] border border-ink/10 bg-white/70 p-5">
        <input type="hidden" name="priceRuleId" value={draft.priceRuleId} />
        <input type="hidden" name="returnPath" value={returnPath} />
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-2xl font-bold">{isEditing ? "Modifica prezzo" : "Nuovo prezzo stagionale"}</h3>
            <p className="mt-1 text-sm text-ink/55">Imposta fino a {maxPriceRulesPerVehicle} fasce di prezzo per veicolo.</p>
            {selectedVehicleId ? (
              <p className="mt-1 text-xs font-bold text-ink/45">
                {selectedVehicleRuleCount}/{maxPriceRulesPerVehicle} fasce configurate per il veicolo selezionato
              </p>
            ) : null}
          </div>
          {isEditing ? (
            <button
              className="rounded-full border border-ink/10 px-4 py-2 text-xs font-bold text-ink/65 hover:border-sea/30 hover:text-green-deep"
              type="button"
              onClick={() => setDraft(emptyDraft)}
            >
              Annulla modifica
            </button>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Veicolo
            <select
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
              name="vehicle"
              required
              value={draft.vehicleValue}
              onChange={(e) => setDraft((d) => ({ ...d, vehicleValue: e.target.value }))}
            >
              <option value="">Seleziona veicolo</option>
              {vehicles.map((v) => (
                <option key={v.id} value={`${v.id}|${v.renter_id}`}>
                  {v.vehicle_categories?.name_it ? `${v.vehicle_categories.name_it} - ` : ""}{v.title_it}{v.internal_name ? ` - ${v.internal_name}` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Nome regola
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
              name="name"
              placeholder="Es. Alta stagione"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Dal
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
              name="dateFrom"
              type="date"
              required
              value={draft.dateFrom}
              onChange={(e) => setDraft((d) => ({ ...d, dateFrom: e.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Al
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
              name="dateTo"
              type="date"
              required
              value={draft.dateTo}
              onChange={(e) => setDraft((d) => ({ ...d, dateTo: e.target.value }))}
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Prezzo al giorno (€)
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
              name="pricePerDay"
              type="number"
              min="0"
              step="0.01"
              required
              value={draft.pricePerDay}
              onChange={(e) => setDraft((d) => ({ ...d, pricePerDay: e.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Minimo giorni noleggio
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
              name="minRentalDays"
              type="number"
              min="1"
              value={draft.minRentalDays}
              onChange={(e) => setDraft((d) => ({ ...d, minRentalDays: e.target.value }))}
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <input
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
            name="notes"
            placeholder="Note operative opzionali"
            value={draft.notes}
            onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
          />
          <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white px-4">
            <span className="text-sm font-bold text-ink/70">Regola attiva</span>
            <div className="ml-auto flex rounded-full border border-ink/10 bg-cream p-1">
              <label className="cursor-pointer rounded-full px-3 py-1 text-xs font-bold has-[:checked]:bg-green-deep has-[:checked]:text-white">
                <input
                  className="sr-only"
                  type="radio"
                  name="isActive"
                  value="true"
                  checked={draft.isActive === "true"}
                  onChange={() => setDraft((d) => ({ ...d, isActive: "true" }))}
                />
                Sì
              </label>
              <label className="cursor-pointer rounded-full px-3 py-1 text-xs font-bold has-[:checked]:bg-ink has-[:checked]:text-white">
                <input
                  className="sr-only"
                  type="radio"
                  name="isActive"
                  value="false"
                  checked={draft.isActive === "false"}
                  onChange={() => setDraft((d) => ({ ...d, isActive: "false" }))}
                />
                No
              </label>
            </div>
          </div>
          <button
            className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-ink/30"
            type="submit"
            disabled={hasReachedRuleLimit}
          >
            Salva prezzo
          </button>
        </div>
        {hasReachedRuleLimit ? (
          <p className="mt-3 text-xs font-bold text-amber-800">
            Hai raggiunto il limite di {maxPriceRulesPerVehicle} fasce per questo veicolo. Modifica o elimina una fascia esistente.
          </p>
        ) : null}
      </form>

      {rules.length > 0 ? (
        <div className="overflow-hidden rounded-[28px] border border-ink/10 bg-white/70">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-[0.12em] text-ink/50">
                <tr>
                  <th className="px-5 py-4">Veicolo</th>
                  <th className="px-5 py-4">Nome regola</th>
                  <th className="px-5 py-4">Dal / Al</th>
                  <th className="px-5 py-4">€ / giorno</th>
                  <th className="px-5 py-4">Min. giorni</th>
                  <th className="px-5 py-4">Attiva</th>
                  <th className="px-5 py-4">Note</th>
                  <th className="px-5 py-4">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {rules.map((rule) => {
                  const vehicle = vehicleById.get(rule.vehicle_id);
                  return (
                    <tr key={rule.id}>
                      <td className="px-5 py-4 font-semibold">
                        {vehicle?.title_it || rule.vehicles?.title_it || "-"}
                        {vehicle?.vehicle_categories?.name_it ? (
                          <span className="block text-xs text-ink/50">
                            {vehicle.vehicle_categories.name_it}
                          </span>
                        ) : null}
                        {(vehicle?.internal_name || rule.vehicles?.internal_name) ? (
                          <span className="block text-xs text-ink/50">
                            {vehicle?.internal_name || rule.vehicles?.internal_name}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-5 py-4">{rule.name || "-"}</td>
                      <td className="px-5 py-4 tabular-nums">{rule.date_from} / {rule.date_to}</td>
                      <td className="px-5 py-4 font-bold tabular-nums">€{rule.price_per_day}</td>
                      <td className="px-5 py-4">{rule.min_rental_days}g</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${rule.is_active ? "bg-green-deep/10 text-green-deep" : "bg-ink/10 text-ink/50"}`}>
                          {rule.is_active ? "Sì" : "No"}
                        </span>
                      </td>
                      <td className="px-5 py-4">{rule.notes || "-"}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="rounded-full border border-ink/10 px-4 py-2 text-xs font-bold text-ink/65 hover:border-sea/30 hover:text-green-deep"
                            type="button"
                            onClick={() => editRule(rule)}
                          >
                            Modifica
                          </button>
                          <button
                            className="rounded-full border border-sea/20 px-4 py-2 text-xs font-bold text-green-deep hover:bg-sea/10 disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink/35"
                            type="button"
                            onClick={() => copyRule(rule)}
                            disabled={rules.filter((item) => item.vehicle_id === rule.vehicle_id).length >= maxPriceRulesPerVehicle}
                          >
                            Copia listino
                          </button>
                          <form
                            action={deletePriceRuleAction}
                            onSubmit={(e) => {
                              if (!window.confirm("Vuoi eliminare questa regola prezzo?")) e.preventDefault();
                            }}
                          >
                            <input type="hidden" name="priceRuleId" value={rule.id} />
                            <input type="hidden" name="returnPath" value={returnPath} />
                            <button className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-50" type="submit">
                              Elimina
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-[28px] border border-ink/10 bg-white/70 p-6 text-sm text-ink/60">
          Nessuna regola prezzo creata.
        </div>
      )}
    </div>
  );
}
