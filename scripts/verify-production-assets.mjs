import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const production = process.env.CARTPAPER_PRODUCTION === "true";
const blockers = [];
const warnings = [];

function requireFile(relativePath, label) {
  const file = path.join(root, relativePath);
  if (!existsSync(file)) {
    blockers.push(`${label} lipsește: ${relativePath}`);
  }
  return file;
}

requireFile("public/brand/cartpaper-mark-light.png", "Logo 2 Cartpaper pentru fundal deschis");
requireFile("public/brand/cartpaper-mark-dark.png", "Logo 4 Cartpaper pentru fundal închis");
requireFile("public/brand/favicon-light.png", "Favicon Cartpaper pentru temă deschisă");
requireFile("public/brand/favicon-dark.png", "Favicon Cartpaper pentru temă închisă");
requireFile("public/brand/apple-touch-icon.png", "Apple touch icon Cartpaper");
requireFile("public/brand/asset-manifest.json", "Manifest brand V3");

const manifestFile = requireFile("public/mockups/asset-manifest.json", "Manifest mockupuri");
if (existsSync(manifestFile)) {
  const manifest = JSON.parse(await readFile(manifestFile, "utf8"));
  if (manifest.placeholder) {
    blockers.push("Mockupurile sunt încă placeholder-e de dezvoltare.");
  }
}

const anpcFile = requireFile("public/legal/anpc-sal.png", "Artwork ANPC SAL");
const anpcMetadataFile = path.join(root, "public", "legal", "anpc-sal.metadata.json");
if (existsSync(anpcFile)) {
  const metadata = await sharp(anpcFile).metadata();
  if (metadata.width !== 250 || metadata.height !== 50) {
    blockers.push(`ANPC SAL trebuie să fie 250x50, găsit ${metadata.width}x${metadata.height}.`);
  }
  const stats = await sharp(anpcFile).stats();
  const isLikelyPlaceholder = stats.channels.some((channel) => channel.max - channel.min < 8);
  if (isLikelyPlaceholder) {
    warnings.push("ANPC SAL pare a fi un placeholder; verifică manual artwork-ul oficial.");
  }
}
if (existsSync(anpcMetadataFile)) {
  const metadata = JSON.parse(await readFile(anpcMetadataFile, "utf8"));
  if (metadata.placeholder !== false) {
    const message = "ANPC SAL este încă marcat ca placeholder de dezvoltare.";
    if (production) blockers.push(message);
    else warnings.push(message);
  }
} else if (production) {
  blockers.push("Metadatele ANPC SAL lipsesc; marchează explicit artwork-ul oficial cu placeholder=false.");
}

const envChecks = [
  ["QUOTE_WEBHOOK_URL", "Destinația formularului de ofertă nu este configurată."],
  ["QUOTE_EMAIL_TO", "E-mailul destinatar pentru ofertă nu este configurat."],
];
for (const [key, message] of envChecks) {
  if (!process.env[key]) blockers.push(message);
}

blockers.push("Datele juridice ale societății trebuie completate în src/config/companyConfig.ts.");
blockers.push("Statisticile provizorii trebuie verificate înainte de producție.");
blockers.push("Testimonialele trebuie să fie reale sau eliminate înainte de producție.");

if (production && blockers.length > 0) {
  console.error("Blocaje de producție:");
  console.error(blockers.map((blocker) => `- ${blocker}`).join("\n"));
  process.exit(1);
}

for (const warning of [...warnings, ...blockers]) {
  console.warn(`Production warning: ${warning}`);
}

console.log("Development asset verification completed.");
