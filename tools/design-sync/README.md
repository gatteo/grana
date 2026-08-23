# design-sync — the Claude Design bundles, generated from the registry

Both Claude Design projects — **Luminars V3 · Grana** (`dc653a61-a8aa-4714-860b-125c733cbe8d`)
and **Revenue Farm · Grana** (`975e6747-c824-495a-9e0f-42d9a5fc0505`) — are generated from
this one repo, each rendered under its own brand (owner decision D-G5, 2026-08-23). This tool
builds and validates the two bundles locally; pushing them to the projects is a separate,
manual step done with the `DesignSync` tools (see *Pushing* below).

```sh
pnpm design-sync:build        # ds-bundle/luminars + ds-bundle/rf   (≈ 20 s)
pnpm design-sync:validate     # file-shape checks + the Playwright render check, both profiles (≈ 2 min)
pnpm design-sync:diff --profile luminars --remote-sync <fetched _ds_sync.json>   # the push plan
```

Single profile: `node tools/design-sync/build.mjs --profile rf`, same flag on `validate.mjs`.
The output dir is `ds-bundle/` (gitignored); `--out <dir>` moves it.

## What a bundle is

The layout the claude.ai/design app expects (identical to what the old per-repo converter
produced, so the app's self-check, card index and incremental push all keep working):

```
ds-bundle/<profile>/
  _ds_bundle.js            the whole registry as ONE browser global, window.Grana (React external);
                           first line = /* @ds-bundle: {namespace, components, sourceHashes, …} */
  _ds_bundle.css           grana.css compiled by Tailwind v4 + the utility safelist + the brand pin
  styles.css               the entry the app reads: @import fonts/fonts.css, _ds_bundle.css
  fonts/                   the ten woff2 faces + fonts.css (bundle-relative urls)
  _vendor/react.js         react 19 + react-dom(/client) as a global (no UMD upstream)
  _preview/<Name>.js       the story page compiled against window.Grana
  components/<group>/<Name>/<Name>.{html,jsx,d.ts,prompt.md}
                           .html  = the card (first line <!-- @dsCard group="…" viewport="…" -->)
                           .jsx   = Object.assign(window, {every export of the item})
                           .d.ts  = an interface per exported component (resolved props)
                           .prompt.md = description · props · recipe notes · story examples
  guidelines/              the profile's docs + index.md
  README.md                the agent prompt header ("Building with <Product> …")
  _ds_needs_recompile      the fence the app's self-check reads
  _ds_sync.json            the sidecar: renderHashes / sourceKeys / sourceHashes / styleSha / …
  .ds-build-meta.json .review.html .render-check.json .push-plan.{json,md} _screenshots/   local only
```

`<group>` is the registry group folder: `controls · fields · status · surfaces · patterns ·
extras` — the Design System pane builds its card index from the `@dsCard group="…"` marker.

## How it works (build.mjs)

1. **The component list is the registry.** Every `registry:ui` item in
   `registry/groups/<group>/registry.json` is one card; its group is the folder it sits in
   (`lib/registry.mjs`). The card's name is the PascalCase of the item name when that is an
   export of the item's file (`back-link` → `BackLink`), else the file's first component
   export (`sonner` → `Toaster`). Every other value export of the file rides along
   (`CardHeader`, `cardVariants`, `notify`, `toast`, …): on the global, in the `.jsx`, in the
   `.d.ts`, in the prompt.
2. **Types** come from ts-morph over the real sources with the repo tsconfig (`lib/dts.mjs`):
   each component's first call-signature parameter, apparent type, props filtered to
   grana-declared + library (Base UI, cva, sonner) props — React/DOM noise dropped except
   `children/className/style/render/id`. The cva literal unions (`variant`, `size`, `tone`)
   and the JSDoc on own props are the payload. The file's top-level block comments become the
   prompt's *Notes* (the recipe rationale the builders wrote).
3. **The bundle** (`lib/bundle.mjs`): an entry of EXPLICIT named re-exports per item (a name
   exported by two files fails the build instead of being silently dropped as an ambiguous
   `export *`), `@/` resolved from the tsconfig alias, `react`/`react-dom`/`react-is`/
   `scheduler` shimmed to the window globals (the jsx-runtime shim spreads static children so
   React does not warn about keys), esbuild iife → `window.Grana` (+ `cn`, `useIsMobile`).
4. **The stylesheet** (`lib/css.mjs`): an entry that `@import`s `grana.css`, `@source`s
   `registry/grana/ui`, `playground/stories`, `playground/lib`, this tool's `lib/` (the story
   shim) and `previews/`, plus `@source inline()` safelists; compiled with `@tailwindcss/node`
   + the oxide `Scanner` (the same engine as the Vite plugin, without Vite). `@font-face`
   blocks move to `fonts/fonts.css` with `./` urls and `public/fonts/*` is copied beside them.
   For `rf` the `[data-brand="rf"]` declarations are copied onto `:root` (the *brand pin*), so
   a design that never sets the attribute still renders RF; `luminars` is grana.css's default.
5. **Previews are the stories** (`lib/stories.mjs`): `playground/stories/<item>.stories.tsx`
   is compiled per card with `@/registry/grana/ui/*` and `@/lib/utils` resolved to
   `window.Grana` and `@/playground/lib/story` to `lib/story-shim.tsx` — the same `Story /
   Row / Label` markup plus `data-ds-story="<title>"` on every section, `window.__dsOnly` to
   restrict a card to some sections and `window.__dsSurface` to render a section under
   `data-surface="marketing"`. The card mounts the story's default export; `?story=<title>`
   renders one section. Items without a story of their own point at a sibling's
   (`config.json` → `cards.label = { story: "field", only: ["Label"] }`).
6. **Emit** (`lib/emit.mjs`) writes the per-card files, `guidelines/`, `README.md` (the
   product intro from `readme/<profile>.intro.md` + the generated utility table + `readme/
   rules.md` + the component index), `.review.html`; then the header is stamped and
   `_ds_sync.json` written last (`lib/hashes.mjs`).

## Adding a component

Nothing to register here. Add the item to its group's `registry.json`, the file to
`registry/grana/ui/`, the story to `playground/stories/<item>.stories.tsx`, run the build.
If the item shares a story with another item, add a `cards.<item>` entry in `config.json`
(`story` + `only`). If some sections belong to the marketing surface, add them under
`cards.<item>.surface`. If a component file exports a name another file already exports,
the build stops — rename one.

## config.json

| Key | Meaning |
|---|---|
| `globalName` | the browser global (`Grana`) |
| `defaultViewport` | the `@dsCard viewport` (the product renders the card at this size) |
| `profiles.<p>.product / brand / projectId / projectName` | the product name in the README, the `data-brand` on every card, the Claude Design project |
| `profiles.<p>.guidelines` | repo-relative docs copied into `guidelines/` |
| `profiles.<p>.oldBundle` | the last pushed bundle (the local mirror of the project) — `diff.mjs` derives deletes from it |
| `cards.<item>.story` | use another item's story (`label` → `field`) |
| `cards.<item>.only` | render only these section titles (exact match) |
| `cards.<item>.surface` | `{ "<section title>": "marketing" }` — wrap that section in the marketing surface |
| `cards.<item>.viewport` | per-card viewport override |
| `ignoreConsole` | regexes for console errors the render check should ignore (none today) |

## Validation (validate.mjs)

File shape: the header, the sidecar recomputed from disk (render hashes and source hashes),
`styles.css`'s import closure, the utilities actually present in the css, no dangling
`/fonts/` urls, the brand pin on `rf`, every card's `@dsCard` first line and resolvable
`<link>/<script>` targets, every `.d.ts` parsed by TypeScript. Then Playwright opens EVERY
card (chromium from the root `playwright`):

- **bad** — a page error, a JS console error, a render error in the card, no story sections,
  a blank screenshot, or the stylesheet not applied (body not in General Sans).
- **thin** — every component root (`[data-slot]` elements with no `data-slot` ancestor inside
  the section) has the same computed background / border / radius / font / padding / colour /
  display as a pristine element of the same tag in a stylesheet-less iframe (the UA default),
  or nothing paints, or the rendered height is < 8px.
- **variantsIdentical** — two or more sections whose rendered HTML is byte-identical.
- Network 404s (a story's deliberate broken `<img>`) are reported apart as `[RESOURCE_404]`.

Screenshots land in `_screenshots/<group>__<Name>.png`, the set is tiled into
`contact-sheet-N.png` (16 per sheet), the verdicts in `.render-check.json`. **Read the contact
sheets** — the machine check catches errors and missing CSS, not a preview that shows the
wrong thing.

## Pushing (the lead's procedure)

1. Build + validate both profiles; read the sheets.
2. Fetch each project's current `_ds_sync.json` (`DesignSync get_file`) and run
   `node tools/design-sync/diff.mjs --profile <p> --remote-sync <file>` — it unions the
   fetched sidecar's paths with `profiles.<p>.oldBundle` and writes
   `ds-bundle/<p>/.push-plan.{json,md}`: every file to write (all of them — full writes are
   idempotent) and every remote path to delete (the old groups' cards, previews, guidelines).
   Without `--remote-sync` the deletes come from the old local bundle only; the notes below say
   why a stale anchor is worse than none.
3. Write `_ds_needs_recompile` first, then everything except `_ds_sync.json`, then the
   deletes, then `_ds_sync.json` last; `list_files` and compare.
4. Afterwards, copy `ds-bundle/<p>` over `profiles.<p>.oldBundle` (or point that key at a
   kept copy) so the next diff has the right "before".

The Luminars *screens* design file (`aa561d58…`) embeds a DS bundle under `_ds/<folder>/`
(today the RF one): replace that folder's contents with `ds-bundle/luminars/` (at least
`styles.css`, `_ds_bundle.css`, `fonts/`, `_ds_bundle.js`, `_vendor/`) so its screens render
the Luminars brand.

## Sidecar recipe (`_ds_sync.json`, `keyRecipe` 101)

- `sourceKeys[Name]` = sha256(recipe · name · brand · the item's source file · its story file ·
  an owned preview if any · the canonical `cards.<item>` config)[:16] — the grade contract:
  changed ⇒ re-verify the card.
- `renderHashes[Name]` = sha256(`_preview/<Name>.js` · the card html minus its first line, plus
  the `viewport` attr)[:16] — artifact churn; a pure regroup does not move it.
- `sourceHashes[path]` = sha256 of each `components/<g>/<Name>/<Name>.{jsx,d.ts,prompt.md}`[:12]
  (also in the bundle header); `bundleSha12`; `styleSha` = bundle body + css + styles.css +
  fonts/ + _vendor/; `auxSha` = guidelines/ + README.md.
- The old converter's recipes were 1–7; a recipe mismatch means "re-verify everything".

## What can go stale — lessons carried over from the old per-repo converters

- **The previews are the product.** An auto-generated no-props render passed the old machine
  check while showing an empty pill; the contact sheet caught it. Always look at the sheets.
  Here the previews are the stories, so a story that shows one variant shows one card.
- **A precompiled Tailwind stylesheet is a closed set.** A class no component or story uses
  and no safelist names does nothing in a design. The safelist in `lib/css.mjs` is the
  vocabulary the README promises; extend it there when the agent reaches for a family it
  lacks (the README's table and the safelist must move together).
- **The registry is the published surface.** An item in a group file is published to everyone
  designing with both products; a component not in a group file is invisible to the sync.
- **A regroup MOVES paths** (`components/<oldgroup>/<Name>/…` → `components/<newgroup>/…`);
  the old paths must be deleted or the pane shows the card twice. Only the project's current
  sidecar knows exactly what it holds — re-fetch it every push; yesterday's copy makes the diff
  describe paths the project no longer has (the old Luminars sync once asked to delete 96
  files a previous sync had already removed).
- **Fonts ship with relative urls or they ship dangling.** `fonts.css` upstream points at
  `/fonts/*` (Vite's public root); the build rewrites every face to `./` and copies the woff2s.
  A card rendering in a fallback face = check `fonts/fonts.css`; `[FONT_DANGLING]` is fatal.
- **The base reset is not optional.** Tailwind's preflight (inside `@import "tailwindcss"`)
  is what resets `button` chrome, `box-sizing`, UA margins; the old RF bundle shipped without
  one and every `.wrap` overflowed by two gutters. The compiled css carries it; never strip
  the `base` layer.
- **The brand must be pinned for RF.** grana.css defaults to Luminars without an attribute; a
  design that never sets `data-brand="rf"` would render Luminars. The pin copies the RF
  declarations onto `:root`; `[BRAND_PIN]` fails the rf validation if it is missing.
- **Surfaces nest by attribute.** `[data-surface="marketing"]` on a wrapper re-tokens that
  subtree, but `[data-surface="app"] body { font-size: 14px }` only matches `<html>`; the
  bundle adds `html:not([data-surface="marketing"]) body { 14px }` so an attribute-less design
  still reads at product size.
- **Portalled layers (Dialog, Sheet, Popover, Tooltip, Term, DropdownMenu, Select) are
  `position: fixed`** — they render over the card, never inside a cell; the open-by-default
  stories show them. A story that un-portals one would clip inside the card.
- **Props come from the checker, not a `.d.ts` tree.** The old Luminars sync shipped
  `[key: string]: unknown` for every component because the app had no declarations; here
  ts-morph resolves the real types. A component whose props collapse to `unknown` usually
  means `@types/react` or the tsconfig alias stopped resolving — the `.d.ts` still parses, so
  read one after a toolchain bump.
- **`"use client"` and React 19.** esbuild ignores the directive; React 19 ships no UMD, so
  `_vendor/react.js` is our own iife of react + react-dom/client. Bump React → the styling
  surface (`styleSha`) moves and `_vendor/` re-ships.
- **Stories are Italian and long on purpose** (Italian-length labels are a design rule); a
  card's full-page screenshot is tall and the contact-sheet tile crops it to the top-left —
  open the per-card PNG when a tile looks cut.
- **Known, accepted:** the Avatar story loads `/does-not-exist.png` to show the image
  fallback → one `[RESOURCE_404]` warning per profile, not an error.

## Dependencies

`tools/design-sync/package.json` (own `node_modules`, gitignored): `esbuild`, `ts-morph`,
`@tailwindcss/node` + `@tailwindcss/oxide` (pinned to the root `tailwindcss` version — keep
them in lockstep when bumping Tailwind). `react`, `react-dom`, `tailwindcss`, `playwright`,
`@base-ui/react`, `lucide-react`, … resolve from the repo root. After a fresh clone:
`cd tools/design-sync && pnpm install` (and `pnpm exec playwright install chromium` at the root
if chromium is missing). `tools/design-sync` and `ds-bundle` are excluded from `pnpm lint`;
`tsconfig.json` never included them.

## Push log

- **2026-08-23** — first push of both profiles by the lead through DesignSync: "Luminars V3 · Grana"
  (`dc653a61…`, 282 writes / 102 deletes) and "Revenue Farm · Grana" (`975e6747…`, 285 writes /
  351 deletes). Both projects verified with `list_files` afterwards: exactly the bundle plus the
  app's own `_adherence.oxlintrc.json` / `_ds_manifest.json`. The RF project's old marketing cards
  (42) and motion cards (2) have no Grana counterpart yet and were removed with the runtime they
  depended on; the old bundle stays at `platform/packages/ui/ds-bundle/`. The Luminars screens
  file (`aa561d58…`, a regular project) still embeds the OLD RF bundle under `_ds/` — its artboards
  reference `window.RFUI`; do not swap that folder for the Grana bundle (`window.Grana`) without
  re-drawing them. Deletes are capped at 256 paths per `delete_files` call.
