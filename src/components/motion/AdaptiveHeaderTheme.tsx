"use client";

import { useEffect } from "react";

export function AdaptiveHeaderTheme() {
  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-header-theme]"));

    const syncScrolled = () => {
      root.dataset.headerScrolled = window.scrollY > 24 ? "true" : "false";
    };

    syncScrolled();
    window.addEventListener("scroll", syncScrolled, { passive: true });

    if (sections.length === 0) {
      root.dataset.headerTheme = "light";
      return () => window.removeEventListener("scroll", syncScrolled);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const theme = visible?.target.getAttribute("data-header-theme");
        if (theme === "dark" || theme === "light" || theme === "lime") {
          root.dataset.headerTheme = theme;
        }
      },
      {
        rootMargin: "-18% 0px -64% 0px",
        threshold: [0.12, 0.24, 0.48, 0.72],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      window.removeEventListener("scroll", syncScrolled);
      observer.disconnect();
    };
  }, []);

  return null;
}
