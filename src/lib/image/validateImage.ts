export const acceptedMimeTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"] as const;
export const maxUploadBytes = 10 * 1024 * 1024;

export type ImageValidationResult =
  | { ok: true; warning?: string }
  | { ok: false; message: string };

const acceptedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg"];

export function validateFileMeta(file: File): ImageValidationResult {
  const lowerName = file.name.toLowerCase();
  const hasAcceptedExtension = acceptedExtensions.some((extension) => lowerName.endsWith(extension));
  const hasAcceptedMime = acceptedMimeTypes.includes(file.type as (typeof acceptedMimeTypes)[number]);

  if (!hasAcceptedExtension || !hasAcceptedMime) {
    return {
      ok: false,
      message: "Formatul fișierului nu este acceptat. Folosește PNG, JPG, WEBP sau SVG.",
    };
  }

  if (file.size > maxUploadBytes) {
    return { ok: false, message: "Fișierul depășește limita de 10 MB." };
  }

  return { ok: true };
}

export async function decodeImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
  if (blob.type === "image/svg+xml") {
    const text = await blob.text();
    const viewBox = text.match(/viewBox=["']\s*[-.\d]+\s+[-.\d]+\s+([.\d]+)\s+([.\d]+)\s*["']/i);
    const width = text.match(/\swidth=["']([.\d]+)(?:px)?["']/i);
    const height = text.match(/\sheight=["']([.\d]+)(?:px)?["']/i);

    if (viewBox) return { width: Number(viewBox[1]), height: Number(viewBox[2]) };
    if (width && height) return { width: Number(width[1]), height: Number(height[1]) };
    return { width: 1000, height: 1000 };
  }

  const bitmap = await createImageBitmap(blob);
  const dimensions = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return dimensions;
}

export function resolutionWarning(width: number, height: number) {
  return Math.max(width, height) < 800
    ? "Logo-ul are o rezoluție redusă. Simularea poate părea neclară."
    : undefined;
}
