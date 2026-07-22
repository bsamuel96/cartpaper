"use client";

import { useCallback, useState } from "react";
import {
  createConsentRecord,
  defaultConsentCategories,
  parseConsent,
  readCookie,
  writeConsentCookie,
  type ConsentCategories,
  type ConsentRecord,
} from "@/lib/consent/consent";

export function useConsent() {
  const [record, setRecord] = useState<ConsentRecord | null>(() => {
    if (typeof document === "undefined") return null;
    return parseConsent(readCookie(document.cookie));
  });

  const save = useCallback((categories: Partial<ConsentCategories>) => {
    const next = createConsentRecord({ ...defaultConsentCategories, ...categories });
    writeConsentCookie(next);
    setRecord(next);
  }, []);

  return {
    loaded: true,
    record,
    hasDecision: Boolean(record),
    save,
  };
}
