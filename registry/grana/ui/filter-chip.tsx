import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"

import { cn } from "@/lib/utils"

/* FilterChip — skin-spec §4. A pressable pill for a DYNAMIC, wrapping, many-of-many set (the
 * connector catalog); deliberately not a Segmented variant. `selected` is the pressed state;
 * the chip reports it as `aria-pressed`. A count, when given, is set in the chip's sans, `tabular`. */
type FilterChipProps = Omit<
  TogglePrimitive.Props,
  "pressed" | "defaultPressed" | "onPressedChange"
> & {
  selected?: boolean
  defaultSelected?: boolean
  onSelectedChange?: TogglePrimitive.Props["onPressedChange"]
  count?: number
}

function FilterChip({
  className,
  selected,
  defaultSelected,
  onSelectedChange,
  count,
  children,
  ...props
}: FilterChipProps) {
  return (
    <TogglePrimitive
      data-slot="filter-chip"
      pressed={selected}
      defaultPressed={defaultSelected}
      onPressedChange={onSelectedChange}
      className={cn(
        "press inline-flex h-[30px] shrink-0 items-center justify-center gap-1.5 rounded-full border border-border-strong px-3.5 text-[12.5px] whitespace-nowrap text-muted-foreground duration-[120ms] ease-out select-none not-disabled:hover:border-stone-400 not-disabled:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 data-pressed:bg-canvas-deep data-pressed:font-medium data-pressed:text-foreground [&_svg]:size-3.5 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      {count !== undefined ? (
        <span data-slot="filter-chip-count" className="tabular text-faint">
          {count}
        </span>
      ) : null}
    </TogglePrimitive>
  )
}

export { FilterChip }
export type { FilterChipProps }
