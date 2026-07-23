# Cartpaper Functionality Audit

Created before component edits for `cartpaper-ux-simplification-functional-repair-prompt.md`.

Baseline command:

```bash
rg -n '<button|<a |type="range"|type="file"|role="tab"|onClick|href=' src
```

## Baseline Findings

| Area | Visible control | Current behavior | Required repair |
| --- | --- | --- | --- |
| Header | Desktop nav anchors | Point to sections and `/personalizeaza`; depends on sections remaining. | Keep only anchors with real destinations. Simplify sticky header and logo variant. |
| Header | Mobile menu open/close, links, quote CTA | Opens and locks body; Escape closes; focus trap is incomplete. | Keep, add complete focus behavior and return focus. Links and CTA must close menu. |
| Hero | Primary CTA | Opens `/personalizeaza`. | Keep. Use bag icon instead of arrow styling. |
| Hero | Secondary CTA | Opens quote dialog. | Keep if dialog is practical and no fake success. |
| Hero | Chips | Static text only. | Remove or convert to real controls. Preferred: remove. |
| Hero | Stats strip | Shows unverified numbers with public `neconfirmat`. | Hide unverified stats. |
| Hero | Bag arrows | Change the active animated deck. | Keep as simple carousel controls with live region. |
| Hero | Palette dots | Static color dots with no action. | Remove unless they recolor preview/export. Preferred: remove. |
| Capability rail | Drag marquee | Decorative draggable rail, includes implementation placeholder language. | Replace with three static trust/value points. |
| Process | Three cards | Informational, but sticky stacking CSS exists. | Keep as full-width static cards, no stacking/pinning. |
| Personalizer teaser | CTA | Opens `/personalizeaza`. | Keep. |
| Personalizer teaser | Before/after range | Separate slider below image; comparison is not direct in-image. | Replace with in-image drag/tap/keyboard comparison. |
| Collection | Tabs | Click changes content; arrow/Home/End keyboard support missing. | Keep as accessible tabs with full keyboard model. |
| Collection | Swatches | Static spans, no recolor or URL state. | Remove unless recolor is implemented end to end. |
| Collection | `Testează varianta` | Links with `?model=`, but personalizer ignores query. | Validate URL model and preselect matching bag. |
| Final CTA | `Cere un kit de mostre` | Opens generic quote dialog. | Open quote dialog with request type `mostre`. |
| Final CTA | `Sună-ne direct` | Opens quote dialog even when no phone is configured. | Render real `tel:` link when configured, otherwise hide or replace with real email action. |
| Cookie banner | Close icon | Silently stores optional rejection with ambiguous meaning. | Remove first-visit close icon; keep explicit Refuză/Personalizează/Acceptă actions. |
| Cookie preferences | Dialog controls | Toggles and saves; focus trap exists. | Keep, update height via ResizeObserver and restore focus reliably. |
| Quote dialog | Form fields and submit | Validates, posts, but fetch/JSON lacks try/catch; no request type. | Add practical controls, request type, robust loading/failure, honest attachment copy. |
| Personalizer step nav | Five step buttons | Direct jump across five-step flow. | Replace with three-step indicator; avoid tiny five-column mobile nav. |
| Personalizer upload | File input/upload/replace/remove | Works locally, moves to background or bag step. | Keep; preserve original and processed logo separately. |
| Personalizer background | Local/advanced/undo/ranges | Advanced always visible; labels include `Feather`/`Undo`; before/after images are identical. | Show controls only when useful, detect provider availability, Romanian labels, real before/after. |
| Personalizer bag selection | Mockup buttons | Selects a bag and resets transform. | Store per-bag transforms; use URL preset on entry. |
| Personalizer placement | Fullscreen/compare buttons | Opens modal/fullscreen; compare renders four live stages. | Keep fullscreen if useful; remove heavy compare modal from main flow. |
| Personalizer placement | Logo color buttons | Change preview/export color. | Keep supported modes: Original, Negru, Alb, Verde Cartpaper. |
| Personalizer placement | Finish buttons | Seven effects, some business-unclear. | Reduce to Mat, Alb, Folie aurie if preview/export match. |
| Personalizer placement | Size/rotation/opacity ranges | Size/rotation work; opacity is unnecessary. | Keep size/rotation with current values; remove opacity. |
| Personalizer placement | Centrează/Potrivește/Resetează | Use stale state; fit calls center separately; center resets rotation. | Use functional atomic transform helpers and tests. |
| Personalizer canvas | Drag/transform handles | Logo can be lost outside print area; handles small. | Add print bounds, larger handles, visible edit boundary. |
| Personalizer final | Download/share/save/quote | Download works; share depends on stale export; save has no restore; quote text uses raw enums. | Generate current export for share, implement restore or remove save, natural Romanian summary, quote prefill. |
| Sticky personalizer action | `Gata` | Last-step button has no useful final action. | Last step must expose `Cere ofertă` and `Descarcă simularea`. |
| Footer | Contact/legal/cookie links | Email works; phone hidden if absent; public legal-review sentence is visible. | Remove public dev sentence; keep real links only; cookie settings reopens preferences. |
| Assets/scripts | `postinstall` placeholders | Installs regenerate development placeholders and ANPC image. | Remove placeholder generation from postinstall and refuse overwrites unless explicitly forced. |

## Post-Repair Verification

To be completed after implementation with exact command results and any remaining production blockers.
