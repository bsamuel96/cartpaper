import { expect, it } from "vitest";
import { hasTransparentPixel } from "@/lib/image/detectTransparency";

it("detects transparent pixels from alpha channel data", () => {
  expect(hasTransparentPixel(new Uint8ClampedArray([0, 0, 0, 255, 10, 10, 10, 0]))).toBe(true);
  expect(hasTransparentPixel(new Uint8ClampedArray([0, 0, 0, 255, 10, 10, 10, 251]))).toBe(false);
});
