# CARTPAPER.RO — MASTER CODEX PROMPT V2
## Mobile-first React website, Romanian content, four real bag mockups, live logo customizer

Act as a senior product designer, senior React/Next.js engineer, mobile UX specialist, image-processing engineer, accessibility specialist, performance engineer and QA engineer.

Work directly in the repository currently open in VS Code. Inspect the existing project before changing anything. Preserve existing work. Create and edit the actual files, install the required dependencies, run the checks, fix failures and leave a working production build.

Do not stop at a proposal, wireframe or collection of snippets. Implement the product. Do not wait for confirmation unless an action would permanently delete user files or overwrite an irreplaceable asset.

The project is **mobile-first**. Design, implement and test the 360–430px experience first. Desktop is a progressive enhancement of the mobile product, not the other way around.

---

## 1. Project context

Brand: **Cartpaper / cartpaper.ro**

Business: custom branded paper bags for Romanian businesses, boutiques, restaurants, events and premium retail.

Local logo directory on this Mac:

```text
/Users/samuelbuzatu/Desktop/git things/cartpaper.ro/logo
```

Quote this path in shell commands because it contains spaces. Never edit, rename or delete the source files in that folder. Copy selected assets into the repository and work on the copies.

Reference screenshots should be placed inside the repository at:

```text
reference/screenshots/
```

Inspect all screenshots in that folder. Treat them as the primary visual reference for brand character, typography, spacing, section order, color, border radii and responsive behavior. Do not reproduce defects that may exist in the screenshots, such as duplicated statistics, clipped content, inaccessible contrast or oversized mobile sections.

The public interface, navigation, validation, consent text, legal templates and marketing copy must be in natural Romanian with correct diacritics. Code, filenames and technical comments may be in English.

---

## 2. Product outcome

Build a polished Romanian website that:

1. Visually follows the supplied Cartpaper screenshots.
2. Uses the supplied Cartpaper logos and extracts the real brand lime from them.
3. is designed mobile-first from a 360px baseline.
4. has a dedicated, app-like bag personalizer at `/personalizeaza`.
5. lets a visitor upload PNG, JPG, WEBP or SVG logos.
6. detects existing transparency.
7. removes a simple flat background locally in the browser.
8. offers optional advanced background removal through a secure server route.
9. places the cleaned logo on four photorealistic paper-bag mockups.
10. lets the visitor move, resize, rotate, recolor and reset the logo.
11. makes the logo look printed on the bag rather than pasted over it.
12. exports a high-resolution PNG preview.
13. passes the selected configuration into a Romanian quote form.
14. includes a functional cookie-consent banner and preferences dialog.
15. includes current ANPC SAL artwork and link in the footer.
16. includes Romanian privacy, cookie and terms templates.
17. is accessible, responsive, fast and maintainable.
18. never fakes a form submission or makes unverified business claims.

This is a lead-generation website and visual configurator, not a checkout.

---

## 3. First actions

Before implementation:

1. Inspect the current repository:
   - list files and directories;
   - identify the framework and package manager;
   - inspect `package.json`, lockfiles, TypeScript and lint configuration;
   - inspect existing components and styles;
   - run `git status`;
   - do not discard unrelated changes.

2. Inspect the logo directory:
   ```text
   "/Users/samuelbuzatu/Desktop/git things/cartpaper.ro/logo"
   ```

3. For every logo file, record:
   - filename;
   - format;
   - pixel dimensions;
   - alpha channel;
   - whether it is an icon or wordmark;
   - whether it is intended for light or dark backgrounds;
   - whether the black background is real or only a preview background;
   - dominant lime color;
   - visual quality.

4. Inspect every screenshot in `reference/screenshots/`.

5. Inspect `source-assets/bag-mockups/` for the four source PSD files described below.

6. Write a short implementation plan in the terminal output or a temporary note, then continue immediately.

If the logo path cannot be accessed, create `public/brand/README.md`, use a clearly marked temporary text wordmark and report the missing asset as a production blocker.

If the screenshot folder is empty, continue from this specification and create `reference/screenshots/README.md` explaining where the screenshots belong.

If the source bag PSDs are missing, do not use compressed website preview images as production assets. Implement the complete customizer with clearly labelled local development placeholders, create `source-assets/bag-mockups/README.md`, and report the four required downloads.

---

## 4. Four selected photorealistic bag sources

Use four distinct real-looking editable bag mockups. Do not hotlink them in the production website. Download the licensed source PSDs manually, preserve their license information, prepare clean local runtime assets, and serve only the prepared local exports.

Expected source filenames:

```text
source-assets/bag-mockups/kraft-classic.psd
source-assets/bag-mockups/white-premium.psd
source-assets/bag-mockups/black-luxury.psd
source-assets/bag-mockups/color-pop.psd
```

### Bag A — Kraft Clasic

Source title:
`Free Kraft Paper Shopping Bag Mockup PSD`

Source page:
`https://goodmockups.com/free-kraft-paper-shopping-bag-mockup-psd-3/`

Purpose:
- natural kraft carrier;
- twisted paper handles;
- upright three-quarter view;
- main everyday bag;
- recommended logo modes: original, black, white or Cartpaper lime;
- recommended blend mode: multiply for dark marks, normal for white marks.

### Bag B — Alb Premium

Source title:
`Free White Shopping Bag Mockup PSD`

Source page:
`https://goodmockups.com/free-white-shopping-bag-mockup-psd-2/`

Purpose:
- white premium carrier;
- configurable handle, side and inner colors;
- bright, clean surface;
- recommended logo modes: original, black, Cartpaper lime;
- recommended blend mode: multiply or normal.

### Bag C — Negru Elegant

Source title:
`Free Dark Shopping Bag Mockup (PSD)`

Source page:
`https://unblast.com/free-dark-shopping-bag-mockup-psd/`

Purpose:
- upright dark luxury bag;
- black cord handles;
- premium presentation;
- recommended logo modes: white, Cartpaper lime or a user-selected light color;
- recommended blend mode: screen or normal.

### Bag D — Culoare Intensă

Source title:
`Paper gift bag mockup`

Source page:
`https://mockups-design.com/paper-gift-bag-mockup/`

Purpose:
- front-facing premium gift bag;
- configurable bag, handle and inner colors;
- export a Cartpaper-compatible coral/red version for the default preset;
- allow optional preset colors such as coral, navy, blush and lime;
- recommended logo modes: white, black or original;
- recommended blend mode: normal.

### Asset-license record

Create:

```text
THIRD_PARTY_ASSETS.md
public/mockups/asset-manifest.json
```

For each source record:
- asset id;
- title;
- source page;
- original creator if stated;
- license wording shown on the source page;
- date accessed;
- local source filename;
- prepared runtime files;
- any attribution requirement;
- a note that the original PSD is not redistributed publicly.

Do not claim ownership of third-party mockups. Do not remove source-license records.

---

## 5. Preparing runtime bag assets

Browsers cannot use PSD smart objects directly. The website must use prepared, clean exports.

For each bag create:

```text
public/mockups/{bag-id}/base.webp
public/mockups/{bag-id}/overlay.png
public/mockups/{bag-id}/mask.png
public/mockups/{bag-id}/thumbnail.webp
public/mockups/{bag-id}/metadata.json
```

Use these ids:

```text
kraft-classic
white-premium
black-luxury
color-pop
```

Preparation requirements:

1. Open the original PSD in Photoshop or Photopea.
2. Hide or replace all demo branding.
3. Keep the bag, handles, folds, paper texture, highlights and shadows.
4. Export a clean base image with no logo.
5. Export a transparent overlay containing only highlights, folds and shadows that should sit above the visitor’s logo, when the PSD structure permits it.
6. Export a print-area mask:
   - white = printable front surface;
   - black = outside the printable surface;
   - soft grey only where feathered clipping is intentional.
7. Export a thumbnail.
8. Keep all runtime images in the same stage aspect ratio, preferably 4:5.
9. Use a working stage of 1200×1500 or another consistent 4:5 size.
10. Preserve sufficient resolution for a 2× PNG export.
11. Do not include the PSD files under `public/`.
12. Do not ship mockup previews that still contain another brand’s design.
13. Do not distort the bag or legal source artwork.
14. Optimize photographic bases to WebP.
15. Keep overlays and masks as PNG.

Create `scripts/verify-mockup-assets.mjs` to verify:
- all four asset sets exist;
- dimensions are consistent;
- masks match base dimensions;
- overlays have alpha;
- no known development-placeholder hash remains;
- metadata contains source and license fields.

If automatic PSD extraction is unreliable, do not generate damaged assets. Create a precise `ASSET_PREPARATION.md` with manual export steps and keep development placeholders until clean exports are supplied.

---

## 6. Technology

Preferred stack:

- current stable Next.js App Router;
- React;
- strict TypeScript;
- `src/` directory;
- CSS Modules and `src/app/globals.css`;
- no Tailwind unless the repository already uses it;
- `next/font`;
- `next/image` for ordinary content images;
- `react-konva`, `konva`, `use-image`;
- `lucide-react`;
- `zod`;
- `dompurify`;
- `clsx`;
- Vitest;
- React Testing Library;
- Playwright;
- `@axe-core/playwright`;
- `sharp` for build-time image checks and optimization.

Use Server Components by default. Use Client Components only for:
- customizer state;
- file input;
- canvas;
- browser image processing;
- cookie preferences;
- mobile menus;
- dialogs and form interactions.

Dynamically import the customizer with SSR disabled. Do not load Konva or image-processing code on the first marketing-page render.

If the repository is empty, scaffold a stable Next.js App Router application with TypeScript, ESLint, `src/`, App Router and the `@/*` alias.

Do not use canary or experimental releases.

---

## 7. Mobile-first rules

These rules are non-negotiable.

1. Write base CSS for 360–430px first.
2. Add only `min-width` media queries for tablet and desktop enhancements.
3. Validate at 360×800 before styling 1440px.
4. No hover-only behavior.
5. All important controls must work with one thumb.
6. Interactive targets should be approximately 44×44px or larger.
7. Use `100dvh`, not `100vh`, for app-like screens.
8. Respect:
   - `env(safe-area-inset-top)`;
   - `env(safe-area-inset-right)`;
   - `env(safe-area-inset-bottom)`;
   - `env(safe-area-inset-left)`.
9. Use a single-column reading order on mobile.
10. Do not create horizontal page scrolling.
11. Mobile headings must not clip at 320–360px.
12. Inputs must use at least 16px text to avoid unwanted iOS zoom.
13. Do not put critical controls behind tiny icon-only buttons.
14. Do not trap page scrolling except while a modal or mobile drawer is open.
15. Apply `touch-action: none` only to the active canvas-editing surface, not the whole page.
16. Respect `prefers-reduced-motion`.
17. Optimize for a mid-range mobile CPU and a normal 4G connection.
18. Avoid large client bundles on the home page.
19. Do not decode or process full-size images repeatedly during slider movement.
20. The cookie banner and customizer action bar must never cover each other.

Create a CSS custom property such as:

```css
--cookie-banner-height: 0px;
```

Update it when the mobile consent banner is visible, and offset sticky customizer controls accordingly.

---

## 8. Information architecture

Routes:

```text
/
 /personalizeaza
 /politica-de-confidentialitate
 /politica-de-cookies
 /termeni-si-conditii
```

Home-page section order:

1. Header
2. Hero
3. Trust/statistics strip
4. Short process section
5. Personalizer teaser with a direct CTA
6. Collection
7. Why Cartpaper
8. Verified testimonials, only when real content exists
9. Final lime CTA
10. Footer

The dedicated `/personalizeaza` route contains the complete customizer. Do not force the complex editor into a narrow embedded home-page card. The home page may show a non-interactive or lightweight preview and a strong button:

`Personalizează o pungă`

All home-page quote CTAs may open the quote dialog. All personalization CTAs go to `/personalizeaza`.

---

## 9. Visual system

Follow the screenshots closely:

- warm off-white background;
- deep charcoal text;
- near-black dark sections;
- lime accent derived from the actual logo;
- editorial serif display typography;
- clean geometric sans-serif UI typography;
- restrained borders;
- rounded cards;
- pill buttons;
- minimal shadows;
- generous negative space;
- premium packaging aesthetic.

Suggested fallback palette until the logo is inspected:

```css
--color-bg: #f7f3ea;
--color-surface: #efebdf;
--color-surface-strong: #e6e0d4;
--color-ink: #11120e;
--color-ink-soft: #1b1c17;
--color-muted: #756f65;
--color-border: #d8d1c5;
--color-white: #fffefa;
--color-lime: #bdec14;
--color-lime-hover: #addc0c;
--color-error: #a92b2b;
--color-success: #426518;
```

Extract and replace `--color-lime` from the real logo.

Suggested fonts:
- display: Cormorant Garamond;
- body/UI: Manrope.

Load through `next/font`; do not depend on runtime Google Fonts requests.

Mobile typography targets:
- H1: `clamp(3rem, 14vw, 4.8rem)`;
- section title: `clamp(2.45rem, 10vw, 4rem)`;
- body: 1rem–1.125rem;
- compact labels: 0.75rem–0.875rem.

Use these only as starting points; visually calibrate against the screenshots.

---

## 10. Header

Mobile first:

- 68–72px high;
- warm off-white;
- Cartpaper wordmark left;
- hamburger right;
- sticky;
- subtle bottom border after scrolling;
- accessible full-screen or large drawer menu;
- menu links:
  - Servicii
  - Personalizare
  - Proces
  - Colecție
  - De ce Cartpaper
  - Contact
- primary menu CTA:
  `Cere ofertă`
- lock body scroll while open;
- close on Escape, outside click or selected link;
- restore focus to the trigger.

Desktop enhancement:
- full horizontal navigation;
- lime quote button;
- approximately 80–88px high.

Add a skip link:
`Sari la conținut`

---

## 11. Home-page content and composition

Centralize copy in:

```text
src/content/siteContent.ts
```

Do not scatter final marketing text through JSX.

### Hero

Badge:
`PUNGI DE HÂRTIE PERSONALIZATE`

H1:
`Brandul tău, ambalat frumos.`

Render `frumos` in lime.

Body:
`Creăm pungi de hârtie personalizate pentru afaceri care vor să fie ținute minte — de la magazine locale la branduri naționale. Fiecare pungă devine o extensie a identității tale.`

Primary CTA:
`Personalizează o pungă`

Secondary CTA:
`Cere o ofertă`

Option chips:
- `Mâner răsucit`
- `Laminare mată`

On mobile:
- copy first;
- actions next;
- options next;
- statistics next;
- image after the primary content;
- dark quantity badge over the image;
- no side-by-side content;
- no duplicate statistics.

On desktop:
- split layout resembling the supplied screenshot.

Provisional statistics:
- `500+` / `branduri deservite`
- `1M+` / `pungi produse`
- `48h` / `răspuns rapid`

Mark all three as requiring verification before production.

### Process

Overline:
`PROCES`

Title:
`De la idee la pungă, în trei pași.`

Step 1:
- `Încarcă logo-ul`
- `Adaugă identitatea brandului tău și verifică fundalul.`

Step 2:
- `Alege și personalizează`
- `Selectează punga, culoarea și poziția imprimării.`

Step 3:
- `Primești propunerea`
- `Descarcă simularea și trimite-ne configurația pentru ofertă.`

### Personalizer teaser

Overline:
`PERSONALIZATOR`

Title:
`Vezi logo-ul tău pe patru tipuri de pungă.`

Body:
`Încarcă logo-ul, elimină fundalul și testează rapid variantele Kraft Clasic, Alb Premium, Negru Elegant și Culoare Intensă.`

CTA:
`Începe personalizarea`

Show the four prepared thumbnails in a swipeable mobile row with scroll snapping. Do not create an auto-playing carousel.

### Collection

Overline:
`COLECȚIE`

Title:
`Fiecare pungă, la alt nivel.`

Tabs:
- `Kraft clasic`
- `Alb premium`
- `Culoare intensă`
- `Panglică satinată`

Tabs must be functional and touch-friendly.

### Benefits

Overline:
`DE CE CARTPAPER`

Title:
`Ambalaje care muncesc la fel de mult ca tine.`

Cards:
- `Comenzi adaptate proiectului`
- `Culori atent controlate`
- `Materiale selectate responsabil`
- `Ambalaj cu identitatea ta`

Do not make certification or sustainability claims that cannot be documented.

### Testimonials

Only show verified testimonials in production. Do not invent quotes, names, star ratings or customer companies. In development, optional sample cards must be labelled `Conținut demonstrativ`.

### Final CTA

Overline:
`ÎNCEPE ASTĂZI`

Title:
`Pregătit să creezi pungi pe care oamenii le țin minte?`

Body:
`Trimite-ne brief-ul și revenim cu întrebările necesare, o simulare și o ofertă potrivită proiectului.`

Actions:
- `Cere un kit de mostre`
- `Sună-ne direct`

---

## 12. Dedicated mobile-first personalizer

Create an app-like route at:

```text
/personalizeaza
```

### Mobile layout

The mobile personalizer is a five-step wizard:

1. `Logo`
2. `Fundal`
3. `Pungă`
4. `Poziționare`
5. `Previzualizare`

Top app bar:
- back link to the home page;
- short title;
- progress indicator such as `Pasul 2 din 5`;
- no desktop navigation clutter.

Main area:
- one task per screen;
- maximum readable width;
- clear title and short helper text;
- no dense sidebars.

Bottom action bar:
- sticky;
- safe-area aware;
- `Înapoi`;
- primary `Continuă`;
- offset above cookie banner;
- disabled state is visually and semantically clear.

Persist the in-progress customizer state in `sessionStorage`, not permanent local storage. Clear the uploaded logo when the tab session ends. Never persist image bytes in cookies.

### Desktop enhancement

At 900px and above:
- left control rail;
- large preview on the right;
- progress remains visible;
- controls can be edited without leaving the preview;
- preserve the same step model and data state as mobile.

### Step 1 — Logo

- large upload zone;
- camera/photo-library compatible file input;
- accepted types clearly shown;
- checkerboard preview;
- replace/remove buttons;
- privacy note.

Copy:
`PNG, JPG, WEBP sau SVG. Maximum 10 MB.`

Privacy:
`Procesarea de bază are loc direct pe dispozitivul tău. Logo-ul nu este salvat pe server.`

### Step 2 — Fundal

- show before/after;
- detect transparency;
- if transparent, confirm and continue;
- local removal button;
- eyedropper/background color;
- tolerance;
- feather;
- undo;
- reset;
- optional advanced removal with explicit consent.

### Step 3 — Pungă

Show the four bag presets as large cards:
- image;
- Romanian name;
- one-line material/finish description;
- selected state with more than color alone.

The selected card should update the preview immediately.

### Step 4 — Poziționare

Keep the preview visible at the top on mobile, no taller than roughly 52–58dvh.

Controls:
- drag logo on the preview;
- corner resize handles;
- rotation handle;
- `Centrează`;
- `Potrivește în zona de tipar`;
- `Resetează`;
- color mode;
- opacity;
- rotation slider;
- size slider;
- blend mode under an `Opțiuni avansate` disclosure.

Provide large touch controls. Do not require precise tiny handles.

### Step 5 — Previzualizare

Show:
- final mockup;
- chosen bag;
- logo mode;
- background-removal method;
- approximate print size;
- disclaimer;
- download;
- quote CTA;
- edit buttons for earlier steps.

Disclaimer:
`Simulare orientativă. Dimensiunea, poziționarea și culorile finale se confirmă în bunul de tipar.`

Primary:
`Descarcă simularea`

Secondary:
`Adaugă la cererea de ofertă`

---

## 13. Upload validation and SVG safety

Accept:
- PNG;
- JPEG;
- WEBP;
- SVG.

Maximum:
- 10 MB.

Validate:
- extension;
- MIME type;
- decoded content;
- dimensions;
- malformed files.

Recommended raster size:
- at least 800px on the longest side.

Romanian messages:

Invalid format:
`Formatul fișierului nu este acceptat. Folosește PNG, JPG, WEBP sau SVG.`

Too large:
`Fișierul depășește limita de 10 MB.`

Low resolution:
`Logo-ul are o rezoluție redusă. Simularea poate părea neclară.`

Unreadable:
`Fișierul nu a putut fi citit. Încearcă un alt export al logo-ului.`

Already transparent:
`Logo-ul are deja fundal transparent.`

For SVG:
- read as text;
- sanitize with DOMPurify using an SVG-safe profile;
- remove scripts;
- remove event attributes;
- remove `foreignObject`;
- reject external image/font/resource URLs;
- rasterize the sanitized SVG for the canvas;
- never inject unsanitized SVG into the DOM.

Revoke all Blob URLs when replaced or unmounted.

---

## 14. Background removal

Implement two modes.

### Mode A — local fast removal

Use an edge-connected flood-fill algorithm in a Web Worker.

Do not globally delete every pixel matching white, black or a selected color. That destroys valid interior logo details.

Algorithm:

1. Decode the image.
2. Sample the corners and multiple edge points.
3. Estimate the dominant connected background color.
4. Determine whether edge colors are sufficiently consistent.
5. Seed flood fill only from matching boundary pixels.
6. Traverse only pixels connected to the image edge.
7. Use a documented color-distance metric.
8. Expose tolerance.
9. Feather the alpha boundary.
10. Preserve existing alpha.
11. Return a transparent PNG Blob.
12. Keep an undo copy in memory.

Use:
```text
src/workers/backgroundRemoval.worker.ts
```

Downscale the processing preview to a sensible maximum, such as 1600–2400px on the longest edge. Do not re-run the complete algorithm on every range-input event; debounce it.

Complex-background message:
`Fundalul pare complex. Ajustează culoarea și toleranța sau folosește eliminarea avansată.`

Same-color warning:
`Unele elemente ale logo-ului au aceeași culoare ca fundalul. Pentru cel mai bun rezultat, folosește un PNG transparent sau un SVG.`

### Mode B — optional advanced removal

Create:

```text
src/app/api/remove-background/route.ts
```

Server-only environment variable:

```text
REMOVE_BG_API_KEY=
```

Do not use a `NEXT_PUBLIC_` prefix.

The local method must work without a key.

Before uploading to the external processor, show a confirmation:
`Procesarea avansată trimite temporar fișierul către un furnizor extern. Continuă numai dacă ești de acord.`

Server route:
- same-origin validation where practical;
- multipart form data;
- file validation again;
- 10 MB maximum;
- timeout using `AbortController`;
- no permanent storage;
- no image-byte logging;
- no secret logging;
- return transparent PNG;
- handle provider and rate-limit errors in Romanian.

Not configured:
`Procesarea avansată nu este configurată momentan.`

Provider failure:
`Fundalul nu a putut fi eliminat automat. Poți continua cu instrumentele locale.`

Busy/rate-limited:
`Serviciul de procesare este ocupat. Încearcă din nou peste câteva minute.`

Use a provider interface so the service can be replaced later.

---

## 15. Mockup rendering

Use a consistent internal stage, preferably 1200×1500.

Rendering order:

1. base image;
2. visitor logo clipped to the print mask;
3. surface texture/highlight/shadow overlay;
4. selection controls only while editing.

Each preset must define:
- base source;
- overlay source;
- mask source;
- thumbnail;
- stage dimensions;
- print-area polygon or quadrilateral;
- default logo position and scale;
- recommended logo mode;
- recommended blend mode;
- allowed bag-color options;
- accessible description.

Create a typed model similar to:

```ts
type Point = { x: number; y: number };

type MockupPreset = {
  id: "kraft-classic" | "white-premium" | "black-luxury" | "color-pop";
  label: string;
  shortDescription: string;
  baseSrc: string;
  overlaySrc: string;
  maskSrc: string;
  thumbnailSrc: string;
  stage: { width: number; height: number };
  printQuad: [Point, Point, Point, Point];
  defaultLogo: {
    x: number;
    y: number;
    width: number;
    rotation: number;
  };
  recommendedColorMode: "original" | "black" | "white" | "lime";
  recommendedBlendMode: "normal" | "multiply" | "screen";
  bagColorOptions?: Array<{ id: string; label: string; value: string }>;
};
```

For near-front-facing bags, an affine transform is acceptable. For visibly angled bags, map the logo to the four-corner print quadrilateral using a perspective transform or a triangle-subdivision canvas/WebGL method. Do not merely place an unwarped rectangle over an angled surface.

Provide a graceful affine fallback when WebGL2 is unavailable.

Use the mask to prevent printing across handles, side panels or outside the front face.

Logo color modes:
- `Culori originale`;
- `Negru`;
- `Alb`;
- `Verde Cartpaper`;
- `Culoare personalizată`.

Recolor by preserving the alpha channel and filling opaque pixels. Do not rely on approximate CSS filters.

Blend modes:
- normal;
- multiply;
- screen;
- automatic.

Default:
- kraft: multiply for dark logo;
- white: multiply or normal;
- black: screen or normal;
- color pop: normal.

Controls:
- drag;
- resize;
- rotate;
- center;
- fit;
- reset;
- undo last transform.

The exported image must not contain edit handles.

---

## 16. Touch interaction

Implement the customizer for touch first.

Requirements:
- single-finger drag;
- large corner handles;
- optional two-finger scale/rotation;
- sliders as an accessible alternative to gestures;
- no accidental page scrolling while actively transforming the logo;
- restore normal page scrolling when the gesture ends;
- no long-press requirement;
- no hover tooltip dependency;
- prevent the image from being dragged by the browser;
- keep logo bounds within or near the printable region;
- provide haptic feedback only through supported, non-essential APIs and never require it.

A keyboard-accessible alternative must allow:
- arrow-key position adjustment;
- Shift + arrows for larger steps;
- numeric size;
- numeric rotation;
- reset;
- center.

Expose a text summary:
`Logo centrat, 62% din lățimea zonei de tipar, rotire 0 grade, opacitate 100%.`

---

## 17. Export

Export a PNG from the mockup stage.

Requirements:
- hide editing controls;
- include the base, logo and overlay;
- use a pixel ratio of 2 when memory permits;
- retry at a lower ratio on memory-constrained mobile devices;
- strip metadata by rendering through canvas;
- show progress;
- handle cancellation/failure;
- preserve the selected 4:5 framing;
- filename:
  `cartpaper-simulare-{mockup-id}-{YYYY-MM-DD}.png`.

Do not include the control UI in the image.

After export, allow:
- download;
- share through `navigator.share` when file sharing is supported;
- fallback to ordinary download when it is not.

Do not make Web Share a requirement.

---

## 18. Quote flow

Create an accessible quote dialog or page-level sheet.

Fields:
- Nume;
- Companie;
- E-mail;
- Telefon;
- Tipul pungii;
- Cantitate estimată;
- Dimensiuni dorite;
- Tip de mâner;
- Finisaj;
- Număr de culori;
- Termen orientativ;
- Mesaj;
- logo attached indicator;
- simulation attached indicator;
- privacy acknowledgement.

Use Zod and Romanian error messages.

Create:

```text
src/app/api/quote/route.ts
```

Environment:

```text
QUOTE_WEBHOOK_URL=
QUOTE_EMAIL_TO=
CONTACT_EMAIL=
```

If a webhook is configured, send validated JSON. Do not send image bytes unless the destination is intentionally built to receive them.

If no backend is configured, do not show a false success state. Show:
`Formularul online nu este configurat încă. Descarcă simularea și trimite-ne configurația prin e-mail.`

Provide a properly encoded email fallback.

Include:
- honeypot;
- loading state;
- success state;
- failure state;
- basic rate-limit abstraction;
- no permanent local lead storage.

---

## 19. Cookie consent

Implement a real consent manager in Romanian.

Categories:
- Necesare — always on;
- Analiză — off by default;
- Marketing — off by default.

First-visit mobile presentation:
- bottom sheet;
- does not occupy the whole screen;
- respects safe-area inset;
- concise copy;
- three actions that remain usable at 360px.

Copy:
`Folosim cookie-uri necesare pentru funcționarea site-ului. Cu acordul tău, putem activa cookie-uri de analiză și marketing. Poți accepta, refuza sau personaliza opțiunile.`

Actions:
- `Refuză opționale`;
- `Personalizează`;
- `Acceptă toate`.

Do not visually hide or weaken the reject action.

Preferences title:
`Preferințe cookie`

Buttons:
- `Salvează preferințele`;
- `Refuză opționale`;
- `Acceptă toate`.

Store a versioned record:
- version;
- categories;
- timestamp.

Cookie name:
`cartpaper_consent`

Suggested lifetime:
180 days.

Use SameSite=Lax.

No analytics or marketing script may load before consent. Implement an optional script registry even if no optional scripts are configured.

Footer control:
`Setări cookie`

The preferences dialog must:
- trap focus;
- close on Escape;
- restore focus;
- not treat closing as acceptance;
- expose toggles properly;
- keep necessary cookies locked on.

---

## 20. ANPC SAL footer asset

Use the current official ANPC SAL implementation, not the obsolete EU SOL/ODR badge.

Portal destination:

```text
https://reclamatiisal.anpc.ro/
```

Official ANPC information source:

```text
https://anpc.ro/
```

Expected local file:

```text
public/legal/anpc-sal.png
```

Requirements:
- obtain the current official artwork from ANPC;
- preserve it exactly;
- do not redraw or recolor it;
- display at 250×50 pixels;
- use width `250` and height `50`;
- link to the SAL portal;
- open in a new tab;
- use `rel="noopener noreferrer"`;
- alt:
  `Soluționarea Alternativă a Litigiilor – ANPC`;
- add an adjacent text link;
- do not include an obsolete SOL badge.

If the official image is missing, show a development-only placeholder that explicitly says it is not official. Make `verify:assets` fail for production until the official file is present.

---

## 21. Footer

Deep charcoal background.

Mobile order:
1. Cartpaper wordmark;
2. short description;
3. social links, only when configured;
4. Services links;
5. Company links;
6. Contact details;
7. ANPC SAL;
8. legal links;
9. cookie settings;
10. copyright.

Desktop:
- four columns;
- legal row below.

Do not render `href="#"`.

Company values must be editable in:

```text
src/config/companyConfig.ts
```

Do not invent:
- legal company name;
- CUI;
- registration number;
- registered address;
- real phone;
- real working hours;
- social URLs.

---

## 22. Legal pages

Create:
- `/politica-de-confidentialitate`;
- `/politica-de-cookies`;
- `/termeni-si-conditii`.

Use branded layouts and Romanian copy templates.

The privacy template must distinguish:
- local logo processing;
- optional external background removal;
- quote-form data;
- consent storage;
- optional analytics/marketing.

Do not invent legal facts, retention periods or processors. Use configuration placeholders and a production-verification checklist.

State in the README:
`Textele juridice sunt șabloane tehnice și trebuie revizuite pentru datele și activitatea reală a societății.`

---

## 23. Accessibility

Target WCAG 2.2 AA.

Requirements:
- one H1 on the home page;
- semantic landmarks;
- valid heading hierarchy;
- visible focus;
- meaningful Romanian alt text;
- decorative images use empty alt;
- buttons are buttons;
- links are links;
- no clickable divs;
- focus-managed drawer and dialogs;
- associated form errors;
- `aria-live` for processing, upload, export and form status;
- 44px touch targets;
- no state communicated by color alone;
- sufficient contrast;
- reduced-motion support;
- keyboard alternative for canvas interactions;
- textual customizer state summary;
- accessible accordion controls;
- no automatic carousel;
- no unexpected focus changes.

Do not use lime for small text on cream when contrast is insufficient.

---

## 24. Performance

Home-page priorities:
- server-render marketing sections;
- lazy-load below-the-fold images;
- dynamically import the personalizer teaser logic if needed;
- do not load Konva on `/`;
- preload only the actual LCP asset;
- explicit image dimensions;
- responsive sizes;
- no large base64 assets;
- no unnecessary global state library;
- no Redux;
- self-hosted font output through `next/font`.

Customizer priorities:
- load only on `/personalizeaza`;
- lazy-load advanced removal;
- use a Web Worker;
- downscale processing previews;
- debounce expensive operations;
- cache the latest processed result for the tab session;
- clean up workers and object URLs;
- avoid re-decoding bag bases on every control update.

Set practical performance budgets in the README and report measured values only when actually measured.

---

## 25. SEO

Set:
- `<html lang="ro">`;
- title:
  `Cartpaper — Pungi de hârtie personalizate`;
- description:
  `Pungi de hârtie personalizate pentru retail, evenimente și branduri. Încarcă logo-ul, testează patru simulări și solicită o ofertă.`;
- canonical based on `NEXT_PUBLIC_SITE_URL`;
- Open Graph metadata;
- favicon;
- sitemap;
- robots.

Do not output Organization or LocalBusiness structured data until real company information exists.

---

## 26. Security and privacy

- strict file validation;
- sanitized SVG;
- no client-exposed secrets;
- no permanent upload storage;
- no image-byte logging;
- no untrusted HTML injection;
- no untrusted external URLs;
- request timeout;
- origin validation where practical;
- CSP compatible with Next.js, Blob URLs, Web Workers and canvas exports;
- `X-Content-Type-Options`;
- sensible `Referrer-Policy`;
- sensible `Permissions-Policy`;
- no analytics by default;
- no remote bag-image hotlinks;
- no PSDs in public assets.

Test security headers rather than adding a CSP that breaks the app.

---

## 27. Suggested structure

```text
src/
  app/
    api/
      quote/route.ts
      remove-background/route.ts
    personalizeaza/page.tsx
    politica-de-confidentialitate/page.tsx
    politica-de-cookies/page.tsx
    termeni-si-conditii/page.tsx
    layout.tsx
    page.tsx
    globals.css
    sitemap.ts
    robots.ts

  components/
    layout/
    sections/
    consent/
    quote/
    personalizer/
      MobilePersonalizerShell.tsx
      DesktopPersonalizerLayout.tsx
      PersonalizerProvider.tsx
      ProgressHeader.tsx
      StepLogo.tsx
      StepBackground.tsx
      StepBag.tsx
      StepPlacement.tsx
      StepReview.tsx
      MockupStage.tsx
      MockupSelector.tsx
      TransformControls.tsx
      ExportActions.tsx
      StickyStepActions.tsx
    ui/

  config/
    companyConfig.ts
    siteConfig.ts

  content/
    siteContent.ts
    legalContent.ts

  data/
    mockups.ts
    collections.ts

  hooks/
    useConsent.ts
    useObjectUrl.ts
    usePersonalizerSession.ts
    useMediaQuery.ts

  lib/
    image/
      validateImage.ts
      sanitizeSvg.ts
      detectTransparency.ts
      edgeFloodFill.ts
      tintImage.ts
      perspectiveWarp.ts
      exportStage.ts
    consent/
    validation/
    security/

  workers/
    backgroundRemoval.worker.ts

  types/

public/
  brand/
  images/
  mockups/
  legal/

source-assets/
  bag-mockups/

reference/
  screenshots/

scripts/
  prepare-brand-assets.mjs
  verify-mockup-assets.mjs
  verify-production-assets.mjs
  optimize-images.mjs

tests/
  unit/
  components/
  e2e/

THIRD_PARTY_ASSETS.md
ASSET_PREPARATION.md
.env.example
README.md
```

Adapt this structure to an existing repository rather than forcing a destructive rewrite.

---

## 28. Tests

Unit tests:
- transparency detection;
- edge flood fill;
- interior matching-color preservation;
- alpha preservation;
- tinting;
- SVG sanitization;
- consent storage;
- image validation;
- quote validation;
- perspective transform math.

Component tests:
- first-visit cookie banner;
- reject/accept/custom consent;
- upload errors;
- transparent logo handling;
- bag selection;
- step navigation;
- reset;
- export disabled before readiness;
- no false quote success.

Playwright mobile tests:
- 360×800;
- 390×844;
- 430×932.

Test:
- no horizontal overflow;
- mobile menu;
- hero;
- personalizer navigation;
- upload fixture;
- background removal;
- choose all four bags;
- move/resize/rotate logo;
- export;
- quote configuration;
- cookie banner;
- footer SAL area;
- keyboard access;
- axe checks.

Desktop:
- 1440×1000;
- 1920×1080.

Generate visual QA screenshots under:
```text
artifacts/visual/
```

Do not claim visual or Lighthouse results that were not measured.

---

## 29. Scripts

Provide:

```text
dev
build
start
lint
typecheck
test
test:watch
test:e2e
test:a11y
prepare:brand
optimize:images
verify:mockups
verify:assets
screenshots
check
```

`check` should run:
1. lint;
2. typecheck;
3. unit/component tests;
4. mockup verification;
5. production asset verification;
6. production build.

Keep full Playwright tests separate if needed for speed.

---

## 30. Environment

Create `.env.example`:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000

CONTACT_EMAIL=hello@cartpaper.ro
QUOTE_EMAIL_TO=
QUOTE_WEBHOOK_URL=

REMOVE_BG_API_KEY=
```

Explain:
- `REMOVE_BG_API_KEY` is server-only;
- local removal works without it;
- external removal must be disclosed in privacy content;
- `.env.local` must be gitignored.

---

## 31. Production verification

Create `scripts/verify-production-assets.mjs`.

Fail production verification when:
- Cartpaper wordmark is missing;
- Cartpaper icon is missing;
- any of the four bag bases is missing;
- any mask has the wrong dimensions;
- demo branding remains in known mockup files;
- the ANPC SAL asset is missing or not 250×50;
- legal company values remain required but empty;
- quote destination is not configured;
- provisional statistics are still marked unverified;
- unverified testimonials would be rendered;
- development placeholders remain.

The site may run in development with warnings, but production verification must be explicit.

---

## 32. Acceptance criteria

Complete only when:

- mobile layout is implemented first and works at 360px;
- desktop layout matches the reference direction;
- no horizontal overflow exists;
- the Cartpaper logo is correctly prepared;
- the actual brand lime is used;
- all public copy is Romanian;
- `/personalizeaza` is a usable five-step mobile flow;
- PNG, JPG, WEBP and sanitized SVG upload work;
- transparent logos are detected;
- solid backgrounds can be removed locally;
- advanced removal is secure and optional;
- four prepared bag mockups exist;
- each bag has a mask and print-area configuration;
- the logo can be moved, resized, rotated and recolored;
- angled print faces use perspective-aware mapping;
- exports contain no editor handles;
- PNG download works on mobile and desktop;
- quote configuration is carried forward;
- quote submission never fakes success;
- cookie preferences persist and can be reopened;
- optional scripts are blocked before consent;
- legal templates exist;
- current ANPC SAL is present;
- the obsolete SOL badge is absent;
- strict TypeScript passes;
- lint passes;
- tests pass;
- production build passes;
- README and asset-license records are complete.

---

## 33. Final report

After implementation, run the actual commands and fix failures.

Report:
- architecture used;
- mobile-first decisions;
- four mockups prepared and their source records;
- logo/background-removal behavior;
- perspective-rendering method;
- cookie-consent behavior;
- ANPC SAL implementation;
- quote behavior;
- commands run;
- tests and build results;
- missing assets;
- unverified content;
- remaining production blockers.

Do not say a command passed unless it actually passed.
