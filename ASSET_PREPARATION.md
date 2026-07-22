# Cartpaper Asset Preparation

The current app ships with development placeholders for the four bag mockups. Replace them before production.

1. Download the licensed PSD source listed for each mockup in `THIRD_PARTY_ASSETS.md`.
2. Open each PSD in Photoshop or Photopea.
3. Hide all demo branding and keep the bag, handles, folds, paper texture, shadows and highlights.
4. Export a clean `base.webp`, transparent `overlay.png`, black/white `mask.png`, and `thumbnail.webp` at a consistent 1200×1500 stage.
5. Update each `public/mockups/{id}/metadata.json` with real license wording and set `placeholder` to `false`.
6. Run `npm run verify:mockups`.

The original PSD files must stay outside `public/`.
