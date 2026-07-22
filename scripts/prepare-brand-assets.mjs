import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const logoDir = path.join(root, "logo");
const outputDir = path.join(root, "public", "brand");

const assets = [
  {
    source: "1.png",
    target: "cartpaper-wordmark-light-surface.png",
    role: "wordmark",
    background: "light",
    notes: "Transparent PNG with dark wordmark and lime .ro accent.",
  },
  {
    source: "2.png",
    target: "cartpaper-icon-light-surface.png",
    role: "icon",
    background: "light",
    notes: "Transparent icon variant for light surfaces.",
  },
  {
    source: "3.png",
    target: "cartpaper-wordmark-dark-surface.png",
    role: "wordmark",
    background: "dark",
    notes: "Transparent PNG with light wordmark and lime .ro accent.",
  },
  {
    source: "4.png",
    target: "cartpaper-icon-dark-surface.png",
    role: "icon",
    background: "dark",
    notes: "Transparent icon variant for dark surfaces.",
  },
];

await mkdir(outputDir, { recursive: true });

const manifest = {
  lime: "#bdec14",
  sampledFrom: "logo/*.png",
  sourcePath: logoDir,
  generatedAt: new Date().toISOString(),
  assets: [],
};

for (const asset of assets) {
  const sourcePath = path.join(logoDir, asset.source);
  const targetPath = path.join(outputDir, asset.target);

  if (!existsSync(sourcePath)) {
    manifest.assets.push({ ...asset, copied: false, missing: true });
    continue;
  }

  await copyFile(sourcePath, targetPath);
  manifest.assets.push({
    ...asset,
    copied: true,
    publicPath: `/brand/${asset.target}`,
    format: "png",
    dimensions: "2000x2000",
    alpha: true,
  });
}

await writeFile(
  path.join(outputDir, "brand-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`Prepared ${manifest.assets.filter((asset) => asset.copied).length} brand assets.`);
