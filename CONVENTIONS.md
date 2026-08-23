# Grana — builder conventions

Grana is the shared design system for **Revenue Farm** and **Luminars**: one set of tokens and
components, two brands, two surfaces, consumed by copy through the shadcn CLI. This file is the
contract every component in `registry/grana/` follows. Read it fully before writing a line.

## 1. Layers and what lives where

| Layer | Where | Shared? |
|---|---|---|
| L0 tokens | `registry/grana/styles/grana.css` (+ `fonts.css`, `public/fonts`) | yes — **never edited by builders**; ask in your report |
| L1 primitives | `registry/grana/ui/*.tsx` — Button, Badge, Chip, Input, Card, Table, Dialog, Menu… | yes, verbatim |
| L2 patterns | `registry/grana/ui/*.tsx` too (flat; a pattern is still a ui item) — PageHead, StatGrid, TeachingEmpty, Feed… | yes |
| L2 marketing | `registry/grana/ui/*.tsx` too, group `marketing` — Canvas, Section/Wrap, the bands, the heroes, the cards, the product fragments | yes |
| L3 shells & pages | per product (Luminars' inset shell + agent rail; RF's big-card shell, its site header/footer and its 42 marketing pages) | no — built FROM L1/L2 in the product repo |

Everything in `registry/grana/ui/` installs into a consumer's `components/ui/`. Keep it flat.

## 2. The stack idiom (non-negotiable)

- **Base UI** primitives (`@base-ui/react/*`), **cva** variants, `cn()` from `@/lib/utils`,
  `data-slot="…"` on every root element, `useRender` + `mergeProps` for polymorphic elements.
  The stock shadcn files already in `registry/grana/ui/` show the idiom — re-skin them, keep their
  structure and export names, so shadcn documentation and agents' prior knowledge still apply.
- Imports: `@/lib/utils` and `@/registry/grana/ui/<name>` only. **Never relative imports between
  components** (the CLI rewrites the aliases on install; relative paths break).
- **No `dark:` classes.** Both products are light-only by design. Strip every `dark:` from stock code.
- **No raw colours, ever** (DSN-7). Only theme utilities: `bg-card`, `border-border`,
  `text-foreground`, `text-muted-foreground`, `text-faint`, `bg-accent` (hover fill), `bg-muted`
  (sunken fill), `bg-secondary`, `bg-primary text-primary-foreground` (the ink ground),
  `text-status-good|warning|serious|critical|info`, `bg-exec-agent-soft text-exec-agent`,
  `bg-unit-demand`, `text-ochre`, `bg-inverse text-inverse-foreground`, `bg-stone-50`… If a value
  you need has no utility, say so in your report — do not invent one inline.
- **Radii: `rounded-xs` 4 · `rounded-sm` 6 · `rounded-md` 10 · `rounded-lg` 14 · `rounded-full`.**
  Nothing else (`xl`+ alias to 14 so stock code cannot invent radii). Buttons and chips are pills.
- **Borders are 1px hairlines** in `border-border` (`border-border-strong` for modals/frames). Never
  2px, never coloured borders except the destructive/invalid state.
- **Shadows:** `shadow-card` / `shadow-panel` only, and only where the skin spec says. The RF product
  surface nulls them through the tokens — you do not need to special-case it.
- **Focus:** the stylesheet paints ONE global `:focus-visible` outline (2px, `--ring`, offset 2).
  Remove the stock `outline-none` and `focus-visible:ring-*` classes; let the global outline show.
  Fields included (the gold outline is the field's focus state in Luminars).
- **Type:** `font-sans` is inherited — don't repeat it. Numbers: the `num` utility (mono, tabular)
  on every numeric readout, or `tabular` when the figures must stay in the sans. Section labels:
  the `eyebrow` utility — it takes the product recipe (10.5px/.09em) or the paper one
  (12px/.14em) from the surface, by itself. The product's voice moments (page titles, onboarding
  headlines): the `voice` utility — the brand decides which face that is.
  Sizes from the spec, via Tailwind's scale (`text-sm` 14, `text-xs` 12) plus `text-13` and
  `text-2xs` (10.5). Arbitrary px (`h-[30px]`, `px-[9px]`) is fine when the spec gives a number.
  Two traps measured in the marketing port: a fluid size needs the type hint —
  `text-[length:clamp(...)]`, because `text-[clamp(...)]` compiles to **nothing**; and `text-13` /
  `text-2xs` carry a line-height of their own, so a place that must inherit the surface's leading
  wants the plain arbitrary size (`text-[13px]`) instead.
- **Icons:** `lucide-react`, stroke 1.5–1.75, sized by the component (`[&_svg]:size-3.5`). The
  products' hand-drawn nav icons stay in the products.
- Both brands, both surfaces: a component must look right under `data-brand="luminars"` and
  `"rf"`, and under `data-surface="app"` and `"marketing"`. It reads tokens, so it usually just does;
  verify in the playground's switcher.

## 2b. The two registers

The same components serve a product surface and a marketing surface. Almost everything is one
recipe reading tokens that differ per surface — but where a component genuinely reads differently
on paper, the difference is declared IN the component with `in-data-[surface=marketing]:`, never
by forking the component. Two live examples:

- `Button` keeps one API; on paper its `md`/`sm` sizes drop the fixed height for the padding-driven
  field recipe (the RF `.btn`). A marketing page writes `<Button variant="primary">` and gets a
  50px pill; the same line in the product gets a 34px one.
- `Prose` keeps one API; `variant="editorial"` is an article on paper (display headings, a 62ch
  measure, ruled links, dash markers) against the default product register.

The marketing register also owns six composite type utilities — `display`, `h2`, `h3`, `lead`,
`metric`, `serif` — plus `link`, the field geometry (`px-gutter`, `py-section`, `p-frame`,
`max-w-measure|head|lead|text`), `rounded-img`, and the entrances (`animate-rise`,
`animate-img-settle`, `animate-stake-in`, always behind the `[.js_&]` gate). They read the
surface's scale, so the same class is a product heading in the app and a field-sized one on paper.
Textures for stories live in `public/img` and travel into the design bundles.

## 3. The visual truth

`docs/skin-spec.md` holds the measured recipe of every component as it exists in the two products
today (heights, paddings, faces, weights, colours by token, every state, and the two kits'
differences). **Copy its numbers.** Where the two kits disagree and the spec gives a unified
recommendation, follow it; where it flags a judgement call, pick the Luminars value and say so in
your report. `docs/guidelines/` carries the design rules behind the numbers.

Rules of thumb that override any stock default:
- A status is a **dot + word**, never colour alone. Chips report a STATE; Badges name a PROPERTY;
  a dashed Badge means *inferred, not asserted*.
- One ink primary per screen. Every other verb is quiet. Destructive is a two-step ladder
  (quiet-but-warms-to-critical → critical-at-rest).
- Numerals are never proportional. Eyebrows are mono uppercase. Borders and fills come from the
  stone ramp; status colours never decorate.
- Layered UI (menus, tooltips, popovers, dialogs) is portalled and `fixed` — every product surface
  scrolls inside an inset panel, and a clipping ancestor would cut an absolutely-positioned layer.
- Empty states teach: they carry the one action that fills them.

## 4. Files you own

A builder owns exactly: their components in `registry/grana/ui/`, their stories in
`playground/stories/`, and their group's registry file `registry/groups/<group>/registry.json`.
Nothing else. Token or convention gaps go in the final report, not into shared files.

### Component file
`registry/grana/ui/<kebab-name>.tsx`. One component family per file (Card + CardHeader + … in
`card.tsx`). Export PascalCase components and the `xxxVariants` cva where one exists. Props extend
the primitive's props; `className` is always accepted and merged last.

### Story file
`playground/stories/<kebab-name>.stories.tsx`, default-exporting a React component. Use the helpers
from `@/playground/lib/story` (`Story`, `Row`, `Label`). Show every variant × size, every state
(hover can't be shown — show `data-pressed`, disabled, invalid, dashed, selected…), a realistic
composed example (a row in a table, a chip next to text), and long/Italian-length content.
The playground discovers stories by glob — no registration needed.

### Registry item
Append to `registry/groups/<group>/registry.json`:

```json
{
  "name": "chip",
  "type": "registry:ui",
  "title": "Chip",
  "description": "A status the thing is in: dot + word, six tones.",
  "dependencies": ["class-variance-authority"],
  "registryDependencies": ["@grana/status-dot"],
  "files": [{ "path": "registry/grana/ui/chip.tsx", "type": "registry:ui" }]
}
```

`dependencies` = npm packages the file imports. `registryDependencies` = sibling grana items, always
namespaced `@grana/<name>` (a bare name resolves to shadcn's built-in, not ours). `pnpm
registry:build` merges every group file into the root `registry.json` (generated — never edit it
by hand) and must pass with your items in. Item file paths are repo-relative.

Custom font sizes (`text-2xs`, `text-13`, `text-metric`) are safe with `cn()` — `lib/utils.ts`
teaches tailwind-merge the names and ships to consumers as `@grana/utils`. Prefer them over
`text-[13px]`.

## 5. Done means

- `pnpm typecheck && pnpm lint && pnpm registry:build` green.
- The story renders every variant/state under both brands with no console errors (`pnpm dev`, port
  5180; verify with the browser tools or a Playwright screenshot — do not assume).
- No `dark:`, no raw colour/hex, no radius outside the scale, no `outline-none`, no relative imports.
- Numbers match `docs/skin-spec.md`; deviations are listed in your report with a reason.
- Keyboard and ARIA behaviour of the stock primitive is intact (you re-skinned, you did not rewrite).
- Your final report: components shipped (name → file), the old-API → new-API mapping lines for both
  products (e.g. `Luminars <Button tone="primary"> → <Button variant="primary">`; `RF .btn--quiet →
  variant="quiet"`), deviations from the spec, token/convention gaps, and anything you could not
  verify.

## 6. Naming map (old → new), the shared vocabulary

| Concept | Luminars today | RF today | Grana |
|---|---|---|---|
| Ink button | `tone="primary"` | `.btn--primary` / `AppButton primary` | `variant="primary"` |
| Hairline button | `tone="quiet"` | `.btn--quiet` / `.btn--ghost` | `variant="quiet"` |
| Destructive rung 1 | `tone="quiet" destructive` | — | `variant="quiet" destructive` |
| Destructive commit | `tone="danger"` | — | `variant="danger"` |
| On-image / on-dark button | — | `.btn--on-dark`, glass secondary | `variant="on-dark"`, `variant="glass"` (marketing) |
| Sizes | `xs sm md lg` | `--sm` | `xs sm md lg` (+ `icon` sizes) |
| Status state | `<Chip tone=ok…>` | `<StatusChip tone=…>` | `<Chip tone="ok|attention|serious|warning|info|quiet">` |
| Property | `<Badge dashed>` | — | `<Badge variant="outline|dashed|…">` |
| Secondary text | `--text-2` | `--text-muted` | `text-muted-foreground` |
| Faint text | `--text-3` | `--text-faint` | `text-faint` |
| Page canvas | `--canvas` | `--bg` | `bg-background` |
| Card | `--surface` | `--bg-raised` | `bg-card` |
| Hairline | `--border` | `--line` | `border-border` |
