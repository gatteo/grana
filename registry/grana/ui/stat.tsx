import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* The KPI row (skin-spec §16). `cells` is the RF recipe — one box, hairline-gap cells;
 * `cards` is the Luminars Home recipe — separate cards twelve apart. Either way a Stat is:
 * a mono eyebrow, a tabular value, a delta that carries direction AND a word, and a faint
 * mono base line naming the evidence. A null value renders a dash: it never pretends to be
 * a zero. */
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

const statValueVariants = cva(
  "num leading-none font-medium tracking-[-0.03em] whitespace-nowrap",
  {
    variants: {
      size: {
        md: "text-xl",
        lg: "text-metric",
      },
    },
    defaultVariants: { size: "lg" },
  }
)

function Stat({
  className,
  label,
  value,
  suffix,
  delta,
  deltaDirection,
  base,
  teach,
  size = "lg",
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
    /** The evidence line, in faint mono ("su 128 trattative · 30 gg"). */
    base?: React.ReactNode
    /** A sans teaching line for the absent case ("Appears after the first run."). */
    teach?: React.ReactNode
  }) {
  const absent = value === null || value === undefined
  return (
    <div
      data-slot="stat"
      className={cn(
        "flex min-w-0 flex-col bg-card px-4 pt-[15px] pb-4 in-data-[variant=cards]:rounded-md in-data-[variant=cards]:border in-data-[variant=cards]:border-border in-data-[variant=cards]:px-5 in-data-[variant=cards]:py-[18px]",
        className
      )}
      {...props}
    >
      <dt data-slot="stat-label" className="eyebrow mb-2 block">
        {label}
      </dt>
      {/* The delta sits beside the value when it fits and drops under it when it does not —
          it never wraps word-by-word in a sliver beside a wide number. */}
      <dd
        data-slot="stat-value-row"
        className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
      >
        {absent ? (
          <span
            data-slot="stat-value"
            data-absent=""
            className={cn(statValueVariants({ size }), "text-faint")}
            aria-label="no value yet"
          >
            —
          </span>
        ) : (
          <span data-slot="stat-value" className={statValueVariants({ size })}>
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
              "tabular inline-flex items-center gap-[3px] text-[11px] font-medium whitespace-nowrap",
              deltaDirection === "up" && "text-status-good-ink",
              deltaDirection === "down" && "text-status-critical-ink",
              (deltaDirection === "flat" || deltaDirection === undefined) &&
                "text-muted-foreground"
            )}
          >
            {deltaDirection === "up" ? (
              <span aria-hidden="true">↑</span>
            ) : deltaDirection === "down" ? (
              <span aria-hidden="true">↓</span>
            ) : null}
            {delta}
          </span>
        ) : null}
      </dd>
      {absent && teach !== undefined && teach !== null ? (
        <p
          data-slot="stat-teach"
          className="mt-[7px] text-[11.5px] leading-[1.45] text-faint"
        >
          {teach}
        </p>
      ) : base !== undefined && base !== null ? (
        <p data-slot="stat-base" className="num mt-[7px] text-[11px] text-faint">
          {base}
        </p>
      ) : null}
    </div>
  )
}

export { StatGrid, Stat, statGridVariants, statValueVariants }
