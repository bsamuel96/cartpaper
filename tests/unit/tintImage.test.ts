import { expect, it } from "vitest";
import { tintImageData } from "@/lib/image/tintImage";

it("recolors opaque pixels and preserves alpha", () => {
  const result = tintImageData(new Uint8ClampedArray([1, 2, 3, 255, 4, 5, 6, 0]), "#bdec14");
  expect(Array.from(result)).toEqual([189, 236, 20, 255, 4, 5, 6, 0]);
});
