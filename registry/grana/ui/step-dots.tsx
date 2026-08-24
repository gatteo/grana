import * as React from "react"

import { cn } from "@/lib/utils"

/* The stepper for a multi-step modal footer. Five-pixel dots, and the one you are on stretches
 * into a short bar in the ink — so the position reads at a glance without a "3 / 5" to parse,
 * and the footer's one primary action stays alone on the right (DSN-3).
 *
 * The label is the CALLER's: the component knows the numbers, not the language the product
 * speaks. `label="Passaggio 2 di 4"` in Italian, "Step 2 of 4" in English; the English fallback
 * exists so a stepper is never unnamed, not so callers can skip it.
 *
 *   <StepDots count={4} current={1} label="Step 2 of 4" />
 */

function StepDots({
  className,
  count,
  current,
  label,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  /** How many steps there are. */
  count: number
  /** Which one you are on, 0-based. */
  current: number
  /** The accessible name, naming the position in the product's own language. */
  label?: string | undefined
}) {
  const total = Math.max(0, Math.floor(count))
  const at = Math.min(total - 1, Math.max(0, Math.floor(current)))

  return (
    <span
      data-slot="step-dots"
      role="group"
      aria-label={label ?? `Step ${at + 1} of ${total}`}
      className={cn("flex items-center gap-[5px]", className)}
      {...props}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          data-slot="step-dot"
          data-state={index === at ? "current" : "other"}
          aria-hidden="true"
          className={cn(
            "block h-[5px] rounded-full transition-[width,background-color] duration-180 ease-brand-out",
            index === at ? "w-[17px] bg-foreground" : "w-[5px] bg-stone-300"
          )}
        />
      ))}
    </span>
  )
}

export { StepDots }
