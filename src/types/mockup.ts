export type Point = { x: number; y: number };

export type MockupId = "kraft-classic" | "white-premium" | "black-luxury" | "color-pop";

export type LogoColorMode = "original" | "black" | "white" | "lime" | "custom";

export type BlendMode = "normal" | "multiply" | "screen" | "automatic";

export type PrintFinish =
  | "matte-ink"
  | "white-ink"
  | "gold-foil"
  | "silver-foil"
  | "emboss"
  | "deboss"
  | "spot-uv";

export type MockupPreset = {
  id: MockupId;
  label: string;
  shortDescription: string;
  baseSrc: string;
  overlaySrc: string;
  maskSrc: string;
  shadowOverlaySrc: string;
  highlightOverlaySrc: string;
  handleOverlaySrc: string;
  printMaskSrc: string;
  bagColorMaskSrc: string;
  displacementMapSrc: string;
  posterSrc: string;
  thumbnailSrc: string;
  stage: { width: number; height: number };
  printQuad: [Point, Point, Point, Point];
  defaultLogo: {
    x: number;
    y: number;
    width: number;
    rotation: number;
  };
  recommendedColorMode: LogoColorMode;
  recommendedBlendMode: BlendMode;
  defaultFinish: PrintFinish;
  bagColorOptions?: Array<{ id: string; label: string; value: string }>;
  accessibleDescription: string;
  placeholder?: boolean;
};

export type LogoTransform = {
  x: number;
  y: number;
  width: number;
  rotation: number;
  opacity: number;
};
