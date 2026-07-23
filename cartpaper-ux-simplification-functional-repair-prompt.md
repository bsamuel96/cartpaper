# CARTPAPER.RO — UX SIMPLIFICATION AND FUNCTIONAL REPAIR PROMPT

## Repository

Work directly in the existing repository:

```text
https://github.com/bsamuel96/cartpaper
```

Use the current `main` branch as the starting point. Inspect the repository and `git status` before editing. Preserve existing assets and unrelated work. Do not push, force-push, rewrite history, or open a pull request unless explicitly asked.

This is **not** another “add more effects” pass. It is a reduction, repair, and product-logic pass.

The current project contains too many simultaneous visual effects, several controls that only look interactive, and several workflows that do not behave as their labels imply. The objective is to make it feel modern, restrained, fast, and obvious to use.

The governing rule is:

> If an element looks interactive, it must produce a clear, testable result. If it does not need to be interactive, remove the interactive styling. If it has no useful purpose, remove it.

Do not stop after writing recommendations. Modify the actual application, run the checks, test the flows, and leave a working production build.

---

# 1. Product objective

Rework Cartpaper into a calm, mobile-first Romanian lead-generation website with one genuinely useful interactive product: the paper-bag personalizer.

The experience should feel:

- modern;
- premium but not theatrical;
- visually quiet;
- mobile-first;
- fast;
- direct;
- predictable;
- fully functional;
- written in natural Romanian with correct diacritics.

The website should use only a few deliberate interactions:

1. A simple swipeable bag carousel in the hero.
2. A real before/after background-removal comparison whose handle moves **inside the image**.
3. The working bag personalizer.
4. Subtle button, tab, menu, and dialog transitions.

Everything else should be static or use restrained CSS transitions.

Do not add more decorative animation libraries, floating elements, magnetic buttons, parallax layers, global grain, spotlight effects, route wipes, or scroll gimmicks.

---

# 2. Start with a real functionality audit

Before editing components, create:

```text
FUNCTIONALITY_AUDIT.md
```

Use repository search to enumerate every visible interactive element:

```bash
rg -n '<button|<a |type="range"|type="file"|role="tab"|onClick|href=' src
```

For each control, record:

| Page/component | Visible label | Current behavior | Expected behavior | Keep, repair, or remove | Test |
|---|---|---|---|---|---|

Audit at minimum:

- header navigation;
- mobile menu;
- hero CTAs;
- hero carousel arrows, swipe behavior, dots, palettes, and chips;
- collection tabs;
- collection color swatches;
- collection CTA;
- before/after comparison;
- all personalizer steps;
- upload, remove, replace, undo, background removal, sliders, bag selector, logo controls, preview, compare, fullscreen, export, share, save, restore, and quote actions;
- final CTA buttons;
- phone and email actions;
- cookie banner;
- cookie settings;
- quote form;
- legal/footer links.

After implementation, update the audit so every retained control has an observable result and an automated or documented test.

Do not leave a visible control with “future behavior,” a placeholder click handler, `href="#"`, a misleading label, or a button that only changes styling without changing data or content.

---

# 3. Confirmed defects that must be fixed

The following defects exist in the current implementation. Treat this as the minimum repair list and identify any additional problems during the audit.

## 3.1 Asset generation can overwrite production assets

`package.json` currently runs placeholder generation in `postinstall`, and `scripts/generate-placeholder-assets.mjs` writes over all mockup files and the ANPC image.

This is dangerous.

Fix it as follows:

- Remove `npm run prepare:placeholders` from `postinstall`.
- `postinstall` must not overwrite image assets.
- Placeholder generation must be an explicit developer-only command.
- The placeholder script must refuse to overwrite an asset whose metadata contains `"placeholder": false`.
- It must never overwrite `public/legal/anpc-sal.png` when the ANPC metadata says it is official.
- Add an optional `--force-development-placeholders` flag for intentional local regeneration.
- Production verification must fail when mockups or ANPC artwork are still placeholders.
- Normal `npm install` must be safe.

## 3.2 The homepage before/after slider is outside the image

The current `BeforeAfterPreview` renders a visual divider inside the image but places the actual range input underneath it.

Replace it with a genuine in-image comparison control:

- The user must be able to drag the handle directly inside the image.
- Tapping anywhere in the image should move the divider to that point.
- Dragging must work with mouse, touch, and pen.
- The handle must remain inside the image bounds.
- The control must work with Left/Right arrows, Home, and End.
- Use a 44px minimum touch target.
- Keep “Cu fundal” and “Fără fundal” labels inside the picture.
- Remove the separate slider bar below the image.
- Use `touch-action: pan-y` so vertical page scrolling still works when the user is not horizontally dragging.
- Use pointer capture during an active horizontal drag.
- Expose a semantic range control to assistive technology.
- Announce the percentage through `aria-valuetext`.
- Do not make the visual handle decorative; it must reflect and control the real value.

Suggested structure:

```tsx
<div
  className="comparison"
  style={{ "--position": `${position}%` } as React.CSSProperties}
  onPointerDown={...}
  onPointerMove={...}
>
  <Image className="comparisonBase" ... />
  <div className="comparisonReveal">...</div>
  <div className="comparisonDivider">...</div>
  <input
    className="comparisonRange"
    type="range"
    min={0}
    max={100}
    value={position}
    aria-label="Compară logo-ul înainte și după eliminarea fundalului"
    onChange={...}
  />
</div>
```

The input may be visually transparent, but it must occupy the image area and remain keyboard accessible.

## 3.3 The collection CTA passes a model that the personalizer ignores

`CollectionTabs` links to:

```text
/personalizeaza?model={mockup-id}
```

The personalizer currently starts from the default model and does not read the query parameter.

Fix this:

- Read `model` with `useSearchParams`.
- Validate it against `mockupPresets`.
- Preselect the requested bag.
- Apply the preset’s default transform, color mode, blend behavior, and finish.
- Do not overwrite a deliberately restored saved project without asking.
- Add an end-to-end test that clicks “Testează varianta” for every collection tab and confirms that the matching bag is selected on `/personalizeaza`.

## 3.4 “Sună-ne direct” does not call anyone

The final CTA currently uses a quote button for both actions, including “Sună-ne direct.”

Fix the semantics:

- “Sună-ne direct” must be a real `tel:` link when a telephone number exists.
- If no telephone number is configured, do not render a fake phone action.
- Replace it with a real email action or hide it.
- “Cere un kit de mostre” may open the quote dialog, but it must prefill a request type or message indicating that the visitor wants a sample kit.

## 3.5 The final personalizer button says “Gata” and does nothing

The sticky next button on the last step currently remains on the final step.

Replace it with a real final action:

- Primary final action: `Cere ofertă`.
- Secondary final action: `Descarcă simularea`.
- Do not show a “Gata” button unless it closes the workflow and takes the user somewhere useful.
- The sticky bar must change according to the current step.
- Every final action must be covered by an end-to-end test.

## 3.6 “Potrivește” uses stale state and can silently fail

The current fit logic updates width and then calls centering through a second update based on stale state. It can reset the width it just calculated.

Repair transform updates:

- Use one functional state update.
- Calculate `x`, `y`, and `width` once.
- “Centrează” must preserve current width and rotation.
- “Potrivește în zona de tipar” must set center and width atomically.
- “Resetează” must restore the preset default.
- Add unit tests for all three actions.
- Display a brief Romanian status message after each action.

## 3.7 The personalizer’s “before” and “after” previews use the same image

Keep separate URLs for:

- the untouched original logo;
- the current processed logo.

The “Înainte” view must always display the original upload. The “După” view must display the processed result. Restoring the original must be reversible.

Do not set `hasTransparency` to `false` blindly when restoring. Preserve the original transparency state.

Use the same in-image comparison pattern as the homepage when it is useful, rather than two oversized cards showing identical content.

## 3.8 Advanced background removal is always offered even when unavailable

The advanced provider button currently appears even when no API key is configured and only fails after the user confirms.

Add a capability endpoint:

```text
GET /api/remove-background
```

Return:

```json
{ "enabled": true }
```

only when the server-side provider is configured.

Client behavior:

- Check capability once.
- Hide or disable advanced processing when unavailable.
- Explain it in plain Romanian.
- Do not show a privacy confirmation for a feature that cannot run.
- Keep local processing as the default.
- Catch timeout, provider, JSON, and network errors.
- Never leave the UI stuck in a loading state.

## 3.9 Save exists, restore does not

A project can currently be saved to IndexedDB, but the user has no way to reopen it.

Choose one complete behavior:

Preferred behavior:
- Keep “Salvează pe dispozitiv.”
- On personalizer entry, check IndexedDB.
- Show a small `Continuă proiectul salvat` card with:
  - saved date;
  - bag type;
  - `Continuă`;
  - `Șterge`.
- Restore the logo Blob and configuration.
- Confirm before replacing the current unsaved project.
- Add tests for save, reload, restore, and delete.

Alternative:
- Remove the save action completely.

Do not retain one half of a workflow.

## 3.10 Export and share can become stale

Changing the logo, bag, position, size, rotation, color, or finish after export currently leaves the old export available for sharing.

Fix this:

- Invalidate and revoke the previous export whenever any render-affecting state changes.
- Prefer generating a fresh preview at the moment the user selects `Partajează` or `Cere ofertă`.
- `Partajează` must not require a separate download first.
- If Web Share with files is unavailable, offer a direct download and explain the fallback.
- Catch user cancellation without showing an error.
- Never share an old configuration.

## 3.11 The quote UI implies attachments that are not actually sent

Do not claim that a logo or simulation is “attached” unless the request actually includes it.

Use accurate wording:

- `Logo disponibil în sesiunea curentă`
- `Configurație preluată`
- `Simulare descărcată` only when true

The quote action must at minimum pass:

- selected bag;
- logo color mode;
- finish;
- background-removal method;
- position summary;
- dimensions/scale summary;
- rotation;
- user message.

Show a preview thumbnail in the dialog if available, but do not imply that a mailto link can attach a file.

If binary upload is not implemented, state this clearly and provide a `Descarcă simularea` action before opening the email fallback.

## 3.12 Decorative elements look like controls

The following currently look interactive but do not change anything:

- hero option chips;
- hero palette dots;
- collection color swatches;
- some badge-like pills.

For each one, do one of the following:

1. Make it a real semantic control with visible state and a real data effect.
2. Restyle it as clearly non-interactive information.
3. Remove it.

Preferred simplification:

- Remove hero chips and the hero palette.
- Keep bag color controls only inside the collection or personalizer.
- Make collection swatches real buttons only when they actually recolor the corresponding bag.
- Use `bagColorOptions` and `bagColorMaskSrc` only if both preview and export implement the same result.
- Otherwise remove the swatches and unused bag-color code.

## 3.13 The logo can disappear outside the printable area

The Konva logo is clipped visually, but drag movement is not bounded.

Implement:

- `dragBoundFunc` that keeps the logo’s usable center within the print region.
- `boundBoxFunc` that prevents resizing below a useful minimum or beyond the printable area.
- A visible print-area boundary only while editing.
- A gentle snap to center when close to the horizontal or vertical center line.
- A `Logo-ul este în afara zonei de tipar` warning only if partial overflow is intentionally allowed.
- The export and on-screen preview must use the same transform rules.

Keep transformer handles large enough on mobile. Konva anchor size is affected by stage scaling, so compute it from the scale to preserve an approximately 32–40px visible control.

## 3.14 Public development language must not appear as customer content

Remove from public production UI:

- `neconfirmat`;
- `Date verificate — Placeholder-ele sunt blocate la producție`;
- legal-development warnings in the footer;
- placeholder artwork text;
- internal enum values such as `black`, `local`, `advanced`, `multiply`, or `screen`.

Behavior:

- Hide unverified statistics entirely.
- Render only verified customer-facing claims.
- Keep development warnings behind `process.env.NODE_ENV === "development"`.
- Map every enum to natural Romanian.
- Production verification must block unresolved placeholders rather than displaying developer notes to customers.

---

# 4. Simplify the visual system

## 4.1 Remove visual noise

Remove these global effects and the related code when no longer used:

- `GrainOverlay`;
- `ScrollProgress`;
- `PageTransition`;
- `SmoothScrollProvider`;
- Lenis smooth scrolling;
- global page wipe;
- pointer spotlight cards;
- magnetic buttons;
- tilt surfaces;
- draggable capability marquee;
- sticky stacked process cards;
- adaptive header color crossfades;
- unnecessary GSAP setup;
- decorative shadows on every surface.

Remove unused files and dependencies after confirming no remaining imports:

- `gsap`;
- `@gsap/react`;
- `lenis`;
- Motion components that are no longer used;
- `motion` if the final implementation uses native scroll snap and CSS only.

Keeping `motion` for one accessible swipe carousel is acceptable, but do not retain it for generic fades.

Use:

- native scrolling;
- CSS `scroll-behavior: smooth` only where appropriate;
- CSS transitions of approximately 160–220ms;
- native scroll snap for horizontal product lists;
- `prefers-reduced-motion`.

## 4.2 Limit signature interactions

The homepage should have no more than these three prominent interactions:

1. Hero bag carousel.
2. In-image before/after comparison.
3. Collection tabs.

The customizer is the fourth interaction, on its own route.

Do not make every section draggable, sticky, animated, spotlighted, or horizontally scrolling.

## 4.3 Consolidate the homepage

Use this structure:

1. Simple sticky header.
2. Hero.
3. Three concise trust/value points.
4. Three-step process.
5. Personalizer teaser with in-image comparison.
6. Collection.
7. One benefits section.
8. Final CTA.
9. Footer.

Remove the separate draggable `CapabilityRail` or merge its useful copy into the three trust/value points.

Do not duplicate process and benefit messages.

Use one dark section and one lime CTA section. Keep the rest on the warm cream background.

## 4.4 Spacing and surfaces

Use fewer cards.

- Cards should group related content, not wrap every paragraph.
- Maximum one border per component.
- Use a consistent card radius around 16–20px.
- Reserve full pill shapes for compact controls and primary CTAs.
- Use subtle shadows only on floating dialogs, menus, and the active product image.
- Use more whitespace instead of more decoration.
- Keep body copy widths around 55–68 characters.
- Use `text-wrap: balance` for headings and `text-wrap: pretty` for paragraphs where supported.
- Remove `overflow-wrap: anywhere` from headings. Romanian words must not break at arbitrary characters.
- Use `overflow-wrap: break-word` only where long URLs or identifiers require it.

---

# 5. Replace the typography

Replace the current all-Manrope heading treatment.

Use this two-font system:

- **Body, navigation, controls, labels:** `Source Sans 3`
- **Display headings:** `Source Serif 4`

Both must be loaded with Latin Extended support.

Preferred implementation:

```tsx
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";

const bodyFont = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});
```

If the installed Next.js font metadata does not accept both subset values, self-host the official WOFF2 files or use an equivalent Fontsource Latin Extended package. Do not silently fall back to a font that lacks the glyphs.

Remove unused font packages after migration:

- Manrope;
- Cormorant Garamond;
- Instrument Serif;

unless one remains intentionally used and documented.

CSS:

```css
body,
button,
input,
textarea,
select {
  font-family: var(--font-body), system-ui, sans-serif;
}

h1,
h2,
.displayText {
  font-family: var(--font-display), Georgia, serif;
  font-weight: 500;
}
```

Recommended mobile-first sizing:

```css
h1 {
  font-size: clamp(2.7rem, 11vw, 5.25rem);
  line-height: 0.98;
  letter-spacing: -0.035em;
}

h2 {
  font-size: clamp(2.15rem, 8vw, 3.7rem);
  line-height: 1;
  letter-spacing: -0.025em;
}

body {
  font-size: 1rem;
  line-height: 1.58;
}
```

Create a development typography proof containing exactly:

```text
Ă Â Î Ș Ț
ă â î ș ț
Pungi de hârtie personalizate
Brandul tău, ambalat frumos.
Soluționarea Alternativă a Litigiilor
```

Verify:

- Ș and Ț use comma-below glyphs, not cedillas;
- no fallback font appears for Romanian characters;
- bold and regular styles align;
- input text remains at least 16px on mobile;
- no heading clips or wraps mid-word at 360px.

Add a small visual test or screenshot for the proof and remove the proof route from production navigation.

---

# 6. Header and navigation

Simplify the header.

Use:

- logo derived from source logo 2 on the cream header;
- logo 4 only on dark surfaces such as the footer;
- one consistent cream sticky header;
- a subtle bottom border after scrolling;
- no morphing pill container;
- no automatic light/dark/lime crossfade;
- no route transition wipe.

Desktop navigation:

- Servicii
- Personalizare
- Proces
- Colecție
- De ce Cartpaper
- Contact
- `Cere ofertă`

Mobile:

- logo;
- menu button;
- simple full-height or bottom-sheet menu;
- focus trap;
- Escape closes;
- body scroll locks;
- focus returns to trigger;
- links close the menu;
- quote CTA works.

Every anchor must land on a real section. Do not keep an anchor for a deleted section.

---

# 7. Hero

Simplify the hero to:

- overline;
- one clear display heading;
- one short paragraph;
- one primary CTA;
- one secondary CTA;
- one product carousel.

Remove:

- decorative option chips;
- palette dots;
- unverified statistics;
- stacked rotating card deck;
- excessive overlapping controls;
- long swipe instruction that remains on screen.

The carousel should show one bag prominently at a time.

Mobile behavior:

- native horizontal swipe or a lightweight gesture;
- arrows remain available;
- four small accessible dots;
- current bag name;
- no card rotation;
- no cards peeking at extreme angles;
- no parallax;
- 4:5 stable image ratio;
- no layout shift.

Desktop behavior:

- same logic;
- larger image;
- optional subtle 1–2% scale on active slide;
- no cursor tilt.

When a bag changes, announce its name through a polite live region.

---

# 8. Trust and process

Replace the draggable capability rail with three static, useful points, for example:

- Simulare înainte de ofertă
- Configurație clară
- Producție confirmată prin bun de tipar

Do not expose implementation details such as placeholder verification.

Process cards:

- three static cards;
- no sticky stacking;
- no scroll pinning;
- no entrance sequence required;
- concise copy;
- one icon per card;
- visible numbers 01, 02, 03.

---

# 9. Personalizer teaser and comparison

Keep one dark teaser section because it creates useful contrast.

Layout:

- concise heading and paragraph;
- CTA to `/personalizeaza`;
- real in-image comparison.

The comparison must demonstrate one thing only: a logo with a background versus the same logo without a background.

Use the actual logo artwork and a real bag mockup. Do not compare unrelated layouts or move the logo between sides.

The divider, handle, reveal mask, and range value must remain synchronized.

No separate slider below the image.

---

# 10. Collection

Use accessible tabs. Prefer Radix Tabs, which is already installed, or implement the complete keyboard model.

Requirements:

- Left/Right arrows change tabs.
- Home/End work.
- Active tab is obvious.
- Tab content changes immediately.
- Image, copy, details, and CTA match the active model.
- No auto-rotating carousel.

Color swatches:

- Keep them only if they actually recolor the bag.
- Use `<button>` with an accessible color name.
- Show selected state.
- Update the visual preview.
- Pass the color into `/personalizeaza`.
- Update the customizer state.
- Include the selected bag color in export.
- Otherwise remove the swatches.

The `Testează varianta` CTA must preserve:

- model;
- selected bag color when applicable.

Example:

```text
/personalizeaza?model=color-pop&culoare=coral
```

---

# 11. Reduce the personalizer from five steps to three

Replace the current five-step flow with:

## Step 1 — Logo

Contains:

- upload;
- file validation;
- original preview;
- transparency detection;
- local background removal when needed;
- advanced removal only when available;
- restore original;
- in-image before/after comparison;
- concise privacy explanation.

Do not show background controls when the uploaded logo is already transparent unless the visitor explicitly asks to edit it.

Romanian labels:

- `Elimină fundalul`
- `Toleranță`
- `Netezire margini`
- `Revino la original`
- `Procesare avansată`
- `Fundal deja transparent`

Do not use `Feather`, `Undo`, or provider jargon in the primary UI.

## Step 2 — Personalizează

Contains:

- bag selector;
- editable preview;
- logo color;
- bag color only when supported;
- size;
- rotation;
- center;
- fit;
- reset;
- fullscreen preview.

Keep the default controls compact.

Primary controls:

- `Model pungă`
- `Culoare logo`: Original, Negru, Alb, Verde Cartpaper
- `Dimensiune`
- `Rotire`
- `Centrează`
- `Potrivește în zona de tipar`
- `Resetează`

Remove from the main flow:

- blend-mode terminology;
- opacity, unless a real business case requires it;
- seven fake finish effects;
- comparison of all bags if it creates a heavy four-canvas modal.

If finishes are retained, show at most:

- Mat
- Alb
- Folie aurie

Only keep a finish if on-screen preview and exported PNG match.

Automatic blend behavior should remain internal, selected by the preset.

## Step 3 — Finalizează

Contains:

- final preview;
- natural Romanian summary;
- download;
- share;
- quote;
- edit links.

Do not show raw enum values.

Example summary:

```text
Pungă: Kraft Clasic
Logo: negru
Finisaj: mat
Fundal logo: eliminat local
Dimensiune: aproximativ 62% din zona de tipar
Rotire: 0°
```

Final primary action:

```text
Cere ofertă
```

Secondary actions:

```text
Descarcă simularea
Partajează
```

Only show `Salvează pe dispozitiv` when restore is fully implemented.

---

# 12. Personalizer state and transform rules

## 12.1 Use functional state updates

Do not build updates from stale captured state.

Use:

```tsx
setStored((current) => ({
  ...current,
  transform: {
    ...current.transform,
    ...nextTransform,
  },
}));
```

## 12.2 Store per-bag transforms

Switching bags must not destroy the visitor’s placement without warning.

Store:

```ts
transformsByMockup: Record<MockupId, LogoTransform>
```

On first selection, use the preset default. When returning to a previously edited bag, restore its last transform.

## 12.3 Calculate percentage correctly

Do not use `width / 6`.

Calculate logo width relative to the active printable region’s bounding width.

## 12.4 Keep preview and export identical

Create shared render logic for:

- bag color;
- logo color;
- logo transform;
- clipping;
- blend behavior;
- finish;
- overlay order.

The browser preview and exported PNG must not differ materially.

## 12.5 Revoke resources

Revoke:

- object URLs;
- stale export URLs;
- worker instances;
- image bitmaps;
- IndexedDB handles.

Do so when assets change and on unmount.

---

# 13. Background removal behavior

Keep local removal as the default.

Improve the interface:

- Display the detected background color.
- Show the current tolerance value.
- Show the current edge-smoothing value.
- Use a `Resetări recomandate` action.
- Reprocess only after a short debounce or an explicit button, not on every pointer tick for a large file.
- Preserve the original Blob.
- Do not silently reduce the final logo quality.
- If a processing preview is downscaled, state that export uses the best available processed source.
- Warn when the background appears complex.
- Do not tell the user to select a color unless a real eyedropper or color input exists.

If a manual background color picker is implemented:

- clicking the preview samples a pixel;
- show the selected color;
- support keyboard fallback with a color input;
- pass `backgroundColor` into `removeConnectedBackground`.

---

# 14. Quote flow

Make the quote form practical.

Use appropriate controls:

- Nume — text
- Companie — text
- E-mail — email
- Telefon — tel
- Tip pungă — select
- Cantitate estimată — number
- Dimensiuni — text
- Mâner — select
- Finisaj — select
- Termen — date or clear text
- Mesaj — textarea
- Confidențialitate — required checkbox with a real link

Prefill values from the personalizer.

Add a request type:

```ts
"oferta" | "mostre"
```

The final sample-kit CTA should open the same dialog with `requestType: "mostre"`.

Network behavior:

- wrap fetch and JSON parsing in `try/catch/finally`;
- always leave loading state;
- display server validation errors;
- preserve entered values after a recoverable failure;
- show the email fallback when no webhook is configured;
- do not show a success state unless the server returned success.

Dialog behavior:

- focus trap;
- Escape closes;
- outside click closes only if no destructive loss occurs;
- preserve the current draft while the page remains open;
- restore focus to the trigger.

---

# 15. Cookie consent

Keep the cookie system, but simplify its presentation.

- No unnecessary close icon on first visit if closing has ambiguous meaning.
- Keep three explicit actions:
  - Refuză opționale
  - Personalizează
  - Acceptă toate
- Keep Necessary always enabled.
- Use a `ResizeObserver` to update `--cookie-banner-height` on resize, content wrap, and orientation change.
- Ensure the personalizer sticky actions never overlap the banner.
- Footer `Setări cookie` must reopen preferences.
- Do not load optional scripts before consent.

---

# 16. Footer and production data

Use logo 4 on the dark footer.

Remove the public sentence saying that legal content still needs review.

Render real contact actions only when values exist.

- Email must use `mailto:`.
- Phone must use `tel:`.
- Social icons must have configured URLs or be hidden.
- No empty links.

ANPC:

- Keep the current SAL destination.
- Replace the development placeholder with the official artwork before production.
- Never regenerate it from `postinstall`.
- Production verification must fail while metadata says `placeholder: true`.

Mockups:

- The current metadata marks all four as placeholders.
- Do not call the result production-ready until licensed mockup exports replace them.
- Development placeholders may remain for local work, but display a development-only badge, never public customer copy.

---

# 17. Mobile-first rules

Build and inspect the 360px layout first.

Test:

- 360 × 800
- 390 × 844
- 430 × 932
- 768 × 1024
- 1440 × 1000

Requirements:

- no horizontal page overflow;
- minimum 44px touch targets;
- input text at least 16px;
- no five-column tiny step navigation;
- no control labels truncated;
- no sticky bar over the cookie banner;
- no modal taller than the viewport without internal scrolling;
- no canvas handles too small to touch;
- no page scroll lock when the user is merely viewing a preview;
- no horizontal carousel unless it has a clear purpose;
- one main action per screen;
- secondary actions visually quieter than the primary;
- image comparison handle remains inside the image;
- full-width controls where one-handed use benefits;
- safe-area insets respected.

The mobile personalizer should show:

1. compact page title;
2. three-step indicator;
3. current step content;
4. preview in the step where editing occurs;
5. sticky Back/Continue or final actions.

Do not duplicate the same preview twice on mobile.

---

# 18. Accessibility

Target WCAG 2.2 AA.

Required:

- correct heading order;
- one H1 per page;
- semantic buttons and links;
- real tab keyboard behavior;
- focus traps in dialogs and mobile menu;
- visible focus;
- no state communicated only by color;
- live regions for processing, export, save, and submit status;
- range inputs have labels and current values;
- comparison slider supports keyboard;
- canvas has a textual state summary;
- reduced motion honored;
- no hover-only information;
- appropriate Romanian alt text;
- no inaccessible transparent overlay that steals input unexpectedly.

---

# 19. Tests that must be added

## Unit tests

Add tests for:

- center transform preserves width and rotation;
- fit transform updates x, y, and width atomically;
- reset uses preset defaults;
- transform clamp keeps logo within print bounds;
- URL model validation;
- Romanian label maps;
- export invalidation;
- saved-project restore;
- background restore preserves original transparency;
- placeholder generator refuses to overwrite production metadata.

## Component tests

Add tests for:

- before/after divider changes from pointer movement;
- before/after range works with keyboard;
- original and processed images differ after removal;
- advanced button is hidden or disabled when provider is unavailable;
- collection swatches either change the image or are absent;
- final CTA phone action is `tel:`;
- sample CTA prefills sample request;
- final-step primary action opens quote;
- share generates a current export;
- save action has a restore path;
- quote network failure exits loading state.

## End-to-end tests

Add Playwright tests for:

1. Every header link reaches a real destination.
2. Every homepage CTA has a visible result.
3. Every collection model opens the matching personalizer preset.
4. The in-image slider can be dragged inside the image.
5. A logo can be uploaded.
6. A flat background can be removed.
7. A bag can be selected.
8. The logo can be dragged but not lost outside the print region.
9. `Centrează`, `Potrivește`, and `Resetează` visibly change the transform.
10. Export downloads a PNG.
11. Share uses the current state or provides the documented fallback.
12. Quote opens with configuration prefilled.
13. “Sună-ne direct” is a real phone link or is absent.
14. The last-step button performs an action.
15. Cookie choices persist.
16. No horizontal overflow at 360px.
17. No placeholder asset passes production verification.

Create a small test helper or checklist ensuring every visible button label on the homepage and personalizer is represented in an interaction test.

---

# 20. Performance

After removing effects:

- remove unused dependencies;
- keep Server Components for static marketing sections;
- dynamically import Konva only on `/personalizeaza`;
- do not load GSAP or Lenis;
- use `next/image` dimensions;
- lazy-load below-the-fold images;
- avoid rendering four live Konva stages simultaneously;
- use thumbnails for bag selection;
- create a full canvas only for the active bag;
- debounce expensive removal processing;
- avoid state writes on every animation frame unless required;
- keep CSS and client bundles smaller than the current implementation.

Measure rather than claim.

Report:

- production build result;
- major client bundle changes if available;
- Lighthouse results only if actually run.

---

# 21. Suggested implementation order

Follow this order:

1. Inspect git status and run the current checks.
2. Create `FUNCTIONALITY_AUDIT.md`.
3. Make `postinstall` and placeholder generation safe.
4. Replace typography and verify Romanian glyphs.
5. Remove global visual effects and unused dependencies.
6. Simplify header and homepage structure.
7. Rebuild the in-image comparison slider.
8. Repair collection tabs, swatches, and URL preset behavior.
9. Refactor the personalizer from five steps to three.
10. Repair transforms and drag bounds.
11. Repair background-removal before/after state and capability detection.
12. Repair export, share, save/restore, and quote behavior.
13. Simplify footer and cookie UI.
14. Add tests.
15. Run all checks and inspect screenshots.
16. Update the audit and README.

---

# 22. Commands to run

Use the existing package manager and lockfile.

At minimum run:

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run verify:mockups
npm run verify:assets
npm run build
npm run test:e2e
```

Generate screenshots at:

```text
360 × 800
390 × 844
768 × 1024
1440 × 1000
```

Inspect them manually for:

- visual load;
- whitespace;
- font fallback;
- Romanian diacritics;
- button hierarchy;
- slider placement;
- canvas usability;
- sticky-action overlap;
- footer placeholder content.

Do not report a command as passing unless it actually passed.

---

# 23. Definition of done

The task is complete only when:

- the website is visually calmer;
- Source Sans 3 and Source Serif 4 render Romanian correctly;
- headings no longer break Romanian words arbitrarily;
- global grain, progress bar, page wipe, smooth-scroll gimmick, spotlight, and redundant motion are removed;
- the homepage has a clear hierarchy;
- unverified public stats are hidden;
- no developer placeholder language appears in customer-facing production UI;
- the comparison handle moves inside the picture;
- the collection model query works;
- final phone action is real;
- the final personalizer action works;
- fit, center, and reset work;
- original and processed logo previews are distinct;
- advanced removal is offered only when configured;
- the logo cannot be lost outside the print region;
- export and share always use current state;
- save has restore or is removed;
- quote wording accurately reflects what is sent;
- every retained visible control has an observable result;
- mobile at 360px is usable;
- keyboard navigation works;
- lint, typecheck, tests, asset verification, and production build have been run;
- production assets are not overwritten by installation.

---

# 24. Final report

At the end, provide:

1. Files changed.
2. Visual effects removed.
3. Typography implementation and the Romanian glyph test.
4. Every dead or misleading control repaired or removed.
5. Personalizer workflow changes.
6. Slider implementation.
7. Asset-overwrite protection.
8. Test results with exact commands.
9. Remaining production blockers, especially:
   - placeholder bag mockups;
   - ANPC placeholder;
   - missing company details;
   - missing phone;
   - quote webhook;
   - unverified claims.

Keep the final report factual. Do not describe a feature as complete if it was only styled or partially wired.
