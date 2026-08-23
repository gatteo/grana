import * as React from "react"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

/* Work in progress, indeterminate. Inherits the text colour (muted beside a label, the
 * button's foreground inside one); 16px by default, `size-3.5` inside small controls. */
function Spinner({
  className,
  label = "Loading",
  ...props
}: React.ComponentProps<"svg"> & { label?: string }) {
  return (
    <Loader2Icon
      data-slot="spinner"
      role="status"
      aria-label={label}
      strokeWidth={1.75}
      className={cn("size-4 shrink-0 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
