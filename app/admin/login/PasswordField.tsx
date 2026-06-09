"use client";

import { useState } from "react";

export function PasswordField() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="grid gap-2 text-sm font-bold text-ink/70">
      Password
      <span className="relative block">
        <input
          className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 pr-12 text-base font-normal text-ink outline-none focus:border-sea/50"
          name="password"
          type={isVisible ? "text" : "password"}
          autoComplete="current-password"
          required
        />
        <button
          aria-label={isVisible ? "Nascondi password" : "Mostra password"}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink/55 hover:bg-sea/10 hover:text-green-deep"
          type="button"
          onClick={() => setIsVisible((value) => !value)}
        >
          {isVisible ? (
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M7.1 7.5C4.9 8.8 3.4 10.8 3 12c.8 2.4 4.3 6 9 6 1.5 0 2.9-.4 4.1-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.2 6.2A8.7 8.7 0 0 1 12 6c4.7 0 8.2 3.6 9 6-.2.7-.8 1.5-1.6 2.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path d="M3 12c.8-2.4 4.3-6 9-6s8.2 3.6 9 6c-.8 2.4-4.3 6-9 6s-8.2-3.6-9-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          )}
        </button>
      </span>
    </label>
  );
}
