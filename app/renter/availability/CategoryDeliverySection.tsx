"use client";

import { useState } from "react";
import { saveCategoryDeliveryCapabilityAction } from "@/app/renter/availability/actions";
import { DELIVERY_PORTS, HOTEL_MUNICIPALITIES, municipalityLabels, portLabels } from "@/lib/delivery-zones";
import { deliveryMethodLabels } from "@/lib/booking-labels";
import { isNauticalCategory } from "@/lib/vehicle-categories";
import type { RenterCategoryDeliveryGroup } from "@/lib/supabase/queries/renter";

function ZoneCheckbox({
  name,
  value,
  label,
  defaultChecked
}: {
  name: string;
  value: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-ink/10 bg-sand/30 px-3 py-2 text-sm has-[:checked]:border-sea/30 has-[:checked]:bg-sea/5">
      <input className="accent-sea" type="checkbox" name={name} value={value} defaultChecked={defaultChecked} />
      <span>{label}</span>
    </label>
  );
}

function CategoryForm({ group }: { group: RenterCategoryDeliveryGroup }) {
  const portCap = group.capabilities.find((c) => c.delivery_method === "port_delivery");
  const hotelCap = group.capabilities.find((c) => c.delivery_method === "hotel_delivery");

  const [portEnabled, setPortEnabled] = useState(portCap?.is_enabled ?? false);
  const [hotelEnabled, setHotelEnabled] = useState(hotelCap?.is_enabled ?? false);

  return (
    <form
      action={saveCategoryDeliveryCapabilityAction}
      className="rounded-[28px] border border-ink/10 bg-white/70 p-5"
    >
      <input type="hidden" name="renterId" value={group.renter_id} />
      <input type="hidden" name="categoryId" value={group.category_id} />
      <input type="hidden" name="categorySlug" value={group.category_slug} />
      <input type="hidden" name="enabled_pickup_point" value="true" />

      <h3 className="font-serif text-2xl font-bold">{group.category_name_it}</h3>

      <div className="mt-4 grid gap-3">
        {/* Pickup point — always active */}
        <div className="flex items-center justify-between rounded-2xl border border-ink/5 bg-cream/50 px-4 py-3">
          <span className="text-sm text-ink/70">{deliveryMethodLabels.it.pickup_point}</span>
          <span className="text-xs font-bold text-green-deep">Sempre attivo</span>
        </div>

        {/* Port delivery */}
        <div className="rounded-2xl border border-ink/10 bg-white px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm">{deliveryMethodLabels.it.port_delivery}</span>
            <div className="flex rounded-full border border-ink/10 bg-cream p-1">
              <label className="cursor-pointer rounded-full px-4 py-2 text-sm font-bold has-[:checked]:bg-green-deep has-[:checked]:text-white">
                <input
                  className="sr-only"
                  type="radio"
                  name="enabled_port_delivery"
                  value="true"
                  defaultChecked={portEnabled}
                  onChange={() => setPortEnabled(true)}
                />
                Abilitato
              </label>
              <label className="cursor-pointer rounded-full px-4 py-2 text-sm font-bold has-[:checked]:bg-ink has-[:checked]:text-white">
                <input
                  className="sr-only"
                  type="radio"
                  name="enabled_port_delivery"
                  value="false"
                  defaultChecked={!portEnabled}
                  onChange={() => setPortEnabled(false)}
                />
                Disabilitato
              </label>
            </div>
          </div>
          {portEnabled && (
            <div className="mt-3">
              <p className="mb-2 text-xs font-bold text-ink/50 uppercase tracking-wide">Porti coperti</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {DELIVERY_PORTS.map((port) => (
                  <ZoneCheckbox
                    key={port}
                    name="port_zones"
                    value={port}
                    label={portLabels.it[port]}
                    defaultChecked={(portCap?.zones ?? []).includes(port)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hotel delivery */}
        <div className="rounded-2xl border border-ink/10 bg-white px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm">{deliveryMethodLabels.it.hotel_delivery}</span>
            <div className="flex rounded-full border border-ink/10 bg-cream p-1">
              <label className="cursor-pointer rounded-full px-4 py-2 text-sm font-bold has-[:checked]:bg-green-deep has-[:checked]:text-white">
                <input
                  className="sr-only"
                  type="radio"
                  name="enabled_hotel_delivery"
                  value="true"
                  defaultChecked={hotelEnabled}
                  onChange={() => setHotelEnabled(true)}
                />
                Abilitato
              </label>
              <label className="cursor-pointer rounded-full px-4 py-2 text-sm font-bold has-[:checked]:bg-ink has-[:checked]:text-white">
                <input
                  className="sr-only"
                  type="radio"
                  name="enabled_hotel_delivery"
                  value="false"
                  defaultChecked={!hotelEnabled}
                  onChange={() => setHotelEnabled(false)}
                />
                Disabilitato
              </label>
            </div>
          </div>
          {hotelEnabled && (
            <div className="mt-3">
              <p className="mb-2 text-xs font-bold text-ink/50 uppercase tracking-wide">Comuni coperti</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {HOTEL_MUNICIPALITIES.map((m) => (
                  <ZoneCheckbox
                    key={m}
                    name="hotel_zones"
                    value={m}
                    label={municipalityLabels.it[m]}
                    defaultChecked={(hotelCap?.zones ?? []).includes(m)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" type="submit">
          Salva
        </button>
      </div>
    </form>
  );
}

export function CategoryDeliverySection({ groups }: { groups: RenterCategoryDeliveryGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <>
      <div className="mb-4 mt-8">
        <h2 className="font-serif text-3xl font-bold">Consegna per categoria</h2>
        <p className="mt-2 text-sm text-ink/60">
          Configura i metodi di consegna e le zone coperte per ogni categoria. Le imbarcazioni supportano solo il ritiro presso IschiaMotion Point.
        </p>
      </div>
      <div className="grid gap-4">
        {groups.map((group) => {
          const isNautical = isNauticalCategory(group.category_slug);

          if (isNautical) {
            return (
              <div key={group.category_id} className="rounded-[28px] border border-ink/10 bg-white/70 p-5">
                <h3 className="font-serif text-2xl font-bold">{group.category_name_it}</h3>
                <p className="mt-2 text-sm text-ink/55">Solo ritiro presso IschiaMotion Point.</p>
                <div className="mt-3">
                  <span className="rounded-full bg-green-deep/10 px-3 py-1 text-xs font-bold text-green-deep">
                    {deliveryMethodLabels.it.pickup_point}
                  </span>
                </div>
              </div>
            );
          }

          return <CategoryForm key={group.category_id} group={group} />;
        })}
      </div>
    </>
  );
}
