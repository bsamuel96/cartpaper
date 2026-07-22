"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { useFinePointer } from "@/hooks/useFinePointer";

export function PointerSpotlight({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={(event) => {
        if (!finePointer || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        ref.current.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
        ref.current.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
      }}
    >
      {children}
    </div>
  );
}
