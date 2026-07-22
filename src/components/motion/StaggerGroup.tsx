"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";
import { easings } from "@/lib/animation/easings";

export function StaggerGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      className={className}
      variants={{
        hidden: { y: 18, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.52, ease: easings.enter } },
      }}
    >
      {children}
    </m.div>
  );
}
