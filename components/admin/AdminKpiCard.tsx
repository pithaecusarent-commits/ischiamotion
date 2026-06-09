type Props = {
  label: string;
  value: number;
  detail: string;
  available: boolean;
  icon: string;
  tone?: "default" | "attention" | "success" | "info";
  href?: string;
  suffix?: string;
};

const toneConfig = {
  default: {
    card: "border-ink/10 bg-white hover:border-ink/20",
    icon: "bg-slate-100 text-ink/60",
    dot: "bg-ink/20",
    value: "text-ink",
  },
  attention: {
    card: "border-amber-200 bg-gradient-to-br from-amber-50 to-white hover:border-amber-300",
    icon: "bg-amber-100 text-amber-700",
    dot: "bg-gold",
    value: "text-amber-900",
  },
  success: {
    card: "border-sea/20 bg-gradient-to-br from-mint/20 to-white hover:border-sea/30",
    icon: "bg-sea/10 text-sea",
    dot: "bg-sea",
    value: "text-green-deep",
  },
  info: {
    card: "border-sea/15 bg-gradient-to-br from-mint/10 to-white hover:border-sea/25",
    icon: "bg-mint/20 text-green-deep",
    dot: "bg-sea/60",
    value: "text-green-deep",
  },
};

type ToneKey = keyof typeof toneConfig;

export function AdminKpiCard({
  label,
  value,
  detail,
  available,
  icon,
  tone = "default",
  href,
  suffix,
}: Props) {
  const cfg = toneConfig[tone as ToneKey] ?? toneConfig.default;

  const baseClass = `group flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${cfg.card} ${href ? "cursor-pointer" : ""}`;

  const inner = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span
          aria-hidden="true"
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-black shadow-sm ${cfg.icon}`}
        >
          {icon}
        </span>
        <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full shadow-[0_0_0_4px_rgba(0,0,0,0.06)] ${cfg.dot}`} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-ink/40">{label}</p>
        <p className={`mt-0.5 text-3xl font-black leading-none ${cfg.value}`}>
          {available ? (
            <>
              {value}
              {suffix && <span className="text-xl">{suffix}</span>}
            </>
          ) : (
            "—"
          )}
        </p>
      </div>
      <p className="text-xs font-semibold leading-4 text-ink/50">
        {available ? detail : "Dato non disponibile"}
      </p>
    </>
  );

  if (href) {
    return <a className={baseClass} href={href}>{inner}</a>;
  }
  return <div className={baseClass}>{inner}</div>;
}
