import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

/* Tooltip — the Luminars `.tip` behaviour on Base UI: 180 ms to open, 120 ms grace to close
 * (the popup is hoverable, WCAG 1.4.13), focus opens at once, Escape dismisses, a capture-phase
 * scroll anywhere closes it (every product surface scrolls inside an inset panel). Portalled
 * and `fixed`, preferred above with a 7px gap, 10px from any edge. The panel is the light
 * popover ground — hairline + `shadow-panel` — not the dark `.tip`. */
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
            "z-70 w-max max-w-[260px] origin-(--transform-origin) rounded-sm border border-border bg-popover px-2.5 py-2 text-left text-xs leading-[1.45] font-normal whitespace-normal text-popover-foreground shadow-panel duration-[130ms] ease-out data-[side=bottom]:slide-in-from-top-0.5 data-[side=left]:slide-in-from-right-0.5 data-[side=right]:slide-in-from-left-0.5 data-[side=top]:slide-in-from-bottom-0.5 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
            className
          )}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
