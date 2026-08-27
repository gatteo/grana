# 03 · Product app (dashboard)

The neutral surface. Reference implementation: `d-grana/dashboard.html`.
Layout model: Intercom admin / shadcn dashboard. This page is the base for every
product view.

## Hard rules (from the brief)

- **No brand hue anywhere in the chrome.** The shell is warm neutral; the only colour
  on screen is status and data. The customer's logo sits in the shell, not ours.
- Customer personalisation is **logo only** (square tile, initials fallback).
- Every AI/system action is labelled: a person must always tell at a glance what the
  machine did.
- Density is real: the design must survive twenty columns and five thousand rows.
- A discreet `powered by Revenue Farm` line sits at the sidebar bottom.

## Shell architecture ("the big card")

```
body (app canvas: stone-100)
└── .app  grid: 244px sidebar | 1fr   · height 100vh · overflow clip
    ├── .app__side   transparent, scrolls internally
    └── .app__main   padding: 8px 8px 8px 0
        └── .shell   THE BIG CARD
            ├── .topbar        flex-none, white, bottom hairline
            └── .shell__scroll flex-1, overflow-y auto
                └── .page      1.5rem padding, 1.25rem gaps
```

- The workspace is **one large white card**: `stone-0`, 1 px `stone-200` border,
  **14 px radius** (`--app-shell-radius`), `overflow: clip`.
- An 8 px gap (`--app-gap`) separates it from the viewport on top/right/bottom; the
  sidebar side has no gap.
- **Scrolling happens inside the card** (`.shell__scroll`), never on the body. Sidebar
  and topbar stay fixed.
- **No shadows anywhere in the app.** If a `.panel`-style class inherits a marketing
  shadow from shared tokens, reset it explicitly (`box-shadow: none`): this was a real
  bug in the PoC.

## Sidebar (generated per customer)

- Transparent on the canvas: no background, no right border.
- Tenant header: 28 px square logo tile (dark, initials) + name + "città · N persone".
- Nav item: 7 px radius row, muted text, 15 px stroke icon at 75% opacity, optional
  mono count right-aligned.
  - Hover: `stone-200` fill.
  - Active: **white pill** with an inset hairline ring
    (`background: stone-0; box-shadow: inset 0 0 0 1px stone-200`), 500 weight. No
    shadow, no accent colour.
- Groups: mono uppercase labels (`0.625rem`, +0.11em) for Acquisizione / Vendita /
  Crescita / **Da attivare**.
- "Da attivare" items are faint with a bordered mono tag (`Attiva`, `In arrivo`): the
  in-product upsell is part of the navigation, always visible, never a popup.
- Footer: Impostazioni + `powered by Revenue Farm` (mono, faint).

## Topbar (inside the card)

White, 3.5rem, bottom hairline. Search field on `stone-50` with hairline border and
mono `⌘K` kbd. Right: ghost button, ink primary pill-radius-8 button, avatar circle.

## Components (shadcn-flavoured)

| Component | Recipe |
|---|---|
| Card / panel | white, 1 px `stone-200`, 10 px radius, **no shadow**. Header row: 500-weight title left, mono context right, bottom hairline. |
| KPI row | 4 cells in a hairline-gap grid (1 px gaps on `stone-200`). Cell: muted label, mono value 1.625rem, delta (▲ green `#0a7d0a` / red `status-critical`), faint mono baseline ("giugno 2026: 112"). Deltas always carry direction + context, not colour alone. |
| Segmented control | bordered group, 8 px radius, hairline separators, active = `stone-100` fill + 500 weight. |
| Table | mono uppercase header on `stone-50` with bottom hairline; rows with hairline dividers, hover `stone-50`; names 500, secondary cells muted; numbers mono right-aligned with `white-space: nowrap`. Min-width + horizontal scroll below it. |
| Status chip | 6 px radius, tinted fill at ~12% + dark-tinted text + 11 px icon. Neutral chip = `stone-100`. Colour + icon + word, always. |
| Activity feed | rows of actor + text + mono timestamp. **Humans**: round avatar, initials. **Machines**: square dashed-border tile (`AI`, `SYS`) + a dashed mono `Azione AI` / `Automatico` chip after the sentence. The round/square + solid/dashed distinction is the human/machine contract. |
| Upsell panel | plain panel: mono eyebrow "Modulo da attivare", title, evidence-based copy ("nelle ultime 30 trattative perse, 11..."), ink primary + ghost secondary. Sales inside the product is quiet and factual. |
| Chart | HTML/CSS bars (crisp hairlines, selectable labels), hairline gridlines with mono axis values, legend with 9 px squares. **Built 2026-08-27 as `chart.tsx`** (`Chart` · `ChartColumns` · `ChartLegend` · `Sparkline`): no charting library, because ten bars do not earn 200KB and a library paints its own colours (DSN-7). Ink by default; the chart slots only when a legend has to tell series apart, and the second series of a two-series stack is `muted` stone — a fortnight of red bars reads as an alarm going off. Bars cap their width so a week across a wide card is a picture of the week, not of the card. Every chart carries an `aria-label` AND renders its numbers as a visually-hidden table. |

## Typography in the app

Same stack as marketing but calmer: page title 1.5rem/500, panel titles 0.9375rem/500,
body `fs-sm`/`fs-xs`. Cabinet Grotesk display weights are NOT used in the app. All
numbers Spline Sans Mono.

## Responsive

- ≤1240: right column stacks under the main column.
- ≤1080: sidebar hidden (mobile nav is a later exercise), card gets the left gap too.
- ≤1000: KPI 2-up. ≤620: KPI 1-up, tighter paddings, search hidden.
- Mobile is the primary case for the pipeline views (field crews on phones): design
  down, not just squeeze.
