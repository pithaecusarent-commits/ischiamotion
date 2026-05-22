"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRenter } from "@/lib/supabase/renter-auth";
import { updateRenterAvailability, updateRenterDeliveryCapability } from "@/lib/supabase/queries/renter";
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
