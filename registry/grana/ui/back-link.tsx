import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowLeftIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/* The way back up — skin-spec §2. `inline` is the Luminars kit recipe (a faint 13px line
 * above a detail page); `nav` is the shell recipe (a padded row in the object-focus takeover,
 * with the hover fill of a nav item). Renders a <button> by default; `render={<a href>}`
 * hands it to a router. */
const backLinkVariants = cva(
  "inline-flex items-center gap-1.5 text-left whitespace-nowrap transition-colors duration-[120ms] ease-out select-none [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:stroke-[1.75]",
  {
    variants: {
      variant: {
        inline: "text-[13px] text-faint hover:text-foreground",
        nav: "rounded-sm px-2 py-[7px] text-sm font-medium text-muted-foreground hover:bg-canvas-deep hover:text-foreground",
      },
    },
    defaultVariants: {
      variant: "inline",
    },
  }
)

function BackLink({
  className,
  variant = "inline",
  children,
  nativeButton,
  render,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof backLinkVariants>) {
  const isNative = nativeButton ?? render === undefined
  return (
    <ButtonPrimitive
      data-slot="back-link"
      data-variant={variant}
      type={isNative ? "button" : undefined}
      render={render}
      nativeButton={isNative}
      className={cn(backLinkVariants({ variant }), className)}
      {...props}
    >
      <ArrowLeftIcon aria-hidden />
      {children}
    </ButtonPrimitive>
  )
}

export { BackLink, backLinkVariants }
