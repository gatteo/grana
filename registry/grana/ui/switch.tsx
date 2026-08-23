import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

/* Neither kit had a switch; this is the Checkbox's rule on a track. Off: a sunken track
 * (`bg-muted`) in the frame hairline with a white thumb ringed by the same hairline. On: ink
 * track, white thumb. No brand hue, no ring of its own — the global `:focus-visible` outline
 * is the focus state. 30×18 (thumb 14) by default, 24×14 (thumb 10) for `size="sm"`. */
function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border transition-colors duration-[120ms] after:absolute after:-inset-x-3 after:-inset-y-2 aria-invalid:border-destructive data-[size=default]:h-[18px] data-[size=default]:w-[30px] data-[size=sm]:h-3.5 data-[size=sm]:w-6 data-checked:border-primary data-checked:bg-primary data-unchecked:border-border-strong data-unchecked:bg-muted data-disabled:cursor-default data-disabled:opacity-50 not-data-disabled:data-unchecked:hover:border-stone-400",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-card ring-1 ring-border-strong transition-transform duration-[120ms] ease-brand-out data-checked:bg-primary-foreground data-checked:ring-0 group-data-[size=default]/switch:size-3.5 group-data-[size=default]/switch:data-checked:translate-x-[13px] group-data-[size=default]/switch:data-unchecked:translate-x-px group-data-[size=sm]/switch:size-2.5 group-data-[size=sm]/switch:data-checked:translate-x-[11px] group-data-[size=sm]/switch:data-unchecked:translate-x-px"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
