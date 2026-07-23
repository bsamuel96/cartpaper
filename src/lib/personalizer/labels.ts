import type { LogoColorMode, PrintFinish } from "@/types/mockup";
import type { StoredPersonalizerState } from "@/hooks/usePersonalizerSession";

export const logoColorLabels: Record<LogoColorMode, string> = {
  original: "original",
  black: "negru",
  white: "alb",
  lime: "verde Cartpaper",
  custom: "culoare personalizată",
};

export const printFinishLabels: Record<PrintFinish, string> = {
  "matte-ink": "mat",
  "white-ink": "alb",
  "gold-foil": "folie aurie",
};

export const backgroundMethodLabels: Record<StoredPersonalizerState["backgroundMethod"], string> = {
  none: "necurățat",
  transparent: "deja transparent",
  local: "eliminat local",
  advanced: "eliminat avansat",
};
