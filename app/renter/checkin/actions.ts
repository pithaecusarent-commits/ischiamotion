"use server";

import { redirect } from "next/navigation";
import { requireRenter } from "@/lib/supabase/renter-auth";
import { createRenterCheckin } from "@/lib/supabase/queries/renter";

export async function submitRenterCheckin(formData: FormData) {
  const session = await requireRenter("/renter/checkin");

  if (session.denied) {
    redirect("/renter/checkin?outcome=denied&message=Accesso%20negato");
  }

  const voucherCode = String(formData.get("voucherCode") || "").trim();

  if (!voucherCode) {
    redirect("/renter/checkin?outcome=invalid&message=Inserisci%20un%20codice%20voucher");
  }

  const { result, error } = await createRenterCheckin({
    accessToken: session.accessToken,
    voucherCode
  });

  if (error || !result) {
    redirect(`/renter/checkin?outcome=invalid&message=${encodeURIComponent(error || "Voucher non valido")}`);
  }

  const params = new URLSearchParams({
    outcome: result.outcome,
    message: result.message
  });

  if (result.booking_code) {
    params.set("booking", result.booking_code);
  }

  redirect(`/renter/checkin?${params.toString()}`);
}
