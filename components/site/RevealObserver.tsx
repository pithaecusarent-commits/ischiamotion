"use client";

import { useEffect } from "react";

export function RevealObserver() {
  useEffect(() => {
    let observer: IntersectionObserver | undefined;

    function setup() {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer!.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12 }
      );
      document.querySelectorAll(".reveal").forEach((el) => observer!.observe(el));
    }

    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(setup);
      return () => {
        cancelIdleCallback(id);
        observer?.disconnect();
      };
    }
    setup();
    return () => observer?.disconnect();
  }, []);

  return null;
}
