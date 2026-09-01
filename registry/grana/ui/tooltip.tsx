import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

/* Tooltip — the Luminars `.tip` behaviour on Base UI: 180 ms to open, 120 ms grace to close
 * (the popup is hoverable, WCAG 1.4.13), focus opens at once, Escape dismisses, a capture-phase
 * scroll anywhere closes it (every product surface scrolls inside an inset panel). Portalled
 * and `fixed`, preferred above with a 7px gap, 10px from any edge.
 *
 * The panel is the LIGHT popover ground — white, hairline, the panel shadow — with an arrow
 * pointing at the trigger (the owner's rulings of 2026-09-01, AGE-175: "white in the white
 * theme"; a dark tip over the process band's dark ground had no edge at all). Motion is the
 * shadcn recipe at the measured thresholds: fade + zoom-95 + an 8px slide, 150 ms ease-out in,
 * 100 ms ease-in out; the earlier 130 ms fade with a 2px slide was below what a person
 * notices, which read as "pops up with no animation". Reduced motion gets none. The arrow is
 * Base UI's three-path arrow, so the hairline continues around it. */
function TooltipProvider({
  delay = 180,
  closeDelay = 120,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      closeDelay={closeDelay}
      {...props}
    />
  )
}

function Tooltip({ actionsRef, ...props }: TooltipPrimitive.Root.Props) {
  const ownActions = React.useRef<TooltipPrimitive.Root.Actions | null>(null)
  const actions = actionsRef ?? ownActions

  React.useEffect(() => {
    const close = () => actions.current?.close()
    window.addEventListener("scroll", close, { capture: true, passive: true })
    window.addEventListener("resize", close, { passive: true })
    return () => {
      window.removeEventListener("scroll", close, { capture: true })
      window.removeEventListener("resize", close)
    }
  }, [actions])

  return (
    <TooltipPrimitive.Root data-slot="tooltip" actionsRef={actions} {...props} />
  )
}

function TooltipTrigger({
  delay = 180,
  closeDelay = 120,
  ...props
}: TooltipPrimitive.Trigger.Props) {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      delay={delay}
      closeDelay={closeDelay}
      {...props}
    />
  )
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 7,
  align = "center",
  alignOffset = 0,
  collisionPadding = 10,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "collisionPadding"
  >) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className="isolate z-70"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-70 w-max max-w-[260px] origin-(--transform-origin) rounded-md border border-border bg-popover px-3 py-1.5 text-left text-xs leading-[1.45] font-normal text-balance whitespace-normal text-popover-foreground shadow-panel duration-150 ease-out data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-closed:duration-100 data-closed:ease-in motion-reduce:animate-none",
            className
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow
            data-slot="tooltip-arrow"
            className="z-10 data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180"
          >
            <svg width="20" height="10" viewBox="0 0 20 10" fill="none" aria-hidden>
              <path
                d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66437 2.60207Z"
                className="fill-popover"
              />
              <path
                d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66437 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
                className="fill-border"
              />
              <path
                d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.2598 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
                className="fill-popover"
              />
            </svg>
          </TooltipPrimitive.Arrow>
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
