# Grana skin spec — Luminars kit × Revenue Farm kit → one Tailwind v4 / shadcn rebuild

Extracted 2026-08-23 from the two hand-written implementations. Every number below is copied
from source, not paraphrased. Where the kits differ, both are shown as `Luminars | RF`.

Sources read in full:

- Luminars: `apps/desktop/src/kit/*.tsx`, `kit/kit.module.css`, `styles/base.css`,
  `styles/tokens.css`, `styles/fonts.css`, `shell/shell.module.css`, `shell/Shell.tsx`,
  `home/home.module.css` (KPI), `docs/DESIGN.md`.
- RF: `packages/ui/src/app/{shell,panel,chip,feed,icons}.tsx`, `styles/{app,base,tokens,theme}.css`,
  `marketing/{btn,eyebrow,section-head,canvas}.tsx` (the `.btn/.eyebrow/.canvas/.marks/.wrap`
  recipes live in `styles/base.css`; `.section__head` and an RF `.num` live in `marketing.css`),
  `docs/design-system/{01-foundations,03-product-app}.md`, `lib/format.ts`.

Unit conventions: RF writes rem; converted at 16px root (RF `--fs-body: 1rem`, no root override).
Luminars writes px. Heights marked "≈" are computed (font-size × inherited line-height + padding
+ border); Luminars body `line-height: 1.45`, RF body `line-height: 1.6` (`--lh-body`) — RF never
sets a control line-height, so every RF control inherits 1.6 and is taller than its padding
suggests.

---

## 0. Cross-cutting

### 0.1 Tokens — the shared spine and where they diverge

Identical in both: the stone ramp `stone-0 #ffffff · 50 #fbfaf9 · 100 #f5f3f2 · 200 #e9e7e4 ·
300 #d7d5d2 · 400 #b4b1ae · 500 #8c8985 · 600 #66635f · 700 #484541 · 800 #2e2b28 ·
900 #1a1816 · 950 #0e0d0a`; ecru `#f6f3ee` / ecru-deep `#eeeae2`; status `good #0ca30c ·
warning #fab219 · serious #ec835a · critical #d03b3b · info #2a78d6`; gold/warm `#a97a2e`;
pill `999px`; the four faces (Cabinet Grotesk / General Sans / Spline Sans Mono / Source Serif 4).

| Role | Luminars (`tokens.css`) | RF app (`app.css` `[data-surface="app"]` + `tokens.css`) | RF marketing |
|---|---|---|---|
| canvas / page ground | `--canvas: #f6f3ee` (ecru), `--canvas-deep: #eeeae2` | `--app-bg: stone-100 #f5f3f2` | `--bg: ecru`, `--bg-sunken: ecru-deep` |
| surface (card/panel) | `--surface: stone-0`, `--surface-2: stone-100` | `--app-panel: stone-0`; hover/muted fills `stone-50` | `--bg-raised: stone-0` |
| ink / primary action | `--ink: stone-900` | `--app-action: stone-900`; hover `stone-800` | `--accent: stone-900`; `--accent-hover: #000000` |
| text | `--text: stone-900` | `--text: stone-900` | same |
| text secondary | `--text-2: stone-600` | `--text-muted: stone-600` | same |
| text tertiary | **`--text-3: stone-550 #716e6b`** (added for WCAG AA 4.5:1 on white; stone-500 reserved for borders/dots) | **`--text-faint: stone-500 #8c8985`** (≈3.5:1 on white — below AA for body text) | same as app |
| hairline | `--border: stone-200` | `--app-line: stone-200` | `--line: #e3ded5` (warmer than stone-200) |
| strong hairline | `--border-strong: stone-300` | (none; `stone-400` used ad hoc for `.tag--action`, `.dcard:hover`, dashed machine borders) | `--line-strong: #d0cabf` |
| wayfinding accent | `--gold: #a97a2e` (focus ring + sparing accents) | none in app | `--accent-warm: #a97a2e` (section indices, stakes, selection only; "never buttons, never links, never fills") |
| radius scale | `--radius-sm: 6px`, `--radius-md: 10px`, `--radius-lg: 14px`, `--radius-pill: 999px` | `--app-radius: 10px`, `--app-shell-radius: 14px`; literals `8px`, `7px`, `6px`, `4px` | `--radius-img 8px`, `--radius-panel 6px`, `--radius-plot 8px`, `--radius-sm 4px`, `--radius-btn: pill` |
| shadows | `--shadow-card: 0 1px 2px rgba(26,24,22,.05), 0 4px 16px rgba(26,24,22,.05)`; `--shadow-panel: 0 1px 2px rgba(26,24,22,.04), 0 10px 34px rgba(26,24,22,.09)` | **`[data-surface="app"] * { --shadow-panel: none; --shadow-card: none }`** | `--shadow-panel: 0 1px 2px rgba(14,13,10,.06), 0 32px 72px -30px rgba(14,13,10,.42)`; `--shadow-card: 0 1px 2px rgba(14,13,10,.04), 0 16px 44px -28px rgba(14,13,10,.22)` |
| mono for numbers | `--font-mono` (one face for ids, eyebrows, numerals) | `--font-num: "Spline Sans Mono", ui-monospace, monospace` (separate alias, same face) + `--font-mono` | same |
| easing | `ease-out` literal, 120–140 ms | `--ease: cubic-bezier(0.2,0.7,0.2,1)` 0.14 s; `--ease-out: cubic-bezier(0.16,1,0.3,1)` | 0.18 s `--ease` |
| extra | executor hues `--exec-agent #0e7a8a/-soft #e0f2f5`, `--exec-human #a05a9e/#f6e9f5`, `--exec-api #4a6bd0/#e8edfb`, `--exec-screen #6c7a3a/#eef1e0`; `--sidebar-width: 236px` | `--app-gap: 0.5rem` | cobalt ramp, unit tints, chart-1…8, grain, dots, rows |

RF already maps shadcn semantic slots in `theme.css` (`--primary: stone-900`, `--border:
stone-200`, `--ring: stone-900`, `--radius: 0.5rem`, `--muted: stone-100`, `--secondary:
stone-100`, `--destructive: status-critical`, `--accent-color: stone-100`). Reuse that file as the
`@theme inline` seed; add `--color-stone-550`, `--color-canvas`, `--color-canvas-deep`,
`--color-gold`, the Luminars `--radius-sm/md/lg` and the two Luminars shadows.

### 0.2 Reset both depend on

Luminars `base.css` (copied exactly):

```css
* { box-sizing: border-box; margin: 0; }
html, body, #root { height: 100%; }
body { font-family: var(--font-sans); font-size: 14px; line-height: 1.45; color: var(--text);
       background: var(--canvas); -webkit-font-smoothing: antialiased; overflow: hidden; }
button { font: inherit; color: inherit; background: none; border: none; padding: 0; cursor: pointer; }
input, textarea, select { font: inherit; color: inherit; }
code, pre { font-family: var(--font-mono); }
```

RF `base.css` has **no element reset**; it assumes Tailwind v4 preflight (`theme.css` is
`@theme inline`). Its controls therefore re-assert `border: 0; cursor: pointer` (`.btn`,
`.btn-app`) and `background: transparent; cursor: pointer` (`.seg button`). RF body:
`background: var(--bg); color: var(--text); font-family: var(--font-sans); font-size: 1rem;
line-height: 1.6; -webkit-font-smoothing: antialiased; overflow-x: clip;` — the app scope
overrides `[data-surface="app"] body { background: var(--app-bg); font-size: var(--fs-sm) }`
(14px). RF also sets `::selection { background: #eadfc6; color: var(--stone-900) }`.

Builder rule: the rebuild sits on Tailwind preflight (covers `button` bg/border/font). Add the
two things preflight does not do: `button { cursor: pointer }` and `body { line-height: 1.45 }`
for the product surface (see §0.8 on which line-height wins).

### 0.3 Focus ring

| | Luminars | RF |
|---|---|---|
| global | `:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }` | `:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }` |
| form fields | inherit the global ring (Input.tsx comment: "a control that paints its own would drift") | `.field input/select/textarea:focus-visible { outline: 2px solid var(--stone-900); outline-offset: 1px; }` |
| Term | `outline-offset: 2px` on `.term` (focusable `tabIndex=0`) | — |

Docs: DESIGN.md DSN-6 "visible focus"; RF 01-foundations "Focus: visible `:focus-visible`
outline in `currentColor`". DESIGN.md names gold as "wayfinding only" and the ring is exactly
wayfinding. Recommendation: one global ring, `outline: 2px solid var(--ring); outline-offset:
2px` with `--ring: var(--gold)` on the Luminars surface and `--ring: currentColor` on RF, so
components never declare their own ring (the Luminars rule). Do not port RF's 1px-offset field
ring.

### 0.4 `.num` — exact recipes

```css
/* Luminars base.css */
.num { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }

/* RF marketing.css (NOT in base.css; app surfaces rely on this file being loaded) */
.num { font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1, "lnum" 1; }

/* RF base.css — the metric role, which is where RF actually switches face */
.metric { font-family: var(--font-num); font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum" 1, "lnum" 1; font-weight: 500;
          letter-spacing: -0.04em; line-height: 1; }
```

Difference: Luminars `.num` switches to the mono face; RF `.num` only turns on tabular figures
and keeps the inherited sans (RF `PageHead` subtitle and `PanelHead` context carry `.num` for
that reason; RF switches face per-class via `font-family: var(--font-num)` on `.kpi__val`,
`.c-num`, `.feed time`, `.nav-item__count`, `.dcard__meta`, `.board__sum`). Unified: `.num` =
Luminars (mono + tabular + `"tnum" 1, "lnum" 1`); add `.tabular` = figures only for the RF
subtitle case.

### 0.5 `.eyebrow` — exact recipes

```css
/* Luminars base.css */
.eyebrow { font-family: var(--font-mono); font-size: 10.5px; font-weight: 500;
           text-transform: uppercase; letter-spacing: 0.09em; color: var(--text-3); }

/* RF base.css (marketing scale) */
.eyebrow { font-family: var(--font-mono); font-size: var(--fs-eyebrow); /* 0.75rem = 12px */
           font-weight: 500; letter-spacing: var(--ls-eyebrow); /* 0.14em */
           text-transform: uppercase; color: var(--text-faint); /* stone-500 */ }
.eyebrow b { font-weight: 500; color: var(--accent-warm); margin-right: 0.625em; }
```

RF's app surface never uses `.eyebrow` for chrome; it has three smaller mono-caps recipes:
`.nav-group` 10px / 0.11em / stone-400; `.data th` and `.board__head` 10px / 0.08em / stone-500;
`.tag` 9px / 0.07em. Luminars has one (10.5 / 0.09em / stone-550) plus `.badge` 10px / 0.08em
and `.accountRole` 9.5px / 0.08em. DESIGN.md: "eyebrows always mono-uppercase … letter-spacing
≥ .08em". See §19 for the unified scale.

### 0.6 Hairline = 1px

Both: every border is `1px solid`. RF tokens name it (`--hairline: 1px`; 01-foundations: "the only
border weight"). Luminars never uses another weight. Dashed is the one permitted variant, and it
means the same thing in both kits — *inferred / machine-made, not asserted*: Luminars
`.badge[data-dashed="on"]`; RF `.actor--machine`, `.by-ai`, `.assistant__tool`, `.staff-banner`.
Keep that contract.

### 0.7 "No shadows in the product surface"

- RF: hard rule. `[data-surface="app"] * { --shadow-panel: none; --shadow-card: none }`,
  `.panel { box-shadow: none }`; 03-product-app: "No shadows anywhere in the app … reset it
  explicitly." Active nav uses an **inset** ring instead (`box-shadow: inset 0 0 0 1px`).
- Luminars: soft depth **is** the design ("soft warm-tinted shadows … depth is gentle, never
  floating chrome"). Shadows appear in exactly four places: the content panel
  (`shell .content: var(--shadow-panel)`), `.card[data-elevated="on"]` (`--shadow-card`),
  the Segmented active segment (`--shadow-card`), and the two portalled layers `.menuPanel` /
  `.tip` (`--shadow-panel`).

Recommendation: keep the shadow as a token that a surface scope may zero. Components reference
`var(--shadow-card)` / `var(--shadow-panel)` only; the RF scope sets both to `none`, the
Luminars scope keeps them. Never hardcode a shadow in a component.

### 0.8 Type base

| | Luminars | RF app | RF marketing |
|---|---|---|---|
| body | 14px / 1.45 General Sans | 14px (`--fs-sm`) / 1.6 | 16px / 1.6 |
| sm / xs | 13.5 · 13 · 12.5 · 12 · 11.5 px (per component) | `--fs-sm` 14px, `--fs-xs` 13px | same tokens |
| display face in app | yes: page title, notice title, teaching-empty title, greeting, wordmark (Cabinet Grotesk 700) | **no** — "Cabinet Grotesk display weights are NOT used in the app"; page title 24px/500 General Sans | display 800, h2 700 |

### 0.9 Radius usage per component

| Component | Luminars | RF app | RF marketing |
|---|---|---|---|
| Button | pill | **8px** (`.btn-app`) | pill (`--radius-btn`) |
| Chip / status chip | pill | 6px | — |
| Badge / tag | pill | 4px (`.tag`, `.by-ai`, `.assistant__tool`, `kbd`) | 4px `--radius-sm` |
| Segmented | pill track + pill segments | 8px group, square segments with 1px separators | — |
| FilterChip | pill | — | — |
| Input / Select / Textarea | 6px `--radius-sm` | 8px (`.field`, `.search`, `.assistant__form input`) | — |
| Card / Panel | 10px `--radius-md` | 10px `--app-radius` | panel 6px, plot 8px, img 8px |
| Menu panel / tooltip | 10px / 6px | overlay panel 10px | — |
| Menu item / nav item / icon trigger | 6px | nav 7px, dcard 8px | — |
| Shell content card | 14px `--radius-lg` | 14px `--app-shell-radius` | — |
| Avatar | 50% | 50% (avatar, human actor); 8px (tenant logo); 6px (machine actor) | — |
| Count badge | 9px (18px tall pill) | — | — |

### 0.10 Shell geometry, side by side

| | Luminars (`shell.module.css`) | RF (`app.css`) |
|---|---|---|
| layout | `display: flex; height: 100%; background: var(--canvas)` | `display: grid; grid-template-columns: 244px minmax(0,1fr); height: 100vh; overflow: clip` |
| sidebar width | `236px` (`--sidebar-width`), `flex: 0 0 236px` | `244px` grid column |
| sidebar padding | `46px 14px 14px` (top clears the 38px drag strip + traffic lights); `gap: 18px`; flex column; `user-select: none`; whole aside is `data-tauri-drag-region="deep"` | `0.875rem 0.75rem 0.75rem` = `14px 12px 12px`; `overflow-y: auto`; transparent |
| content card inset | `margin: 12px 12px 12px 0` (`.contentAlone` adds `margin-left: 12px` when the sidebar is collapsed) | `.app__main { padding: 8px 8px 8px 0 }` (`--app-gap: .5rem`); ≤1080px adds `padding-left: 8px` |
| content card | `background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg)` (14px); `box-shadow: var(--shadow-panel)`; `overflow: auto`; `flex: 1; min-width: 0` | `.shell { background: var(--app-panel); border: 1px solid var(--app-line); border-radius: 14px; overflow: clip; display: flex; flex-direction: column }` + `.shell__scroll { flex: 1; min-height: 0; overflow-y: auto }`; **no shadow** |
| topbar | none (overlay titlebar: `.dragStrip` `height: 38px; padding-left: 76px; padding-right: 12px; width: 236px; justify-content: flex-end; z-index: 5`; collapsed `width: 240px`) | `.topbar { height: 3.5rem (56px); padding-inline: 1.5rem (24px); gap: 1rem; border-bottom: 1px solid var(--app-line); background: var(--app-panel); flex: none }`; `.topbar__right { margin-left: auto; gap: 0.625rem }`; ≤620px `padding-inline: 1rem` |
| topbar search | — | `.search { flex: 1; max-width: 380px; gap: 8px; padding: 7px 12px; background: stone-50; border: 1px solid stone-200; border-radius: 8px; color: text-faint; font-size: 13px }` + `kbd { mono 10px; border 1px stone-200; radius 4px; padding 1px 4px; margin-left: auto }` |
| sidebar toggle | `.sidebarToggle 26×26; radius 6px; color text-3; hover bg canvas-deep color text` (IconPanelLeft 16px) | `.menu-toggle` 36×36, border 1px stone-200, radius 8px, bg stone-0, shown ≤1080px only |
| wordmark / tenant | `.wordmark { font-family: display; 700; 17px; padding: 0 8px }` | `TenantBadge` (§18) |
| nav gap | `.nav gap: 14px` between groups; `.navGroup gap: 2px` between items; group label `.eyebrow { padding: 0 8px 6px }` | `.nav-group { padding: 1rem 0.5rem 0.375rem }` = `16px 8px 6px` (label IS the group spacer); no item gap |
| sidebar foot | `.sidebarFoot { gap: 8px }` — account row, Settings nav item, status pill | `.app__side-foot { margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--app-line); gap: 0.125rem }` + `.powered { padding: 12px 8px 0; mono 10px; ls .04em; stone-400 }` |
| status pill | `.statusPill { inline-flex; gap 7px; padding 6px 12px; pill; bg surface; border 1px border; 12.5px; color text-2; align-self: flex-start }` + StatusDot | — (no ambient status) |
| assistant / agent rail | a third inset panel (AgentRail, same construction as content) | `.assistant { position: fixed; right/top/bottom: 8px; width: min(400px, calc(100vw - 16px)); bg stone-0; border 1px stone-200; radius 14px; overflow clip; z-index 50 }` |
| responsive | none (desktop app) | ≤1240 `.grid-2` stacks; ≤1080 sidebar hidden; ≤1000 KPI 2-up; ≤620 KPI 1-up, page padding 16px, search hidden |
| body scroll | `body { overflow: hidden }`; the content panel scrolls | `body` never scrolls; `.shell__scroll` does |

DESIGN.md fixes the Luminars shell: "fixed ~236px sidebar + inset content card"; RF
03-product-app fixes 244px / 8px gap / 14px radius / no shadow.

---

## 1. Button

### API today

| | Luminars `Button` | RF `AppButton` / `AppButtonLink` | RF marketing `Btn` / `btnClass` |
|---|---|---|---|
| element | `<button type="button">` (type defaults) | `<button>` / `<a>` | `<a>` when `href`, else `<button type="button">` |
| variants | `tone: "primary" \| "quiet" \| "danger"`, default **`quiet`** | `quiet?: boolean` (default = primary ink) | `variant: "primary" \| "quiet" \| "on-dark" \| "ghost-dark"`, default **`primary`** |
| sizes | `size: "xs" \| "sm" \| "md" \| "lg"`, default `md` | one size | `size?: "sm"` (one step down) |
| extra | `destructive?: boolean` (quiet → warms to critical on hover), `pressed?: boolean` (sets `aria-pressed` + `data-pressed`) | `className` passthrough (via `cn`) | `href/target/rel/type/onClick/className` |
| className | **forbidden** (`Omit<…,"className">`) | allowed | allowed |
| data attrs | `data-tone`, `data-size`, `data-destructive="on\|off"`, `data-pressed="on\|off"` | class modifiers `.btn-app--quiet` | `.btn--{variant}`, `.btn--sm` |

### Recipe

Base:

| | Luminars `.button` | RF `.btn-app` | RF `.btn` |
|---|---|---|---|
| display | `inline-flex; align-items: center; justify-content: center` | `inline-flex; align-items: center` | `inline-flex; align-items: center` |
| gap | 6px | 7px (`0.4375rem`) | 8px (`0.5rem`) |
| radius | pill | **8px** | pill (`--radius-btn`) |
| weight | 500 | 500 | 500 |
| letter-spacing | 0 | 0 | `-0.005em` |
| font | inherits sans; size per `data-size` | `--fs-xs` 13px | `--fs-sm` 14px; `--sm`: 13px |
| padding | xs `2px 10px` · sm `6px 14px` · md `7px 16px` · lg `9px 20px` | `7px 13px` (`0.4375rem 0.8125rem`) | `14px 24px` (`0.875rem 1.5rem`); `--sm` `9px 16px` (`0.5625rem 1rem`) |
| font-size | xs 11.5 · sm 12.5 · md 12.5 · lg 13.5 px | 13px | 14px; sm 13px |
| ≈ height | xs 21 (quiet 23) · sm 30 (32) · md 32 (34) · lg 38 (40) — **quiet/danger are 2px taller than primary** because only they carry a border | ≈ 35 (primary, border 0) / 37 (quiet, 1px border) | ≈ 50; sm ≈ 39 |
| white-space | nowrap | — | — |
| transition | `background 120ms ease-out, color 120ms ease-out, border-color 120ms ease-out` | none | `background-color .18s, color .18s, box-shadow .18s, transform .18s` `var(--ease)` |
| active | — | — | `transform: translateY(1px)` |
| disabled | `opacity: 0.5; cursor: default` (".45 lost; .5 wins") | `opacity: 0.5; cursor: not-allowed` | — |
| text-decoration | — | `none` (link form) | `none` |

Variants:

| Variant | Luminars | RF app | RF marketing |
|---|---|---|---|
| primary | `background: var(--ink); color: var(--stone-50)`; hover `background: var(--stone-800)` | `background: var(--app-action)` (stone-900); `color: var(--stone-0)`; hover `stone-800` | `.btn--primary { background: var(--accent); color: var(--ecru) }`; hover `var(--accent-hover)` = `#000000` |
| quiet | `border: 1px solid var(--border-strong)` (stone-300); `color: var(--text-2)`; **no background**; hover `color: var(--text); border-color: var(--stone-400)` | `.btn-app--quiet { background: var(--app-panel); color: var(--text); border: 1px solid var(--app-line) }` (stone-200); hover `background: var(--stone-100)` | `.btn--quiet { color: var(--text); background: rgba(255,255,255,.4); backdrop-filter: blur(10px) saturate(140%); box-shadow: inset 0 0 0 1px var(--line-strong) }`; hover `box-shadow: inset 0 0 0 1px var(--stone-400); background: rgba(255,255,255,.72)` |
| quiet + destructive | hover only: `color: var(--status-critical); border-color: var(--status-critical)` | — | — |
| danger | `border: 1px solid var(--status-critical); color: var(--status-critical)`; hover `background: var(--status-critical); color: var(--stone-0)` | — | — |
| pressed (toggle on) | `.button[data-pressed="on"] { background: var(--canvas-deep); color: var(--text); border-color: var(--stone-400) }` | — | — |
| on-dark | — | — | `background: var(--ecru); color: var(--stone-900)`; hover `#fff` |
| ghost-dark | — | — | `color: var(--text-inverse); background: rgba(246,243,238,.1); backdrop-filter: blur(12px) saturate(140%); box-shadow: inset 0 0 0 1px rgba(246,243,238,.26)`; hover `background: rgba(246,243,238,.18); box-shadow: inset 0 0 0 1px rgba(246,243,238,.4)` |

Icon inside a button: neither kit sizes it; Luminars icons are intrinsically 16px; RF `.btn-app`
children get the 7px gap. Luminars primary text is `stone-50` (not pure white); RF is `stone-0`.

Luminars icon-only square triggers that are *not* `Button` (keep them as a separate
`IconButton`): `.menuTrigger` / `.sidebarToggle` `26×26; inline-flex center; border-radius:
var(--radius-sm); color: var(--text-3); transition background 120ms, color 120ms; hover (and
`.menuTriggerOpen`) background: var(--canvas-deep); color: var(--text)`.

### Rules from the docs

- DESIGN.md: "One dark primary button per screen (DSN-3)"; "every row in a list carries the
  SAME verb weight … the one dark primary belongs in the page head"; "Tone is WEIGHT, not
  decoration (DSN-7)".
- RF 01-foundations: "`radius-btn` pill — ALL buttons"; "Soft is interactive … Pills and
  circles are things you press". RF's own `.btn-app` (8px) contradicts its foundations doc;
  03-product-app calls it "ink primary pill-radius-8 button" — a documented exception, not a
  rule.
- Button.tsx: the destructive ladder (007-AC-5) — "the verb you reach for is quiet and only
  warms under the pointer; the verb that commits is critical at rest."

### Recommended unified API (cva)

```ts
variant: "primary" | "quiet" | "danger" | "ghost"     // default "quiet" (app), ghost = icon-only square
size:    "xs" | "sm" | "md" | "lg" | "icon"             // default "md"; icon = 26×26 square, radius-sm
destructive?: boolean   // quiet-only hover warming; ignored on other variants
pressed?: boolean       // renders aria-pressed + data-pressed
asChild?: boolean       // Radix Slot — replaces AppButtonLink / Btn href
```

Marketing keeps its own `MarketingButton` cva (`variant: primary | quiet | on-dark |
ghost-dark`, `size: md | sm`) — glass + translateY are marketing-only and must not leak into the
product surface.

Recipe decisions for the rebuild: pill radius (both foundations docs say so); quiet = hairline
`stone-300`, no fill, `text-2` (Luminars; RF quiet's `stone-200` border reads as a field, not a
button); fix the 2px height mismatch by giving primary a `1px solid transparent` border (or
`box-shadow: inset 0 0 0 1px` on quiet) so all variants share one height per size; disabled
`opacity .5; cursor: not-allowed` (RF's cursor; Luminars' opacity).

Mapping:

- Luminars `tone="primary"` → `variant="primary"`; `tone="quiet"` → `variant="quiet"`;
  `tone="danger"` → `variant="danger"`; `destructive` → `destructive`; `pressed` → `pressed`;
  `size` → `size` (same names).
- RF `AppButton` (no flag) → `variant="primary" size="md"`; `AppButton quiet` →
  `variant="quiet"`; `AppButtonLink` → `<Button asChild><a/></Button>`.
- RF `.btn--primary` → `MarketingButton variant="primary"`; `.btn--quiet` → `variant="quiet"`;
  `.btn--on-dark` → `variant="on-dark"`; `.btn--ghost-dark` → `variant="ghost-dark"`;
  `.btn--sm` → `size="sm"`; `Btn href` → `asChild`.
- Luminars `.menuTrigger` / `.sidebarToggle` → `variant="ghost" size="icon"`.
- Luminars `.firstVisitDismiss` (§16) → `variant="quiet" size="xs"` (it is an unregistered
  Button copy: `12px; padding 4px 12px; border 1px border-strong; pill; hover text + stone-400`).

### Behaviour to keep

`type="button"` default (both); `aria-pressed` only when `pressed !== undefined` (an ordinary
verb must not claim to be a toggle); `:hover` rules gated by `:not(:disabled)`.

---

## 2. BackLink

### API today

Luminars `BackLink({ onClick, children })` → `<button type="button" class=backLink>`. A second
recipe lives in the shell (`shell.module.css .backLink`) for the object-focus takeover. RF has
no app back link; its marketing `.link` is the nearest text-link recipe.

### Recipe

| | Luminars kit `.backLink` | Luminars shell `.backLink` | RF marketing `.link` |
|---|---|---|---|
| display | `inline-block; text-align: left` | `text-align: left` (block in the nav column) | inline |
| color | `var(--text-3)`; hover `var(--text)` | `var(--text-2)`; `font-weight: 500`; hover `background: var(--canvas-deep); color: var(--text)` | `var(--text)`; 500 |
| font-size | 13px | inherits 14px | inherits |
| padding / radius | none; `margin-bottom: 14px` | `7px 8px`; `border-radius: var(--radius-sm)` | `padding-bottom: 1px` |
| underline | none | none | `border-bottom: 1px solid var(--stone-400)`; hover `border-color: var(--accent-warm)`; `text-decoration: none` |
| transition | `color 120ms ease-out` | — | `border-color .18s var(--ease)` |

### Recommended unified API

`BackLink` with `variant: "inline" | "nav"` (inline = kit recipe, nav = shell recipe) and
`asChild`. Keep RF `.link` as `TextLink` (marketing only; gold hover is marketing's).
Mapping: Luminars kit `BackLink` → `variant="inline"`; shell `.backLink` → `variant="nav"`.

---

## 3. Segmented

### API today

| | Luminars `Segmented<T>` | RF `.seg` |
|---|---|---|
| props | `options: {value: T; label: ReactNode}[]`, `value`, `onChange`, `label` (required, → `aria-label`) | no component; raw `<div class="seg"><button aria-pressed>…` |
| ARIA | `<span role="group" aria-label>`; each `<button type="button" aria-pressed>` `data-active="on\|off"` | `button[aria-pressed="true"]` styles the active one |

### Recipe

| | Luminars | RF |
|---|---|---|
| track | `inline-flex; align-items: center; flex: none; gap: 2px; padding: 3px; border-radius: pill; border: 1px solid var(--border); background: var(--surface-2)` | `display: flex; border: 1px solid var(--app-line); border-radius: 8px; overflow: hidden; background: var(--app-panel)` |
| segment | `padding: 5px 13px; border-radius: pill; font-size: 12.5px; color: var(--text-2); white-space: nowrap; transition: color 120ms, background 120ms` | `padding: 6px 11px (0.375rem 0.6875rem); font-size: 13px; color: var(--text-muted); border-right: 1px solid var(--app-line)` (last child `border-right: 0`); `background: transparent; cursor: pointer` |
| hover (inactive) | `color: var(--text)` | — |
| active | `background: var(--surface); color: var(--text); font-weight: 500; box-shadow: var(--shadow-card)` (raised onto the surface) | `background: var(--stone-100); color: var(--text); font-weight: 500` (sunken) |
| ≈ height | segment 28 → track 36 | segment ≈ 33 → track ≈ 35 |

Docs: RF 03 "bordered group, 8 px radius, hairline separators, active = stone-100 fill + 500
weight". Luminars Segmented.tsx: "a quiet track with the active option RAISED onto the surface,
rather than a row of separately-bordered pills … Not a tab strip — it filters, it does not
navigate."

### Recommended unified API

```ts
<Segmented value onValueChange label options size?="sm"|"md">   // role=group, aria-pressed buttons
variant: "raised" (Luminars, default) | "divided" (RF)
```

Mapping: Luminars `Segmented` → `variant="raised"`; RF `.seg` → `variant="divided"`. Keep
`label` required. Do not add `role="tablist"` — it is a filter, not navigation.

---

## 4. FilterChip (Luminars only)

API: `FilterChip({ active=false, onClick, children })` → `<button type="button"
aria-pressed data-active>`. Many-of-many toggles for open-ended, wrapping sets (the connector
catalog); deliberately not a Segmented variant.

Recipe: `padding: 5px 14px; border-radius: pill; border: 1px solid var(--border-strong);
font-size: 12.5px; color: var(--text-2); white-space: nowrap; transition: color 120ms,
background 120ms, border-color 120ms`. Hover (inactive): `color: var(--text); border-color:
var(--stone-400)`. Active: `background: var(--canvas-deep); color: var(--text); font-weight:
500` (border stays stone-300). ≈ height 30.

Unified: `Toggle` (shadcn) with `variant="chip"`; `pressed` ↔ `active`. Mapping: `FilterChip
active` → `<Toggle variant="chip" pressed>`.

---

## 5. Menu (dropdown, Luminars only)

API: `Menu({ label: string, items: {label; onSelect; disabled?}[] })`. Renders `null` when
`items.length === 0`. Trigger = `IconMore` in a 26×26 ghost square (§1); `aria-haspopup="true"`,
`aria-expanded`, `aria-label={label}`, `title={label}`. **Deliberately no `role=menu`/`menuitem`**
("would promise arrow-key semantics this does not implement").

Recipe:

- `.menuPanel { position: fixed; z-index: 60; min-width: 184px; padding: 4px; display: flex;
  flex-direction: column; border: 1px solid var(--border); border-radius: var(--radius-md);
  background: var(--surface); box-shadow: var(--shadow-panel); animation: menuIn 120ms ease-out }`
  — `@keyframes menuIn { from { opacity: 0; transform: translateY(-3px) } }`.
- `.menuItem { text-align: left; padding: 7px 10px; border-radius: var(--radius-sm);
  font-size: 13px; color: var(--text-2); white-space: nowrap }`; hover (not disabled)
  `background: var(--surface-2); color: var(--text)`; disabled `color: var(--text-3); cursor:
  default`.

Behaviour that must not be lost: portalled to `document.body`, `position: fixed`, placed in a
`useLayoutEffect` (first pass renders `visibility: hidden`, then measures); `GAP = 5`,
`EDGE = 12`; opens below the trigger's bottom edge, flips above when `below + height + 12 >
innerHeight`; right-anchored (`right = max(12, innerWidth − trigger.right)`); closes on outside
`mousedown`, `Escape` (returns focus to the trigger), item select, any `scroll` (capture phase,
so an inner scroll container counts) and `resize`. RF has no dropdown.

Unified: shadcn `DropdownMenu` (Radix) gives the portal, collision flip, outside/Escape
dismissal and adds the keyboard semantics Luminars declined to fake. Skin the content with the
recipe above (`min-w-[184px] p-1 rounded-md border bg-surface shadow-panel`, item
`px-2.5 py-[7px] rounded-sm text-[13px] text-text-2`). Keep: trigger is `Button
variant="ghost" size="icon"` with `aria-label`; render nothing for an empty item list; close on
scroll (Radix does not by default — add a capture-phase scroll listener).

---

## 6–8. Input, Select, Textarea (+ the shared field shell)

### API today

| | Luminars | RF |
|---|---|---|
| Input | `Input({ mono?: boolean, …InputHTMLAttributes })`, className forbidden, `data-mono="on\|off"` | no component; `.field input` (`.field` = label + control column) |
| Select | `Select({ children, …SelectHTMLAttributes })` → `<span class=selectWrap><select class=select/><span class=selectCaret aria-hidden>⌄</span></span>`; **native popup on purpose** ("the OS's … unbeatable for keyboard and assistive tech") | `.field select` (native, unstyled caret) |
| Textarea | `Textarea(props)`; `resize: none` by design (surfaces grow it themselves) | `.field textarea` |
| label / error | none (surfaces do it) | `.field label { font-size: 13px; font-weight: 500 }`, `.field { gap: 6px }`, `.form-error { font-size: 13px; color: var(--status-critical) }` |

### Recipe — the field shell

| | Luminars `.input, .textarea, .select` | RF `.field input/select/textarea` | RF `.search` / `.assistant__form input` |
|---|---|---|---|
| padding | `7px 10px` | `7px 10px` (`0.4375rem 0.625rem`) | `7px 12px` / `7px 10px` |
| border | `1px solid var(--border-strong)` (stone-300) | `1px solid var(--app-line)` (stone-200) | stone-200 |
| radius | `var(--radius-sm)` 6px | 8px | 8px |
| background | `var(--surface)` | `var(--app-panel)` | `stone-50` |
| color | `var(--text)` | `var(--text)` | text-faint (search) |
| font | `var(--font-sans); 13px` | `--fs-sm` 14px | 13px / 14px |
| ≈ height | 35 | 38 | — |
| min-width | 0 | — | — |
| hover | `border-color: var(--stone-400)` (not disabled); `transition: border-color 120ms ease-out` | — | — |
| focus | global gold ring | `outline: 2px solid var(--stone-900); outline-offset: 1px` | — |
| disabled | `opacity: 0.6; cursor: default` | — | — |
| placeholder | `color: var(--text-3)` | — | — |
| mono | `.input[data-mono="on"] { font-family: var(--font-mono) }` | — | — |
| textarea | `resize: none; line-height: 1.5` | — | — |
| select | `appearance: none; padding-right: 26px; cursor: pointer`; wrap `position: relative; inline-flex; align-items: center`; caret `position: absolute; right: 9px; color: var(--text-3); font-size: 12px; line-height: 1; pointer-events: none` (glyph `⌄`) | native | — |

### Recommended unified API

- `Input` (`mono?: boolean` → `font-mono`), `Textarea`, `NativeSelect` (Luminars wrapper with
  an SVG caret instead of the `⌄` text glyph — the glyph depends on the face having it), plus
  `Field` / `FieldLabel` / `FieldError` from RF for the label column. Keep shadcn's Radix
  `Select` out of the desktop app (the Luminars decision is explicit); offer it only where a
  custom popup is needed.
- Shell recipe: `px-2.5 py-[7px] border border-stone-300 rounded-sm bg-surface text-[13px]`
  with `hover:border-stone-400 disabled:opacity-60 placeholder:text-text-3`; `h-[34px]` fixed
  so inputs and `Button size="md"` quiet (34) align on a row.
- Mapping: Luminars `Input mono` → `Input mono`; RF `.field` → `Field`; `.field input` →
  `Input`; `.form-error` → `FieldError`; `.search` → `Input variant="search"` (stone-50 fill,
  optional `kbd` slot).

---

## 9. Badge (Luminars) + RF `.tag` / `.by-ai` / `.assistant__tool`

### API today

Luminars `Badge({ dashed=false, children })` → `<span class=badge data-dashed>`. Semantics:
"a Badge names a property of the thing itself — its grade, who authored it"; `dashed` =
"inferred, not asserted" (load-bearing: CST-0 depth behind disclosure). RF: no component;
`NavItemContent tag / tagAction` renders `.tag` / `.tag--action`; `FeedItem machineLabel`
renders `.by-ai`.

### Recipe

| | Luminars `.badge` | RF `.tag` | RF `.by-ai` | RF `.assistant__tool` |
|---|---|---|---|---|
| display | `inline-flex; align-items: center` | inline; `margin-left: auto` | `inline-flex; gap: 4px; margin-left: 6px; vertical-align: 1px` | `align-self: flex-start` |
| font | mono 10px 500 uppercase `0.08em` | mono 9px (`0.5625rem`) uppercase `0.07em` | mono 9px uppercase `0.07em` | mono 10px `0.04em` (not uppercase) |
| padding | `2px 8px` | `2px 5px` (`0.125rem 0.3125rem`) | `1px 5px` | `2px 6px` |
| radius | pill | 4px | 4px | 4px |
| border | `1px solid var(--border-strong)`; dashed variant `border-style: dashed` | `1px solid var(--app-line)`; `--action`: `border-color: stone-400` | `1px dashed var(--stone-400)` | `1px dashed var(--stone-400)` |
| color | `var(--text-2)` | `stone-500`; `--action` `stone-700` | `stone-600` | `stone-500` |
| nowrap | yes | — | — | — |

### Recommended unified API

```ts
<Badge variant="outline" | "dashed" | "action"  shape="pill" | "square">
```

Default `variant="outline" shape="pill"` (Luminars). Mapping: Luminars `Badge` → `variant=
"outline"`; `Badge dashed` → `variant="dashed"`; RF `.tag` → `variant="outline" shape="square"`;
`.tag--action` → `variant="action" shape="square"`; `.by-ai` → `variant="dashed" shape=
"square"`; `.assistant__tool` → `variant="dashed" shape="square"` (`normal-case tracking-[.04em]`).
The dashed-means-machine contract is shared by both kits; never use dashed for anything else.

---

## 10. Chip (Luminars `Chip` + RF `StatusChip`)

### API today

| | Luminars `Chip` | RF `StatusChip` |
|---|---|---|
| tone | `StatusTone = "ok" \| "attention" \| "serious" \| "warning" \| "info" \| "quiet"` (default `quiet`) — shared with `StatusDot` via `tone.ts` | `ChipTone = "neutral" \| "good" \| "warn" \| "lost"` (default `neutral`) |
| indicator | `dot?: boolean` (default true; off for non-status chips — "an origin, a kind") | inline SVG per tone (12-grid: check `stroke 1.6`, `!` `stroke 1.5`, × `stroke 1.6`); none for neutral |
| emphasis | `emphasis?: boolean` ("first rung of the attention ladder: warmer ground, firmer border") | — |
| data attrs | `data-tone`, `data-dot="on\|off"`, `data-emphasis="on\|off"` | `.chip--good/--warn/--lost` |

### Recipe

| | Luminars `.chip` | RF `.chip` |
|---|---|---|
| display | `inline-flex; align-items: center; gap: 6px; white-space: nowrap` | `inline-flex; align-items: center; gap: 6px (0.375rem); white-space: nowrap` |
| padding | `3px 10px` | `3px 8px 3px 7px` (`0.1875rem 0.5rem 0.1875rem 0.4375rem`) |
| radius | pill | 6px |
| border | `1px solid var(--border-strong)` | none |
| font | 12px, weight inherits (400) | 11px (`0.6875rem`) |
| color / bg | `var(--text-2)` on `var(--surface-2)` | `var(--text-muted)` on `var(--stone-100)` |
| ≈ height | 25 | 24 |
| indicator | `::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--stone-400) }`; per tone `--status-good / --status-critical (attention) / --status-serious / --status-warning / --status-info`; `[data-dot="off"]::before { content: none }` | `svg { width: 11px; height: 11px }` |
| tone fills | none — the text stays `text-2`; only the dot is coloured (DSN-6) | `--good { background: color-mix(in srgb, var(--status-good) 12%, transparent); color: #0a7d0a }`; `--warn { color-mix(… var(--status-warning) 20% …); color: #7a5400 }`; `--lost { color-mix(… var(--status-critical) 12% …); color: #a52a2a }` |
| emphasis | `background: var(--canvas-deep); border-color: var(--stone-400); color: var(--text); font-weight: 500` | — |

Docs: DESIGN.md "status colors never decorate and always render as dot + word (DSN-6)"; RF 03
"Status chip: 6 px radius, tinted fill at ~12% + dark-tinted text + 11 px icon … Colour + icon
+ word, always." Same accessibility rule, different rendering.

### Recommended unified API

```ts
<Chip tone="quiet"|"ok"|"warning"|"serious"|"attention"|"info"
      variant="outline" (Luminars pill + dot) | "tint" (RF 6px tinted fill + icon)
      indicator="dot"|"icon"|"none"   // default: outline→dot, tint→icon
      emphasis?: boolean>
```

Mapping: Luminars `Chip tone=X` → `tone=X variant="outline"`; `dot={false}` →
`indicator="none"`; RF `neutral` → `tone="quiet"`; `good` → `tone="ok"`; `warn` →
`tone="warning"`; `lost` → `tone="attention"`; all RF → `variant="tint"`. Keep the tint text
colours as literal tokens (`--status-good-ink #0a7d0a`, `--status-warning-ink #7a5400`,
`--status-critical-ink #a52a2a`) — they exist because the raw status hues fail AA as text.

---

## 11. StatusDot (Luminars only)

API: `StatusDot({ tone="quiet", live=false })` → `<span aria-hidden data-tone data-live>`; always
rendered beside a word the caller owns (DSN-6).

Recipe: `display: inline-block; width: 7px; height: 7px; border-radius: 50%; flex: 0 0 auto;
background: var(--stone-400)`; tones as the Chip dot; `[data-live="on"] { animation: dotPulse
1.4s ease-in-out infinite }`, `@keyframes dotPulse { 50% { opacity: 0.35 } }` — "only a dot
reporting something LIVE breathes". Note the Chip's `::before` dot is **6px**, the standalone is
**7px** (same `stone-400` neutral, same tone ramp). RF has no dot (status is icon-in-chip).

Unified: `StatusDot tone live` unchanged, 7px; the Chip renders the same component with
`size={6}` so the two can never drift on colour again (they already did once — the chip's
neutral had slipped to a text tone before the 2026-08-22 consolidation).

---

## 12. Notice / EmptyState / UpsellPanel

### API today

| | Luminars `Notice` | RF `EmptyState` | RF `UpsellPanel` |
|---|---|---|---|
| props | `title: string; children?` — "reports a condition the person did not cause … may have nothing to offer" | `children` → `<p class="empty">` | `eyebrow, title, children, actions?` → `<section class="panel upsell">` |

### Recipe

| | Luminars `.notice` | RF `.empty` | RF `.upsell` |
|---|---|---|---|
| box | `border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface-2); padding: 32px; max-width: 560px` | `padding: 40px 24px (2.5rem 1.5rem); text-align: center` — no box | `.panel` + `padding: 16px; flex column; gap: 10px` |
| title | `.noticeTitle { font-family: var(--font-display); font-weight: 700; font-size: 16px; margin-bottom: 6px }` | — | `h3 { font-size: 14px; font-weight: 500 }` + `.eyebrow` above |
| body | `.noticeBody { color: var(--text-2); font-size: 13px; line-height: 1.5 }` | `color: var(--text-faint); font-size: 13px` | `p { font-size: 13px; color: var(--text-muted); line-height: 1.5 }` |
| actions | — | — | `.upsell__actions { display: flex; gap: 8px; margin-top: 4px }` |

### Recommended unified API

`Notice({ title, children, actions?, eyebrow? })` with `variant: "card" (Luminars) | "plain"
(RF empty, centered faint line)`. Mapping: Luminars `Notice` → `variant="card"`; RF
`EmptyState` → `variant="plain"`; RF `UpsellPanel` → `Card` + `Eyebrow` + `Notice`-style body +
`actions` (or keep `UpsellPanel` as a composition, not a primitive).

---

## 13. Card (Luminars `Card`) + RF `Panel` / `PanelHead`

### API today

| | Luminars `Card` | RF `Panel` / `PanelHead` |
|---|---|---|
| element | `as: "div" \| "section" \| "li"` (default div; "a div inside an ol is invalid") | always `<section class="panel">` |
| props | `tone: "surface" \| "sunken"`, `elevated?: boolean`, `padded?: boolean` (default true) | `className?`; `PanelHead({ title, context? })` → `<div class="panel__head"><h2/><p class="num"/></div>` |
| className | forbidden | allowed |

### Recipe

| | Luminars `.card` | RF `.panel` |
|---|---|---|
| box | `border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface)` | `background: var(--app-panel); border: 1px solid var(--app-line); border-radius: var(--app-radius) (10px); box-shadow: none` |
| sunken | `[data-tone="sunken"] { background: var(--surface-2) }` | — |
| elevated | `[data-elevated="on"] { box-shadow: var(--shadow-card) }` | never |
| padding | `[data-padded="on"] { padding: 18px 20px }` ("16px 18px and 18px 20px; the roomier one wins"); `[data-padded="off"] { overflow: hidden }` (a child owns the edges) | none on the panel; children pad themselves (`.feed`, `.kpi`, `.upsell 16px`) |
| eyebrow child | `.card > .eyebrow { display: block; margin-bottom: 10px }` | — |
| head | — | `.panel__head { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 16px (0.875rem 1rem); border-bottom: 1px solid var(--app-line) }`; `h2 { font-size: 15px (0.9375rem); font-weight: 500; letter-spacing: -0.012em }`; `p { font-size: 13px; color: var(--text-faint) }` (+ `.num` tabular) |

RF 03: "Card / panel: white, 1 px stone-200, 10 px radius, no shadow. Header row: 500-weight
title left, mono context right, bottom hairline." DESIGN.md: "panels with mono ALL-CAPS header
links".

### Recommended unified API

```ts
<Card as? tone="surface"|"sunken" elevated? padded?>   // shadcn Card shell
<CardHeader title context? actions?>                    // RF panel__head recipe
```

Mapping: Luminars `Card` → `Card` (same props); RF `Panel` → `Card padded={false}`;
`PanelHead` → `CardHeader`. `elevated` resolves to `var(--shadow-card)`, which the RF scope
zeroes (§0.7), so the prop is safe on both surfaces.

---

## 14. Page + PageHead

### API today

| | Luminars | RF |
|---|---|---|
| Page | `Page({ width: "narrow" \| "medium" \| "wide" = "medium", pad: "tight" \| "default" \| "roomy" = "default" })` → `data-width`, `data-pad` | `Page({ children })` → `<div class="page">` |
| PageHead | `PageHead({ title, subtitle?: ReactNode, actions?, size: "page" \| "object" = "page", children? })` → `<header class=pageHead data-size><div class=pageHeadText><h1/><p/>{children}</div><div class=pageHeadActions/></header>` (`.pageHeadText` has **no CSS rule**) | `PageHead({ title, subtitle?: string, children })` → `<div class="page__head"><div><h1/><p class="num"/></div>{children}</div>` |

### Recipe

| | Luminars | RF |
|---|---|---|
| page padding | default `28px 32px 40px`; tight `22px 28px 40px`; roomy `32px 40px` | `24px (1.5rem)`; ≤620px `16px` |
| page layout | padding only ("coupling a flex stack to a padding step made Home's layout everyone's") | `display: flex; flex-direction: column; gap: 20px (1.25rem)` |
| width | `max-width`: narrow 760 · medium 860 · wide 1080 ("Three widths, no fourth") | none (fills the card) |
| head | `display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 20px` | `display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap` |
| title | `font-family: var(--font-display); font-weight: 700; font-size: 24px; letter-spacing: -0.01em`; `[data-size="object"]` → 20px | `h1 { font-size: 24px (1.5rem); font-weight: 500; letter-spacing: -0.022em }` (sans; display face banned in the app) |
| subtitle | `color: var(--text-2); margin-top: 4px; max-width: 62ch` (14px inherited) | `p { color: var(--text-faint); font-size: 13px; margin-top: 4px }` + `.num` |
| actions | `display: flex; align-items: center; gap: 8px; flex: none` | raw children |

### Recommended unified API

```ts
<Page width="narrow"|"medium"|"wide"|"full" pad="tight"|"default"|"roomy" stack?: boolean>
<PageHead title subtitle? actions? size="page"|"object">
```

`width="full"` + `stack` (flex column gap 20) cover RF. Title face is a surface decision: the
Luminars scope sets `--font-heading: var(--font-display)` 700; RF sets `--font-heading:
var(--font-sans)` 500. Mapping: Luminars → same names; RF `Page` → `width="full" stack`; RF
`PageHead` → `PageHead` (children → `actions`).

---

## 15. Table (+ RF `TableWrap`, `data-num`, row hover, header)

### API today

| | Luminars `Table` | RF |
|---|---|---|
| props | `bleed?: boolean` (rules reach past the card padding), `align: "middle" \| "top"`, `rowHeight?: number` (→ `--kit-row-h`) | `TableWrap({children})` → `<div class="table-wrap">`; raw `<table class="data">` with `.c-name / .c-num / .c-muted` cells |
| numeric | `th[data-num], td[data-num] { text-align: right }` + caller adds `.num` | `.c-num { font-family: var(--font-num); text-align: right; white-space: nowrap }` |

### Recipe

| | Luminars `.table` | RF `.data` |
|---|---|---|
| table | `width: 100%; border-collapse: collapse; font-size: 13.5px` | `font-size: 13px; min-width: 720px; width: 100%; border-collapse: collapse` |
| wrap | `[data-bleed="on"] { width: calc(100% + 24px); margin: 0 -12px }` | `.table-wrap { overflow-x: auto }` |
| th | `text-align: left; font-family: var(--font-mono); font-size: 10.5px; font-weight: 500; letter-spacing: 0.09em; text-transform: uppercase; color: var(--text-3); padding: 14px 12px 9px; border-bottom: 1px solid var(--border); white-space: nowrap; line-height: 1.5` (extra top air so mono caps never sit flush under a card edge; lh 1.5 so the 12px `?` marker is not cropped) | `font-family: var(--font-mono); font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--stone-500); padding: 10px 16px; border-bottom: 1px solid var(--app-line); background: var(--stone-50); white-space: nowrap; text-align: left` |
| td | `height: var(--kit-row-h, auto); padding: 9px 12px; border-bottom: 1px solid var(--border)`; `[data-align="middle"\|"top"]` → `vertical-align` | `padding: 11px 16px; border-bottom: 1px solid var(--app-line); vertical-align: middle` |
| last row | `tbody tr:last-child td { border-bottom: none }` | same (`border-bottom: 0`) |
| row hover | **none** (no zebra, no hover — "the calm list") | `tbody tr:hover { background: var(--stone-50) }` |
| name / muted cells | — | `.c-name { font-weight: 500 }`; `.c-muted { color: var(--text-muted) }` |

Docs: RF 03 "mono uppercase header on stone-50 … rows with hairline dividers, hover stone-50;
names 500, secondary cells muted; numbers mono right-aligned with white-space: nowrap. Min-width
+ horizontal scroll"; DESIGN.md "a list panel is exactly as wide as the rest of its page and
scrolls sideways inside itself rather than widening the page".

### Recommended unified API

shadcn `Table / TableHeader / TableRow / TableHead / TableCell` with root props `bleed`, `align`,
`rowHeight`, `hoverable?: boolean` (RF on, Luminars off), `headFill?: boolean` (RF stone-50
head), and `TableCell num` / `TableHead num` (right-align + `.num`). `TableWrap` = a
`overflow-x-auto` root with `minWidth`. Mapping: Luminars → same; RF `.c-num` → `num`;
`.c-name` → `font-medium`; `.c-muted` → `text-text-2`; `TableWrap` → `Table minWidth={720}`.

---

## 16. StatGrid / Stat (RF KPI row) + Luminars Home KPI

### API today

RF `StatGrid({children})` → `<dl class="kpis">`; `Stat({ label, value, delta?, deltaDirection?:
"up"|"down", base? })` → `<div class="kpi"><dt/><dd><span class="kpi__val"/><span class="delta
delta--up|down"/></dd><p class="kpi__base num"/></div>`. Luminars: **no kit primitive** — Home
composes `Card` + `home.module.css` (`Kpi({ label, value: string|null, suffix?, teach })`;
null renders a `—` and the teaching line — "A dash never pretends to be a zero").

### Recipe

| | Luminars Home (`home.module.css`) | RF `.kpis / .kpi` |
|---|---|---|
| grid | `.kpiRow { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px }` — four separate padded `Card`s (18px 20px) | `.kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--app-line); border: 1px solid var(--app-line); border-radius: var(--app-radius); overflow: hidden }` — one box, hairline-gap cells; ≤1000px 2-up; ≤620px 1-up |
| cell | Card padding `18px 20px` | `.kpi { background: var(--app-panel); padding: 15px 16px 16px (0.9375rem 1rem 1rem) }` |
| label | `.kpiLabel { font-size: 10.5px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-3) }` — **sans, 600**: a drift from the mono `.eyebrow` role | `dt { font-size: 13px; color: var(--text-muted); margin-bottom: 8px }` (sentence case, sans) |
| value | `.kpiValue { font-size: 20px; font-weight: 600; color: var(--text) }` + class `num` (mono tabular) | `.kpi__val { font-family: var(--font-num); font-size: 26px (1.625rem); font-weight: 500; letter-spacing: -0.03em; line-height: 1; white-space: nowrap }`; `dd { display: flex; align-items: baseline; gap: 8px }` |
| absent | `.kpiValueAbsent { font-size: 20px; font-weight: 500; color: var(--text-3) }` (`—`) | — |
| suffix / delta | `.kpiSuffix { font-size: 12px; font-weight: 500; color: var(--text-3) }` | `.delta { font-size: 11px; font-weight: 500; inline-flex; gap: 3px }`; `--up { color: #0a7d0a }`; `--down { color: var(--status-critical) }` ("Deltas always carry direction + context, not colour alone") |
| base / teach line | `.kpiTeach { font-size: 11.5px; line-height: 1.45; color: var(--text-3) }` | `.kpi__base { margin-top: 7px; font-size: 11px; color: var(--text-faint) }` + `.num` |

DESIGN.md names the same object: "the KPI card (value + delta + a grounding line naming its
evidence)".

### Recommended unified API

```ts
<StatGrid columns=4 variant="cells" (RF hairline grid) | "cards" (Luminars gap-12 cards)>
<Stat label value|null suffix? delta? deltaDirection? base? teach?>
```

Value: `num` role, `font-medium`, `leading-none`, `tracking-[-0.03em]`, size `lg` 26px (RF) /
`md` 20px (Luminars). Label: fix Luminars to the mono `.eyebrow` (10.5/500/.09em/text-3) —
the 600-weight sans label is a one-off. Mapping: RF `StatGrid/Stat` → same names,
`variant="cells"`; Luminars `Kpi` → `Stat` with `teach`, `variant="cards"`.

---

## 17. EmptyState / TeachingEmpty / FirstVisit / Term (Luminars guidance kit)

RF has only `.empty` (§12). Luminars:

### TeachingEmpty

API `TeachingEmpty({ title, body, action? })` — DSN-3: "what this screen will show and the one
action that gets the person there". Recipe: `.teachingEmpty { display: flex; flex-direction:
column; align-items: flex-start; gap: 8px; padding: 36px 32px; border: 1px solid var(--border);
border-radius: var(--radius-md); background: var(--surface) }`; `.teachingEmptyTitle {
font-family: var(--font-display); font-weight: 700; font-size: 19px; letter-spacing: -0.01em }`;
`.teachingEmptyBody { color: var(--text-2); font-size: 13px; line-height: 1.55; max-width:
62ch }`; `.teachingEmptyAction { margin-top: 6px }`.

### FirstVisit

API `FirstVisit({ id, title, children, dismissLabel })`; dismissal persisted in
`localStorage` under `luminars.guide.${id}` = `"dismissed"`; renders `null` once dismissed.
Inline, never modal. Recipe: `.firstVisit { display: flex; align-items: flex-start;
justify-content: space-between; gap: 16px; padding: 12px 16px; border: 1px solid var(--border);
border-radius: var(--radius-md); background: var(--surface-2); margin-bottom: 16px }`;
`.firstVisitBody { flex column; gap: 3px; max-width: 68ch }`; `.firstVisitTitle { font-weight:
600; font-size: 13px }`; `.firstVisitText { color: var(--text-2); font-size: 12.5px;
line-height: 1.5 }`; `.firstVisitDismiss { flex: none; font-size: 12px; color: var(--text-2);
padding: 4px 12px; border: 1px solid var(--border-strong); border-radius: pill }` hover
`color: var(--text); border-color: var(--stone-400)` → becomes `Button variant="quiet"
size="xs"`.

### Term (explained word + tooltip)

API `Term({ label?, explain, children?, marker: "icon" | "none" = "icon" })`. Marker policy
(owner 2026-08-22): `?` glyph after plain words; nothing on a chip/badge/dot (already an object);
the dotted underline is retired. Recipe: `.term { position: relative; cursor: help;
outline-offset: 2px }`; `.termMarker { display: inline-block; width: 12px; height: 12px;
margin-left: 4px; border: 1px solid var(--border-strong); border-radius: 50%; font-family:
var(--font-mono); font-size: 9px; font-weight: 500; line-height: 10px; text-align: center;
letter-spacing: 0; text-transform: none; color: var(--text-3); vertical-align: middle;
transition: color 140ms, border-color 140ms }`; hover/focus-visible marker `color: var(--text);
border-color: var(--stone-400)`. Tip: `.tip { position: fixed; z-index: 70; width: max-content;
max-width: 260px; padding: 8px 10px; border-radius: var(--radius-sm); background-color:
var(--stone-900); color: var(--stone-50); font-family: var(--font-sans); font-size: 12px;
font-weight: 400; line-height: 1.45; letter-spacing: 0; text-transform: none; text-align: left;
white-space: normal; box-shadow: var(--shadow-panel); animation: tipIn 130ms ease-out }`,
`@keyframes tipIn { from { opacity: 0; transform: translateY(2px) } }`. `.srOnly` = the
standard clip pattern.

Behaviour to keep: `tabIndex=0` anchor with `aria-describedby` pointing at an **always-present**
sr-only span (the tip itself is `role="tooltip" aria-hidden`); open delay 180 ms, close grace
120 ms (WCAG 1.4.13 hoverable — entering the tip cancels the close); focus opens immediately,
blur closes, Escape blurs (dismissible); portalled to body, `position: fixed`, measured in
`useLayoutEffect`; preferred above (`GAP 7`), falls below if `top < EDGE 10`; horizontally
centred and clamped to `[10, innerWidth − width − 10]`; closes on capture-phase scroll and resize.
Unified: shadcn `Tooltip` (Radix) skinned with the `.tip` recipe + a `Term` wrapper that adds the
marker and the sr-only description; keep `delayDuration={180}` and the scroll-close listener.

---

## 18. Feed / FeedItem (RF) · Avatar + TenantBadge (RF) · Luminars account row

### Feed (RF only)

API `Feed({children})` → `<ul class="feed">`; `FeedItem({ actorKind: "human"|"ai"|"system",
actorLabel, time, dateTime, machineLabel?, children })` → `<li><span class="actor
actor--human|--machine">{initials | "AI" | "SYS"}</span><div><p>{children}{machineLabel &&
<span class="by-ai">}</p><time class="num" dateTime>…</time></div></li>`.

Recipe: `.feed { padding: 6px 16px 16px (0.375rem 1rem 1rem); list-style: none; margin: 0 }`;
`li { display: grid; grid-template-columns: 26px 1fr; gap: 12px; padding: 11px 0; border-bottom:
1px solid var(--app-line) }` (last: 0); `.actor { width: 26px; height: 26px; display: grid;
place-items: center; font-size: 9px; font-weight: 600; letter-spacing: 0.02em }`;
`.actor--human { border-radius: 50%; background: var(--stone-200); color: var(--stone-700) }`;
`.actor--machine { border-radius: 6px; background: var(--app-panel); border: 1px dashed
var(--stone-400); color: var(--stone-600); font-family: var(--font-mono); font-size: 8px }`;
`p { font-size: 13px; line-height: 1.45 }`; `strong { font-weight: 500 }`; `time { display:
block; margin-top: 3px; font-family: var(--font-num); font-size: 11px; color: var(--text-faint) }`;
`.by-ai` as §9. Contract (03): "Humans: round avatar, initials. Machines: square dashed-border
tile … The round/square + solid/dashed distinction is the human/machine contract." Luminars has
the same idea in its executor hues (`--exec-agent` etc., "agent = dashed AI-step chip") and
DESIGN.md "actor badges" — but no feed primitive; Home's `.attentionRow` / `.runRow` lists are
plain flex rows (`padding: 13px 16px` / `9px 2px`, hairline between).

Unified: `Feed` / `FeedItem` as RF, `ActorBadge kind="human"|"ai"|"system"` extracted (26px;
human circle stone-200/stone-700; machine 6px dashed stone-400 mono 8px).

### Avatar

| | Luminars shell `.avatar` | RF `.avatar` | RF `.tenant__logo` |
|---|---|---|---|
| size | 24×24 | 27×27 | 28×28 |
| shape | 50% | 50% | 8px |
| fill / text | `background: var(--canvas-deep); border: 1px solid var(--border-strong); color: var(--text-2)` | `background: var(--stone-300); color: var(--stone-800)` | `background: var(--stone-900); color: var(--stone-0)` |
| font | mono 9.5px, `letter-spacing: 0.04em` | 10px 600 | 11px 600 `0.01em` |
| initials | first letter of first two words, uppercase (identical `initials()` in both repos) | same | same; `<img>` with `object-fit: cover` when `logoUrl` |

Account / tenant rows: Luminars `.accountRow { flex; align-items: center; gap: 9px; padding:
6px 8px }`, `.accountName { 12.5px; 500; color text; ellipsis }`, `.accountRole { mono 9.5px;
uppercase; 0.08em; 400; text-3 }`. RF `.tenant { flex; align-items: center; gap: 10px; padding:
6px 8px 16px }`, `.tenant__name { 500; -0.01em; 14px }`, `.tenant__plan { 11px; text-faint }`.

Unified: `Avatar size="sm"(24)|"md"(27) variant="outline"(Luminars)|"filled"(RF)`; `TenantTile`
(28px square ink tile, `img` fallback) separate; `IdentityRow({ avatar, name, detail })` covers
both rows (detail mono-caps on Luminars, sentence on RF — a scope choice).

---

## 19. Eyebrow + `.num` (both) + RF `SectionHead`

Recipes in §0.4 / §0.5. RF `Eyebrow({ index?, tint?, className, children })` → `<span
class="eyebrow">{index && <b>}{children}</span>` with `style={{ color: var(--unit-${tint}) }}`.
RF `SectionHead({ index?, eyebrow, title, lead?, serifLead?, align: "start"|"center", className })`
→ `<div class="section__head" data-reveal><Eyebrow/><h2 class="h2"/><p class?="serif"/></div>`;
`.section__head { max-width: var(--measure-head); margin-bottom: clamp(2.5rem, 4vw, 3.5rem) }`;
`.section__head .eyebrow { display: block; margin-bottom: 1.25rem }`; `p { margin-top: 1rem;
color: var(--text-muted); max-width: var(--measure-lead) }`; `--center { max-width: 56ch;
margin-inline: auto; text-align: center }` (`p` 48ch); `.h2 { font-family: var(--font-display);
font-size: clamp(2.25rem, 4vw, 3.5rem); font-weight: 700; line-height: 1.04; letter-spacing:
-0.02em; text-wrap: balance }`.

Unified eyebrow scale (one component, `size`):

| size | px | tracking | used for |
|---|---|---|---|
| `xs` | 9.5 | 0.08em | Luminars account role; RF `.tag` (9 / .07em) |
| `sm` | 10 | 0.08em | table heads (RF), Badge, RF `.nav-group` (.11em → normalise) |
| `md` (default) | 10.5 | 0.09em | Luminars `.eyebrow`, nav group labels, card eyebrows |
| `lg` | 12 | 0.14em | RF marketing `.eyebrow` |

Always `font-mono font-medium uppercase`; colour `text-3` (stone-550) — RF's stone-500 /
stone-400 eyebrows should move up one step for AA. `index` (warm `b`) and `tint` stay marketing
props. Mapping: Luminars `.eyebrow` → `<Eyebrow>`; RF `Eyebrow` → `<Eyebrow size="lg" index
tint>`; RF `.nav-group` → `<Eyebrow size="sm">`.

---

## 20. Nav item / sidebar row (both shells)

### API today

Luminars: no component; `Shell.tsx` renders `<button class={navItem | navItemActive}><Icon
class=navIcon/><span class=navLabel/>{badge}</button>` (buttons, not links; no `aria-current`).
RF: `navItemClassName({ off? })` → `"nav-item nav-item--off"` applied by the app's own `<Link>`;
`NavItemContent({ icon, label, count?, tag?, tagAction? })`; active = `[aria-current]`.

### Recipe

| | Luminars `.navItem / .navItemActive` | RF `.nav-item` |
|---|---|---|
| layout | `display: flex; align-items: center; gap: 8px; text-align: left` | `display: flex; align-items: center; gap: 9px (0.5625rem); text-decoration: none` |
| padding / radius | `5px 8px`; `var(--radius-sm)` 6px | `7px 8px (0.4375rem 0.5rem)`; 7px |
| font / colour | 13px; `var(--text-2)` | inherits 14px; `var(--text-muted)` |
| icon | 16px intrinsic, stroke 1.5; `.navIcon { display: inline-flex; flex: 0 0 auto; color: var(--text-3) }`; active/hover `color: inherit` | `svg { width: 15px; height: 15px; flex: none; opacity: 0.75 }` stroke 1.4 |
| label | `.navLabel { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap }` | bare text |
| hover | `background: var(--canvas-deep); color: var(--text)` | `background: var(--stone-200); color: var(--text)`; `transition: background-color .14s, color .14s var(--ease)` |
| active | `background: var(--canvas-deep); color: var(--text); font-weight: 500` (same ground as hover, weight is the difference) | `[aria-current] { background: var(--app-panel); box-shadow: inset 0 0 0 1px var(--app-line); color: var(--text); font-weight: 500 }` — white pill + inset hairline |
| count | `.badge { display: inline-block; min-width: 18px; padding: 0 5px; border-radius: 9px; background: var(--ink); color: var(--stone-0); font-size: 11px; text-align: center }` (open decisions only) + `.num` | `.nav-item__count { margin-left: auto; font-family: var(--font-num); font-size: 12px; color: var(--text-faint) }` (plain number) |
| off / upsell | — | `.nav-item--off { color: var(--stone-400) }`; hover `var(--text-muted)`; `.tag` / `.tag--action` (§9) |
| ≈ height | 29 | 36 |

### Recommended unified API

```ts
<NavItem asChild? active icon label count? countVariant="pill"|"plain" tag? off?>
variant: "tinted" (Luminars canvas-deep) | "raised" (RF white + inset ring)
```

Render `aria-current="page"` when active in both (Luminars should adopt it). Mapping: Luminars
`.navItemActive` → `active variant="tinted"`; shell `.badge` → `count countVariant="pill"`;
RF `nav-item[aria-current]` → `active variant="raised"`; `nav-item__count` → `countVariant=
"plain"`; `nav-item--off` → `off`; `tag/tagAction` → `tag` + `Badge variant="action"`.

---

## 21. Icons

| | Luminars `kit/icons.tsx` | RF `app/icons.tsx` | RF chip glyphs (`chip.tsx`) |
|---|---|---|---|
| API | one component per icon: `IconHome, IconProcesses, IconRuns, IconConnections, IconTimeline, IconNotifications, IconCompany, IconSettings, IconPanelLeft, IconChevronUpDown, IconMore` (`SVGProps` spread) | `Icon({ name, …svgProps })`, `IconName = dashboard \| leads \| pipeline \| quote \| contacts \| form \| spark \| calculator \| star \| lock \| doc \| building \| chart \| globe \| box \| team \| catalog \| settings` | inline per tone |
| grid | `viewBox="0 0 24 24"` | `viewBox="0 0 16 16"` | `0 0 12 12` |
| intrinsic size | `width=16 height=16` | none — sized by CSS (`.nav-item svg 15px`, `.chip svg 11px`) | none (11px via `.chip svg`) |
| stroke | `1.5`, `strokeLinecap="round"`, `strokeLinejoin="round"` | `1.4`, **no linecap/linejoin** (butt/miter defaults) | 1.6 (check, ×), 1.5 (!) |
| fill | `none`; `IconMore` uses filled `r=1.4` circles ("a 1.5-stroke ring would only smear at 16px") | `none` | `none` |
| colour | `currentColor` | `currentColor` | `currentColor` |
| a11y | `aria-hidden: true` | `aria-hidden="true"` | — |

Unified: one `Icon name size=16 strokeWidth=1.5` on the 24-grid with round caps (Luminars),
re-drawing RF's 18 names; `size` prop replaces CSS sizing; RF nav uses `size={15}` and
`className="opacity-75"` if that look is kept. Keep `IconMore` filled. Mapping: Luminars
`IconX` → `<Icon name="x">`; RF `<Icon name>` → same, add `size`.

---

## 22. Marketing-only primitives (RF, kept verbatim, not for the product surface)

- `.wrap { width: 100%; max-width: var(--measure) (1280px); margin-inline: auto;
  padding-inline: var(--gutter) (clamp(1.25rem, 4vw, 3rem)) }`.
- `Canvas({ img, pos?, grainOpacity?, duotone?, marks?: boolean|"light", wash?, reveal?,
  className?, style?, children })` → `<figure class="canvas [canvas--duo]" style={--img,
  --img-pos, --grain-o, --wash} data-reveal?><div class="canvas__img" aria-hidden/>[<span
  class="marks [marks--light]" aria-hidden/>]{children}</figure>`. Layers: `.canvas { position:
  relative; border-radius: var(--radius-img) (8px); overflow: hidden; isolation: isolate }`;
  `.canvas__img { position: absolute; inset: 0; z-index: 0; background-image: var(--img);
  background-size: cover; background-position: var(--img-pos, center) }`; `::before` wash z1
  `var(--wash, linear-gradient(180deg, rgba(246,243,238,.10) 0%, rgba(14,13,10,.05) 55%,
  rgba(14,13,10,.22) 100%))`; `::after` grain z2 `background-image: var(--grain);
  background-size: 240px 240px; opacity: var(--grain-o, 0.14)`; `.canvas > *:not(.canvas__img)
  { position: relative; z-index: 3 }` ("the :not() is load-bearing"); `.canvas--duo .canvas__img
  { filter: grayscale(1) sepia(1) hue-rotate(178deg) saturate(2.4) brightness(0.82)
  contrast(1.05) }`. **No `mix-blend-mode` anywhere** (froze the compositor).
- `.marks { position: absolute; inset: 14px; z-index: 4; pointer-events: none; --mk:
  rgba(14,13,10,.5); background: linear-gradient(var(--mk), var(--mk)) top left / 6px 6px
  no-repeat, … top right …, … bottom left …, … bottom right … }`; `.marks--light { --mk:
  rgba(246,243,238,.75) }`; `marketing.css` re-asserts `.canvas > span.marks { position:
  absolute; inset: 14px; z-index: 4 }` at higher specificity.
- `.panel` (marketing) `{ background: var(--stone-0); border: var(--hairline) solid
  rgba(14,13,10,.12); border-radius: var(--radius-panel) (6px); box-shadow: var(--shadow-panel);
  overflow: hidden }`; `.plot { background: var(--bg-raised); border: 1px solid var(--line);
  border-radius: var(--radius-plot) (8px) }`.
- Reveal motion: `.js [data-reveal] { opacity: 0; translate: 0 22px; transition: opacity .75s
  var(--ease-out) var(--d, 0s), translate .75s … }`; `.in-view { opacity: 1; translate: 0 0 }`;
  reduced-motion removes it.

---

## 23. Reduced motion

Luminars: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after {
animation-duration: 0.01ms !important; transition-duration: 0.01ms !important } }` (global).
RF: per-feature (`.js [data-reveal]` reset; marketing.css §"Reduced motion"). Unified: the
Luminars global rule; it also kills `dotPulse`, `menuIn`, `tipIn`.

---

## 24. Migration map (one line per old surface)

| Old | New |
|---|---|
| L `Button tone=primary\|quiet\|danger size destructive pressed` | `Button variant=primary\|quiet\|danger size destructive pressed` |
| L `.menuTrigger`, `.sidebarToggle` | `Button variant="ghost" size="icon"` |
| L `.firstVisitDismiss` | `Button variant="quiet" size="xs"` |
| RF `AppButton` / `AppButton quiet` / `AppButtonLink` | `Button variant="primary"` / `variant="quiet"` / `asChild` |
| RF `Btn variant size href` / `btnClass` | `MarketingButton variant size asChild` |
| L `BackLink` / shell `.backLink` | `BackLink variant="inline"` / `variant="nav"` |
| RF `.link` | `TextLink` (marketing) |
| L `Segmented` | `Segmented variant="raised"` |
| RF `.seg` | `Segmented variant="divided"` |
| L `FilterChip active` | `Toggle variant="chip" pressed` |
| L `Menu label items` | `DropdownMenu` skinned; trigger `Button ghost icon` |
| L `Input mono` / `Textarea` / `Select` | `Input mono` / `Textarea` / `NativeSelect` |
| RF `.field`, `.field label`, `.form-error` | `Field`, `FieldLabel`, `FieldError` |
| RF `.search` | `Input variant="search"` |
| L `Badge` / `Badge dashed` | `Badge variant="outline"` / `variant="dashed"` (pill) |
| RF `.tag` / `.tag--action` / `.by-ai` / `.assistant__tool` | `Badge shape="square" variant=outline / action / dashed / dashed` |
| L `Chip tone dot emphasis` | `Chip variant="outline" tone indicator emphasis` |
| RF `StatusChip tone=neutral\|good\|warn\|lost` | `Chip variant="tint" tone=quiet\|ok\|warning\|attention` |
| L `StatusDot tone live` | `StatusDot tone live` |
| L `Notice` / RF `EmptyState` | `Notice variant="card"` / `variant="plain"` |
| RF `UpsellPanel` | composition: `Card` + `Eyebrow` + body + `actions` |
| L `Card as tone elevated padded` | `Card` (same) |
| RF `Panel` / `PanelHead` | `Card padded={false}` / `CardHeader title context` |
| L `Page width pad` / `PageHead title subtitle actions size` | same |
| RF `Page` / `PageHead` | `Page width="full" stack` / `PageHead` |
| L `Table bleed align rowHeight` + `td[data-num]` | `Table` (same) + `TableCell num` |
| RF `TableWrap` + `.data` + `.c-num/.c-name/.c-muted` | `Table minWidth hoverable headFill` + `num` / `font-medium` / `text-text-2` |
| RF `StatGrid` / `Stat` | `StatGrid variant="cells"` / `Stat` |
| L Home `Kpi` | `StatGrid variant="cards"` / `Stat teach` |
| L `TeachingEmpty` / `FirstVisit` / `Term` | same names; `Term` on shadcn `Tooltip` |
| RF `Feed` / `FeedItem` | same; `ActorBadge` extracted |
| RF `Avatar` / `TenantBadge` / L `.avatar`+`.accountRow` | `Avatar variant` / `TenantTile` / `IdentityRow` |
| L `.eyebrow` / RF `Eyebrow index tint` / RF `.nav-group` | `Eyebrow size="md"` / `size="lg" index tint` / `size="sm"` |
| L `.navItem` / RF `nav-item` | `NavItem variant="tinted"` / `variant="raised"` |
| L `IconX` / RF `Icon name` | `Icon name size` |
| L `.num` / RF `.num` | `.num` (mono + tabular) / `.tabular` |
