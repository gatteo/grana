# Grana

The shared design system for **Revenue Farm** and **Luminars**. One token layer, one set of
components, two brands, two surfaces — distributed as a [shadcn registry](https://ui.shadcn.com/docs/registry)
and consumed **by copy**: every app owns the source it installs, and re-pulls to update.

- Tokens: `registry/grana/styles/grana.css` (palette → semantic slots per surface → brand overrides).
- Components: `registry/grana/ui/*.tsx` — Base UI primitives, `cva` variants, Tailwind v4.
- Playground: `pnpm dev` (port 5180) — every component, every variant, a brand/surface switcher.
- Builder contract: [`CONVENTIONS.md`](CONVENTIONS.md). Design rules: [`docs/guidelines/`](docs/guidelines/).
- Measured truth of the two products' kits before unification: `docs/skin-spec.md`.

## Consuming Grana in an app

Works identically in Vite (the Luminars desktop) and Next.js (the hosted surfaces, Revenue Farm).

1. **Tailwind v4 + shadcn init** in the app (once):
   `npx shadcn@latest init -b base` — Base UI, CSS variables, neutral base colour.
2. **Serve this registry and point the app at it.** The shadcn CLI resolves namespaces by URL only
   (`file://` is not implemented), so while both repos live on one machine:
   ```bash
   pnpm registry:build && pnpm registry:serve     # in grana → http://127.0.0.1:5190/r/{name}.json
   ```
   and in the app's `components.json`:
   ```json
   "registries": { "@grana": "http://127.0.0.1:5190/r/{name}.json" }
   ```
   (Once the repo is hosted, a GitHub registry — `add gatteo/grana/button#v1` — or an
   authenticated URL replaces this line; the components don't change.)
3. **Install the theme**, then the components you need:
   ```bash
   npx shadcn@latest add @grana/theme
   npx shadcn@latest add @grana/button @grana/chip @grana/card @grana/table …
   ```
   The theme lands as `styles/grana.css` + `styles/fonts.css` (under `src/` when the app has one).
   Make `grana.css` the app's Tailwind entry (or `@import "./grana.css"` from it). Copy grana's
   `public/fonts/` into the app's public dir. Proven 2026-08-23 against a scratch Vite app.
4. **Declare brand and surface** on `<html>`:
   ```html
   <html data-brand="luminars" data-surface="app">   <!-- or data-brand="rf", data-surface="marketing" -->
   ```
   Components read tokens only, so the same `<Button>` renders the Luminars or RF recipe from the
   attribute alone.
5. **Update** later with `npx shadcn@latest add @grana/button --overwrite`; see what an app has
   changed locally with `npx shadcn@latest diff`.

The rule that keeps the two products from drifting: **L0–L2 are never edited inside a consumer.**
Edit here, in the playground, then re-pull. A consumer that must diverge forks the file and the
fork stays visible in `diff`.

## Developing

```bash
pnpm install
pnpm dev              # the playground
pnpm typecheck && pnpm lint
pnpm registry:build   # emits public/r/*.json from registry.json (+ the per-group includes)
node scripts/shot.mjs <story-id> [brand] [surface] [port]   # Playwright screenshot of one story
```

Each component is one item in its group's `registry/groups/<group>/registry.json`, included by the
root `registry.json`. The playground discovers `playground/stories/*.stories.tsx` by glob.
