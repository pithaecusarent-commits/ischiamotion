"use client";

import { useMemo, useState } from "react";
import type { AdminBookingItem } from "@/lib/supabase/queries/admin-bookings";

type WhatsAppCopilotProps = {
  booking: AdminBookingItem;
  message: string;
};

function normalizePhone(phone: string | null) {
  if (!phone) return "";
  const digits = phone.replace(/[\s+().-]/g, "");
  if (/^\d{10}$/.test(digits) && digits.startsWith("3")) return `39${digits}`;
  return digits;
}

export function WhatsAppCopilot({ booking, message }: WhatsAppCopilotProps) {
  const [copied, setCopied] = useState<"message" | "phone" | null>(null);
  const normalizedPhone = useMemo(() => normalizePhone(booking.customer_phone), [booking.customer_phone]);
  const whatsappUrl = normalizedPhone ? `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}` : "";

  async function copy(value: string, target: "message" | "phone") {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(target);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div className="rounded-[24px] border border-ink/10 bg-white/80 p-4 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">WhatsApp Copilot</div>
          <p className="mt-1 text-sm text-ink/55">Messaggio pronto, senza conferme automatiche o dati partner.</p>
        </div>
        {booking.customer_language === "en" ? (
          <span className="rounded-full bg-sea/10 px-3 py-1 text-xs font-bold text-green-deep">EN</span>
        ) : (
          <span className="rounded-full bg-sea/10 px-3 py-1 text-xs font-bold text-green-deep">IT</span>
        )}
      </div>

      <p className="mt-4 whitespace-pre-wrap rounded-2xl border border-ink/10 bg-cream/70 p-4 text-sm leading-6 text-ink/75">
        {message}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-white transition hover:bg-green-deep"
          type="button"
          onClick={() => copy(message, "message")}
        >
          {copied === "message" ? "Copiato" : "Copia messaggio"}
        </button>
        {normalizedPhone ? (
          <a
            className="rounded-full border border-sea/20 bg-sea/10 px-4 py-2 text-xs font-bold text-green-deep transition hover:border-sea/40"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            Apri WhatsApp
          </a>
        ) : (
          <button
            className="cursor-not-allowed rounded-full border border-ink/10 bg-stone-100 px-4 py-2 text-xs font-bold text-stone-500"
            type="button"
            disabled
            title="Telefono cliente mancante"
          >
            Telefono cliente mancante
          </button>
        )}
        {normalizedPhone ? (
          <button
            className="rounded-full border border-ink/10 px-4 py-2 text-xs font-bold text-ink/65 transition hover:border-sea/30 hover:text-green-deep"
            type="button"
            onClick={() => copy(normalizedPhone, "phone")}
          >
            {copied === "phone" ? "Copiato" : "Copia numero"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
