# Cartpaper Asset Preparation

The current app ships with development placeholders for the four bag mockups. Replace them before production.

1. Download the licensed PSD source listed for each mockup in `THIRD_PARTY_ASSETS.md`.
2. Open each PSD in Photoshop or Photopea.
3. Hide all demo branding and keep the bag, handles, folds, paper texture, shadows and highlights.
4. Export the V3 runtime set at a consistent 1200×1500 stage: `base.webp`, `poster.webp`, `overlay.png`, `shadow-overlay.png`, `highlight-overlay.png`, `handle-overlay.png`, `print-mask.png`, `bag-color-mask.png`, `displacement-map.png`, plus a 480×600 `thumbnail.webp`.
5. Keep `mask.png` as a compatibility alias for `print-mask.png` while the customizer export path remains backward-compatible.
6. Update each `public/mockups/{id}/metadata.json` with real license wording, the exact runtime file list, and set `placeholder` to `false`.
7. Run `npm run verify:mockups`.

Brand assets are generated from `logo/2.png` and `logo/4.png` only. Run `npm run prepare:brand` after replacing the source logo exports; the script trims transparent whitespace, restores safe padding, writes `public/brand/asset-manifest.json`, and removes obsolete baked wordmark/icon derivatives.

The development ANPC SAL footer artwork is `public/legal/anpc-sal.png` with companion metadata in `public/legal/anpc-sal.metadata.json`. Replace the image with the official 250×50 artwork and set `placeholder` to `false` in that metadata before production.

The original PSD files must stay outside `public/`.
