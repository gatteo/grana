# Porting the marketing surface into Grana

The Revenue Farm marketing kit (`~/projects/revenuefarm/platform/packages/ui/src/marketing/*.tsx`
over `styles/marketing.css` + `styles/base.css`) becomes the `marketing` registry group. The
components are thin React wrappers over BEM classes today; here they are Tailwind-authored on the
Grana tokens like every other item.

**The gate is that the live site does not move.** Every number in `marketing.css` is a measured
decision — copy it. Where a value has a token, use the token; where it does not, use the arbitrary
value (`px-[23px]`, `top-[0.68em]`). Never round a number to "a nicer one".

## 1. Read these, in this order

1. `CONVENTIONS.md` — the builder contract. Everything in it holds here too.
2. The component's source: `packages/ui/src/marketing/<name>.tsx` (props, structure, JSDoc).
3. Its CSS: every rule for the classes that file uses, in `packages/ui/src/styles/marketing.css`
   (and `base.css` for `.btn` `.canvas` `.panel` `.plot` `.wrap` `.eyebrow` `.display` `.h2` `.h3`
   `.lead` `.serif` `.metric` `.link` `[data-reveal]`). Read the media queries too — the
   breakpoints are part of the recipe.
4. `docs/guidelines/02-marketing-site.md` + `05-imagery.md` for the *why* behind a number.

## 2. The token map — old CSS var / class → Grana

| RF | Grana |
|---|---|
| `--bg` | `bg-background` |
| `--bg-raised` | `bg-card` |
| `--bg-sunken` | `bg-muted` (= ecru-deep on paper) |
| `--bg-inverse` | `bg-inverse` |
| `--text` | `text-foreground` |
| `--text-muted` | `text-muted-foreground` |
| `--text-faint` | `text-faint` **(now stone-550, not stone-500 — a deliberate AA fix)** |
| `--text-inverse` / `--text-inverse-muted` | `text-inverse-foreground` / `text-inverse-muted` |
| `--line` / `--line-strong` | `border-border` / `border-border-strong` |
| `--line-inverse`, `rgba(246,243,238,.16)` | `border-inverse-line` (0.14 — see deviations) |
| `--accent` (ink action) | `bg-primary` / `text-primary` |
| `--accent-warm`, `--accent-warm-dark` | `text-ochre`, `text-ochre-dark` |
| `--unit-<u>` | `text-unit-<u>` / `bg-unit-<u>` |
| `--font-display/sans/mono/serif` | `font-display` / `font-sans` / `font-mono` / `font-serif` |
| `.num` **on the marketing surface** (tabular figures, face untouched) | the `tabular` utility |
| `font-family: var(--font-num)` + tabular (the mono readout) | the `num` utility |
| `--fs-display/h2/h3/lead/metric` | the `display` / `h2` / `h3` / `lead` / `metric` **utilities** (face+size+weight+leading+tracking in one class), or `text-display/h2/h3/lead/metric` for the size alone |
| `--fs-body` 1rem | the surface default — say nothing |
| `--fs-sm` .875rem / `--fs-xs` .8125rem | `text-sm` / `text-[13px]` |
| `--fs-eyebrow` + `--ls-eyebrow` | the `eyebrow` utility (it widens on `data-surface="marketing"` by itself) |
| `.eyebrow` + `<b>` index | `<Eyebrow size="lg" index="01">` from `@/registry/grana/ui/eyebrow` |
| `.section__head` | `<SectionHead>` from the same file — it already carries the measures |
| `--measure` 1280 / `--measure-text` / `--measure-head` / `--measure-lead` | `max-w-measure` / `max-w-text` / `max-w-head` / `max-w-lead` |
| `--gutter` / `--space-section` / `--frame` | `px-gutter` / `py-section` / `p-frame` |
| `.wrap` | `<Wrap>` (from `@/registry/grana/ui/section`) |
| `.section`, `.section--sunken` | `<Section>` / `<Section variant="sunken">` |
| `--radius-sm` 4px | `rounded-xs` |
| `--radius-panel` 6px | `rounded-sm` |
| `--radius-img` / `--radius-plot` 8px | `rounded-img` |
| `--app-shell-radius` 14px | `rounded-lg` |
| `--radius-pill` | `rounded-full` |
| `--hairline` | `border` (1px is the only hairline) |
| `--shadow-card` / `--shadow-panel` | `shadow-card` / `shadow-panel` (the marketing surface already carries the deeper values) |
| `--ease` / `--ease-out` | `ease-brand` / `ease-brand-out` |
| `--grain` | the `grain` utility, or `bg-[image:var(--grain)]` when you need a custom opacity |
| `--dots` + `--dots-size` | `bg-[image:var(--dots)] bg-[length:var(--dots-size)]` |
| `.btn`, `.btn--primary/quiet/on-dark/ghost-dark`, `.btn--sm` | `<Button>` — `variant="primary" / "glass" / "on-dark" / "glass-dark"`, `size="sm"`. **The marketing geometry is automatic on `data-surface="marketing"`; never pass a size for the default one.** |
| `.link` | the `link` utility |
| `.panel` / `.plot` | `<Panel>` / `<Plot>` (`@/registry/grana/ui/panel`) |
| `.canvas`, `.canvas__img`, `.canvas--duo`, `.marks` | `<Canvas>` (`@/registry/grana/ui/canvas`) |
| `[data-reveal]`, `--d` stagger | keep the attribute and the `--d` variable; the stylesheet owns the rest |
| `.js` gate | the stylesheet owns it; `<RevealObserver>` sets it |

| the firmer hairline around a picture of the product, `rgba(14,13,10,.12)` | `border-line-artefact` |
| the four unit tints as a type | `import type { UnitTint } from "@/registry/grana/ui/eyebrow"` |

Anything with no row here: say so in your report rather than inventing a token.

**Two measured traps.** A fluid size needs the type hint — `text-[length:clamp(…)]`, because
`text-[clamp(…)]` compiles to nothing. And the marketing surface re-points every text size's
leading at the body's 1.6 (`--lh-xs|sm|base|lead`), so `text-sm` on paper already means 14/22.4 —
do not add `leading-[1.6]`; only override where the CSS declared a line-height of its own.

## 3. Rules specific to this port

- **Layer order inside a canvas is load-bearing.** image z0 · wash z1 · grain z2 · content z3 ·
  marks z4, `isolation: isolate`, plain alpha, never a blend mode.
- **The reveal attribute travels.** A component that took `reveal?: boolean` keeps it and still
  emits `data-reveal`; a component that hard-coded `data-reveal=""` keeps doing that.
- **Keep the props.** The old prop name is the API two products already write. Rename only where
  this document says so (`Stat`/`StatBand` → `ProofStat`/`ProofBand`, because the product `Stat`
  already exists and one exported name may not live in two files).
- **Keep the semantics**: `<figure>`, `<dl>/<dt>/<dd>`, `<blockquote>/<cite>`, `aria-hidden` on
  decorative layers, `<h2>`/`<h3>` levels as they are today.
- **Italian, long.** Stories use the real Italian copy from the site, not "Lorem".
- `cva` only where a component has real variants; a single-shape component is a plain `cn()`.
- `data-slot` on every root and on every meaningful inner element (design-sync's render check
  reads them).
- Media queries become Tailwind's `max-*` variants (`max-md:` etc.) **only when the breakpoint
  matches Tailwind's scale**; otherwise use the arbitrary form `max-[880px]:`. The CSS
  breakpoints here are 560 / 760 / 820 / 860 / 880 / 900 / 940 / 1000 / 1020 / 1180 — treat them
  as arbitrary values, do not snap them to `sm/md/lg`.

## 4. Done means

- The file is at `registry/grana/ui/<item>.tsx`, the story at
  `playground/stories/<item>.stories.tsx`. The item is **already declared** in
  `registry/groups/marketing/registry.json` — do not edit that file; report any correction needed
  (dependencies, registryDependencies, description).
- `pnpm typecheck && pnpm lint` green (run from the repo root; do not run `registry:build`, the
  lead does).
- The story renders under **both** brands and the **marketing** surface in the playground
  (`pnpm dev`, port 5180 — the lead starts it; the switcher is in the top bar). Verify with a
  screenshot (`node scripts/shot.mjs <story-id> rf marketing`), do not assume.
- Your report: the old→new prop mapping, every number you could not express with a token, every
  deliberate deviation from the CSS and why, and anything you could not verify.
