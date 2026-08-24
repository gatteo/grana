import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* The KPI row (skin-spec §16). `cells` is the frame — one box, hairline-gap cells; `cards`
 * separates them twelve apart. Either way a Stat is: a label, a tabular value, a delta that
 * carries direction AND a word, and a faint base line naming the evidence. A null value
 * renders a dash: it never pretends to be a zero.
 *
 * A Stat speaks in one of two REGISTERS (`register` on Stat, not on the grid — a grid may
 * legitimately hold both). `eyebrow` is the dashboard voice: a mono-caps label over a fluid
 * metric, mono evidence underneath. `sentence` is the product voice from the Luminars Home
 * drawing: a plain sans label read as a sentence ("Time given back"), a fixed 29px figure,
 * a solid direction triangle and a sans base line — an app panel is a fixed width, so its
 * figures do not breathe with the viewport.
 *
 * `columns="fit"` sizes to the CONTAINER rather than the viewport, which is what an app panel
 * needs: the same grid is four across on Home and two across with the assistant open, and no
 * viewport breakpoint can know that. It HALVES — four, two, one — because a grid of four
 * halves cleanly and a grid of three does not: `auto-fit` on a four-item row lands on three
 * columns at panel widths and leaves one cell stranded beside two empty tracks, which in the
 * `cells` variant are not empty at all but the frame's own ground showing through. Measured on
 * the Luminars shell 2026-08-24 with the sidebar away and the assistant open.
 *
 * It queries the nearest ancestor `@container`; with none, it stays four across. */
const statGridVariants = cva("grid", {
  variants: {
    variant: {
      cells: "gap-px overflow-hidden rounded-md border border-border bg-border",
      cards: "gap-3",
    },
    columns: {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      fit: "grid-cols-4 @max-[900px]:grid-cols-2 @max-[440px]:grid-cols-1",
    },
  },
  defaultVariants: {
    variant: "cells",
    columns: 4,
  },
})

function StatGrid({
  className,
  variant = "cells",
  columns = 4,
  ...props
}: React.ComponentProps<"dl"> & VariantProps<typeof statGridVariants>) {
  return (
    <dl
      data-slot="stat-grid"
      data-variant={variant}
      className={cn(statGridVariants({ variant, columns }), className)}
      {...props}
    />
  )
}

const statValueVariants = cva("num font-medium whitespace-nowrap", {
  variants: {
    size: {
      md: "text-xl leading-none tracking-[-0.03em]",
      lg: "text-metric leading-none tracking-[-0.03em]",
      /* The product figure: fixed, because an app panel does not resize with the viewport. */
      figure: "text-[29px] leading-[1.05] tracking-[-0.02em]",
    },
  },
  defaultVariants: { size: "lg" },
})

function Stat({
  className,
  label,
  value,
  suffix,
  delta,
  deltaDirection,
  base,
  teach,
  size,
  register = "eyebrow",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof statValueVariants> & {
    label: React.ReactNode
    /** `null` renders an em dash in the faint ink — absence, not zero. */
    value: React.ReactNode | null
    /** A unit or qualifier after the value ("h", "/ sett."). */
    suffix?: React.ReactNode
    /** Direction + a word, e.g. "+12% vs mese scorso". Never colour alone. */
    delta?: React.ReactNode
    deltaDirection?: "up" | "down" | "flat"
    /** The evidence line ("su 128 trattative · 30 gg"). */
    base?: React.ReactNode
    /** A teaching line for the absent case ("Appears after the first run."). */
    teach?: React.ReactNode
    /** The voice: `eyebrow` is the dashboard's mono caps, `sentence` the product's plain
     * sans label. See the file header. */
    register?: "eyebrow" | "sentence"
  }) {
  const absent = value === null || value === undefined
  const sentence = register === "sentence"
  /* The register picks the figure size unless the caller names one. */
  const resolved = size ?? (sentence ? "figure" : "lg")
  return (
    <div
      data-slot="stat"
      data-register={register}
      className={cn(
        "flex min-w-0 flex-col bg-card px-4 pt-[15px] pb-4 in-data-[variant=cards]:rounded-md in-data-[variant=cards]:border in-data-[variant=cards]:border-border in-data-[variant=cards]:px-5 in-data-[variant=cards]:py-[18px]",
        sentence && "px-5 pt-[15px] pb-[17px]",
        className
      )}
      {...props}
    >
      <dt
        data-slot="stat-label"
        className={cn(
          "block",
          sentence
            ? "text-13 leading-[1.35] font-normal text-muted-foreground"
            : "eyebrow mb-2"
        )}
      >
        {label}
      </dt>
      {/* The delta sits beside the value when it fits and drops under it when it does not —
          it never wraps word-by-word in a sliver beside a wide number. */}
      <dd
        data-slot="stat-value-row"
        className={cn(
          "flex flex-wrap items-baseline gap-x-2 gap-y-1",
          sentence && "mt-[5px]"
        )}
      >
        {absent ? (
          <span
            data-slot="stat-value"
            data-absent=""
            className={cn(
              statValueVariants({ size: resolved }),
              sentence ? "font-normal text-stone-400" : "text-faint"
            )}
            aria-label="no value yet"
          >
            —
          </span>
        ) : (
          <span
            data-slot="stat-value"
            className={statValueVariants({ size: resolved })}
          >
            {value}
          </span>
        )}
        {!absent && suffix !== undefined && suffix !== null ? (
          <span
            data-slot="stat-suffix"
            className="text-xs font-medium text-faint"
          >
            {suffix}
          </span>
        ) : null}
        {!absent && delta !== undefined && delta !== null ? (
          <span
            data-slot="stat-delta"
            data-direction={deltaDirection ?? "flat"}
            className={cn(
              "tabular inline-flex items-center gap-[3px] font-medium whitespace-nowrap",
              sentence ? "text-[11.5px]" : "text-[11px]",
              deltaDirection === "up" && "text-status-good-ink",
              deltaDirection === "down" && "text-status-critical-ink",
              (deltaDirection === "flat" || deltaDirection === undefined) &&
                "text-muted-foreground"
            )}
          >
            {deltaDirection === "up" ? (
              <span aria-hidden="true">{sentence ? "▲" : "↑"}</span>
            ) : deltaDirection === "down" ? (
              <span aria-hidden="true">{sentence ? "▼" : "↓"}</span>
            ) : null}
            {delta}
          </span>
        ) : null}
      </dd>
      {absent && teach !== undefined && teach !== null ? (
        <p
          data-slot="stat-teach"
          className={cn(
            "text-[11.5px] leading-[1.45] text-faint",
            sentence ? "mt-[5px] leading-[1.4]" : "mt-[7px]"
          )}
        >
          {teach}
        </p>
      ) : base !== undefined && base !== null ? (
        <p
          data-slot="stat-base"
          className={cn(
            "text-faint",
            sentence
              ? "mt-[5px] text-[11.5px] leading-[1.4]"
              : "num mt-[7px] text-[11px]"
          )}
        >
          {base}
        </p>
      ) : null}
    </div>
  )
}

export { StatGrid, Stat, statGridVariants, statValueVariants }
