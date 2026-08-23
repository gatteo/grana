"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/grana/ui/tooltip"

/* A word of art with its plain explanation one hover/focus away (skin-spec §17). The term
 * still appears; the tip explains, it never replaces. The affordance is a small mono `?`
 * trailing the word — the dotted underline is retired. `marker="none"` is for children that
 * are already an object (a chip, a badge): the shape is its own affordance.
 *
 * Timing: 180 ms open (a pointer crossing the word never flashes a tip), 120 ms close grace
 * (WCAG 1.4.13 hoverable — the pointer may travel onto the tip). Focus opens, blur closes,
 * Escape dismisses. The description is always in the DOM (sr-only) so the aria link never
 * points at nothing. */

const OPEN_DELAY_MS = 180
const CLOSE_DELAY_MS = 120

type TermMarker = "icon" | "none"

function Term({
  className,
  label,
  explain,
  marker = "icon",
  side = "top",
  children,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  /** The visible word; `children` override it for custom rendering. */
  label?: React.ReactNode
  /** The plain-language explanation shown on hover/focus and read by assistive tech. */
  explain: React.ReactNode
  marker?: TermMarker
  side?: React.ComponentProps<typeof TooltipContent>["side"]
  children?: React.ReactNode
}) {
  const id = React.useId()
  return (
    <Tooltip>
      <TooltipTrigger
        delay={OPEN_DELAY_MS}
        closeDelay={CLOSE_DELAY_MS}
        render={
          <span
            data-slot="term"
            data-marker={marker}
            tabIndex={0}
            aria-describedby={id}
            className={cn(
              "group/term relative inline cursor-help rounded-xs",
              className
            )}
            {...props}
          />
        }
      >
        {children ?? label}
        {marker === "icon" ? (
          <span
            data-slot="term-marker"
            aria-hidden="true"
            className="ml-1 inline-block size-3 rounded-full border border-border-strong text-center align-middle font-mono text-[9px] leading-[10px] font-medium tracking-normal normal-case text-faint transition-colors duration-[140ms] group-hover/term:border-stone-400 group-hover/term:text-foreground group-focus-visible/term:border-stone-400 group-focus-visible/term:text-foreground"
          >
            ?
          </span>
        ) : null}
        <span id={id} className="sr-only">
          {explain}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={7}
        className="max-w-[260px] text-left font-sans text-xs leading-[1.45] font-normal tracking-normal normal-case whitespace-normal"
      >
        {explain}
      </TooltipContent>
    </Tooltip>
  )
}

export { Term, type TermMarker }
