import * as React from "react"

import { cn } from "@/lib/utils"

/* A placeholder for content that is still arriving: a stone-200 block that breathes.
 * Shape it with className (`h-3 w-40` a line, `size-6 rounded-full` an avatar, `h-24` a card). */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("animate-pulse rounded-xs bg-canvas-deep", className)}
      {...props}
    />
  )
}

export { Skeleton }
