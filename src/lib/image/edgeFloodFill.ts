export type FloodFillOptions = {
  tolerance: number;
  feather: number;
  backgroundColor?: { r: number; g: number; b: number };
};

type Pixel = { r: number; g: number; b: number; a: number };

function pixelAt(data: Uint8ClampedArray, width: number, x: number, y: number): Pixel {
  const index = (y * width + x) * 4;
  return { r: data[index], g: data[index + 1], b: data[index + 2], a: data[index + 3] };
}

function colorDistance(a: Pick<Pixel, "r" | "g" | "b">, b: Pick<Pixel, "r" | "g" | "b">) {
  const red = a.r - b.r;
  const green = a.g - b.g;
  const blue = a.b - b.b;
  return Math.sqrt(red * red + green * green + blue * blue);
}

function estimateBackground(data: Uint8ClampedArray, width: number, height: number) {
  const samples: Pixel[] = [];
  const points = 16;

  for (let index = 0; index < points; index += 1) {
    const ratio = index / (points - 1);
    samples.push(pixelAt(data, width, Math.round(ratio * (width - 1)), 0));
    samples.push(pixelAt(data, width, Math.round(ratio * (width - 1)), height - 1));
    samples.push(pixelAt(data, width, 0, Math.round(ratio * (height - 1))));
    samples.push(pixelAt(data, width, width - 1, Math.round(ratio * (height - 1))));
  }

  const opaqueSamples = samples.filter((sample) => sample.a > 10);
  const source = opaqueSamples.length > 0 ? opaqueSamples : samples;
  return {
    r: Math.round(source.reduce((sum, sample) => sum + sample.r, 0) / source.length),
    g: Math.round(source.reduce((sum, sample) => sum + sample.g, 0) / source.length),
    b: Math.round(source.reduce((sum, sample) => sum + sample.b, 0) / source.length),
  };
}

export function removeConnectedBackground(
  input: Uint8ClampedArray,
  width: number,
  height: number,
  options: FloodFillOptions,
) {
  const output = new Uint8ClampedArray(input);
  const target = options.backgroundColor ?? estimateBackground(input, width, height);
  const tolerance = Math.max(1, options.tolerance);
  const feather = Math.max(0, options.feather);
  const visited = new Uint8Array(width * height);
  const queue: number[] = [];

  function enqueue(x: number, y: number) {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const position = y * width + x;
    if (visited[position]) return;
    const pixel = pixelAt(output, width, x, y);
    if (pixel.a === 0) {
      visited[position] = 1;
      queue.push(position);
      return;
    }
    if (colorDistance(pixel, target) <= tolerance) {
      visited[position] = 1;
      queue.push(position);
    }
  }

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  let head = 0;
  while (head < queue.length) {
    const position = queue[head];
    head += 1;
    const x = position % width;
    const y = Math.floor(position / width);
    const alphaIndex = position * 4 + 3;
    output[alphaIndex] = 0;

    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }

  if (feather > 0) {
    const beforeFeather = new Uint8ClampedArray(output);
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const position = y * width + x;
        const alphaIndex = position * 4 + 3;
        if (beforeFeather[alphaIndex] === 0) continue;

        const nearbyRemoved =
          beforeFeather[((y - 1) * width + x) * 4 + 3] === 0 ||
          beforeFeather[((y + 1) * width + x) * 4 + 3] === 0 ||
          beforeFeather[(y * width + x - 1) * 4 + 3] === 0 ||
          beforeFeather[(y * width + x + 1) * 4 + 3] === 0;

        if (nearbyRemoved) {
          output[alphaIndex] = Math.max(0, beforeFeather[alphaIndex] - feather * 24);
        }
      }
    }
  }

  return {
    data: output,
    removedPixels: queue.length,
    backgroundColor: target,
  };
}
