import type { FloodFillOptions } from "@/lib/image/edgeFloodFill";

export async function removeBackgroundLocal(blob: Blob, options: FloodFillOptions) {
  const bitmap = await createImageBitmap(blob);
  const maxSide = 1800;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    bitmap.close();
    throw new Error("Fișierul nu a putut fi citit. Încearcă un alt export al logo-ului.");
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const imageData = context.getImageData(0, 0, width, height);
  const worker = new Worker(new URL("../../workers/backgroundRemoval.worker.ts", import.meta.url), {
    type: "module",
  });

  try {
    const processed = await new Promise<ImageData>((resolve, reject) => {
      worker.onmessage = (event: MessageEvent<{ data: Uint8ClampedArray; width: number; height: number }>) => {
        const output = new Uint8ClampedArray(event.data.data.length);
        output.set(event.data.data);
        resolve(new ImageData(output, event.data.width, event.data.height));
      };
      worker.onerror = () => reject(new Error("Fundalul nu a putut fi eliminat automat."));
      worker.postMessage(
        {
          data: imageData.data,
          width,
          height,
          options,
        },
        [imageData.data.buffer],
      );
    });

    context.putImageData(processed, 0, 0);

    const outputBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) resolve(result);
        else reject(new Error("Fundalul nu a putut fi eliminat automat."));
      }, "image/png");
    });

    return outputBlob;
  } finally {
    worker.terminate();
  }
}
