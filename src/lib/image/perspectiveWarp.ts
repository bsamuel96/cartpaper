import type { Point } from "@/types/mockup";

type Quad = readonly [Point, Point, Point, Point];

export function quadBounds(quad: Quad) {
  const xs = quad.map((point) => point.x);
  const ys = quad.map((point) => point.y);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

export function isNearRectangularQuad(quad: Quad, tolerance = 24) {
  const [topLeft, topRight, bottomRight, bottomLeft] = quad;
  return (
    Math.abs(topLeft.y - topRight.y) <= tolerance &&
    Math.abs(bottomLeft.y - bottomRight.y) <= tolerance &&
    Math.abs(topLeft.x - bottomLeft.x) <= tolerance * 2 &&
    Math.abs(topRight.x - bottomRight.x) <= tolerance * 2
  );
}

export function pointInQuad(point: Point, quad: Quad) {
  let inside = false;

  for (let current = 0, previous = quad.length - 1; current < quad.length; previous = current, current += 1) {
    const currentPoint = quad[current];
    const previousPoint = quad[previous];
    const intersects =
      currentPoint.y > point.y !== previousPoint.y > point.y &&
      point.x <
        ((previousPoint.x - currentPoint.x) * (point.y - currentPoint.y)) /
          (previousPoint.y - currentPoint.y) +
          currentPoint.x;

    if (intersects) inside = !inside;
  }

  return inside;
}
