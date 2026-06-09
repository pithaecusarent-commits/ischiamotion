import type { Locale } from "@/lib/types";
import { t } from "@/lib/i18n";

export function TrustBar({ locale }: { locale: Locale }) {
  const copy = t(locale);

  return (
    <div className="trust-bar reveal">
      {copy.trust.map(([value, label]) => (
        <div className="trust-item" key={label}>
          <div className="trust-val">{value}</div>
          <div className="trust-label">{label}</div>
        </div>
      ))}
    </div>
  );
}
