"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@/lib/utils"
import { CheckIcon, MinusIcon } from "lucide-react"

/* A 16px box on the field face: hairline (`border-border-strong`, the frame step — stone-200
 * vanishes at this size) when off, ink when on or indeterminate. No brand hue, no ring of its
 * own — the global `:focus-visible` outline is the focus state. The `after:` box widens the
 * hit area to the row's height without growing the mark. */
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer group/checkbox relative flex size-4 shrink-0 items-center justify-center rounded-xs border border-border-strong bg-card transition-colors duration-[120ms] after:absolute after:-inset-x-3 after:-inset-y-2 not-disabled:hover:border-stone-400 disabled:cursor-default disabled:opacity-50 aria-invalid:border-destructive data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground group-has-disabled/field:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3 [&>svg]:stroke-[2.25]"
      >
        <CheckIcon className="group-data-indeterminate/checkbox:hidden" />
        <MinusIcon className="hidden group-data-indeterminate/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
