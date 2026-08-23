import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* A numbered instruction list: do this, then this, then this. An ordered list with the
 * numbers drawn as counters, so a step can be added or removed without renumbering
 * anything by hand — and so screen readers get a real `<ol>` rather than a stack of divs
 * with digits in them.
 *
 * `tone="inverse"` is the same list over a dark or photographic ground (a tutorial panel
 * floating on an image, a dark band): the numerals and the rules take the inverse ramp.
 * The number itself is `num`, because it is a numeral. */

const stepsVariants = cva("flex list-none flex-col [counter-reset:step]", {
  variants: {
    tone: {
      default: "text-foreground",
      inverse: "text-inverse-foreground",
    },
    size: {
      md: "gap-2.5 text-13",
      sm: "gap-2 text-xs",
    },
  },
  defaultVariants: { tone: "default", size: "md" },
})

const stepVariants = cva(
  "flex gap-2.5 leading-snug [counter-increment:step] before:mt-px before:grid before:size-[17px] before:flex-none before:place-items-center before:rounded-full before:text-2xs before:font-medium before:content-[counter(step)] before:num",
  {
    variants: {
      tone: {
        default: "before:bg-canvas-deep before:text-muted-foreground",
        inverse: "before:bg-inverse-line before:text-inverse-foreground",
      },
    },
    defaultVariants: { tone: "default" },
  }
)

type StepsContextValue = { tone: "default" | "inverse" }
const StepsContext = React.createContext<StepsContextValue>({ tone: "default" })

function Steps({
  className,
  tone = "default",
  size = "md",
  ...props
}: React.ComponentProps<"ol"> & VariantProps<typeof stepsVariants>) {
  const value = React.useMemo(() => ({ tone: tone ?? "default" }), [tone])
  return (
    <StepsContext.Provider value={value}>
      <ol
        data-slot="steps"
        data-tone={tone}
        className={cn(stepsVariants({ tone, size }), className)}
        {...props}
      />
    </StepsContext.Provider>
  )
}

/* The tone travels by context, not by a descendant rule: a `[&>li]:…` selector would
 * outrank the child's own className, which is the one contract the whole kit rests on. */
function Step({ className, ...props }: React.ComponentProps<"li">) {
  const { tone } = React.useContext(StepsContext)
  return (
    <li data-slot="step" className={cn(stepVariants({ tone }), className)} {...props} />
  )
}

export { Steps, Step, stepsVariants, stepVariants }
