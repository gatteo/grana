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
 * `boxed` is the RF recipe: a bordered group with hairline separators and a SUNKEN active. */
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
  "inline-flex items-center justify-center whitespace-nowrap text-muted-foreground transition-colors duration-[120ms] ease-out select-none not-disabled:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 data-pressed:font-medium data-pressed:text-foreground",
  {
    variants: {
      variant: {
        pill: "rounded-full data-pressed:bg-card data-pressed:shadow-card",
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
  return (
    <ToggleGroupPrimitive<T>
      data-slot="segmented"
      data-variant={variant}
      data-size={size}
      aria-label={label}
      value={groupValue}
      onValueChange={(next) => {
        /* single + required: pressing the active segment again keeps it */
        const picked = next.find((v) => v !== value) ?? next[0]
        if (picked !== undefined && picked !== value) onChange(picked)
      }}
      className={cn(segmentedTrackVariants({ variant }), className)}
      {...props}
    >
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
              className="num ml-1.5 text-faint in-data-pressed:text-muted-foreground"
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
