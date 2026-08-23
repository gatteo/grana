import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* The ONE field shell (skin-spec §6–8): 34px tall, 7×10 padding, 13px sans, hairline in
 * `border-input`, `bg-card` face, 6px radius, placeholder in `text-faint`. Hover lifts the
 * hairline one stone step; invalid swaps it for the destructive hairline; disabled sinks to
 * `bg-muted` at .6. The field paints NO focus ring of its own — the global `:focus-visible`
 * outline is its focus state. Textarea / NativeSelect / SelectTrigger / InputGroup copy this
 * recipe verbatim so every field on a row shares one height with `Button size="md"` quiet. */
const inputVariants = cva(
  "h-[34px] w-full min-w-0 rounded-sm border border-input bg-card px-2.5 py-[7px] text-13 text-foreground transition-colors duration-[120ms] file:inline-flex file:h-5 file:border-0 file:bg-transparent file:text-13 file:font-medium file:text-foreground placeholder:text-faint not-disabled:hover:border-border-strong disabled:cursor-default disabled:bg-muted disabled:opacity-60 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "",
        /* RF `.search`: the topbar search field, sunken a half step onto `stone-50`. */
        search: "bg-stone-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Input({
  className,
  type,
  variant = "default",
  mono = false,
  ...props
}: React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants> & {
    /** Keys, ids, times, anything that reads as a code: the mono face. */
    mono?: boolean
  }) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-mono={mono ? "on" : "off"}
      className={cn(inputVariants({ variant }), mono && "font-mono", className)}
      {...props}
    />
  )
}

export { Input, inputVariants }
