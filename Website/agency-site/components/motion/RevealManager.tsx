"use client";

import { useEffect } from "react";

export function RevealManager() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".v2-reveal"),
    );

    if (!elements.length) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const lightweightViewport = window.matchMedia("(max-width: 768px)").matches;

    if (prefersReducedMotion || lightweightViewport) {
      elements.forEach((element) => {
        element.classList.add("v2-reveal-visible", "v2-reveal-no-motion");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("v2-reveal-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -6% 0px",
      },
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
