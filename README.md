# Grana

The shared design system for **Revenue Farm** and **Luminars**. One token layer, one set of
components, two brands, two surfaces — distributed as a [shadcn registry](https://ui.shadcn.com/docs/registry)
and consumed **by copy**: every app owns the source it installs, and re-pulls to update.

- Tokens: `registry/grana/styles/grana.css` (palette → semantic slots per surface → brand overrides).
- Components: `registry/grana/ui/*.tsx` — Base UI primitives, `cva` variants, Tailwind v4.
  Seven groups: `controls · fields · status · surfaces · patterns · marketing · extras`.
  The `marketing` group is the paper register — Canvas, Section/Wrap, the bands, the heroes, the
  cards and the product fragments the marketing sites are built from.
- Textures: `public/img` — the editorial fields the marketing stories (and the design bundles) use.
- Playground: `pnpm dev` (port 5180) — every component, every variant, a brand/surface switcher.
- Builder contract: [`CONVENTIONS.md`](CONVENTIONS.md). Design rules: [`docs/guidelines/`](docs/guidelines/).
- Measured truth of the two products' kits before unification: `docs/skin-spec.md`.

## Consuming Grana in an app

Works identically in Vite (the Luminars desktop) and Next.js (the hosted surfaces, Revenue Farm).

1. **Tailwind v4 + shadcn init** in the app (once):
   `npx shadcn@latest init -b base` — Base UI, CSS variables, neutral base colour.
2. **Point the app at the registry.** This repo is private, so the CLI reads it through the GitHub
   contents API with a token. In the app's `components.json`:
   ```json
   "registries": {
     "@grana": {
       "url": "https://api.github.com/repos/gatteo/grana/contents/public/r/{name}.json",
       "headers": {
         "Authorization": "Bearer ${GH_TOKEN}",
         "Accept": "application/vnd.github.raw"
       }
     }
   }
   ```
   and in the shell that runs the CLI:
   ```bash
   export GH_TOKEN=$(gh auth token)     # any token with read access to this repo
   ```
   The token is never written into a repo. Without it the CLI stops with "Set the required
   environment variables"; it also reads `.env` / `.env.local` from the consuming project if you
   would rather keep it there.
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

## Publishing

**What is on `main` is what consumers install.** `public/r/*.json` is the published surface and it
INLINES the component sources, so publishing is two steps and the second one is not optional:

```bash
pnpm registry:build          # public/r/*.json ← registry.json ← registry/groups/*
git commit && git push       # this is the publish
```

`pnpm registry:check` rebuilds into a temp dir and fails if `public/r` is behind the sources — run
it with `typecheck` and `lint` before every commit. A component edited and pushed without a rebuild
ships the *old* code to both products and nothing errors.

Two notes on the transport. The contents API is used rather than `raw.githubusercontent.com`
because raw serves `cache-control: max-age=300` — after a push, a re-pull could quietly install the
previous version for five minutes. The API is always fresh, caps files at 1 MB (the largest item
here is 37 KB) and allows 5,000 requests an hour authenticated.

**Iterating on Grana itself** does not need a push. Serve the built registry locally and install
from the direct URL, which bypasses the namespace:

```bash
pnpm registry:build && pnpm registry:serve      # → http://127.0.0.1:5190/r/{name}.json
npx shadcn@latest add http://127.0.0.1:5190/r/button.json --overwrite   # in the consumer
```
Namespaced `registryDependencies` inside that item still resolve through the hosted registry, so
install siblings explicitly when they changed together.

The rule that keeps the two products from drifting: **L0–L2 are never edited inside a consumer.**
Edit here, in the playground, then re-pull. A consumer that must diverge forks the file and the
fork stays visible in `diff`.

## Developing

```bash
pnpm install
pnpm dev              # the playground
pnpm typecheck && pnpm lint
pnpm registry:build   # emits public/r/*.json from registry.json (+ the per-group includes)
pnpm registry:check   # fails if public/r is behind the sources — the gate before every commit
node scripts/shot.mjs <story-id> [brand] [surface] [port]   # Playwright screenshot of one story
```

Each component is one item in its group's `registry/groups/<group>/registry.json`, included by the
root `registry.json`. The playground discovers `playground/stories/*.stories.tsx` by glob.
