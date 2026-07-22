"use client";

import { useEffect, useState } from "react";
import type { BlendMode, LogoColorMode, LogoTransform, MockupId, PrintFinish } from "@/types/mockup";

const storageKey = "cartpaper_personalizer_state";

export type StoredPersonalizerState = {
  selectedMockupId: MockupId;
  logoMode: LogoColorMode;
  customColor: string;
  blendMode: BlendMode;
  printFinish: PrintFinish;
  transform: LogoTransform;
  backgroundMethod: "none" | "transparent" | "local" | "advanced";
};

export function usePersonalizerSession(initialState: StoredPersonalizerState) {
  const [state, setState] = useState<StoredPersonalizerState>(() => {
    if (typeof sessionStorage === "undefined") return initialState;

    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        return { ...initialState, ...JSON.parse(stored) };
      }
    } catch {
      return initialState;
    }

    return initialState;
  });

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  return [state, setState, true] as const;
}
