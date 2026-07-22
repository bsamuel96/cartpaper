import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const production = process.env.CARTPAPER_PRODUCTION === "true";
const ids = ["kraft-classic", "white-premium", "black-luxury", "color-pop"];
const required = ["base.webp", "overlay.png", "mask.png", "thumbnail.webp", "metadata.json"];
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
  const metadataPath = path.join(dir, "metadata.json");

  if (existsSync(basePath) && existsSync(overlayPath) && existsSync(maskPath)) {
    const [base, overlay, mask] = await Promise.all([
      sharp(basePath).metadata(),
      sharp(overlayPath).metadata(),
      sharp(maskPath).metadata(),
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
