type Props = {
  title: string;
  description: string;
  href: string;
  accent: string;
  icon: string;
  external?: boolean;
  pendingCount?: number;
};

export function AdminQuickAction({
  title,
  description,
  href,
  accent,
  icon,
  external = false,
  pendingCount,
}: Props) {
  const hasPending = pendingCount !== undefined && pendingCount > 0;

  return (
    <a
      className="group flex min-h-[44px] flex-row items-center gap-3 rounded-xl border border-ink/10 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sea/30 hover:shadow-md sm:flex-col sm:items-start sm:gap-0 sm:p-4"
      href={href}
      rel={external ? "noopener noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      {/* Icon row */}
      <div className="flex w-full items-center justify-between gap-2 sm:flex-row">
        <div
          aria-hidden="true"
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-black shadow-sm sm:h-10 sm:w-10 ${accent}`}
        >
          {icon}
        </div>

        {/* Desktop: badge + arrow */}
        <div className="hidden sm:flex sm:items-center sm:gap-2">
          {hasPending && (
            <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-black text-amber-700">
              {pendingCount}
            </span>
          )}
          <span className="grid h-7 w-7 place-items-center rounded-full border border-ink/10 bg-white/80 text-xs font-black text-ink/35 transition group-hover:border-sea/30 group-hover:text-sea">
            →
          </span>
        </div>
      </div>

      {/* Title + description */}
      <div className="min-w-0 flex-1 sm:mt-3 sm:flex-none">
        <h3 className="truncate text-sm font-black text-ink">{title}</h3>
        <p className="mt-0.5 line-clamp-1 text-xs font-semibold text-ink/50 sm:mt-1 sm:line-clamp-none sm:leading-4">
          {description}
        </p>
      </div>

      {/* Mobile: badge + arrow */}
      <div className="flex shrink-0 items-center gap-1.5 sm:hidden">
        {hasPending && (
          <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-black text-amber-700">
            {pendingCount}
          </span>
        )}
        <span className="text-sm font-bold text-ink/30 transition group-hover:text-sea">→</span>
      </div>
    </a>
  );
}
