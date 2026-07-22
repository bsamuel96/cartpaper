"use client";

import type { ReactNode } from "react";
import { useRef } from "react";

export function DragMarquee({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const start = useRef({ x: 0, left: 0, dragging: false });

  return (
    <div
      ref={ref}
      className={className}
      onPointerDown={(event) => {
        if (!ref.current) return;
        start.current = { x: event.clientX, left: ref.current.scrollLeft, dragging: true };
        ref.current.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!ref.current || !start.current.dragging) return;
        ref.current.scrollLeft = start.current.left - (event.clientX - start.current.x);
      }}
      onPointerUp={(event) => {
        start.current.dragging = false;
        ref.current?.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => {
        start.current.dragging = false;
      }}
    >
      {children}
    </div>
  );
}
