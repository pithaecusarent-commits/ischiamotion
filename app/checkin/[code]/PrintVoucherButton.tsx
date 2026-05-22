"use client";

export function PrintVoucherButton() {
  return (
    <button className="mt-6 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white print-hidden" type="button" onClick={() => window.print()}>
      Stampa voucher
    </button>
  );
}
