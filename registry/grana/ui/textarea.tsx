import * as React from "react"

import { cn } from "@/lib/utils"

/* The field shell (see input.tsx) on a textarea: same padding, face and hairline, 1.5
 * line-height, `resize: none` by design (Luminars: surfaces grow it themselves — here the
 * field sizes to its content from a 72px floor). */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-18 w-full min-w-0 resize-none rounded-sm border border-input bg-card px-2.5 py-[7px] text-13 leading-normal text-foreground transition-colors duration-[120ms] placeholder:text-faint not-disabled:hover:border-border-strong disabled:cursor-default disabled:bg-muted disabled:opacity-60 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
