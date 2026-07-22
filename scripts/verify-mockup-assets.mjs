import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const production = process.env.CARTPAPER_PRODUCTION === "true";
const ids = ["kraft-classic", "white-premium", "black-luxury", "color-pop"];
const required = [
  "base.webp",
  "poster.webp",
  "overlay.png",
  "mask.png",
  "shadow-overlay.png",
  "highlight-overlay.png",
  "handle-overlay.png",
  "print-mask.png",
  "bag-color-mask.png",
  "displacement-map.png",
  "thumbnail.webp",
  "metadata.json",
];
const errors = [];
const warnings = [];

async function readMetadata(file) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return null;
  }
}

for (const id of ids) {
  const dir = path.join(root, "public", "mockups", id);
  for (const file of required) {
    const target = path.join(dir, file);
    if (!existsSync(target)) {
      errors.push(`${id}: missing ${file}`);
    }
  }

  if (!existsSync(dir)) {
    continue;
  }

  const basePath = path.join(dir, "base.webp");
  const overlayPath = path.join(dir, "overlay.png");
  const maskPath = path.join(dir, "mask.png");
  const v3OverlayPaths = [
    "shadow-overlay.png",
    "highlight-overlay.png",
    "handle-overlay.png",
    "print-mask.png",
    "bag-color-mask.png",
    "displacement-map.png",
  ].map((file) => path.join(dir, file));
  const metadataPath = path.join(dir, "metadata.json");

  if (existsSync(basePath) && existsSync(overlayPath) && existsSync(maskPath) && v3OverlayPaths.every(existsSync)) {
    const [base, overlay, mask, ...v3Overlays] = await Promise.all([
      sharp(basePath).metadata(),
      sharp(overlayPath).metadata(),
      sharp(maskPath).metadata(),
      ...v3OverlayPaths.map((file) => sharp(file).metadata()),
    ]);

    if (base.width !== 1200 || base.height !== 1500) {
      errors.push(`${id}: base must be 1200x1500, found ${base.width}x${base.height}`);
    }
    if (overlay.width !== base.width || overlay.height !== base.height) {
      errors.push(`${id}: overlay dimensions do not match base`);
    }
    if (mask.width !== base.width || mask.height !== base.height) {
      errors.push(`${id}: mask dimensions do not match base`);
    }
    if (!overlay.hasAlpha) {
      errors.push(`${id}: overlay must contain alpha`);
    }
    for (const overlayMetadata of v3Overlays) {
      if (overlayMetadata.width !== base.width || overlayMetadata.height !== base.height) {
        errors.push(`${id}: V3 overlay dimensions do not match base`);
      }
    }
  }

  if (existsSync(metadataPath)) {
    const metadata = await readMetadata(metadataPath);
    if (!metadata?.sourcePage || !metadata?.license || !metadata?.runtimeFiles) {
      errors.push(`${id}: metadata must include sourcePage, license and runtimeFiles`);
    }
    if (metadata?.placeholder) {
      const message = `${id}: development placeholder is still active`;
      if (production) errors.push(message);
      else warnings.push(message);
    }
  }
}

for (const warning of warnings) {
  console.warn(`Warning: ${warning}`);
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log("Mockup asset structure verified.");
