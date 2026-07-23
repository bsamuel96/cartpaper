"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createConsentRecord,
  defaultConsentCategories,
  parseConsent,
  readCookie,
  writeConsentCookie,
  type ConsentCategories,
  type ConsentRecord,
} from "@/lib/consent/consent";

function readBrowserConsent() {
  const cookieRecord = parseConsent(readCookie(document.cookie));
  if (cookieRecord) return cookieRecord;

  try {
    return parseConsent(window.localStorage.getItem("cartpaper_consent"));
  } catch {
    return null;
  }
}

export function useConsent() {
  const [record, setRecord] = useState<ConsentRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setRecord(readBrowserConsent());
      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const save = useCallback((categories: Partial<ConsentCategories>) => {
    const next = createConsentRecord({ ...defaultConsentCategories, ...categories });
    writeConsentCookie(next);
    try {
      window.localStorage.setItem("cartpaper_consent", JSON.stringify(next));
    } catch {
      // Cookie storage above remains the primary persistence path.
    }
    setRecord(next);
  }, []);

  return {
    loaded,
    record,
    hasDecision: Boolean(record),
    save,
  };
}
