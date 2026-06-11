import { isRenterPortalEnabled } from "@/lib/renter-portal";

const statuses = [
  { label: "Dominio", value: "Configurato" },
  { label: "Email", value: "Configurate" },
  { label: "QR voucher", value: "Interno" },
  { label: "Booking Intelligence", value: "Attiva" }
];

export function AdminSystemStatus() {
  const renterPortalEnabled = isRenterPortalEnabled();
  const visibleStatuses = [
    ...statuses,
    { label: "Area partner", value: renterPortalEnabled ? "Attiva" : "Interna" }
  ];

  return (
    <section className="rounded-2xl border border-ink/10 bg-gradient-to-br from-mint/10 via-white to-cream p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sea/70">Stato piattaforma</p>
          <h2 className="mt-1.5 font-serif text-xl font-bold text-green-deep">Configurazione</h2>
          <p className="mt-1 text-xs font-semibold leading-5 text-ink/50">
            Funzioni chiave configurate e operative.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-sea/20 bg-sea/10 px-3 py-1.5 text-xs font-black text-sea">
          Operativa
        </span>
      </div>
      <div className="mt-4 grid gap-2">
        {visibleStatuses.map((status) => (
          <div
            className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white/80 px-3.5 py-2.5 shadow-sm"
            key={status.label}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-sea shadow-[0_0_0_4px_rgba(0,151,171,0.12)]" />
              <span className="truncate text-xs font-bold text-ink/60">{status.label}</span>
            </div>
            <span className="shrink-0 rounded-full bg-sea/10 px-2.5 py-0.5 text-[10px] font-black text-sea">
              {status.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
