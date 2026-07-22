"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { m } from "motion/react";
import { useState } from "react";
import { mockupPresets } from "@/data/mockups";

const brandMarkByBag: Record<string, string> = {
  "black-luxury": "/brand/cartpaper-mark-dark.png",
};

const paletteColors = ["#d7a86f", "#fffefa", "#11120e", "#cb4d45", "#172039", "#bded15"];

export function HeroBagDeck() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);
  const active = mockupPresets[activeIndex];

  function move(direction: -1 | 1) {
    setHintVisible(false);
    setActiveIndex((current) => (current + direction + mockupPresets.length) % mockupPresets.length);
  }

  return (
    <div className="heroBagDeck" aria-label="Previzualizare pungi personalizate">
      <div className="heroDeckStage">
        {mockupPresets.map((mockup, index) => {
          const offset = index - activeIndex;
          const wrappedOffset =
            Math.abs(offset) > mockupPresets.length / 2 ? offset - Math.sign(offset) * mockupPresets.length : offset;

          return (
            <m.article
              className="heroDeckCard"
              key={mockup.id}
              aria-hidden={index !== activeIndex}
              animate={{
                x: `${wrappedOffset * 13}%`,
                y: Math.abs(wrappedOffset) * 18,
                rotate: wrappedOffset * 5,
                scale: index === activeIndex ? 1 : 0.86,
                opacity: Math.abs(wrappedOffset) > 1 ? 0 : index === activeIndex ? 1 : 0.62,
                zIndex: mockupPresets.length - Math.abs(wrappedOffset),
              }}
              transition={{ type: "spring", stiffness: 170, damping: 22 }}
              drag={index === activeIndex ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -42) move(1);
                if (info.offset.x > 42) move(-1);
              }}
            >
              <Image
                src={mockup.posterSrc ?? mockup.thumbnailSrc}
                width={1200}
                height={1500}
                priority={index === activeIndex}
                alt={index === activeIndex ? mockup.accessibleDescription : ""}
              />
              <Image
                className={`heroDeckLogo ${mockup.id === "black-luxury" ? "heroDeckLogoDark" : "heroDeckLogoLight"}`}
                src={brandMarkByBag[mockup.id] ?? "/brand/cartpaper-mark-light.png"}
                width={512}
                height={512}
                alt=""
                aria-hidden="true"
              />
            </m.article>
          );
        })}
        {hintVisible ? <span className="heroSwipeHint">Glisează pentru a schimba punga</span> : null}
      </div>
      <div className="heroDeckControls">
        <button type="button" className="iconButton" aria-label="Punga anterioară" onClick={() => move(-1)}>
          <ChevronLeft aria-hidden="true" size={22} />
        </button>
        <span>
          {active.label}
          <small>{active.shortDescription}</small>
        </span>
        <button type="button" className="iconButton" aria-label="Punga următoare" onClick={() => move(1)}>
          <ChevronRight aria-hidden="true" size={22} />
        </button>
      </div>
      <div className="heroPalette" aria-label="Culori disponibile">
        {paletteColors.map((color) => (
          <span key={color} style={{ background: color }} />
        ))}
      </div>
    </div>
  );
}
