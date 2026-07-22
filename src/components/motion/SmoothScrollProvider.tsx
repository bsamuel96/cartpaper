"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useFinePointer } from "@/hooks/useFinePointer";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (!finePointer || reducedMotion) return undefined;

    let rafId = 0;
    let destroyed = false;
    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;

    async function boot() {
      const { default: Lenis } = await import("lenis");
      if (destroyed) return;
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    void boot();

    return () => {
      destroyed = true;
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, [finePointer, reducedMotion]);

  return children;
}
