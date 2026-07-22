import { removeConnectedBackground, type FloodFillOptions } from "@/lib/image/edgeFloodFill";

self.onmessage = (
  event: MessageEvent<{
    data: Uint8ClampedArray;
    width: number;
    height: number;
    options: FloodFillOptions;
  }>,
) => {
  const result = removeConnectedBackground(
    event.data.data,
    event.data.width,
    event.data.height,
    event.data.options,
  );

  self.postMessage({
    data: result.data,
    width: event.data.width,
    height: event.data.height,
  });
};
