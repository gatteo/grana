# 02 · Marketing site

The expressive surface. Reference implementation: `d-grana/landing.html`. The homepage
sets the register; interior pages reuse the same devices through the components below —
no page opens with bare text on ecru.

## Page anatomy (approved homepage, top to bottom)

1. Header (ecru, single state)
2. Hero: the framed field with measurement stakes
3. The product panel rising out of the field
4. Proof band (dotted paper, count-up numbers)
5. "Due modi" cards (image + floating UI snippet)
6. Modules grid (hairline grid, 8 cells)
7. Dark manifesto band (full-bleed, the one big dark moment)
8. Case study (mono metric + serif quote + before/after ledger)
9. Units strip on sunken paper (the four tinted fields)
10. Resources (3 posts with image headers)
11. Final CTA canvas on dots
12. Footer (ecru, columns)

## Header

- Sticky, ecru with 90% opacity + backdrop blur, **no bottom border**.
- One state only. It never changes over content.
- Left: RF mark (30 px black tile, 7 px radius) + "Revenue Farm" wordmark in Cabinet
  Grotesk 700. Centre: mega-menu nav. Right: glass "Contatti" + ink "Prenota una demo"
  pills.
- The framed hero starts directly at the header's bottom edge, so the header's own ecru
  is the top of the frame and its content stays optically centred.

### Mega menu

Piattaforma, Servizi, Soluzioni and Risorse open dropdown panels; Casi studio and
Azienda are plain links. Panels are ecru cards (hairline `line-strong` ring, 10 px
radius, `shadow-panel`) with mono group labels, entity-driven links (modules carry a
status dot: green live, amber beta, hollow in arrivo; services carry their one-line
outcome) and a "Vedi tutto →" footer link per panel — every category is fully
reachable. The Piattaforma panel adds a dotted sunken rail with quick links (Prezzi,
Sicurezza, Integrazioni, White label, Novità). Desktop: hover with close-intent delay,
click toggle, Escape and outside-click dismiss. Under 1020 px: burger → full-screen
ecru sheet with the same links grouped in columns plus stacked CTA pills. The EN header
is plain links only (EN branch subset). Implementation: `apps/web/src/components/
site-header.tsx` (server, builds localized panels) + `nav-menu.tsx` (client state).

## The canvas primitive

Every image on the site renders through one primitive. Structure and layers:

```html
<figure class="canvas" style="--img:url(...); --img-pos:center 45%; --grain-o:.15">
  <div class="canvas__img" aria-hidden="true"></div>   <!-- z0: image -->
  <!-- ::before  z1: wash gradient (legibility veil)   -->
  <!-- ::after   z2: grain, plain alpha                -->
  <span class="marks" aria-hidden="true"></span>       <!-- z4: corner marks -->
  ...content...                                        <!-- z3+ -->
</figure>
```

Key implementation facts (learned the hard way, do not regress):

- `.canvas > *:not(.canvas__img)` gets `position: relative; z-index: 3`. The `:not()`
  is load-bearing: without it the image layer is flattened and disappears.
- Grain and wash are plain alpha layers. No `mix-blend-mode` anywhere on canvases:
  stacked blend layers over large images froze the renderer.
- Duotone (until native textures exist) is a single filter chain on `.canvas__img`:
  `grayscale(1) sepia(1) hue-rotate(178deg) saturate(2.4) brightness(.82) contrast(1.05)`
  produces the Demand cobalt from any warm texture.

## Hero: "the surveyed field"

The signature composition. A full-width dark field, framed by paper, with the measure
planted in it.

- **Frame**: the canvas is inset by `--frame` on left/right/bottom; the header provides
  the top. Radius `radius-img`. Registration marks inset 18 px, ecru at 55%.
- **Image**: `dune-hero.jpg` (sand_4), `center 45%`, with a slow one-time settle
  animation (scale 1.045 → 1 over 2.2 s).
- **Wash**: dark gradient at 102°, strong over the text zone, fading right:
  `rgba(12,11,9,.9) → .74 @34% → .4 @58% → .1 @80% → .04`.
- **Content** (left-aligned, max 13ch headline): mono eyebrow with a 6 px
  `accent-warm-dark` square, display headline in ecru (no colour emphasis, no italics),
  serif lead at 85% ecru, then `btn--on-dark` primary + glass ghost secondary, then a
  small reassurance line at 58% ecru.
- **Stakes** (the memorable device): three markers pinned on the ridges. Each is a mono
  chip (ecru 94% fill, hairline ink ring, 4 px radius) over a 1 px stem and a 7 px
  `accent-warm-dark` dot ringed in ecru. Content = real numbers ("128 lead · luglio
  2026", "27,3% close rate", "11 province coperte"). Hidden below 940 px.
- **Fold rule**: eyebrow to CTA note must fit above the fold at 1440×900.

## The rising panel and the product shot

The panel (white, `radius-panel`, hairline ring at 12% ink, `shadow-panel`) overlaps
the hero's bottom edge via negative margin (`-clamp(6.5rem, 11.5vw, 10rem)`). Inside
it lives `ProductShot` (`.appshot`): the dashboard faithfully scaled down from the
product PoC — warm-grey `stone-100` canvas, transparent tenant sidebar with grouped
nav, status tags and "powered by Revenue Farm", and one white shell card containing
topbar (search + ⌘K, quiet + ink buttons, avatar), page head with segmented period
control, hairline KPI grid with deltas and baselines, HTML bar chart, deals table with
soft status chips, the human/AI activity feed ("Azione AI" dashed badge) and a module
upsell panel. Everything is static Italian demo data; `min-width 900px` with
horizontal scroll on small screens (a screenshot that reflows lies about the product).
The shot must track the real dashboard's look — when the product shell changes,
change `packages/ui/src/marketing/product-shot.tsx` with it.

## Interior page hero (`PageHero`)

Every interior page opens on its own framed field: same device as the home hero, one
register quieter. Canvas with the section's texture family, dark 96° wash over the
text zone, light marks, mono eyebrow with warm square, Cabinet 800 h1 (clamp 2.5–4rem,
`measure-head`), serif lead at 85% ecru on `measure-lead`, optional button row, optional
mono fact chips in the stake-label style (honest, dated claims only). `tall` variant for
section hubs.

The wash and the text zone are one decision. The zone runs to 70% of the container, so
the gradient holds above 0.66 alpha out to ~72% and only then opens onto the image. Widen
one without the other and the lead ends up on bare texture.
Texture per family: teal-paper* → Piattaforma, cobalt-foam → Demand/Servizi (native,
no duotone), amber-glass* → Academy, plum-rope/clay-coils → Installatori segments,
dune*/warm-stones/editorial set → master brand, azienda and risorse.

## Cards

All content cards share: white fill, hairline `line` border, `radius-img`, and
**inset images**: the canvas sits 7 px (`0.4375rem`) inside the card on top/left/right
with `radius-sm` corners. Images never touch card borders.

- **Way cards** (2-up): canvas 16/9.5 with a floating UI snippet centred on it (mini
  white panel, mono header, three data rows), then eyebrow (unit-tinted), h3, copy,
  hairline-dash list, text link pinned to the bottom. Hover lifts the snippet 4 px.
- **Unit cards** (4-up): canvas 16/11 in the unit's texture, lockup
  "Revenue Farm · Unit" with the unit name in its tint (Cabinet 700), one line of copy.
  Hover: 4 px lift + `shadow-card`.
- **Post cards** (3-up): canvas 21/9, mono category eyebrow, Cabinet 700 title,
  mono "Verificato il DD/MM/YYYY" stamp pinned to the bottom (the dated-truth device).
- **Illustration cards** (`IllustrationCard`, 2-up in `.ways` or 3-up in `.posts`):
  the way-card concept generalised — inset canvas 16/10 carrying a **built artefact**,
  then eyebrow (unit-tintable), Cabinet 700 title, copy, bottom-pinned link. Hover
  lifts card and artefact together.

## Built artefacts (illustrations drawn in code)

When a section needs an illustration and no photograph exists, draw the product's
paper: a white `FloatPanel` (mono header, `shadow-panel`) floating on a canvas field,
carrying one of the snippet artefacts — `SnippetRows` (ledger rows), `SnippetQuote`
(document with line items and total), `SnippetChat` (WhatsApp-register bubbles),
`SnippetReview` (stars + quote + mono attribution), `SnippetChart` (crisp HTML bars),
`SnippetChecklist` (checked steps), `SnippetBrowser` (drawn browser frame with url
pill and skeleton page — the device for websites we build; use placeholder domains
like "iltuodominio.it", never fake client sites). Artefact content is Italian
product-demo data in Italian number formats; artefacts are decorative
(`aria-hidden`) and never fabricate real clients, reviews or results.

### Product simulations (`shots.tsx`)

The snippets above draw the product's paper. The **shots** draw the product's
screens: `SnippetScore` (a qualification score with its factor bars, so the AI's
verdict is auditable rather than magic), `SnippetPipeline` (kanban columns of
deals, one card mid-drag), `SnippetCompare` (two payment paths side by side),
`SnippetTimeline` (a sequence with states and dates, including a late one),
`SnippetStats` (a compact KPI strip), `SnippetForm` (an embedded qualification
form and what it produces), `SnippetCall` (a voice transcript with its outcome),
`SnippetSplit` (a pool divided among members), `SnippetAlert` (the system noticing
something first), `SnippetVariants` (three versions of the same plant),
`SnippetResult` (a calculator answer with its verification stamp).

They share the `.appshot__*` register so a module artefact and the full
`ProductShot` read as one product, and they compose inside `FloatPanel` on a
`Canvas` exactly like the snippets do.

**Every module page carries its own simulation**, mapped by translationKey in
`apps/web/src/app/[locale]/piattaforma/_components/module-art.tsx`, with the
group-level artefact as fallback so adding a module never breaks a page. The
heading for the block is module-specific copy in `messages/it/piattaforma.json`
under `modulo.art.m.{translationKey}`, falling back to `modulo.art.{group}`.

Three rules keep the simulations honest, and they matter more than the drawing:

1. **Plausible numbers only.** A 12-person installer does not close €4M a month.
   A mock showing impossible figures costs more trust than it buys.
2. **Show the unflattering state too.** The paperwork timeline has a step in
   `late`, the cantiere shows consuntivo above preventivo. A simulation where
   everything is green reads as a render, not as software.
3. **Never simulate a capability the module does not have.** For `in-arrivo`
   modules the simulation is a specification and the page already says so; for
   `live` modules it must match what ships.

This is the pattern the competitors in [`01-competitive-landscape.md`](../../../docs/01-competitive-landscape.md)
(sections 1 and 6.2) use on every feature page, and it is the cheapest way for a
small product to look like a platform.

## Sections

- **Proof band**: full-width white band edged by hairlines, dotted-paper background,
  4 equal columns split by hairlines. Each: mono metric (count-up, `1.847` style
  grouping) + muted label. Numbers never touch the column dividers (1.75rem side
  padding, first column flush with the grid).
- **Modules grid**: 8 cells in a hairline-gap grid (`gap:1px` on a `line` background),
  each cell: mono group label + status chip (Live/Beta/In arrivo), Cabinet 700 name,
  xs copy. Hover: `stone-50` fill. No icons.
- **Dark manifesto**: full-bleed `bg-inverse` with `dune-light.jpg` (sand_2) at 55%
  opacity under a dark vertical wash and 12% grain. Numbered eyebrow (warm index),
  h2 max 26ch, serif body, ecru primary pill, then a 3-column stat row over a 16% ecru
  hairline. This is the only full-bleed image band: everything else is framed.
- **Case study**: two columns. Left: numbered eyebrow, giant mono metric `+9,3` with
  sans unit suffix, label, serif quote (upright), cite. Right: before/after ledger
  rows (struck-through mono "before", bold mono "after"), methodology note, link.
- **Units strip**: sits on `ecru-deep` between hairlines (the sunken band varies the
  page rhythm).
- **Final CTA**: a framed canvas (amber glass family) on a dotted section background,
  centre-aligned: h2, serif line, ecru primary + glass ghost. Light marks.
- **Consult band** (`ConsultBand`): the contextual sales moment — a framed field one
  register below the final CTA, left-aligned: mono eyebrow, Cabinet 700 title (max
  24ch), serif line **written for what the reader is looking at** (never a generic
  pitch), pill actions right. Demo links carry `?source=` for attribution. Max one
  per page; the final CTA band does not count.

- **Tailor band** (`TailorBand`): the tailoring promise — a missing module or a
  customisation gets built and shipped into the customer's own platform at no extra
  cost. Sunken paper, numbered eyebrow, h2 on `measure-head`, serif lead, then three
  hairline-split steps (request, scope, ship) and a closing note with one pill. The
  steps are part of the component, not decoration: they are what turns a claim into a
  mechanism. Copy lives once in `chrome.tailor` and renders through
  `apps/web/src/components/tailor-section.tsx`, because a positioning claim has to
  read identically everywhere. Pages that only need the short form render
  `chrome.tailor.line` as a single muted paragraph.

## Long-form documents

Articles and legal documents use the two-column `doc` layout: a prose column on a
70ch measure and a sticky contents rail (`19rem`) built from the body's own h2/h3.
`renderMarkdownWithOutline` in `@rf/content` gives every heading a stable
accent-stripped id and returns the outline with the HTML. Below 1020 px the rail
moves above the body. The rail hides itself under three headings — a two-item index
is noise. Articles put `keyTakeaways` in a warm-ruled box above the body and the
`gatedAsset` offer after it.

## Footer

Ecru, top hairline. RF mark + wordmark + one-line mission, then four mono-labelled
link columns. Base row: disclaimer left, "Italiano · English" right.

## Copy register (from the brief, enforced in the PoC)

Short declaratives. Numbers inside the sentence. No exclamation marks, no
"rivoluziona", no em dashes, no italics. Every claim dated or measurable. Dates and
money in Italian format.
