"use client";

import type { ReactNode } from "react";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

export function ReducedMotionBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return useReducedMotionPreference() ? (fallback ?? children) : children;
}
