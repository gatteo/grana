# 05 · Imagery

The image system is the brand's colour engine: abstract textured "fields", one family
per business unit, always under grain, always framed. No photography of panels, roofs
or hard hats, ever. No 3D blobs, no gradients-as-imagery.

## Current asset inventory (PoC)

Web copies live in `design/poc/assets/img/`, generation sources in `design/sources/`
(kept on disk, not committed). A compressed, committed texture library for future
slots lives in `design/library/` — see its README for the family inventory and
usage rules.

| File | Source | Size | Used for |
|---|---|---|---|
| `dune-hero.jpg` | `gatteo_sand_4.png` | 2944×1648 | **Hero field. The quality benchmark.** |
| `dune-light.jpg` | `gatteo_sand_2.png` | 1456×816 | Manifesto band; Demand duotone (card + unit tile) |
| `dune-dark.jpg` | `gatteo_sand_3.png` | 1456×816 | Spare (quieter monochrome field) |
| `teal-paper.jpg` | folded paper | 928×1232 | Piattaforma card + unit tile, one post header |
| `amber-glass.jpg` | blown glass | 1456×816 | Academy tile, final CTA band |
| `plum-rope.jpg` | braided rope | 928×1232 | Installatori tile |
| `olive-wax.jpg` | molten wax | 928×1232 | Post header |
| `soft-shapes.jpg` | inflated shapes | 928×1232 | Post header |
| `rf-mark.png` | `../../../assets/logo_square_white_on_black.png` (business workspace) | 696×700 | RF monogram tile (header, footer, hub) |

The served set also carries copies from `design/library/` (all 1456×816 — fine for
page heroes, tiles and card canvases, not for the home hero or manifesto):
`cobalt-foam.jpg` (the native Demand texture), `teal-paper-2/3.jpg`,
`amber-glass-2/3.jpg`, `dune-2/3.jpg`, `plum-rope-2.jpg`, `clay-coils.jpg`,
`olive-wax-2.jpg`, `soft-shapes-2.jpg`, `warm-stones.jpg`, `rust-fabric.jpg`,
`oil-impasto.jpg`. Editorial rotation for article/tool/case cards:
`apps/web/src/lib/textures.ts`.

## Family → unit mapping

| Family | Hue | Unit / role |
|---|---|---|
| Sand dunes (warm caramel) | ochre | Master brand, hero, manifesto |
| Cobalt foam | cobalt `#0058a8` | Demand (native texture `cobalt-foam.jpg` in use) |
| Folded paper | teal/emerald | Piattaforma |
| Blown glass | amber | Academy |
| Braided rope | plum/clay | Installatori |
| Wax / soft shapes | olive / mixed warm | editorial slots (resources) |

## Generation spec (for regenerating the full set)

`sand_4` proved the pipeline: generate, then upscale to ~2900 px+. Match it.

**Per-slot minimum sizes** (2× retina at 1440 layout):

| Slot | Ratio | Minimum |
|---|---|---|
| Hero field | 16:9 | **3840×2160** (3000 px long side absolute floor) |
| Manifesto band | 16:9 | 3840×2160 |
| Final CTA band | ~21:9 crop | 3200×1400 |
| Way cards | 16:9.5 | 1600×950 |
| Unit tiles | 16:11 | 1200×825 |
| Post headers | 21:9 | 1600×690 |

Simplest workflow: one 3840×2160 landscape master per family; all smaller slots are
crops of the master.

**Art direction constraints (what makes it one system):**

- Same light direction in every image (soft, from top-left).
- Matte, fabric-like surfaces. No glossy highlights (they fight text and panels).
- One hue per image, at matched perceived lightness across the family set.
- Fine grain baked at final resolution (the CSS grain veil is added on top anyway).
- The hero master needs a calmer, lower-contrast zone on the left ~half where the
  headline sits, and stronger relief on the right where the stakes pin.
- Midjourney: `--ar 16:9 --style raw`, then the built-in upscaler (or an external 2×
  pass) before export. Never ship raw 928 px grid crops.

## The grain veil (CSS, applied to every image)

See 01-foundations.md for the `--grain` SVG token. Rules: plain alpha compositing
(no blend modes), 240 px tile, opacity 0.12-0.17 by context. The veil quiets the image
so UI panels and text always win.

## The cobalt duotone (fallback for extra Demand fields)

The native Demand texture is `cobalt-foam.jpg`. When a page needs more cobalt fields
than the family provides, any warm dune texture can be brought to the tint with a
single filter chain on the image layer, no extra layers:

```css
filter: grayscale(1) sepia(1) hue-rotate(178deg) saturate(2.4)
        brightness(0.82) contrast(1.05);
```

This is also the art-direction target when commissioning further cobalt textures.

## Washes (legibility veils)

Text never sits raw on an image; a gradient wash always mediates:

- Hero (light text): `linear-gradient(102deg, rgba(12,11,9,.9), .74 34%, .4 58%, .1 80%, .04 100%)`.
- Default canvas (no text): light-to-dark vertical, `rgba(246,243,238,.10)` →
  `rgba(14,13,10,.22)`.
- Dark CTA canvas: `rgba(12,11,9,.38)` → `.58` vertical.
- Manifesto: image at 55% opacity under
  `rgba(12,11,9,.92) → .55 @45% → .94` vertical.

## Logo usage

- The RF monogram is always a **black rounded tile** (7-8 px radius at 28-30 px size)
  with the white RF. On dark surfaces add a 1 px ecru ring at ~30%.
- Wordmark "Revenue Farm" in Cabinet Grotesk 700, tracking -0.015em, next to the tile.
- In the product the RF mark never appears in the shell (customer logo only); Revenue
  Farm appears solely as the mono `powered by Revenue Farm` line.
