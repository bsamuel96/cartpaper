import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const mockupRoot = path.join(root, "public", "mockups");
const legalRoot = path.join(root, "public", "legal");
const stage = { width: 1200, height: 1500 };
const forceDevelopmentPlaceholders = process.argv.includes("--force-development-placeholders");

if (!forceDevelopmentPlaceholders) {
  console.error(
    "Refusing to generate development placeholders without --force-development-placeholders. This script is intentionally not run from postinstall.",
  );
  process.exit(1);
}

async function readJsonIfPresent(file) {
  if (!existsSync(file)) return null;

  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return null;
  }
}

async function assertDevelopmentPlaceholder(metadataFile, label) {
  const metadata = await readJsonIfPresent(metadataFile);
  if (metadata?.placeholder === false) {
    throw new Error(`Refusing to overwrite production asset metadata for ${label}.`);
  }
}

const mockups = [
  {
    id: "kraft-classic",
    title: "Kraft Clasic",
    bg: "#c8955e",
    side: "#a87343",
    handle: "#8d5d35",
    paper: "#d7a86f",
    print: [325, 470, 875, 470, 930, 1170, 270, 1170],
    sourcePage: "https://goodmockups.com/free-kraft-paper-shopping-bag-mockup-psd-3/",
  },
  {
    id: "white-premium",
    title: "Alb Premium",
    bg: "#f9f7f0",
    side: "#e5e0d7",
    handle: "#c8c0b4",
    paper: "#fffefa",
    print: [295, 455, 905, 455, 900, 1180, 300, 1180],
    sourcePage: "https://goodmockups.com/free-white-shopping-bag-mockup-psd-2/",
  },
  {
    id: "black-luxury",
    title: "Negru Elegant",
    bg: "#12130f",
    side: "#050604",
    handle: "#050604",
    paper: "#191a15",
    print: [335, 500, 865, 445, 920, 1165, 285, 1200],
    sourcePage: "https://unblast.com/free-dark-shopping-bag-mockup-psd/",
  },
  {
    id: "color-pop",
    title: "Culoare Intensă",
    bg: "#cb4d45",
    side: "#a93b37",
    handle: "#f2d3c7",
    paper: "#d9574e",
    print: [310, 460, 890, 460, 890, 1188, 310, 1188],
    sourcePage: "https://mockups-design.com/paper-gift-bag-mockup/",
  },
];

function polygon(points) {
  return points.map((point, index) => `${point}${index % 2 ? "" : ","}`).join(" ");
}

function baseSvg(mockup) {
  const printPolygon = polygon(mockup.print);
  return `
  <svg width="${stage.width}" height="${stage.height}" viewBox="0 0 ${stage.width} ${stage.height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="paper" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="${mockup.paper}"/>
        <stop offset="0.55" stop-color="${mockup.bg}"/>
        <stop offset="1" stop-color="${mockup.side}"/>
      </linearGradient>
      <radialGradient id="shadow" cx="50%" cy="75%" r="50%">
        <stop offset="0" stop-color="#000" stop-opacity=".22"/>
        <stop offset="1" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values=".1"/>
        <feComponentTransfer>
          <feFuncA type="table" tableValues="0 .12"/>
        </feComponentTransfer>
      </filter>
    </defs>
    <rect width="1200" height="1500" fill="#f7f3ea"/>
    <ellipse cx="600" cy="1300" rx="390" ry="90" fill="url(#shadow)"/>
    <path d="M410 440 C415 225 785 225 790 440" fill="none" stroke="${mockup.handle}" stroke-width="54" stroke-linecap="round"/>
    <path d="M245 430 L955 430 L1015 1235 C1020 1308 965 1355 885 1355 L315 1355 C235 1355 180 1308 185 1235 Z" fill="url(#paper)"/>
    <path d="M245 430 L315 1355 L185 1235 Z" fill="#000" opacity=".10"/>
    <path d="M955 430 L885 1355 L1015 1235 Z" fill="#fff" opacity=".10"/>
    <polygon points="${printPolygon}" fill="#fff" opacity=".075"/>
    <path d="M305 520 C460 560 740 560 900 520" fill="none" stroke="#fff" opacity=".12" stroke-width="5"/>
    <path d="M320 1190 C480 1238 740 1238 890 1190" fill="none" stroke="#000" opacity=".10" stroke-width="6"/>
    <rect width="1200" height="1500" filter="url(#grain)" opacity=".45"/>
  </svg>`;
}

function overlaySvg(mockup) {
  return `
  <svg width="${stage.width}" height="${stage.height}" viewBox="0 0 ${stage.width} ${stage.height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fold" x1="0" x2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/>
        <stop offset=".48" stop-color="#fff" stop-opacity=".18"/>
        <stop offset="1" stop-color="#000" stop-opacity=".18"/>
      </linearGradient>
    </defs>
    <path d="M600 430 L600 1355" stroke="url(#fold)" stroke-width="40" opacity=".26"/>
    <path d="M245 430 L315 1355" stroke="#000" stroke-width="10" opacity=".10"/>
    <path d="M955 430 L885 1355" stroke="#fff" stroke-width="10" opacity=".18"/>
    <polygon points="${polygon(mockup.print)}" fill="#fff" opacity=".04"/>
  </svg>`;
}

function maskSvg(mockup) {
  return `
  <svg width="${stage.width}" height="${stage.height}" viewBox="0 0 ${stage.width} ${stage.height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="1500" fill="#000"/>
    <polygon points="${polygon(mockup.print)}" fill="#fff"/>
  </svg>`;
}

function shadowOverlaySvg() {
  return `
  <svg width="${stage.width}" height="${stage.height}" viewBox="0 0 ${stage.width} ${stage.height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="floor" cx="50%" cy="85%" r="44%">
        <stop offset="0" stop-color="#000" stop-opacity=".28"/>
        <stop offset="1" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="crease" x1="0" x2="1">
        <stop offset="0" stop-color="#000" stop-opacity=".18"/>
        <stop offset=".48" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity=".22"/>
      </linearGradient>
    </defs>
    <ellipse cx="600" cy="1308" rx="380" ry="88" fill="url(#floor)"/>
    <path d="M245 430 L315 1355" stroke="#000" stroke-width="16" opacity=".10"/>
    <path d="M600 430 L600 1355" stroke="url(#crease)" stroke-width="50" opacity=".22"/>
  </svg>`;
}

function highlightOverlaySvg() {
  return `
  <svg width="${stage.width}" height="${stage.height}" viewBox="0 0 ${stage.width} ${stage.height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shine" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".36"/>
        <stop offset=".34" stop-color="#fff" stop-opacity=".05"/>
        <stop offset="1" stop-color="#fff" stop-opacity=".18"/>
      </linearGradient>
    </defs>
    <path d="M300 475 C435 510 765 510 900 475" fill="none" stroke="#fff" stroke-width="8" opacity=".28"/>
    <polygon points="305,465 610,440 550,1245 285,1200" fill="url(#shine)" opacity=".30"/>
  </svg>`;
}

function handleOverlaySvg(mockup) {
  return `
  <svg width="${stage.width}" height="${stage.height}" viewBox="0 0 ${stage.width} ${stage.height}" xmlns="http://www.w3.org/2000/svg">
    <path d="M410 440 C415 225 785 225 790 440" fill="none" stroke="${mockup.handle}" stroke-width="54" stroke-linecap="round"/>
    <path d="M410 440 C415 225 785 225 790 440" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" opacity=".18"/>
  </svg>`;
}

function bagColorMaskSvg() {
  return `
  <svg width="${stage.width}" height="${stage.height}" viewBox="0 0 ${stage.width} ${stage.height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="1500" fill="#000"/>
    <path d="M245 430 L955 430 L1015 1235 C1020 1308 965 1355 885 1355 L315 1355 C235 1355 180 1308 185 1235 Z" fill="#fff"/>
  </svg>`;
}

function displacementSvg() {
  return `
  <svg width="${stage.width}" height="${stage.height}" viewBox="0 0 ${stage.width} ${stage.height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="paperNoise">
        <feTurbulence type="fractalNoise" baseFrequency=".018 .055" numOctaves="4" seed="14"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
    </defs>
    <rect width="1200" height="1500" fill="#808080"/>
    <rect width="1200" height="1500" filter="url(#paperNoise)" opacity=".38"/>
  </svg>`;
}

await mkdir(mockupRoot, { recursive: true });
await mkdir(legalRoot, { recursive: true });

const manifest = {
  generatedAt: new Date().toISOString(),
  placeholder: true,
  stage,
  mockups: [],
};

for (const mockup of mockups) {
  const dir = path.join(mockupRoot, mockup.id);
  await assertDevelopmentPlaceholder(path.join(dir, "metadata.json"), `mockup ${mockup.id}`);
  await mkdir(dir, { recursive: true });

  await sharp(Buffer.from(baseSvg(mockup))).webp({ quality: 88 }).toFile(path.join(dir, "base.webp"));
  await sharp(Buffer.from(baseSvg(mockup))).webp({ quality: 90 }).toFile(path.join(dir, "poster.webp"));
  await sharp(Buffer.from(baseSvg(mockup))).resize(480, 600).webp({ quality: 78 }).toFile(path.join(dir, "thumbnail.webp"));
  await sharp(Buffer.from(overlaySvg(mockup))).png().toFile(path.join(dir, "overlay.png"));
  await sharp(Buffer.from(maskSvg(mockup))).png().toFile(path.join(dir, "mask.png"));
  await sharp(Buffer.from(shadowOverlaySvg())).png().toFile(path.join(dir, "shadow-overlay.png"));
  await sharp(Buffer.from(highlightOverlaySvg())).png().toFile(path.join(dir, "highlight-overlay.png"));
  await sharp(Buffer.from(handleOverlaySvg(mockup))).png().toFile(path.join(dir, "handle-overlay.png"));
  await sharp(Buffer.from(maskSvg(mockup))).png().toFile(path.join(dir, "print-mask.png"));
  await sharp(Buffer.from(bagColorMaskSvg())).png().toFile(path.join(dir, "bag-color-mask.png"));
  await sharp(Buffer.from(displacementSvg())).png().toFile(path.join(dir, "displacement-map.png"));

  const metadata = {
    id: mockup.id,
    title: mockup.title,
    stage,
    sourcePage: mockup.sourcePage,
    license: "DEVELOPMENT PLACEHOLDER - replace with licensed PSD export before production.",
    attributionRequired: "Unknown until source PSD is reviewed.",
    placeholder: true,
    sourceFile: `source-assets/bag-mockups/${mockup.id}.psd`,
    runtimeFiles: [
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
    ],
  };

  await writeFile(path.join(dir, "metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`);
  manifest.mockups.push(metadata);
}

await writeFile(path.join(mockupRoot, "asset-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

const anpcSvg = `
<svg width="250" height="50" viewBox="0 0 250 50" xmlns="http://www.w3.org/2000/svg">
  <rect width="250" height="50" rx="2" fill="#ffffff"/>
  <rect x="1" y="1" width="248" height="48" rx="2" fill="none" stroke="#9f2f2f" stroke-width="2"/>
  <text x="125" y="31" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#9f2f2f">ANPC SAL</text>
</svg>`;

await assertDevelopmentPlaceholder(path.join(legalRoot, "anpc-sal.metadata.json"), "ANPC SAL");
await sharp(Buffer.from(anpcSvg)).png().toFile(path.join(legalRoot, "anpc-sal.png"));
await writeFile(
  path.join(legalRoot, "anpc-sal.metadata.json"),
  `${JSON.stringify(
    {
      file: "anpc-sal.png",
      dimensions: { width: 250, height: 50 },
      placeholder: true,
      note: "Development-only placeholder. Replace with official ANPC SAL artwork and set placeholder to false before production.",
    },
    null,
    2,
  )}\n`,
);

console.log(`Generated ${mockups.length} development mockup placeholders.`);
