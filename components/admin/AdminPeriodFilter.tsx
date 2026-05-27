"use client";

import { useState } from "react";

type Period = "oggi" | "settimana" | "mese";

const options: { key: Period; label: string }[] = [
  { key: "oggi", label: "Oggi" },
  { key: "settimana", label: "Settimana" },
  { key: "mese", label: "Mese" },
];

export function AdminPeriodFilter() {
  const [period, setPeriod] = useState<Period>("mese");

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-ink/10 bg-white p-1 shadow-sm">
      {options.map(({ key, label }) => (
        <button
          className={`min-h-[32px] rounded-full px-3 py-1 text-xs font-black transition-all duration-150 ${
            period === key
              ? "bg-green-deep text-white shadow-sm"
              : "text-ink/45 hover:text-ink"
          }`}
          key={key}
          onClick={() => setPeriod(key)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
