import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const logoDir = path.join(root, "logo");
const outputDir = path.join(root, "public", "brand");
const safePaddingRatio = 0.076;
const obsoleteFiles = [
  "brand-manifest.json",
  "cartpaper-icon-dark-surface.png",
  "cartpaper-icon-light-surface.png",
  "cartpaper-wordmark-dark-surface.png",
  "cartpaper-wordmark-light-surface.png",
];

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function alphaStats(buffer) {
  const image = sharp(buffer, { failOn: "none" }).ensureAlpha();
  const metadata = await image.metadata();
  const { data } = await image.raw().toBuffer({ resolveWithObject: true });
  let transparent = 0;
  let semi = 0;
  let opaque = 0;
  const limePixels = [];

  for (let index = 0; index < data.length; index += 4) {
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const a = data[index + 3];
    if (a === 0) transparent += 1;
    else if (a === 255) opaque += 1;
    else semi += 1;

    if (a > 128 && r > 120 && g > 180 && b < 70 && g >= r) {
      limePixels.push([r, g, b]);
    }
  }

  const total = transparent + semi + opaque;
  const lime =
    limePixels.length > 0
      ? limePixels
          .reduce((sum, pixel) => [sum[0] + pixel[0], sum[1] + pixel[1], sum[2] + pixel[2]], [0, 0, 0])
          .map((value) => Math.round(value / limePixels.length))
      : [189, 237, 21];

  return {
    width: metadata.width,
    height: metadata.height,
    channels: metadata.channels,
    hasAlpha: Boolean(metadata.hasAlpha),
    transparentPixels: transparent,
    semiTransparentPixels: semi,
    opaquePixels: opaque,
    transparentRatio: Number((transparent / total).toFixed(4)),
    semiTransparentRatio: Number((semi / total).toFixed(4)),
    opaqueRatio: Number((opaque / total).toFixed(4)),
    dominantLime: `#${lime.map((value) => value.toString(16).padStart(2, "0")).join("")}`,
  };
}

async function visualSignature(buffer) {
  const image = sharp(buffer, { failOn: "none" }).ensureAlpha().resize(320, 320, { fit: "inside" });
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  let whiteish = 0;
  let dark = 0;
  let lime = 0;

  for (let index = 0; index < data.length; index += 4) {
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const a = data[index + 3];
    if (a < 80) continue;
    if (r > 210 && g > 210 && b > 210) whiteish += 1;
    if (r < 60 && g < 60 && b < 60) dark += 1;
    if (r > 120 && g > 175 && b < 80 && g >= r) lime += 1;
  }

  return {
    pixels: info.width * info.height,
    whiteish,
    dark,
    lime,
  };
}

async function discoverLogo(kind, preferredNames) {
  const files = (await readdir(logoDir)).filter((file) => /\.(png|webp|jpe?g)$/i.test(file));
  const preferred = preferredNames.find((name) => files.includes(name));

  if (preferred) {
    return path.join(logoDir, preferred);
  }

  const candidates = [];
  for (const file of files) {
    const filePath = path.join(logoDir, file);
    const buffer = await readFile(filePath);
    const stats = await alphaStats(buffer);
    const signature = await visualSignature(buffer);
    if (stats.hasAlpha && stats.width === 2000 && stats.height === 2000 && signature.lime > 500) {
      candidates.push({ file, filePath, signature });
    }
  }

  const sorted = candidates.sort((a, b) => {
    if (kind === "light") return b.signature.dark - a.signature.dark;
    return b.signature.whiteish - a.signature.whiteish;
  });

  if (!sorted[0]) {
    throw new Error(`Could not identify the ${kind} Cartpaper mark. Expected one of: ${preferredNames.join(", ")}`);
  }

  return sorted[0].filePath;
}

async function prepareMark(sourcePath, targetName, size) {
  const source = await readFile(sourcePath);
  const stats = await alphaStats(source);
  if (!stats.hasAlpha) {
    throw new Error(`${path.basename(sourcePath)} must be an RGBA/alpha PNG.`);
  }
  if (stats.transparentRatio < 0.5) {
    throw new Error(`${path.basename(sourcePath)} does not appear to have transparent outer space.`);
  }

  const trimmed = sharp(source, { failOn: "none" }).ensureAlpha().trim({
    background: { r: 0, g: 0, b: 0, alpha: 0 },
    threshold: 0,
  });
  const trimmedBuffer = await trimmed.png().toBuffer();
  const trimmedMetadata = await sharp(trimmedBuffer).metadata();
  const padX = Math.max(24, Math.round((trimmedMetadata.width ?? stats.width ?? 1024) * safePaddingRatio));
  const padY = Math.max(24, Math.round((trimmedMetadata.height ?? stats.height ?? 1024) * safePaddingRatio));
  const padded = sharp(trimmedBuffer)
    .extend({
      top: padY,
      bottom: padY,
      left: padX,
      right: padX,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 });

  const output = size
    ? await padded
        .resize(size, size, {
          fit: "contain",
          kernel: "lanczos3",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png({ compressionLevel: 9 })
        .toBuffer()
    : await padded.toBuffer();

  await writeFile(path.join(outputDir, targetName), output);
  const metadata = await sharp(output).metadata();

  return {
    file: targetName,
    publicPath: `/brand/${targetName}`,
    width: metadata.width,
    height: metadata.height,
    bytes: output.byteLength,
    hash: sha256(output),
  };
}

if (!existsSync(logoDir)) {
  throw new Error(`Logo directory is missing: ${logoDir}`);
}

await mkdir(outputDir, { recursive: true });
await Promise.all(obsoleteFiles.map((file) => rm(path.join(outputDir, file), { force: true })));

const lightSource = await discoverLogo("light", ["2.png", "2(1).png"]);
const darkSource = await discoverLogo("dark", ["4.png", "4(1).png"]);
const lightSourceBuffer = await readFile(lightSource);
const darkSourceBuffer = await readFile(darkSource);
const lightStats = await alphaStats(lightSourceBuffer);
const darkStats = await alphaStats(darkSourceBuffer);
const canonicalLime = lightStats.dominantLime;

const generated = {
  lightMark: await prepareMark(lightSource, "cartpaper-mark-light.png"),
  darkMark: await prepareMark(darkSource, "cartpaper-mark-dark.png"),
  faviconLight: await prepareMark(lightSource, "favicon-light.png", 64),
  faviconDark: await prepareMark(darkSource, "favicon-dark.png", 64),
  appleTouchIcon: await prepareMark(lightSource, "apple-touch-icon.png", 180),
  ogMarkLight: await prepareMark(lightSource, "og-mark-light.png", 512),
  ogMarkDark: await prepareMark(darkSource, "og-mark-dark.png", 512),
};

const manifest = {
  version: "v3",
  generatedAt: new Date().toISOString(),
  sourcePath: logoDir,
  canonicalLime,
  selectedOnly: ["logo 2", "logo 4"],
  sources: {
    light: {
      intendedSurface: "light",
      role: "cartpaper icon mark",
      fileName: path.basename(lightSource),
      hash: sha256(lightSourceBuffer),
      stats: lightStats,
    },
    dark: {
      intendedSurface: "dark",
      role: "cartpaper icon mark",
      fileName: path.basename(darkSource),
      hash: sha256(darkSourceBuffer),
      stats: darkStats,
    },
  },
  generated,
};

await writeFile(path.join(outputDir, "asset-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Prepared Cartpaper V3 brand assets from ${path.basename(lightSource)} and ${path.basename(darkSource)}.`);
