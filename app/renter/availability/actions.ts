"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRenter } from "@/lib/supabase/renter-auth";
import {
  createRenterAvailabilityRule,
  createRenterPriceRule,
  deleteRenterAvailabilityRule,
  deleteRenterPriceRule,
  updateRenterAvailability,
  updateRenterAvailabilityRule,
  updateRenterDeliveryCapability,
  updateRenterPriceRule,
  upsertRenterCategoryDeliveryCapability
} from "@/lib/supabase/queries/renter";
import type { BookingDeliveryMethod } from "@/lib/types";

function getReturnPath(formData: FormData) {
  const path = String(formData.get("returnPath") || "/renter/availability");
  return path.startsWith("/renter/") && !path.startsWith("//") ? path : "/renter/availability";
}

function isValidIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export async function saveRenterAvailability(formData: FormData) {
  const session = await requireRenter("/renter/availability");

  if (session.denied) {
    redirect("/renter/availability?error=Accesso%20negato");
  }

  const renterId = String(formData.get("renterId") || "");
  const categoryId = String(formData.get("categoryId") || "");
  const isOpen = String(formData.get("isOpen") || "false") === "true";
  const reason = String(formData.get("reason") || "");

  if (!renterId || !categoryId) {
    redirect("/renter/availability?error=Configurazione%20disponibilit%C3%A0%20non%20valida");
  }

  const { error } = await updateRenterAvailability({
    accessToken: session.accessToken,
    renterId,
    categoryId,
    isOpen,
    reason
  });

  revalidatePath("/renter/availability");

  if (error) {
    redirect(`/renter/availability?error=${encodeURIComponent(error)}`);
  }

  redirect("/renter/availability?saved=1");
}

export async function saveCategoryDeliveryCapabilityAction(formData: FormData) {
  const session = await requireRenter("/renter/availability");

  if (session.denied) {
    redirect("/renter/availability?error=Accesso%20negato");
  }

  const renterId = String(formData.get("renterId") || "");
  const categoryId = String(formData.get("categoryId") || "");
  const categorySlug = String(formData.get("categorySlug") || "");
  const notes = String(formData.get("notes") || "");

  if (!renterId || !categoryId || !categorySlug) {
    redirect("/renter/availability?error=Configurazione%20non%20valida");
  }

  const portZones = formData.getAll("port_zones").map((z) => String(z).trim()).filter(Boolean);
  const hotelZones = formData.getAll("hotel_zones").map((z) => String(z).trim()).filter(Boolean);

  const methods: Array<{ method: BookingDeliveryMethod; field: string; zones: string[] }> = [
    { method: "pickup_point", field: "enabled_pickup_point", zones: [] },
    { method: "port_delivery", field: "enabled_port_delivery", zones: portZones },
    { method: "hotel_delivery", field: "enabled_hotel_delivery", zones: hotelZones }
  ];

  for (const { method, field, zones } of methods) {
    const isEnabled = String(formData.get(field) || "false") === "true";
    const { error } = await upsertRenterCategoryDeliveryCapability({
      accessToken: session.accessToken,
      renterId,
      categoryId,
      categorySlug,
      deliveryMethod: method,
      isEnabled,
      zones,
      notes
    });
    if (error) {
      revalidatePath("/renter/availability");
      redirect(`/renter/availability?error=${encodeURIComponent(error)}`);
    }
  }

  revalidatePath("/renter/availability");
  redirect("/renter/availability?saved=1");
}

export async function saveRenterDeliveryCapability(formData: FormData) {
  const session = await requireRenter("/renter/availability");

  if (session.denied) {
    redirect("/renter/availability?error=Accesso%20negato");
  }

  const renterId = String(formData.get("renterId") || "");
  const deliveryMethod = String(formData.get("deliveryMethod") || "") as BookingDeliveryMethod;
  const isEnabled = String(formData.get("isEnabled") || "false") === "true";
  const zones = String(formData.get("zones") || "")
    .split(",")
    .map((zone) => zone.trim())
    .filter(Boolean);
  const notes = String(formData.get("notes") || "");

  if (!renterId || !deliveryMethod) {
    redirect("/renter/availability?error=Configurazione%20consegna%20non%20valida");
  }

  const { error } = await updateRenterDeliveryCapability({
    accessToken: session.accessToken,
    renterId,
    deliveryMethod,
    isEnabled,
    zones,
    notes
  });

  revalidatePath("/renter/availability");

  if (error) {
    redirect(`/renter/availability?error=${encodeURIComponent(error)}`);
  }

  redirect("/renter/availability?saved=1");
}

export async function createRenterAvailabilityRuleAction(formData: FormData) {
  const session = await requireRenter("/renter/availability");

  if (session.denied) {
    redirect("/renter/availability?error=Accesso%20negato");
  }

  const vehicleValue = String(formData.get("vehicle") || "");
  const [vehicleId, renterId] = vehicleValue.split("|");
  const ruleId = String(formData.get("ruleId") || "");
  const dateFrom = String(formData.get("dateFrom") || "");
  const dateTo = String(formData.get("dateTo") || "");
  const isClosed = formData.get("isClosed") === "on";
  const parsedMinRentalDays = Number(formData.get("minRentalDays") || "1");
  const minRentalDays = Number.isFinite(parsedMinRentalDays) ? Math.max(Math.trunc(parsedMinRentalDays), 1) : 1;
  const notes = String(formData.get("notes") || "");

  if (!vehicleId || !renterId || !dateFrom || !dateTo) {
    redirect("/renter/availability?error=Compila%20veicolo%20e%20date");
  }

  if (dateTo < dateFrom) {
    redirect("/renter/availability?error=La%20data%20fine%20deve%20essere%20successiva%20alla%20data%20inizio");
  }

  const { error } = ruleId
    ? await updateRenterAvailabilityRule({
      accessToken: session.accessToken,
      ruleId,
      vehicleId,
      renterId,
      dateFrom,
      dateTo,
      isClosed,
      minRentalDays,
      notes
    })
    : await createRenterAvailabilityRule({
      accessToken: session.accessToken,
      vehicleId,
      renterId,
      dateFrom,
      dateTo,
      isClosed,
      minRentalDays,
      notes
    });

  revalidatePath("/renter/availability");

  if (error) {
    redirect(`/renter/availability?error=${encodeURIComponent(error)}`);
  }

  redirect("/renter/availability?saved=1");
}

export async function deleteRenterAvailabilityRuleAction(formData: FormData) {
  const session = await requireRenter("/renter/availability");

  if (session.denied) {
    redirect("/renter/availability?error=Accesso%20negato");
  }

  const ruleId = String(formData.get("ruleId") || "");

  if (!ruleId) {
    redirect("/renter/availability?error=Regola%20non%20valida");
  }

  const { error } = await deleteRenterAvailabilityRule({
    accessToken: session.accessToken,
    ruleId
  });

  revalidatePath("/renter/availability");

  if (error) {
    redirect(`/renter/availability?error=${encodeURIComponent(error)}`);
  }

  redirect("/renter/availability?saved=1");
}

export async function savePriceRuleAction(formData: FormData) {
  const returnPath = getReturnPath(formData);
  const session = await requireRenter(returnPath);

  if (session.denied) {
    redirect(`${returnPath}?error=Accesso%20negato`);
  }

  const vehicleValue = String(formData.get("vehicle") || "");
  const [vehicleId, renterId] = vehicleValue.split("|");
  const ruleId = String(formData.get("priceRuleId") || "");
  const name = String(formData.get("name") || "");
  const dateFrom = String(formData.get("dateFrom") || "");
  const dateTo = String(formData.get("dateTo") || "");
  const priceRaw = Number(formData.get("pricePerDay") || "0");
  const pricePerDay = Number.isFinite(priceRaw) && priceRaw >= 0 ? priceRaw : 0;
  const minRentalDays = Math.max(Math.trunc(Number(formData.get("minRentalDays") || "1")), 1);
  const isActive = formData.get("isActive") !== "false";
  const notes = String(formData.get("notes") || "");

  if (!vehicleId || !renterId || !dateFrom || !dateTo) {
    redirect(`${returnPath}?error=Compila%20veicolo%20e%20date`);
  }

  if (!isValidIsoDate(dateFrom) || !isValidIsoDate(dateTo)) {
    redirect(`${returnPath}?error=Formato%20date%20non%20valido`);
  }

  if (new Date(`${dateTo}T00:00:00Z`).getTime() < new Date(`${dateFrom}T00:00:00Z`).getTime()) {
    redirect(`${returnPath}?error=La%20data%20fine%20deve%20essere%20successiva%20o%20uguale%20alla%20data%20inizio`);
  }

  const { error } = ruleId
    ? await updateRenterPriceRule({
      accessToken: session.accessToken,
      ruleId,
      vehicleId,
      renterId,
      name,
      dateFrom,
      dateTo,
      pricePerDay,
      minRentalDays,
      isActive,
      notes
    })
    : await createRenterPriceRule({
      accessToken: session.accessToken,
      vehicleId,
      renterId,
      name,
      dateFrom,
      dateTo,
      pricePerDay,
      minRentalDays,
      isActive,
      notes
    });

  revalidatePath("/renter/availability");
  revalidatePath("/renter/pricing");

  if (error) {
    redirect(`${returnPath}?error=${encodeURIComponent(error)}`);
  }

  redirect(`${returnPath}?saved=1`);
}

export async function deletePriceRuleAction(formData: FormData) {
  const returnPath = getReturnPath(formData);
  const session = await requireRenter(returnPath);

  if (session.denied) {
    redirect(`${returnPath}?error=Accesso%20negato`);
  }

  const ruleId = String(formData.get("priceRuleId") || "");

  if (!ruleId) {
    redirect(`${returnPath}?error=Regola%20prezzo%20non%20valida`);
  }

  const { error } = await deleteRenterPriceRule({
    accessToken: session.accessToken,
    ruleId
  });

  revalidatePath("/renter/availability");
  revalidatePath("/renter/pricing");

  if (error) {
    redirect(`${returnPath}?error=${encodeURIComponent(error)}`);
  }

  redirect(`${returnPath}?saved=1`);
}
