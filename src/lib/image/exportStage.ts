import type { BlendMode, LogoColorMode, LogoTransform, MockupPreset } from "@/types/mockup";

const lime = "#bdec14";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Imaginea nu a putut fi încărcată pentru export."));
    image.src = src;
  });
}

async function canvasTint(image: HTMLImageElement, mode: LogoColorMode, customColor: string) {
  if (mode === "original") return image;

  const color = mode === "black" ? "#11120e" : mode === "white" ? "#ffffff" : mode === "lime" ? lime : customColor;
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d");
  if (!context) return image;

  context.drawImage(image, 0, 0);
  context.globalCompositeOperation = "source-in";
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const output = new Image();
  const dataUrl = canvas.toDataURL("image/png");

  return new Promise<HTMLImageElement>((resolve, reject) => {
    output.onload = () => resolve(output);
    output.onerror = () => reject(new Error("Logo-ul nu a putut fi recolorat pentru export."));
    output.src = dataUrl;
  });
}

function blendMode(mode: BlendMode, preset: MockupPreset) {
  const selected = mode === "automatic" ? preset.recommendedBlendMode : mode;
  if (selected === "multiply") return "multiply";
  if (selected === "screen") return "screen";
  return "source-over";
}

export async function exportMockupPng(options: {
  preset: MockupPreset;
  logoSrc: string;
  transform: LogoTransform;
  logoMode: LogoColorMode;
  customColor: string;
  blendMode: BlendMode;
  pixelRatio?: number;
}) {
  const { preset, transform } = options;
  const pixelRatio = options.pixelRatio ?? 2;
  const canvas = document.createElement("canvas");
  canvas.width = preset.stage.width * pixelRatio;
  canvas.height = preset.stage.height * pixelRatio;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Exportul nu poate fi generat pe acest dispozitiv.");

  context.scale(pixelRatio, pixelRatio);
  const [base, logo, overlay] = await Promise.all([
    loadImage(preset.baseSrc),
    loadImage(options.logoSrc),
    loadImage(preset.overlaySrc),
  ]);

  context.drawImage(base, 0, 0, preset.stage.width, preset.stage.height);
  context.save();
  context.beginPath();
  preset.printQuad.forEach((point, index) => {
    if (index === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  });
  context.closePath();
  context.clip();
  context.globalAlpha = transform.opacity;
  context.globalCompositeOperation = blendMode(options.blendMode, preset) as GlobalCompositeOperation;

  const renderedLogo = await canvasTint(logo, options.logoMode, options.customColor);
  const aspect = logo.naturalHeight / logo.naturalWidth;
  context.translate(transform.x, transform.y);
  context.rotate((transform.rotation * Math.PI) / 180);
  context.drawImage(renderedLogo, -transform.width / 2, -(transform.width * aspect) / 2, transform.width, transform.width * aspect);
  context.restore();
  context.globalCompositeOperation = "source-over";
  context.globalAlpha = 1;
  context.drawImage(overlay, 0, 0, preset.stage.width, preset.stage.height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Exportul PNG nu a putut fi creat."));
    }, "image/png");
  });
}
