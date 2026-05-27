"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminSearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/admin/bookings?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form className="flex w-full max-w-xs items-center gap-2 sm:max-w-sm" onSubmit={handleSubmit}>
      <div className="relative flex-1">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/35"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          className="h-10 w-full rounded-full border border-ink/10 bg-white/90 pl-9 pr-4 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink/35 focus:border-sea/40 focus:outline-none focus:ring-2 focus:ring-sea/15"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca cliente, richiesta…"
          type="search"
          value={query}
        />
      </div>
      <button
        aria-label="Avvia ricerca"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-green-deep text-white shadow-sm transition hover:bg-sea focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/40"
        type="submit"
      >
        <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </form>
  );
}
