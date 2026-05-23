"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRenter } from "@/lib/supabase/renter-auth";
import {
  createRenterAvailabilityRule,
  deleteRenterAvailabilityRule,
  updateRenterAvailability,
  updateRenterAvailabilityRule,
  updateRenterDeliveryCapability
} from "@/lib/supabase/queries/renter";
import type { BookingDeliveryMethod } from "@/lib/types";

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
    redirect("/renter/availability?error=Configurazione%20disponibilita%20non%20valida");
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
