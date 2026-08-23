import * as React from "react"

import { cn } from "@/lib/utils"

/* Two surfaces the marketing page puts things on (RF `.panel` / `.plot`).
 *
 * `Panel` is the product, framed: white, a darker hairline than the page's, the deep panel
 * shadow, corners clipped. It is the only place the shadow ladder goes to `panel` — a screenshot
 * has to lift off the paper. `Plot` is the neutral card everything else sits in: raised paper, the
 * page hairline, no shadow at rest. Cards that lift on hover do it themselves; neither of these
 * moves on its own. */
function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel"
      className={cn(
        "overflow-hidden rounded-sm border border-line-artefact bg-stone-0 shadow-panel",
        className
      )}
      {...props}
    />
  )
}

/* The horizontal escape hatch for a table or a wide diagram inside a Panel. */
function PanelScroll({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="panel-scroll" className={cn("overflow-x-auto", className)} {...props} />
}

function Plot({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="plot"
      className={cn("rounded-img border border-border bg-card", className)}
      {...props}
    />
  )
}

export { Panel, PanelScroll, Plot }
