import * as React from "react"

import { cn } from "@/lib/utils"
import { Panel, PanelScroll } from "@/registry/grana/ui/panel"
import { Wrap } from "@/registry/grana/ui/section"

/* The product rising out of the field (RF `.showcase`).
 *
 * A `Panel` pulled up into the hero by a negative margin, so the fold is the product and not a
 * seam. It sits above the field (`z-5`) and takes the section's air below it. Its content scrolls
 * sideways instead of reflowing: a screenshot that reflows lies about the product.
 *
 * The caption underneath is the honest line — what the picture is, and where the whole thing can
 * be seen. Two ends of one row, wrapping onto two lines when there is no room for both. */
function RisingPanel({
  className,
  caption,
  captionLink,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Caption row, left side (the neutrality note). */
  caption?: React.ReactNode
  /** Caption row, right side (e.g. a `link` to the full dashboard). */
  captionLink?: React.ReactNode
}) {
  return (
    <Wrap
      data-slot="rising-panel"
      className={cn(
        "relative z-[5] -mt-[clamp(6.5rem,11.5vw,10rem)] pb-section",
        className
      )}
      {...props}
    >
      <Panel className="[.js_&]:animate-rise [.js_&]:[animation-duration:1s] [.js_&]:[animation-delay:0.5s]">
        <PanelScroll>{children}</PanelScroll>
      </Panel>
      {caption || captionLink ? (
        <div
          data-slot="rising-panel-caption"
          className="mt-4.5 flex flex-wrap justify-between gap-x-4 gap-y-2 text-[13px] text-faint"
        >
          {caption ? <span data-slot="rising-panel-note">{caption}</span> : null}
          {captionLink}
        </div>
      ) : null}
    </Wrap>
  )
}

export { RisingPanel }
