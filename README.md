# Cartpaper.ro

Mobile-first Romanian lead-generation website and bag personalizer for Cartpaper.

## Development

```bash
npm install
npm run dev
```

The site runs at `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run verify:mockups
npm run verify:assets
npm run build
```

`npm run verify:assets` reports production blockers in development and fails only when `CARTPAPER_PRODUCTION=true`.

## Assets

The source logo files in `logo/` are never edited. `npm run prepare:brand` copies public derivatives into `public/brand/`.

The four bag mockups and ANPC SAL artwork are development placeholders until the real licensed files are supplied. See `ASSET_PREPARATION.md` and `THIRD_PARTY_ASSETS.md`.

## Legal

Textele juridice sunt șabloane tehnice și trebuie revizuite pentru datele și activitatea reală a societății.

## Environment

Copy `.env.example` to `.env.local` for local configuration. `REMOVE_BG_API_KEY` is server-only. Local background removal works without it; external removal must be disclosed in the privacy content before production use.
