"use client";

import { useEffect, useState } from "react";
import { updateBookingPaymentAction } from "@/app/admin/bookings/[id]/payment-actions";
import { paymentMethodLabels, paymentStatusLabels, paymentTypeLabels } from "@/lib/booking-labels";
import type { BookingPaymentMethod, BookingPaymentStatus, BookingPaymentType } from "@/lib/types";

type Props = {
  bookingId: string;
  paymentType: BookingPaymentType;
  paymentMethod: BookingPaymentMethod;
  paymentStatus: BookingPaymentStatus;
  totalAmount: number | null;
  depositAmount: number | null;
  balanceDue: number | null;
  paymentNotes: string | null;
  successMessage?: boolean;
  errorMessage?: boolean;
};

const paymentTypeOptions: BookingPaymentType[]   = ["pay_on_pickup", "deposit_required", "prepaid_full"];
const paymentMethodOptions: BookingPaymentMethod[] = ["unknown", "cash", "card", "bank_transfer", "future_online_card"];
const paymentStatusOptions: BookingPaymentStatus[] = ["unpaid", "deposit_pending", "deposit_paid", "paid", "refunded", "cancelled"];

function fmt(v: number | null) { return v !== null ? String(v) : ""; }

export function PaymentForm({
  bookingId,
  paymentType: initialType,
  paymentMethod: initialMethod,
  paymentStatus: initialStatus,
  totalAmount: initialTotal,
  depositAmount: initialDeposit,
  balanceDue: initialBalance,
  paymentNotes: initialNotes,
  successMessage,
  errorMessage
}: Props) {
  const [total,   setTotal]   = useState(fmt(initialTotal));
  const [deposit, setDeposit] = useState(fmt(initialDeposit));
  const [balance, setBalance] = useState(fmt(initialBalance));

  useEffect(() => {
    const t = parseFloat(total);
    const d = parseFloat(deposit);
    if (!isNaN(t) && !isNaN(d)) {
      setBalance(String(Math.max(t - d, 0)));
    } else if (!isNaN(t) && deposit === "") {
      setBalance(fmt(null));
    }
  }, [total, deposit]);

  return (
    <div className="mt-4 rounded-[28px] border border-amber-200/60 bg-amber-50/40 p-6">
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Gestione pagamento</div>
      <h2 className="mt-2 font-serif text-2xl font-bold text-ink">Aggiorna pagamento</h2>
      <p className="mt-1 text-sm text-ink/60">Gestione manuale importi e stato pagamento. Se richiedi un acconto, le note pagamento vengono usate anche nell&apos;email cliente.</p>

      {successMessage ? (
        <div className="mt-4 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-semibold text-green-deep">
          Pagamento aggiornato correttamente.
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-4 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
          Impossibile aggiornare il pagamento. Riprova.
        </div>
      ) : null}

      <form action={updateBookingPaymentAction} className="mt-5 grid gap-4">
        <input type="hidden" name="bookingId" value={bookingId} />

        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Tipo pagamento
            <select
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-sea/50"
              name="payment_type"
              defaultValue={initialType}
            >
              {paymentTypeOptions.map((opt) => (
                <option key={opt} value={opt}>{paymentTypeLabels.it[opt]}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Metodo pagamento
            <select
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-sea/50"
              name="payment_method"
              defaultValue={initialMethod}
            >
              {paymentMethodOptions.map((opt) => (
                <option key={opt} value={opt}>{paymentMethodLabels.it[opt]}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Stato pagamento
            <select
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-sea/50"
              name="payment_status"
              defaultValue={initialStatus}
            >
              {paymentStatusOptions.map((opt) => (
                <option key={opt} value={opt}>{paymentStatusLabels.it[opt]}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Totale (€)
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
              name="total_amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="es. 180"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Acconto (€)
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-sea/50"
              name="deposit_amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="es. 60"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-ink/70">
            Saldo (€)
            <input
              className="rounded-2xl border border-ink/10 bg-white/60 px-4 py-3 text-sm outline-none focus:border-sea/50"
              name="balance_due"
              type="number"
              min="0"
              step="0.01"
              placeholder="calcolato automaticamente"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              title="Calcolato automaticamente come totale − acconto"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Note pagamento
          <textarea
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-sea/50"
            name="payment_notes"
            rows={3}
            defaultValue={initialNotes || ""}
            placeholder="Coordinate bonifico, istruzioni pagamento o note operative"
          />
        </label>

        <div className="flex justify-end">
          <button className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white" type="submit">
            Aggiorna pagamento
          </button>
        </div>
      </form>
    </div>
  );
}
