export function tintImageData(data: Uint8ClampedArray, color: string) {
  const hex = color.replace("#", "");
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const output = new Uint8ClampedArray(data);

  for (let index = 0; index < output.length; index += 4) {
    if (output[index + 3] > 0) {
      output[index] = r;
      output[index + 1] = g;
      output[index + 2] = b;
    }
  }

  return output;
}
