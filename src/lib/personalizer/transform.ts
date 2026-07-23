import { mockupPresets } from "@/data/mockups";
import type { LogoTransform, MockupId, MockupPreset } from "@/types/mockup";

export const defaultLogoOpacity = 1;
export const minimumLogoWidth = 80;

export function isMockupId(value: string | null | undefined): value is MockupId {
  return Boolean(value && mockupPresets.some((preset) => preset.id === value));
}

export function transformFromPreset(preset: MockupPreset): LogoTransform {
  return { ...preset.defaultLogo, opacity: defaultLogoOpacity };
}

export function getPrintBounds(preset: MockupPreset) {
  const left = Math.min(...preset.printQuad.map((point) => point.x));
  const right = Math.max(...preset.printQuad.map((point) => point.x));
  const top = Math.min(...preset.printQuad.map((point) => point.y));
  const bottom = Math.max(...preset.printQuad.map((point) => point.y));

  return {
    left,
    right,
    top,
    bottom,
    width: right - left,
    height: bottom - top,
    centerX: (left + right) / 2,
    centerY: (top + bottom) / 2,
  };
}

function clamp(value: number, min: number, max: number) {
  if (min > max) return (min + max) / 2;
  return Math.min(max, Math.max(min, value));
}

export function clampTransformToPrintBounds(transform: LogoTransform, preset: MockupPreset, logoAspect = 1): LogoTransform {
  const bounds = getPrintBounds(preset);
  const maxWidthByHeight = bounds.height / Math.max(logoAspect, 0.1);
  const maxWidth = Math.max(minimumLogoWidth, Math.min(bounds.width, maxWidthByHeight) * 0.94);
  const width = clamp(transform.width, minimumLogoWidth, maxWidth);
  const halfWidth = width / 2;
  const halfHeight = (width * logoAspect) / 2;

  return {
    ...transform,
    width,
    x: clamp(transform.x, bounds.left + halfWidth, bounds.right - halfWidth),
    y: clamp(transform.y, bounds.top + halfHeight, bounds.bottom - halfHeight),
  };
}

export function centerTransform(current: LogoTransform, preset: MockupPreset, logoAspect = 1): LogoTransform {
  const bounds = getPrintBounds(preset);
  return clampTransformToPrintBounds(
    {
      ...current,
      x: bounds.centerX,
      y: bounds.centerY,
    },
    preset,
    logoAspect,
  );
}

export function fitTransform(current: LogoTransform, preset: MockupPreset, logoAspect = 1): LogoTransform {
  const bounds = getPrintBounds(preset);
  return clampTransformToPrintBounds(
    {
      ...current,
      x: bounds.centerX,
      y: bounds.centerY,
      width: bounds.width * 0.62,
    },
    preset,
    logoAspect,
  );
}

export function resetTransform(preset: MockupPreset, logoAspect = 1): LogoTransform {
  return clampTransformToPrintBounds(transformFromPreset(preset), preset, logoAspect);
}

export function transformWidthPercent(transform: LogoTransform, preset: MockupPreset) {
  return Math.round((transform.width / getPrintBounds(preset).width) * 100);
}
