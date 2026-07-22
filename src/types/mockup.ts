export type Point = { x: number; y: number };

export type MockupId = "kraft-classic" | "white-premium" | "black-luxury" | "color-pop";

export type LogoColorMode = "original" | "black" | "white" | "lime" | "custom";

export type BlendMode = "normal" | "multiply" | "screen" | "automatic";

export type MockupPreset = {
  id: MockupId;
  label: string;
  shortDescription: string;
  baseSrc: string;
  overlaySrc: string;
  maskSrc: string;
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
