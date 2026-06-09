"use client";

import { useMemo, useState } from "react";
import {
  createRenterAvailabilityRuleAction,
  deleteRenterAvailabilityRuleAction
} from "@/app/renter/availability/actions";
import type { RenterAvailabilityRuleItem, RenterVehicleItem } from "@/lib/supabase/queries/renter";

type Props = {
  vehicles: RenterVehicleItem[];
  rules: RenterAvailabilityRuleItem[];
};

type Draft = {
  ruleId: string;
  vehicleValue: string;
  dateFrom: string;
  dateTo: string;
  isClosed: boolean;
  minRentalDays: string;
  notes: string;
};

const emptyDraft: Draft = {
  ruleId: "",
  vehicleValue: "",
  dateFrom: "",
  dateTo: "",
  isClosed: true,
  minRentalDays: "1",
  notes: ""
};

export function AvailabilityCalendar({ vehicles, rules }: Props) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const vehicleById = useMemo(() => new Map(vehicles.map((vehicle) => [vehicle.id, vehicle])), [vehicles]);
  const isEditing = Boolean(draft.ruleId);

  function editRule(rule: RenterAvailabilityRuleItem) {
    setDraft({
      ruleId: rule.id,
      vehicleValue: `${rule.vehicle_id}|${rule.renter_id}`,
      dateFrom: rule.date_from,
      dateTo: rule.date_to,
      isClosed: rule.is_closed,
      minRentalDays: String(rule.min_rental_days),
      notes: rule.notes || ""
    });
  }

  return (
    <div className="grid gap-5">
      <form action={createRenterAvailabilityRuleAction} className="rounded-[28px] border border-ink/10 bg-white/70 p-5">
        <input type="hidden" name="ruleId" value={draft.ruleId} />
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-2xl font-bold">{isEditing ? "Modifica regola" : "Nuova regola"}</h3>
            <p className="mt-1 text-sm text-ink/55">Gestisci chiusure, minimo giorni noleggio e note operative.</p>
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
              onChange={(event) => setDraft((current) => ({ ...current, vehicleValue: event.target.value }))}
            >
              <option value="">Seleziona veicolo</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={`${vehicle.id}|${vehicle.renter_id}`}>
                  {vehicle.title_it}{vehicle.internal_name ? ` - ${vehicle.internal_name}` : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Minimo giorni noleggio
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
              name="minRentalDays"
              type="number"
              min="1"
              value={draft.minRentalDays}
              onChange={(event) => setDraft((current) => ({ ...current, minRentalDays: event.target.value }))}
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Data inizio
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
              name="dateFrom"
              type="date"
              required
              value={draft.dateFrom}
              onChange={(event) => setDraft((current) => ({ ...current, dateFrom: event.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Data fine
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
              name="dateTo"
              type="date"
              required
              value={draft.dateTo}
              onChange={(event) => setDraft((current) => ({ ...current, dateTo: event.target.value }))}
            />
          </label>
        </div>

        <label className="mt-4 inline-flex items-center gap-3 text-sm font-bold text-ink/70">
          <input
            className="h-5 w-5"
            name="isClosed"
            type="checkbox"
            checked={draft.isClosed}
            onChange={(event) => setDraft((current) => ({ ...current, isClosed: event.target.checked }))}
          />
          Chiudi disponibilità per queste date
        </label>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
            name="notes"
            placeholder="Note operative opzionali"
            value={draft.notes}
            onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
          />
          <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" type="submit">
            Salva regola
          </button>
        </div>
      </form>

      {rules.length > 0 ? (
        <div className="overflow-hidden rounded-[28px] border border-ink/10 bg-white/70">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-[0.12em] text-ink/50">
                <tr>
                  <th className="px-5 py-4">Veicolo</th>
                  <th className="px-5 py-4">Dal / al</th>
                  <th className="px-5 py-4">Chiuso</th>
                  <th className="px-5 py-4">Minimo giorni noleggio</th>
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
                        {(vehicle?.internal_name || rule.vehicles?.internal_name) ? (
                          <span className="block text-xs text-ink/50">{vehicle?.internal_name || rule.vehicles?.internal_name}</span>
                        ) : null}
                      </td>
                      <td className="px-5 py-4">{rule.date_from} / {rule.date_to}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${rule.is_closed ? "bg-ink text-white" : "bg-green-deep/10 text-green-deep"}`}>
                          {rule.is_closed ? "Sì" : "No"}
                        </span>
                      </td>
                      <td className="px-5 py-4">{rule.min_rental_days} giorni</td>
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
                          <form
                            action={deleteRenterAvailabilityRuleAction}
                            onSubmit={(event) => {
                              if (!window.confirm("Vuoi eliminare questa regola di disponibilità?")) {
                                event.preventDefault();
                              }
                            }}
                          >
                            <input type="hidden" name="ruleId" value={rule.id} />
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
          Nessuna regola calendario creata.
        </div>
      )}
    </div>
  );
}
