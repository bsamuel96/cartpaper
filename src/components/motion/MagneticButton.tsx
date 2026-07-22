"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { useFinePointer } from "@/hooks/useFinePointer";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

export function MagneticButton({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotionPreference();

  return (
    <span
      ref={ref}
      className={className}
      onPointerMove={(event) => {
        if (!finePointer || reducedMotion || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
        ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }}
      onPointerLeave={() => {
        if (!ref.current) return;
        ref.current.style.transform = "translate3d(0, 0, 0)";
      }}
    >
      {children}
    </span>
  );
}
