"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { m } from "motion/react";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";
import { easings } from "@/lib/animation/easings";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotionPreference();

  return (
    <>
      {children}
      {!reducedMotion ? (
        <m.span
          key={pathname}
          className="pageTransitionWipe"
          initial={{ scaleY: 1, transformOrigin: "top" }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.62, ease: easings.standard }}
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}
