# Design Direction

> Status: DRAFT — for owner review. The structural, tonal, and language direction for all three
> surfaces. Per-surface behavior lives in the [`features/`](features/) files; this doc defines
> the shell they share, the feeling the product must give, and the vocabulary every string uses.
> Language update ratified by the owner 2026-08-06 (design-prototype review): the ambient state
> is named **Context Collection** in all user-facing copy. Same review, same day: the concrete
> design system (§ The design system) is ratified from the prototype's "Grana" DS; the sidebar
> carries product identity at top and workspace in the account row; the Record action lives on
> the Processes surface (and the OS status item), not in the sidebar; the collapsed agent rail
> may render as a floating affordance that expands the inset rail. Amended 2026-08-07 (Group 05
> review): the **session indicator** joins the shell description as the one deliberately
> non-shell surface, and the Language table pins Recording against the ambient state.

## The shell: inset panels on a canvas

Every product surface — the desktop app, the business console, and the vendor panel — uses the
same shell. The window paints a soft, warm **canvas**; the sidebar sits directly on the canvas;
the content and the agent rail are **inset panels** — rounded surfaces floating on the canvas
with soft depth, never edge-to-edge sheets:

```
╔═══════════════════════════════════════════════════════════════╗
║ canvas (soft, warm, alive)                                    ║
║  SIDEBAR    ┌──────────────────────────┐  ┌───────────────┐   ║
║             │       CONTENT PANEL      │  │  AGENT RAIL   │   ║
║  workspace  │   (inset, rounded,       │  │  (inset,      │   ║
║  nav groups │    soft shadow)          │  │   collapsible)│   ║
║  status     │                          │  │               │   ║
║  account    └──────────────────────────┘  └───────────────┘   ║
╚═══════════════════════════════════════════════════════════════╝
```

1. **Left sidebar** — on the canvas itself: product identity at top; navigation in small
   labeled groups (the app: **Work** — Home, Processes, Runs, Connections; **Context** —
   Timeline, Notifications; plus Settings); the ambient system status as a pill above the
   account row (context state in the app, org health in the console); the account row at the
   bottom carrying the person and their workspace ("Atlas Operations · admin"). The **Record**
   action is not a sidebar fixture: it lives on the Processes surface and in the OS status
   item. On an object's detail surface the sidebar becomes the **object's own nav** (a back
   link to the library, then the object's tabs) while keeping the status pill and account row
   — the object-focus takeover.
2. **Content panel** — the surface itself, inset. One primary object per screen, a readable
   content column, generous whitespace. Lists are calm cards and tables, not widget dashboards.
3. **Agent rail** — a first-class inset panel, not a popover: persistent, collapsible (state
   remembered), header naming its current context, suggested actions above the input. What
   renders inside it is an **agent conversation**, not a chat (see below). Collapsed, the rail
   may render as a floating affordance (the corner FAB) present on every screen; activating it
   — or its keyboard shortcut — expands the inset rail. It never opens as an overlay.
4. **The session indicator** — the one surface that is deliberately *not* part of the shell:
   while a process recording is live, a compact floating bar sits over whatever application the
   person is actually working in (ratified 2026-08-07, [`003-AC-1`](features/app/003-recorder.md)).
   It is the start step transformed — the same surface the person just used to name the
   outcome — and it dismisses itself on stop. The app window is never required for a recording,
   and the recording never gets a window of its own.

## The feeling: serenity

Luminars watches all day; it must feel like a calm companion, never a surveillance dashboard.
The visual language works for that explicitly:

- **Warm, alive canvas.** Soft washes of color on the background, not flat gray; gentle depth
  on the inset panels.
- **A display voice.** The display face (Cabinet Grotesk) for the moments the product speaks
  to the person — the greeting, the day's summary, empty-state headlines; humanist sans
  (General Sans) for the working UI; the serif (Source Serif 4) reserved for long-form
  narrative renderings (day-log prose, evidence quotes).
- **Illustrated moments.** Empty states, onboarding, and milestone moments use painted/
  illustrated assets, not icon-and-caption placeholders. The v2 asset library is the seed.
- **Ambient proof, not alarms.** Status is shown as presence ("Context Collection is on ·
  watching quietly"), degradation as a named, calm state with one action — never red panic.

## The design system ("Grana")

Ratified 2026-08-06 from the design prototype's DS. These are the canonical tokens every
surface builds from (DSN-7); the design file is the visual source of truth, this list is the
contract.

- **Type.** **Cabinet Grotesk** — display face, the product's voice moments (500/700/800).
  **General Sans** — the working UI sans (400/500/600). **Spline Sans Mono** — ids, version
  stamps, uppercase eyebrow labels (letter-spacing ≥ .08em), and **all numerals** (tabular,
  via the `num` role). **Source Serif 4** — long-form narrative renderings only.
- **Color.** A warm stone ramp `#ffffff → #fbfaf9 → #f5f3f2 → #e9e7e4 → #d7d5d2 → #b4b1ae →
  #8c8985 → #66635f → #484541 → #2e2b28 → #1a1816 → #0e0d0a` (stone-0…950); canvas **ecru**
  `#f6f3ee` / deep `#eeeae2`; **ink = stone-900** (`#1a1816`). The accent is the ink itself —
  a monochrome UI — with **warm gold** `#a97a2e` used sparingly for wayfinding accents.
  Status colors: good `#0ca30c`, warning `#fab219`, serious `#ec835a`, critical `#d03b3b`,
  info `#2a78d6` — always rendered as **dot + word**, never color alone (DSN-6).
- **Shape & depth.** Pill radius (999px) for buttons and chips; radius scale ~6 / 10 / 14px
  (small controls / cards / the window shell); soft warm-tinted shadows (`--shadow-card`,
  `--shadow-panel`) — depth is gentle, never floating chrome.
- **Core components.** The menu bar; the window shell (fixed ~236px sidebar + inset content
  card); nav item with count badge; the sidebar status pill; the account row; the version
  line ("context engine x.y.z"); status chips (dot + label); the dark pill primary button and
  the quiet button; the KPI card (value + delta + a grounding line naming its evidence);
  panels with mono ALL-CAPS header links; the data table; For-you cards (eyebrow + title +
  body + one action); the agent FAB + rail; actor badges; image slots with glass overlays for
  illustrated moments.
- **Explained terms.** A word of art carries its plain-language explanation one hover or
  focus away; the word itself is never replaced (CST-0 — depth behind disclosure). The
  affordance is a small mono **question mark** trailing plain words and labels, and **nothing
  at all** on a chip or badge, which is already an object (owner decision 2026-08-22; the
  dotted underline this replaces read as broken under a pill). A column header explains its
  whole column, so rows stay unmarked.
- **Rules of thumb.** One dark primary button per screen (DSN-3); numerals never
  proportional; eyebrows always mono-uppercase; borders and fills come from the stone ramp,
  status colors never decorate; a row's secondary verbs live in one overflow menu, never
  spread across the row; every row in a list carries the SAME verb weight (a repeated unit
  makes one filled button among outlines read as an inconsistency, not as emphasis — the one
  dark primary belongs in the page head); a list panel is exactly as wide as the rest of its
  page and scrolls sideways inside itself rather than widening the page.
- **Layered UI.** Tooltips and menus are portalled and positioned `fixed`, never absolutely
  positioned inside the surface that raised them: every surface scrolls inside the inset
  panel (DSN-1), and an ancestor whose overflow is not `visible` clips its descendants.

## The agent, not a chat

The rail is a fully-fledged agent conversation, not alternating bubbles. When the assistant
works, the person **sees it work**:

- a live status line while it processes ("Reading Friday's day log…");
- named tool steps in the transcript as they happen ("Opened revision 3", "Validated the edit",
  "Applied via the command surface") — real steps from real calls, never decoration;
- an expandable reasoning summary, collapsed by default;
- rich result blocks: process diffs, evidence quotes with citations, stat cards — not prose
  walls.

The full behavioral spec is [`features/app/005-chat.md`](features/app/005-chat.md); this
presentation applies to the rail on every surface, console and vendor included.

## The OS is a surface

The app ships with a native presence in the operating system: the macOS menu bar (app menus on
the left, a status item on the right) and the Windows system tray, carrying context state and
the core actions without opening the window. Spec:
[`features/app/008-system-presence.md`](features/app/008-system-presence.md).

## Language

Every user-facing string uses this vocabulary (via the typed string catalog, CST-2):

| Term | Means | Never |
|---|---|---|
| **Context Collection** | the ambient, always-on capture. "Context Collection is on", "Context Collection is off", "Context Collection paused", "Collecting Context", "Not Collecting Context", "Pause Context Collection", "No context yet" | "recording" for the ambient state; "capture" in user-facing copy; bare "Context" as the state name |
| **Recording** | a deliberate process-recording session only ([`003-recorder.md`](features/app/003-recorder.md)). "Recording · 06:41", "Pause recording", "Stop" | using it for ambient capture; **"Collecting" for a session**; letting a session's elapsed time occupy the ambient status item — the two states coexist and are never merged into one label (008-AC-3) |
| **Process** | the semantic object: how a job is done | "macro", "script" |
| **Automation** | a compiled, runnable/exported form of a process | — |
| **Run** | one execution of an automation | — |

Internal component names (the capture engine, capture store) are unchanged — this table governs
what the person reads, not what the code is called.

## References

Reference screenshots live in [`assets/design-references/`](assets/design-references/):

- **`botpress-adk-studio.png`** — the structural template: grouped sidebar on the canvas, inset
  working surface, right agent rail with an inviting empty state.
- **`botpress-docs-shell.png`** — the same pattern on a content-heavy surface.
- **`willow-home.png`** — the inset-panel construction and the tone target: light, calm, few
  nav items, friendly empty states, account grounded at the sidebar bottom.

## Tone per surface

- **User app** — the serenity target above, fully: warm canvas, display voice, illustrated
  moments. Short grouped nav (**Work**: Home, Processes, Runs, Connections; **Context**:
  Timeline, Notifications) plus Settings.
- **Business console** — same shell and warmth, denser content: tables, statuses, filters. An
  operations tool with manners.
- **Vendor panel** — same shell; density and speed over ornament; mono for ids and versions.

## Rules

- DSN-1 The inset-panel shell is used on every surface of every plane; the agent rail is
  collapsible and its state is remembered per surface.
- DSN-2 The sidebar always carries the ambient system status (CST-10): in the app the context
  state is visible from every screen without navigation, and mirrors the OS status item.
- DSN-3 One primary CTA per screen. Empty states teach: what this screen will show, and the one
  action that gets the person there.
- DSN-4 Every screen designs its empty, warming/learning, degraded, and offline states
  explicitly; no state collapses the layout or shows placeholder junk.
- DSN-5 All copy flows through the typed string catalog (CST-2) and uses the Language table;
  layouts survive long strings and RTL.
- DSN-6 Full keyboard navigation, visible focus, contrast ≥ WCAG AA, reduced-motion respected.
- DSN-7 Surface code uses design tokens only — no raw color/size values in components.
- DSN-8 The assistant renders as an agent (status line, named tool steps, expandable reasoning,
  rich result blocks) on every surface — plain alternating bubbles are non-compliant.
- DSN-9 The product's voice moments (greeting, day summary, empty-state headlines) use the
  display face; illustrated assets appear wherever the product would otherwise feel cold.

## Source material (reference repo `~/projects/luminars-v2`)

- Design system: superseded 2026-08-06 — the ratified system is the prototype's "Grana" DS
  (§ The design system above); the v2 `packages/design-system/` Fraunces/Inter pairing is
  retired. Its **painted asset library** remains the seed for illustrated moments; its spec is
  `docs/architecture/design.md`. The shell structure defined here wins over any v2 rule it
  conflicts with.
- The v2 "live collection" screen (the visual "here's what you're working on" surface) is the
  reference for Home's live understanding strip: `apps/desktop/src/` collection/timeline
  surfaces and their specs under `docs/features/`.
