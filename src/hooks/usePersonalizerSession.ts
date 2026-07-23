"use client";

import { useEffect, useState } from "react";
import { getMockupPreset } from "@/data/mockups";
import type { BlendMode, LogoColorMode, LogoTransform, MockupId, PrintFinish } from "@/types/mockup";

const storageKey = "cartpaper_personalizer_state";

export type StoredPersonalizerState = {
  selectedMockupId: MockupId;
  logoMode: LogoColorMode;
  customColor: string;
  blendMode: BlendMode;
  printFinish: PrintFinish;
  transformsByMockup: Record<MockupId, LogoTransform>;
  backgroundMethod: "none" | "transparent" | "local" | "advanced";
};

function normalizeState(initialState: StoredPersonalizerState, stored: Partial<StoredPersonalizerState> & { transform?: LogoTransform }) {
  const selectedMockupId = stored.selectedMockupId ?? initialState.selectedMockupId;
  const storedFinish = stored.printFinish as string | undefined;
  const transformsByMockup = {
    ...initialState.transformsByMockup,
    ...(stored.transformsByMockup ?? {}),
  };

  if (stored.transform && !stored.transformsByMockup?.[selectedMockupId]) {
    transformsByMockup[selectedMockupId] = stored.transform;
  }

  return {
    ...initialState,
    ...stored,
    selectedMockupId,
    printFinish:
      storedFinish === "matte-ink" || storedFinish === "white-ink" || storedFinish === "gold-foil"
        ? storedFinish
        : getMockupPreset(selectedMockupId).defaultFinish,
    transformsByMockup,
  } satisfies StoredPersonalizerState;
}

export function usePersonalizerSession(initialState: StoredPersonalizerState) {
  const [state, setState] = useState<StoredPersonalizerState>(() => {
    if (typeof sessionStorage === "undefined") return initialState;

    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        return normalizeState(initialState, JSON.parse(stored));
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
