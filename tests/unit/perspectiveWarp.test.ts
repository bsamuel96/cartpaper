import { expect, it } from "vitest";
import { isNearRectangularQuad, pointInQuad, quadBounds } from "@/lib/image/perspectiveWarp";

const quad = [
  { x: 10, y: 20 },
  { x: 110, y: 20 },
  { x: 120, y: 220 },
  { x: 0, y: 220 },
] as const;

it("computes bounds for a print quadrilateral", () => {
  expect(quadBounds(quad)).toEqual({ x: 0, y: 20, width: 120, height: 200 });
});

it("checks point containment", () => {
  expect(pointInQuad({ x: 60, y: 100 }, quad)).toBe(true);
  expect(pointInQuad({ x: 160, y: 100 }, quad)).toBe(false);
});

it("identifies near-rectangular print areas", () => {
  expect(isNearRectangularQuad(quad, 24)).toBe(true);
});
