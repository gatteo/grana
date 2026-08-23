import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* The six status tones both products share (Luminars `tone.ts`). Chip and StatusDot read
 * the same map so the two can never drift on colour again. */
export type StatusTone = "ok" | "attention" | "serious" | "warning" | "info" | "quiet"

const statusDotVariants = cva("inline-block shrink-0 rounded-full", {
  variants: {
    tone: {
      quiet: "bg-stone-400",
      ok: "bg-status-good",
      attention: "bg-status-critical",
      serious: "bg-status-serious",
      warning: "bg-status-warning",
      info: "bg-status-info",
    },
    live: {
      /* Only a dot reporting something LIVE breathes (1.4s; the global reduced-motion rule
       * kills it). Tailwind's pulse keyframe, retimed inline. */
      true: "animate-dot-pulse",
      false: "",
    },
  },
  defaultVariants: {
    tone: "quiet",
    live: false,
  },
})

/**
 * A status dot. 7px standalone, `size={6}` inside a Chip. It is always rendered beside a
 * word the caller owns (DSN-6: dot + word, never colour alone) — so by default it is hidden
 * from assistive tech; pass `label` when the dot must carry its own meaning (a table cell
 * whose word lives in the column header).
 */
function StatusDot({
  className,
  tone = "quiet",
  live = false,
  size = 7,
  label,
  style,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof statusDotVariants> & {
    tone?: StatusTone
    live?: boolean
    /** Diameter in px. The spec: 7 standalone, 6 inside a chip. */
    size?: number
    /** An accessible name. Omit when a visible word sits beside the dot. */
    label?: string
  }) {
  return (
    <span
      data-slot="status-dot"
      data-tone={tone}
      data-live={live ? "on" : "off"}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(statusDotVariants({ tone, live }), className)}
      style={{
        width: size,
        height: size,
        animationDuration: live ? "1.4s" : undefined,
        ...style,
      }}
      {...props}
    />
  )
}

export { StatusDot, statusDotVariants }
