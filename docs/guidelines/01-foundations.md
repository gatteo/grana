# 01 · Foundations

The base layer shared by every surface. All values live in the PoC's
`d-grana/tokens.css` and must be ported verbatim.

## Principles

1. **The field carries the colour.** The page itself is warm paper (ecru) with ink
   text. Saturated colour enters only through imagery, unit tints, status and data.
2. **The number is the brand.** Every number is monospaced, tabular, Italian-formatted.
   Numbers are content, never decoration.
3. **Frame, don't bleed.** Images never touch the edge of anything: the page frames
   full-bleed canvases with paper, cards frame their images with an inset.
4. **Soft is interactive, sharp is content.** Pills and circles are things you press.
   Surfaces (cards, panels, images) use small radii (4-14 px).
5. **Dark is punctuation.** One dark hero, one dark manifesto band, one dark CTA
   moment. The page never becomes a dark theme. The product is always light.
6. **Flat product, deep marketing.** Marketing panels floating on imagery may carry a
   deep shadow. Product UI carries none: hairline borders only.

## Colour

Use these exact values. OKLCH refinement is welcome in implementation but keep the
rendered result visually identical.

### Warm neutral spine ("stone")

| Token | Hex | Typical use |
|---|---|---|
| `stone-0` | `#ffffff` | panels, cards |
| `stone-50` | `#fbfaf9` | product sidebar fills, muted input fills |
| `stone-100` | `#f5f3f2` | app canvas (dashboard background), hovers |
| `stone-200` | `#e9e7e4` | product hairlines, active fills |
| `stone-300` | `#d7d5d2` | strong hairlines |
| `stone-400` | `#b4b1ae` | disabled, faint icons |
| `stone-500` | `#8c8985` | faint text |
| `stone-600` | `#66635f` | muted text |
| `stone-700` | `#484541` | secondary ink |
| `stone-800` | `#2e2b28` | hover on ink |
| `stone-900` | `#1a1816` | **ink: text and primary action** |
| `stone-950` | `#0e0d0a` | deepest ink |

### Marketing paper

| Token | Hex | Use |
|---|---|---|
| `ecru` | `#f6f3ee` | marketing page background |
| `ecru-deep` | `#eeeae2` | sunken bands (units strip) |
| `bg-inverse` | `#0c0b09` | dark punctuation blocks |
| `text-inverse` | `#f6f3ee` | text on dark |
| `text-inverse-muted` | `#b3ada4` | muted text on dark |
| `line` | `#e3ded5` | marketing hairlines |
| `line-strong` | `#d0cabf` | marketing strong hairlines |

### Action and accent

| Token | Value | Rule |
|---|---|---|
| `accent` | `stone-900` (ink) | Primary buttons, links. **The action colour is ink, not blue.** |
| `accent-hover` | `#000000` | |
| `accent-on-dark` | `ecru` | Primary button on dark surfaces |
| `accent-warm` | `#a97a2e` | Dune ochre. Micro-accent ONLY: section index numbers, hero stakes, text selection. Never buttons, never text links, never fills. |
| `accent-warm-dark` | `#cfa14b` | Same roles on dark surfaces |

Text selection: `::selection { background: #eadfc6; color: stone-900 }`.

### Unit tints (locked by the brief, matched lightness)

| Unit | Light | Dark | Texture family |
|---|---|---|---|
| Master / Demand | `#0058a8` cobalt | `#4495ea` | dunes in cobalt (native texture pending, CSS duotone meanwhile) |
| Piattaforma | `#00744d` emerald | `#26a073` | teal folded paper |
| Academy | `#8a5100` amber | `#ba7924` | amber blown glass |
| Installatori | `#964432` clay | `#c96a55` | plum rope |

Cobalt is **only** the Demand unit tint. It is not the site's action colour. If cobalt
should return as a global accent, that is a brief-level decision, not a styling choice.

### Status (identical on every surface, always icon + word, never colour alone)

`good #0ca30c` · `warning #fab219` · `serious #ec835a` · `critical #d03b3b` ·
`info #2a78d6`

### Charts (slot ORDER is the colour-blindness mechanism, do not reshuffle)

Light: `#1b8a5f` `#e8873b` `#2a78d6` `#e05c7a` `#c9a227` `#0e9ca8` `#7c5cd6` `#d03b3b`
Dark: `#199e70` `#cf7c2a` `#3987e5` `#d55181` `#c98500` `#0e9ca8` `#9085e9` `#e66767`

Brand blue is never a data colour and never a status colour.

## Typography

All faces are free and embeddable (no licence risk for third-party embeds). CDN in the
PoC, self-host in production.

| Role | Face | Weights | Rules |
|---|---|---|---|
| Display + headings | **Cabinet Grotesk** (Fontshare) | 500 / 700 / 800 | Display at 800, headings at 700. Tracking `-0.028em` display, `-0.02em` headings. |
| UI + body | **General Sans** (Fontshare) | 400 / 500 / 600 | Body 400, emphasis/buttons 500, strong 600. |
| Labels + ALL numbers | **Spline Sans Mono** (Google) | 400 / 500 | Eyebrows, table headers, chips, timestamps, every metric. Uppercase labels track `+0.14em`. |
| Editorial voice | **Source Serif 4** (Google) | 400 / 500 | Leads, pull-quotes, manifesto body. **Upright only, italics are banned everywhere.** Never for data, never for UI. |

Scale (fluid):

```
display  clamp(3.25rem, 7vw, 6.25rem)    lh 0.98
h2       clamp(2.25rem, 4vw, 3.5rem)     lh 1.04
h3       clamp(1.25rem, 1.6vw, 1.5rem)   lh 1.22
lead     clamp(1.125rem, 1.4vw, 1.375rem)
body     1rem                            lh 1.6
sm/xs    0.875rem / 0.8125rem
eyebrow  0.75rem (mono, uppercase)
metric   clamp(2rem, 3vw, 2.875rem)      mono, lh 1, tracking -0.04em
```

### Number formatting (non-negotiable)

- Italian formats everywhere: `1.234,56` · `€ 1.234` · `27/07/2026`.
- Always `font-variant-numeric: tabular-nums`.
- **CLDR gotcha**: `toLocaleString('it-IT')` does NOT group 4-digit numbers
  (renders `1847`). Always pass `{ useGrouping: 'always' }` so the brand's `1.847`
  holds. See the count-up implementation in the PoC.

## Space, shape, layout

| Token | Value | Notes |
|---|---|---|
| `measure` | 1280 px | content max-width |
| `measure-text` | 62ch | reading measure for body prose |
| `measure-head` | `max(38rem, 70%)` | section heads, page-hero titles, ledger lists |
| `measure-lead` | `max(32rem, 62%)` | the paragraph under a title |
| `gutter` | `clamp(1.25rem, 4vw, 3rem)` | |
| `space-section` | `clamp(5.5rem, 9vw, 9rem)` | vertical rhythm between sections |
| `frame` | `clamp(6px, 0.7vw, 10px)` | paper border around full-bleed canvases |
| `radius-img` | 8 px | canvases, cards |
| `radius-panel` | 6 px | product panels, snippets |
| `radius-sm` | 4 px | chips, inset card images, small elements |
| `radius-btn` | pill (999px) | ALL buttons |
| `app-shell-radius` | 14 px | the dashboard's big workspace card |
| hairline | 1 px | the only border weight |

A title and its lead take the field, not a column: `measure-head` and
`measure-lead` are percentages with a readable floor, so a head spans about 70%
of the container on desktop and the full width on a phone. Body prose keeps
`measure-text`; when a long document would leave the rest of the field empty,
the answer is the contents rail (02-marketing-site.md), never a wider paragraph.
Centred heads are the exception and stay on a 56ch measure — symmetry needs a
shorter line.

Shadows: `shadow-panel` (deep, for marketing panels floating on imagery only) and
`shadow-card` (soft, for hover lifts). **The product UI never uses shadows.**

## Buttons

| Variant | Recipe |
|---|---|
| Primary | ink background, ecru text, pill |
| Primary on dark/imagery | ecru background, ink text, pill |
| Secondary ("glass") | translucent fill + `backdrop-filter: blur(10-12px) saturate(140%)` + hairline inset ring, pill. Light: `rgba(255,255,255,.4)`. On imagery: `rgba(246,243,238,.1)`. |
| Text link | ink, 500 weight, 1px bottom border in `stone-400`; hover border turns `accent-warm` |

## Patterns (whitespace is designed, not empty)

- **Dots**: `radial-gradient(rgba(26,24,22,.16) 1px, transparent 1px)`, tile
  `18px 18px`. Used on the proof band and the closing CTA section background.
- **Registration marks**: four 6×6 px squares at the corners of large canvases
  (inset 14-18 px). Ink at 50% on light imagery, ecru at 55-75% on dark.
- **Numbered eyebrows**: section eyebrows carry a two-digit index (`01`-`06`) in
  `accent-warm`, mono, before the label. The page reads as a numbered survey document.

## Grain (the signature)

Inline SVG noise, tiled at 240 px, composited with **plain alpha, never blend modes**
(blend stacking froze the GPU in testing):

```css
--grain: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
```

Opacity per context: hero `0.15-0.17`, cards `0.14-0.15`, dark blocks `0.12`. Grain sits
above the image and wash, below content.

## Accessibility and i18n

- Copy is Italian-first; test every layout at Italian length (15-25% longer than
  English) and keep an English variant in mind.
- Colour never carries meaning alone: status = colour + icon + word.
- Focus: visible `:focus-visible` outline in `currentColor`.
- All motion honours `prefers-reduced-motion` (see 04-motion.md).
- Contrast: ink on ecru and ecru on `#0c0b09` both clear AA. Text over imagery always
  sits on a wash gradient zone, never raw on the photo.
