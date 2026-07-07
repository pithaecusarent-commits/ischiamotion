"use client";
import type { Locale } from "@/lib/types";

export function ManageCookiesButton({ locale }: { locale: Locale }) {
  return (
    <button
      type="button"
      className="footer-manage-cookies"
      onClick={() => window.dispatchEvent(new Event("im_manage_cookies"))}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "10px 12px",
        minHeight: 44,
        minWidth: 44,
        font: "inherit",
        color: "inherit",
        textDecoration: "underline",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {locale === "it" ? "Preferenze cookie" : "Cookie preferences"}
    </button>
  );
}
