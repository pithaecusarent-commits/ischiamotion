"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function HtmlLang() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = pathname.split("/")[1] === "en" ? "en" : "it";
  }, [pathname]);

  return null;
}
