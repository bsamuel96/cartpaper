import { expect, it } from "vitest";
import { removeConnectedBackground } from "@/lib/image/edgeFloodFill";

function pixel(data: Uint8ClampedArray, width: number, x: number, y: number) {
  return data[(y * width + x) * 4 + 3];
}

it("removes only edge-connected matching background pixels", () => {
  const width = 5;
  const height = 5;
  const data = new Uint8ClampedArray(width * height * 4);

  for (let index = 0; index < data.length; index += 4) {
    data[index] = 255;
    data[index + 1] = 255;
    data[index + 2] = 255;
    data[index + 3] = 255;
  }

  for (let y = 1; y < 4; y += 1) {
    for (let x = 1; x < 4; x += 1) {
      const index = (y * width + x) * 4;
      data[index] = 10;
      data[index + 1] = 10;
      data[index + 2] = 10;
    }
  }

  const center = (2 * width + 2) * 4;
  data[center] = 255;
  data[center + 1] = 255;
  data[center + 2] = 255;

  const result = removeConnectedBackground(data, width, height, { tolerance: 8, feather: 0 });

  expect(pixel(result.data, width, 0, 0)).toBe(0);
  expect(pixel(result.data, width, 2, 2)).toBe(255);
  expect(pixel(result.data, width, 1, 1)).toBe(255);
});

it("preserves existing alpha while removing the connected border", () => {
  const data = new Uint8ClampedArray([
    255, 255, 255, 128,
    255, 255, 255, 255,
    0, 0, 0, 128,
    255, 255, 255, 255,
  ]);

  const result = removeConnectedBackground(data, 2, 2, {
    tolerance: 8,
    feather: 0,
    backgroundColor: { r: 255, g: 255, b: 255 },
  });
  expect(result.data[3]).toBe(0);
  expect(result.data[8 + 3]).toBe(128);
});
