import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* Toggle — a two-state pill. `default` is borderless with a hover fill (an icon toggle in a
 * toolbar); `outline` carries the quiet hairline. Pressed = the deeper canvas tint, ink text,
 * a firmer hairline — the same ground a pressed Button takes. Sizes follow Button. */
const toggleVariants = cva(
  "group/toggle inline-flex shrink-0 items-center justify-center rounded-full border font-medium whitespace-nowrap transition-colors duration-[120ms] ease-out select-none disabled:cursor-not-allowed disabled:opacity-50 data-pressed:border-stone-400 data-pressed:bg-canvas-deep data-pressed:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:stroke-[1.5] [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-transparent text-muted-foreground not-disabled:hover:bg-accent not-disabled:hover:text-accent-foreground",
        outline:
          "border-border-strong bg-transparent text-muted-foreground not-disabled:hover:border-stone-400 not-disabled:hover:text-foreground",
      },
      size: {
        xs: "h-6 min-w-6 gap-1 px-2.5 text-[11.5px] [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 min-w-8 gap-1.5 px-3.5 text-[12.5px] [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-[34px] min-w-[34px] gap-1.5 px-4 text-[12.5px]",
        lg: "h-10 min-w-10 gap-1.5 px-5 text-[13.5px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "md",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      data-variant={variant}
      data-size={size}
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
