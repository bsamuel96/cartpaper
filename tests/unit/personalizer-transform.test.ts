import { describe, expect, it } from "vitest";
import { getMockupPreset } from "@/data/mockups";
import {
  centerTransform,
  clampTransformToPrintBounds,
  fitTransform,
  isMockupId,
  resetTransform,
  transformFromPreset,
} from "@/lib/personalizer/transform";

const preset = getMockupPreset("kraft-classic");

describe("personalizer transforms", () => {
  it("center transform preserves width and rotation", () => {
    const current = { x: 100, y: 100, width: 260, rotation: 17, opacity: 1 };
    const centered = centerTransform(current, preset);

    expect(centered.width).toBe(current.width);
    expect(centered.rotation).toBe(current.rotation);
    expect(centered.x).toBeGreaterThan(current.x);
    expect(centered.y).toBeGreaterThan(current.y);
  });

  it("fit transform updates x, y, and width atomically", () => {
    const current = { x: 20, y: 20, width: 120, rotation: -8, opacity: 1 };
    const fitted = fitTransform(current, preset);

    expect(fitted.x).not.toBe(current.x);
    expect(fitted.y).not.toBe(current.y);
    expect(fitted.width).not.toBe(current.width);
    expect(fitted.rotation).toBe(current.rotation);
  });

  it("reset uses preset defaults", () => {
    expect(resetTransform(preset)).toEqual(transformFromPreset(preset));
  });

  it("clamp keeps logo within print bounds", () => {
    const clamped = clampTransformToPrintBounds({ x: -999, y: 9999, width: 9999, rotation: 0, opacity: 1 }, preset);

    expect(clamped.x).toBeGreaterThan(0);
    expect(clamped.y).toBeLessThan(preset.stage.height);
    expect(clamped.width).toBeLessThan(9999);
  });

  it("validates URL model ids", () => {
    expect(isMockupId("color-pop")).toBe(true);
    expect(isMockupId("unknown-model")).toBe(false);
  });
});
