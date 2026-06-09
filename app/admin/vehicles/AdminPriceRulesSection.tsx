"use client";

import { useState } from "react";
import {
  deleteAdminVehiclePriceRuleAction,
  saveAdminVehiclePriceRuleAction
} from "@/app/admin/vehicles/actions";
import type { AdminPriceRuleItem } from "@/lib/supabase/queries/admin-vehicles";

type Props = {
  vehicleId: string;
  renterId: string;
  rules: AdminPriceRuleItem[];
};

type Draft = {
  priceRuleId: string;
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
  name: "",
  dateFrom: "",
  dateTo: "",
  pricePerDay: "",
  minRentalDays: "1",
  isActive: "true",
  notes: ""
};

const maxPriceRulesPerVehicle = 5;

export function AdminPriceRulesSection({ vehicleId, renterId, rules }: Props) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const isEditing = Boolean(draft.priceRuleId);
  const hasReachedRuleLimit = !isEditing && rules.length >= maxPriceRulesPerVehicle;

  function editRule(rule: AdminPriceRuleItem) {
    setDraft({
      priceRuleId:   rule.id,
      name:          rule.name || "",
      dateFrom:      rule.date_from,
      dateTo:        rule.date_to,
      pricePerDay:   String(rule.price_per_day),
      minRentalDays: String(rule.min_rental_days),
      isActive:      String(rule.is_active),
      notes:         rule.notes || ""
    });
  }

  function copyRule(rule: AdminPriceRuleItem) {
    setDraft({
      priceRuleId: "",
      name: rule.name || "",
      dateFrom: "",
      dateTo: "",
      pricePerDay: String(rule.price_per_day),
      minRentalDays: String(rule.min_rental_days),
      isActive: String(rule.is_active),
      notes: rule.notes || ""
    });
  }

  return (
    <div className="mt-10">
      <h2 className="font-serif text-3xl font-bold">Prezzi stagionali</h2>
      <p className="mt-2 text-sm text-ink/60">
        Imposta fino a {maxPriceRulesPerVehicle} fasce di prezzo per periodi specifici. Sovrascrivono il prezzo base nei risultati di ricerca.
      </p>

      <div className="mt-5 grid gap-5">
        <form action={saveAdminVehiclePriceRuleAction} className="rounded-[28px] border border-ink/10 bg-white/70 p-5">
          <input type="hidden" name="vehicle_id"   value={vehicleId} />
          <input type="hidden" name="renter_id"    value={renterId} />
          <input type="hidden" name="priceRuleId"  value={draft.priceRuleId} />

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-2xl font-bold">{isEditing ? "Modifica prezzo" : "Nuovo prezzo stagionale"}</h3>
              <p className="mt-1 text-xs font-bold text-ink/45">
                {rules.length}/{maxPriceRulesPerVehicle} fasce configurate
              </p>
            </div>
            {isEditing ? (
              <button
                className="rounded-full border border-ink/10 px-4 py-2 text-xs font-bold text-ink/65 hover:border-sea/30 hover:text-green-deep"
                type="button"
                onClick={() => setDraft(emptyDraft)}
              >
                Annulla
              </button>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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

          <div className="mt-4 grid gap-4 md:grid-cols-[auto_1fr_1fr_auto]">
            <div className="flex items-center gap-2 rounded-2xl border border-ink/10 bg-white px-4">
              <span className="text-sm font-bold text-ink/70">Attiva</span>
              <div className="ml-2 flex rounded-full border border-ink/10 bg-cream p-1">
                <label className="cursor-pointer rounded-full px-3 py-1 text-xs font-bold has-[:checked]:bg-green-deep has-[:checked]:text-white">
                  <input className="sr-only" type="radio" name="isActive" value="true"
                    checked={draft.isActive === "true"}
                    onChange={() => setDraft((d) => ({ ...d, isActive: "true" }))} />
                  Sì
                </label>
                <label className="cursor-pointer rounded-full px-3 py-1 text-xs font-bold has-[:checked]:bg-ink has-[:checked]:text-white">
                  <input className="sr-only" type="radio" name="isActive" value="false"
                    checked={draft.isActive === "false"}
                    onChange={() => setDraft((d) => ({ ...d, isActive: "false" }))} />
                  No
                </label>
              </div>
            </div>
            <label className="grid gap-2 text-sm font-bold text-ink/70">
              Min. giorni
              <input
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
                name="minRentalDays"
                type="number"
                min="1"
                value={draft.minRentalDays}
                onChange={(e) => setDraft((d) => ({ ...d, minRentalDays: e.target.value }))}
              />
            </label>
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
              name="notes"
              placeholder="Note opzionali"
              value={draft.notes}
              onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
            />
            <button
              className="self-end rounded-full bg-ink px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-ink/30"
              type="submit"
              disabled={hasReachedRuleLimit}
            >
              Salva
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
                    <th className="px-5 py-4">Nome</th>
                    <th className="px-5 py-4">Dal / Al</th>
                    <th className="px-5 py-4">€ / giorno</th>
                    <th className="px-5 py-4">Min. giorni</th>
                    <th className="px-5 py-4">Attiva</th>
                    <th className="px-5 py-4">Note</th>
                    <th className="px-5 py-4">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {rules.map((rule) => (
                    <tr key={rule.id}>
                      <td className="px-5 py-4 font-semibold">{rule.name || "-"}</td>
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
                            disabled={rules.length >= maxPriceRulesPerVehicle}
                          >
                            Copia listino
                          </button>
                          <form
                            action={deleteAdminVehiclePriceRuleAction}
                            onSubmit={(e) => {
                              if (!window.confirm("Eliminare questa regola prezzo?")) e.preventDefault();
                            }}
                          >
                            <input type="hidden" name="vehicle_id"   value={vehicleId} />
                            <input type="hidden" name="priceRuleId"  value={rule.id} />
                            <button className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-50" type="submit">
                              Elimina
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] border border-ink/10 bg-white/70 p-6 text-sm text-ink/60">
            Nessuna regola prezzo stagionale.
          </div>
        )}
      </div>
    </div>
  );
}
