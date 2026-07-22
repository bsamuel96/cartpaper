export function hasTransparentPixel(data: Uint8ClampedArray, alphaThreshold = 250) {
  for (let index = 3; index < data.length; index += 4) {
    if (data[index] < alphaThreshold) return true;
  }

  return false;
}

export async function detectTransparencyFromBlob(blob: Blob) {
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    bitmap.close();
    throw new Error("Fișierul nu a putut fi citit. Încearcă un alt export al logo-ului.");
  }

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  bitmap.close();
  return hasTransparentPixel(imageData.data);
}
