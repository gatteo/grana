import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* Segmented — skin-spec §3. One-of-N, always one selected; it FILTERS, it does not navigate,
 * so it is a `role="group"` of `aria-pressed` buttons and never a tablist.
 *
 * `pill` (default) is the Luminars recipe: a quiet sunken track with the active option RAISED
 * onto the surface (`shadow-card`; the RF app surface nulls the shadow through the token).
 * `boxed` is the RF recipe: a bordered group with hairline separators and a SUNKEN active.
 *
 * The raised pill SLIDES (AGE-175, 2026-09-01): one pill element measured onto the pressed
 * option and moved there over 180 ms (ease-out-expo), so a filter change is seen as the same
 * pill travelling rather than two grounds swapping. The pressed option keeps its own ground
 * as the fallback until the pill has been measured (`data-pill="on"` on the track), so the
 * control never renders with no active state; reduced motion jumps. */
const segmentedTrackVariants = cva(
  "group/segmented inline-flex shrink-0 items-center border border-border",
  {
    variants: {
      variant: {
        pill: "gap-0.5 rounded-full bg-surface-2 p-[3px]",
        boxed: "overflow-hidden rounded-sm bg-card",
      },
    },
    defaultVariants: {
      variant: "pill",
    },
  }
)

const segmentedItemVariants = cva(
  "relative z-10 inline-flex items-center justify-center whitespace-nowrap text-muted-foreground transition-colors duration-[120ms] ease-out select-none not-disabled:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 data-pressed:font-medium data-pressed:text-foreground",
  {
    variants: {
      variant: {
        pill: "rounded-full data-pressed:bg-card data-pressed:shadow-card group-data-[pill=on]/segmented:data-pressed:bg-transparent group-data-[pill=on]/segmented:data-pressed:shadow-none",
        boxed:
          "border-r border-border last:border-r-0 data-pressed:bg-muted",
      },
      size: {
        sm: "",
        md: "",
      },
    },
    compoundVariants: [
      { variant: "pill", size: "md", class: "h-7 px-[13px] text-[12.5px]" },
      { variant: "pill", size: "sm", class: "h-6 px-2.5 text-xs" },
      { variant: "boxed", size: "md", class: "h-8 px-[11px] text-[13px]" },
      { variant: "boxed", size: "sm", class: "h-[30px] px-2.5 text-xs" },
    ],
    defaultVariants: {
      variant: "pill",
      size: "md",
    },
  }
)

type SegmentedOption<T extends string> = {
  value: T
  label: React.ReactNode
  /** A count beside the label — rendered with `num`. */
  count?: number
  disabled?: boolean
}

type SegmentedProps<T extends string> = Omit<
  ToggleGroupPrimitive.Props<T>,
  "value" | "defaultValue" | "onValueChange" | "multiple" | "onChange"
> &
  VariantProps<typeof segmentedItemVariants> & {
    options: readonly SegmentedOption<T>[]
    value: T
    onChange: (value: T) => void
    /** Required: what the group filters. Becomes `aria-label`. */
    label: string
  }

function Segmented<T extends string>({
  className,
  options,
  value,
  onChange,
  label,
  variant = "pill",
  size = "md",
  ...props
}: SegmentedProps<T>) {
  const groupValue = React.useMemo(() => [value], [value])
  const trackRef = React.useRef<HTMLDivElement | null>(null)
  const [pill, setPill] = React.useState<{ x: number; w: number } | null>(null)
  const measure = React.useCallback(() => {
    const track = trackRef.current
    if (track === null) return
    const active = track.querySelector<HTMLElement>('[data-slot="segmented-item"][data-pressed]')
    if (active === null) {
      setPill(null)
      return
    }
    setPill({ x: active.offsetLeft, w: active.offsetWidth })
  }, [])
  React.useLayoutEffect(() => {
    measure()
  }, [measure, value, options, variant, size])
  React.useEffect(() => {
    const track = trackRef.current
    if (track === null || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => measure())
    observer.observe(track)
    return () => observer.disconnect()
  }, [measure])
  const slides = variant === "pill" && pill !== null
  return (
    <ToggleGroupPrimitive<T>
      ref={trackRef}
      data-slot="segmented"
      data-variant={variant}
      data-size={size}
      data-pill={slides ? "on" : undefined}
      aria-label={label}
      value={groupValue}
      onValueChange={(next) => {
        /* single + required: pressing the active segment again keeps it */
        const picked = next.find((v) => v !== value) ?? next[0]
        if (picked !== undefined && picked !== value) onChange(picked)
      }}
      className={cn(segmentedTrackVariants({ variant }), "relative", className)}
      {...props}
    >
      {slides ? (
        <span
          aria-hidden
          data-slot="segmented-pill"
          className="pointer-events-none absolute top-[3px] bottom-[3px] left-0 rounded-full bg-card shadow-card transition-[transform,width] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
        />
      ) : null}
      {options.map((option) => (
        <TogglePrimitive<T>
          key={option.value}
          data-slot="segmented-item"
          value={option.value}
          disabled={option.disabled}
          className={cn(segmentedItemVariants({ variant, size }))}
        >
          {option.label}
          {option.count !== undefined ? (
            <span
              data-slot="segmented-count"
              /* The count in the mono figure face (the owner, 2026-09-01: "I liked the mono
                 font better"), at the label's EXACT size and line height so the two sit on one
                 baseline — the face's own metrics had read as another size. */
              className="num ml-1.5 text-[length:inherit] leading-[inherit] text-faint in-data-pressed:text-muted-foreground"
            >
              {option.count}
            </span>
          ) : null}
        </TogglePrimitive>
      ))}
    </ToggleGroupPrimitive>
  )
}

export { Segmented, segmentedTrackVariants, segmentedItemVariants }
export type { SegmentedOption, SegmentedProps }
