# 04 · Motion

Motion is calm, one-directional and purposeful. Reference implementation: bottom of
`d-grana/landing.html` (one ~60-line vanilla script; port the behaviour, not
necessarily the code).

## Principles

- Ease out only: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` for entrances,
  `--ease: cubic-bezier(0.2, 0.7, 0.2, 1)` for micro-interactions. No bounce, no
  elastic, no loops.
- Animate `opacity`, `translate`, `scale` only. Never layout properties.
- Everything honours `prefers-reduced-motion: reduce`: reveals become instant,
  count-ups jump to the final value, the hero settle is skipped.
- Progressive enhancement: an inline `document.documentElement.classList.add('js')`
  gates every hidden initial state. Without JS the page renders fully visible.

## Hero entrance (once, on load)

| Element | Animation | Timing |
|---|---|---|
| Field image | scale 1.045 → 1 ("settle") | 2.2 s, ease-out |
| Content children | rise: opacity 0 + translateY 26px → 0 | 0.9 s, staggered 0.05/0.14/0.23/0.32/0.41 s |
| Stakes | rise 10 px + fade | 0.55 s at 0.7 / 0.85 / 1.0 s |
| Product panel | rise | 1 s at 0.5 s |

## Scroll reveals

- Marker: `data-reveal` attribute; siblings stagger via inline `--d` custom property
  (0.08 s steps).
- Hidden state (only under `.js`): `opacity: 0; translate: 0 22px`.
- `IntersectionObserver` with `rootMargin: '0px 0px -10% 0px'`, `threshold: 0.15`;
  adds `.in-view` (`opacity: 1; translate: 0 0`, 0.75 s), then unobserves.
- Fallback: no IntersectionObserver → everything `.in-view` immediately.

## Count-up (proof band)

- Elements carry `data-count` (target), optional `data-decimals`, `data-prefix`,
  `data-suffix`. Static markup contains the final formatted value (SEO/no-JS).
- Runs when the parent reveals; 1100 ms; easing `1 - (1-p)^4`.
- Formatting: `toLocaleString('it-IT', { useGrouping: 'always', ... })`. The
  `useGrouping: 'always'` is required: Italian CLDR skips grouping on 4-digit numbers
  and the brand writes `1.847`. Wrap in try/catch for older engines.
- Reduced motion: set the final formatted value immediately.

## Micro-interactions

- Cards (unit, post): hover `translate: 0 -4px` + `shadow-card`, 0.3 s.
- Way-card snippet: hover `translate: 0 -4px`, 0.4 s.
- Buttons: background-color transitions 0.18 s; `:active` presses 1 px down.
- Product app: hovers only (background-color 0.14 s). No entrance motion in the
  dashboard.
