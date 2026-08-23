import * as React from "react"

import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

/* Luminars' `Select`: the OS popup on purpose ("unbeatable for keyboard and assistive tech").
 * The field shell with `appearance: none`, 26px of right padding and an SVG caret at 9px from
 * the edge in `text-faint` (the spec's `⌄` glyph depended on the face having it). */
type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative inline-flex w-full items-center has-[select:disabled]:opacity-60",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="h-[34px] w-full min-w-0 cursor-pointer appearance-none rounded-sm border border-input bg-card py-[7px] pr-[26px] pl-2.5 text-13 text-foreground transition-colors duration-[120ms] select-none not-disabled:hover:border-border-strong disabled:cursor-default disabled:bg-muted aria-invalid:border-destructive data-[size=sm]:h-7 data-[size=sm]:py-0.5 data-[size=sm]:text-xs"
        {...props}
      />
      <ChevronDownIcon
        className="pointer-events-none absolute top-1/2 right-[9px] size-3.5 -translate-y-1/2 text-faint select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
