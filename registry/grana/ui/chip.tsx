import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { StatusDot, type StatusTone } from "@/registry/grana/ui/status-dot"

/* A Chip reports a STATE the thing is in (a Badge names a property). Three appearances:
 *   outline — the Luminars pill: hairline, dot + word, the text stays muted; only the dot
 *             carries the tone (DSN-6).
 *   tinted  — the RF recipe: 6px radius, 12% tinted fill, dark-tinted text, 11px icon.
 *   status  — the Luminars table chip: the same tinted fill at PILL radius with a dot that
 *             takes the text's own ink. It sets a table row's height, so it is the tightest
 *             of the three (11.5px on 2px of vertical padding).
 *   plain   — shadcn's outline badge as a pill (the owner's ruling 2026-09-01, AGE-179):
 *             hairline, no fill, muted text, and a leading 14px ICON that carries the tone —
 *             the caller passes it coloured through `icon`; the word is always beside it
 *             (DSN-6). The data tables' state and origin cells use this one.
 * Tone → token: ok→good · attention→critical · serious→serious · warning→warning ·
 * info→info · quiet→stone-400.
 *
 * The tinted text colours are color-mixed from the status hue and the ink because the raw
 * hues fail AA as text (RF keeps them as `--status-*-ink` literals; see the report). */
const chipVariants = cva("inline-flex items-center gap-1.5 whitespace-nowrap", {
  variants: {
    appearance: {
      outline:
        "rounded-full border border-border-strong bg-surface-2 px-2.5 py-[3px] text-xs leading-[1.45] text-muted-foreground",
      tinted:
        "rounded-sm py-[3px] pr-2 pl-[7px] text-[11px] leading-[1.6] [&>svg]:size-[11px] [&>svg]:shrink-0",
      status:
        "gap-1.5 rounded-full border border-transparent py-0.5 pr-[9px] pl-[7px] text-[11.5px] leading-[1.45] font-medium",
      plain:
        "gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs leading-[1.45] text-muted-foreground [&>svg]:size-3.5 [&>svg]:shrink-0 [&>svg]:stroke-[1.75]",
    },
    tone: {
      quiet: "",
      ok: "[--chip-fill:color-mix(in_srgb,var(--status-good)_12%,transparent)] [--chip-ink:var(--status-good-ink)]",
      attention:
        "[--chip-fill:color-mix(in_srgb,var(--status-critical)_12%,transparent)] [--chip-ink:var(--status-critical-ink)]",
      serious:
        "[--chip-fill:color-mix(in_srgb,var(--status-serious)_14%,transparent)] [--chip-ink:var(--status-serious-ink)]",
      warning:
        "[--chip-fill:color-mix(in_srgb,var(--status-warning)_20%,transparent)] [--chip-ink:var(--status-warning-ink)]",
      info: "[--chip-fill:color-mix(in_srgb,var(--status-info)_12%,transparent)] [--chip-ink:var(--status-info-ink)]",
    },
    emphasis: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    /* Luminars: the first rung of the attention ladder — warmer ground, firmer border. */
    {
      appearance: "outline",
      emphasis: true,
      class: "border-stone-400 bg-canvas-deep font-medium text-foreground",
    },
    /* RF: neutral chip = stone-100, muted text, no indicator. */
    { appearance: "tinted", tone: "quiet", class: "bg-muted text-muted-foreground" },
    {
      appearance: "tinted",
      tone: ["ok", "attention", "serious", "warning", "info"],
      class: "bg-(--chip-fill) text-(--chip-ink)",
    },
    { appearance: "tinted", emphasis: true, class: "font-medium" },
    /* status shares tinted's tone map — one set of percentages, so the two can never drift. */
    { appearance: "status", tone: "quiet", class: "bg-muted text-muted-foreground" },
    {
      appearance: "status",
      tone: ["ok", "attention", "serious", "warning", "info"],
      class: "bg-(--chip-fill) text-(--chip-ink)",
    },
  ],
  defaultVariants: {
    appearance: "outline",
    tone: "quiet",
    emphasis: false,
  },
})

/* The RF 12-grid tone glyphs (check 1.6 · ! 1.5 · × 1.6), drawn inline so no icon library
 * drifts them. Neutral has none. */
function ToneIcon({ tone }: { tone: StatusTone }) {
  const stroke = tone === "warning" || tone === "serious" ? 1.5 : 1.6
  const d =
    tone === "ok"
      ? "M2.5 6.5l2.5 2.5 4.5-5"
      : tone === "attention"
        ? "M3 3l6 6M9 3l-6 6"
        : tone === "info"
          ? "M6 5.5v4M6 2.6v.3"
          : "M6 2.5v4.5M6 9.4v.3"
  return (
    <svg
      data-slot="chip-icon"
      aria-hidden="true"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  )
}

function Chip({
  className,
  appearance = "outline",
  tone = "quiet",
  emphasis = false,
  dot = true,
  icon,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof chipVariants> & {
    tone?: StatusTone
    /** Show the indicator (the 6px dot; the 11px glyph when tinted). Off for a chip that
     * names an origin or a kind rather than a state. */
    dot?: boolean
    /** A custom 11px glyph for the tinted appearance (replaces the tone glyph); on `plain`
     * the leading 14px icon, coloured by the caller. */
    icon?: React.ReactNode
    emphasis?: boolean
  }) {
  const indicator = appearance === "plain" ? (
    (icon ?? null)
  ) : !dot ? null : appearance === "tinted" ? (
    (icon ?? (tone === "quiet" ? null : <ToneIcon tone={tone} />))
  ) : (
    /* On `status` the dot takes the chip's own ink rather than the raw hue: the fill is
     * already the tone, and a second, brighter statement of it reads as two colours. */
    <StatusDot
      tone={tone}
      size={6}
      className={appearance === "status" ? "bg-current" : undefined}
    />
  )
  return (
    <span
      data-slot="chip"
      data-appearance={appearance}
      data-tone={tone}
      data-dot={dot ? "on" : "off"}
      data-emphasis={emphasis ? "on" : "off"}
      className={cn(chipVariants({ appearance, tone, emphasis }), className)}
      {...props}
    >
      {indicator}
      {children}
    </span>
  )
}

export { Chip, chipVariants }
