"use client";
import type { Locale } from "@/lib/types";

export function ManageCookiesButton({ locale }: { locale: Locale }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("im_manage_cookies"))}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        font: "inherit",
        color: "inherit",
        textDecoration: "underline",
        display: "inline",
      }}
    >
      {locale === "it" ? "Gestisci cookie" : "Manage cookies"}
    </button>
  );
}
