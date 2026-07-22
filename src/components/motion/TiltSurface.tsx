"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { useFinePointer } from "@/hooks/useFinePointer";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

export function TiltSurface({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotionPreference();

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={(event) => {
        if (!finePointer || reducedMotion || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        ref.current.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 6}deg)`;
      }}
      onPointerLeave={() => {
        if (!ref.current) return;
        ref.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      }}
    >
      {children}
    </div>
  );
}
