import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleDotIcon,
  CircleIcon,
  CircleXIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { StatusDot, type StatusTone } from "@/registry/grana/ui/status-dot"

/* A Chip reports a STATE the thing is in (a Badge names a property). Four appearances, and
 * `tinted` is the DEFAULT since 2026-09-12 (owner ruling: "no border, just the chip colour
 * with the icon"). The hairline pill it replaced put a border and a stone fill around every
 * state in the Luminars app while the console had been tinted for months, so one product
 * spoke two chips. A chip is now a patch of the tone it reports, and nothing else.
 *
 *   tinted  — THE DEFAULT: no border, 6px radius, 12% tinted fill, dark-tinted text, and the
 *             tone's own 11px glyph.
 *   outline — the hairline pill: border, stone fill, muted text, only the dot carries the
 *             tone (DSN-6). It is no longer the default and there is exactly one reason left
 *             to ask for it: a chip on a DARK band, where a 12% tint of a status hue has
 *             nothing to sit on (the Luminars process band).
 *   plain   — shadcn's outline badge as a pill (the owner's ruling 2026-09-01, AGE-179):
 *             hairline, no fill, muted text, and a leading 14px ICON that carries the tone.
 *             Each tone has its own glyph (a hollow circle for quiet, a dotted one for info,
 *             a check, an alert, a triangle, a cross) coloured by the tone; the caller may
 *             replace it through `icon` or drop it with `dot={false}`; the word is always
 *             beside it (DSN-6). The data tables' state and origin cells use this one.
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
      plain:
        "gap-1.5 rounded-full border border-border bg-transparent px-2.5 py-0.5 text-xs leading-[1.45] text-muted-foreground [&>svg]:size-3.5 [&>svg]:shrink-0",
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
  ],
  defaultVariants: {
    appearance: "tinted",
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

/* The plain appearance's tone glyphs: lucide, 14px, in the tone's own hue (the glyph is an
 * icon, not text, so the raw status colours apply; the word beside it carries the reading). */
function PlainToneIcon({ tone }: { tone: StatusTone }) {
  const props = { "data-slot": "chip-icon", "aria-hidden": true } as const
  switch (tone) {
    case "ok":
      return <CircleCheckIcon {...props} className="text-status-good" />
    case "attention":
      return <CircleXIcon {...props} className="text-status-critical" />
    case "serious":
      return <TriangleAlertIcon {...props} className="text-status-serious" />
    case "warning":
      return <CircleAlertIcon {...props} className="text-status-warning" />
    case "info":
      return <CircleDotIcon {...props} className="text-status-info" />
    default:
      return <CircleIcon {...props} className="text-stone-400" />
  }
}

function Chip({
  className,
  appearance = "tinted",
  tone = "quiet",
  emphasis = false,
  dot = true,
  icon,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof chipVariants> & {
    tone?: StatusTone
    /** Show the indicator (the 6px dot; the 11px glyph when tinted; the 14px tone icon when
     * plain). Off for a chip that names an origin or a kind rather than a state. */
    dot?: boolean
    /** A custom glyph in place of the tone's own: 11px on `tinted`, the leading 14px icon on
     * `plain` (colour it yourself; the default is coloured by the tone). */
    icon?: React.ReactNode
    emphasis?: boolean
  }) {
  const indicator = !dot ? null : appearance === "plain" ? (
    (icon ?? <PlainToneIcon tone={tone} />)
  ) : appearance === "tinted" ? (
    (icon ?? (tone === "quiet" ? null : <ToneIcon tone={tone} />))
  ) : (
    <StatusDot tone={tone} size={6} />
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
