"use client";

import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import { useState } from "react";

export function BeforeAfterPreview() {
  const [position, setPosition] = useState(56);

  return (
    <div className="beforeAfterTeaser" style={{ "--split": `${position}%` } as React.CSSProperties}>
      <div className="beforeAfterCanvas" aria-label="Comparație logo cu fundal și logo curățat">
        <span className="beforeAfterLabel beforeAfterLabelLeft">Cu fundal</span>
        <span className="beforeAfterLabel beforeAfterLabelRight">Curățat</span>
        <Image
          src="/mockups/white-premium/poster.webp"
          width={1200}
          height={1500}
          loading="eager"
          alt="Pungă albă premium"
        />
        <div className="beforeAfterDirty" aria-hidden="true">
          <span className="demoLogoBox">
            cartpaper
            <small>fundal alb</small>
          </span>
        </div>
        <div className="beforeAfterClean" aria-hidden="true">
          <Image src="/brand/cartpaper-mark-light.png" width={512} height={512} alt="" />
        </div>
        <span className="beforeAfterHandle" aria-hidden="true">
          <span>
            <MoveHorizontal size={18} />
          </span>
        </span>
        <span className="beforeAfterHint">Trage ca să vezi diferența</span>
      </div>
      <label className="rangeField splitControl">
        Curățare fundal
        <input
          type="range"
          min="18"
          max="82"
          value={position}
          style={{ caretColor: "transparent" }}
          suppressHydrationWarning
          onChange={(event) => setPosition(Number(event.target.value))}
        />
      </label>
    </div>
  );
}
