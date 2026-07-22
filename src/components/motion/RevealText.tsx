"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";
import { easings } from "@/lib/animation/easings";

export function RevealText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.span
      className={className}
      initial={{ y: 22, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.66, ease: easings.enter }}
    >
      {children}
    </m.span>
  );
}
