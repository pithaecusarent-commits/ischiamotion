"use client";

export function VoucherPrintButton() {
  return (
    <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white print-hidden" type="button" onClick={() => window.print()}>
      Stampa voucher
    </button>
  );
}
