"use client";

import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import { useRef, useState } from "react";

export function BeforeAfterPreview() {
  const [position, setPosition] = useState(56);
  const frameRef = useRef<HTMLDivElement>(null);

  function updateFromClientX(clientX: number) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(82, Math.max(18, Math.round(next))));
  }

  return (
    <div className="beforeAfterTeaser" style={{ "--split": `${position}%` } as React.CSSProperties}>
      <div
        ref={frameRef}
        className="beforeAfterCanvas"
        aria-label="Comparație logo cu fundal și logo fără fundal"
        onPointerDown={(event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture?.(event.pointerId);
          updateFromClientX(event.clientX);
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) updateFromClientX(event.clientX);
        }}
        onMouseDown={(event) => {
          event.preventDefault();
          updateFromClientX(event.clientX);
        }}
        onMouseMove={(event) => {
          if (event.buttons === 1) updateFromClientX(event.clientX);
        }}
      >
        <span className="beforeAfterLabel beforeAfterLabelLeft">Cu fundal</span>
        <span className="beforeAfterLabel beforeAfterLabelRight">Fără fundal</span>
        <Image
          src="/mockups/white-premium/poster.webp"
          width={1200}
          height={1500}
          loading="eager"
          alt="Pungă albă premium"
        />
        <div className="beforeAfterDirty" aria-hidden="true">
          <span className="demoLogoBox">
            <Image src="/brand/cartpaper-mark-light.png" width={512} height={512} alt="" />
          </span>
        </div>
        <div className="beforeAfterClean" aria-hidden="true">
          <Image src="/brand/cartpaper-mark-light.png" width={512} height={512} alt="" />
        </div>
        <label className="srOnly" htmlFor="before-after-range">
          Curățare fundal
        </label>
        <input
          id="before-after-range"
          className="beforeAfterRange"
          type="range"
          min="18"
          max="82"
          value={position}
          aria-valuetext={`${position}% fără fundal`}
          onChange={(event) => setPosition(Number(event.target.value))}
          onPointerDown={(event) => updateFromClientX(event.clientX)}
          onPointerMove={(event) => {
            if (event.buttons === 1) updateFromClientX(event.clientX);
          }}
          onMouseDown={(event) => updateFromClientX(event.clientX)}
          onMouseMove={(event) => {
            if (event.buttons === 1) updateFromClientX(event.clientX);
          }}
        />
        <span className="beforeAfterHandle" aria-hidden="true">
          <span>
            <MoveHorizontal size={18} />
          </span>
        </span>
        <span className="beforeAfterHint">Trage linia din imagine</span>
      </div>
    </div>
  );
}
