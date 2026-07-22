"use client";

import { useEffect, useRef, useState } from "react";
import { useConsent } from "@/hooks/useConsent";
import { defaultConsentCategories, type ConsentCategories } from "@/lib/consent/consent";

export function CookieConsent() {
  const { loaded, record, hasDecision, save } = useConsent();
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [categories, setCategories] = useState<ConsentCategories>(defaultConsentCategories);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const open = () => {
      lastFocusRef.current = document.activeElement as HTMLElement;
      setCategories(record?.categories ?? defaultConsentCategories);
      setPreferencesOpen(true);
    };
    window.addEventListener("cartpaper:open-cookie-settings", open);
    return () => window.removeEventListener("cartpaper:open-cookie-settings", open);
  }, [record?.categories]);

  useEffect(() => {
    const banner = document.querySelector<HTMLElement>(".cookieBanner");
    const height = banner ? `${banner.offsetHeight}px` : "0px";
    document.documentElement.style.setProperty("--cookie-banner-height", !hasDecision && loaded ? height : "0px");
  }, [hasDecision, loaded]);

  useEffect(() => {
    if (!preferencesOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button, input")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreferencesOpen(false);
        lastFocusRef.current?.focus();
      }
      if (event.key === "Tab" && dialogRef.current) {
        const focusables = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button, input, a"));
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [preferencesOpen]);

  function saveAndClose(nextCategories: Partial<ConsentCategories>) {
    save(nextCategories);
    setPreferencesOpen(false);
    lastFocusRef.current?.focus();
  }

  if (!loaded) return null;

  return (
    <>
      {!hasDecision ? (
        <section className="cookieBanner" aria-label="Consimțământ cookie">
          <p>
            Folosim cookie-uri necesare pentru funcționarea site-ului. Cu acordul tău, putem activa
            cookie-uri de analiză și marketing. Poți accepta, refuza sau personaliza opțiunile.
          </p>
          <div className="cookieActions">
            <button className="button buttonGhost" type="button" onClick={() => saveAndClose(defaultConsentCategories)}>
              Refuză opționale
            </button>
            <button
              className="button buttonSecondary"
              type="button"
              onClick={() => {
                lastFocusRef.current = document.activeElement as HTMLElement;
                setPreferencesOpen(true);
              }}
            >
              Personalizează
            </button>
            <button className="button buttonPrimary" type="button" onClick={() => saveAndClose({ analytics: true, marketing: true })}>
              Acceptă toate
            </button>
          </div>
        </section>
      ) : null}

      {preferencesOpen ? (
        <div className="modalLayer" role="presentation" onMouseDown={() => setPreferencesOpen(false)}>
          <div
            className="modalPanel"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-preferences-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modalHeader">
              <h2 id="cookie-preferences-title">Preferințe cookie</h2>
              <button className="iconButton" type="button" onClick={() => setPreferencesOpen(false)} aria-label="Închide">
                ×
              </button>
            </div>
            <div className="toggleList">
              <label className="toggleRow locked">
                <span>
                  <strong>Necesare</strong>
                  <small>Active permanent pentru funcționarea site-ului.</small>
                </span>
                <input type="checkbox" checked readOnly aria-label="Cookie-uri necesare active permanent" />
              </label>
              <label className="toggleRow">
                <span>
                  <strong>Analiză</strong>
                  <small>Ne ajută să înțelegem folosirea site-ului.</small>
                </span>
                <input
                  type="checkbox"
                  checked={categories.analytics}
                  onChange={(event) => setCategories((current) => ({ ...current, analytics: event.target.checked }))}
                />
              </label>
              <label className="toggleRow">
                <span>
                  <strong>Marketing</strong>
                  <small>Permite campanii și măsurare publicitară când sunt configurate.</small>
                </span>
                <input
                  type="checkbox"
                  checked={categories.marketing}
                  onChange={(event) => setCategories((current) => ({ ...current, marketing: event.target.checked }))}
                />
              </label>
            </div>
            <div className="modalActions">
              <button className="button buttonGhost" type="button" onClick={() => saveAndClose(defaultConsentCategories)}>
                Refuză opționale
              </button>
              <button className="button buttonSecondary" type="button" onClick={() => saveAndClose({ analytics: true, marketing: true })}>
                Acceptă toate
              </button>
              <button className="button buttonPrimary" type="button" onClick={() => saveAndClose(categories)}>
                Salvează preferințele
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
