"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function ScrollProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  if (pathname.startsWith("/personalizeaza")) return null;

  return <span className="scrollProgress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />;
}
