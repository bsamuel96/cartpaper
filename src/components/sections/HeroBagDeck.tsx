"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { mockupPresets } from "@/data/mockups";

const brandMarkByBag: Record<string, string> = {
  "black-luxury": "/brand/cartpaper-mark-dark.png",
};

const heroSwatches: Record<string, string> = {
  "kraft-classic": "Kraft",
  "white-premium": "Alb",
  "black-luxury": "Negru",
  "color-pop": "Coral",
};

export function HeroBagDeck() {
  const [activeIndex, setActiveIndex] = useState(0);
  const startXRef = useRef<number | null>(null);
  const active = mockupPresets[activeIndex];

  function move(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + mockupPresets.length) % mockupPresets.length);
  }

  function finishSwipe(clientX: number) {
    if (startXRef.current === null) return;
    const delta = clientX - startXRef.current;
    startXRef.current = null;
    if (Math.abs(delta) < 44) return;
    move(delta < 0 ? 1 : -1);
  }

  return (
    <div className="heroBagDeck" aria-label="Previzualizare pungi personalizate">
      <div
        className="heroDeckStage"
        onPointerDown={(event) => {
          startXRef.current = event.clientX;
        }}
        onPointerUp={(event) => finishSwipe(event.clientX)}
        onPointerCancel={() => {
          startXRef.current = null;
        }}
      >
        <article className="heroDeckCard">
          <Image
            src={active.posterSrc ?? active.thumbnailSrc}
            width={1200}
            height={1500}
            priority
            alt={active.accessibleDescription}
          />
          <Image
            className={`heroDeckLogo ${active.id === "black-luxury" ? "heroDeckLogoDark" : "heroDeckLogoLight"}`}
            src={brandMarkByBag[active.id] ?? "/brand/cartpaper-mark-light.png"}
            width={512}
            height={512}
            alt=""
            aria-hidden="true"
          />
        </article>
      </div>
      <div className="heroDeckControls">
        <button type="button" className="iconButton" aria-label="Punga anterioară" onClick={() => move(-1)}>
          <ChevronLeft aria-hidden="true" size={22} />
        </button>
        <div className="heroSwatchPanel">
          <strong>{active.label}</strong>
          <div className="heroSwatches" aria-label="Alege culoarea pungii din hero">
            {mockupPresets.map((mockup, index) => (
              <button
                key={mockup.id}
                type="button"
                className={`heroSwatch heroSwatch-${mockup.id}`}
                aria-current={index === activeIndex ? "true" : undefined}
                aria-label={`Arată ${mockup.label}`}
                onClick={() => setActiveIndex(index)}
              >
                <span aria-hidden="true" />
                <small>{heroSwatches[mockup.id] ?? mockup.label}</small>
              </button>
            ))}
          </div>
        </div>
        <button type="button" className="iconButton" aria-label="Punga următoare" onClick={() => move(1)}>
          <ChevronRight aria-hidden="true" size={22} />
        </button>
      </div>
      <p className="srOnly" aria-live="polite">
        {active.label}
      </p>
    </div>
  );
}
