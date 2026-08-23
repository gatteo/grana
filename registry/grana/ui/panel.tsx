import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"

/* Two surfaces the marketing page puts things on (RF `.panel` / `.plot`).
 *
 * `Panel` is the product, framed: white, a darker hairline than the page's, the deep panel
 * shadow, corners clipped. It is the only place the shadow ladder goes to `panel` — a screenshot
 * has to lift off the paper. `Plot` is the neutral card everything else sits in: raised paper, the
 * page hairline, no shadow at rest. Cards that lift on hover do it themselves; neither of these
 * moves on its own.
 *
 * Both take `render` — a Plot that is really an `<article>` or a link, a Panel that is a `<figure>`,
 * keep the recipe and change the tag instead of being re-inlined by hand in a product. */
function Panel({ className, render, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "overflow-hidden rounded-sm border border-line-artefact bg-stone-0 shadow-panel",
          className
        ),
      },
      props
    ),
    render,
    state: { slot: "panel" },
  })
}

/* The horizontal escape hatch for a table or a wide diagram inside a Panel. */
function PanelScroll({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="panel-scroll" className={cn("overflow-x-auto", className)} {...props} />
}

function Plot({ className, render, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("rounded-img border border-border bg-card", className),
      },
      props
    ),
    render,
    state: { slot: "plot" },
  })
}

export { Panel, PanelScroll, Plot }
