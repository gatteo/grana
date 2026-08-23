import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* The page skeleton on paper (RF `.section` / `.section--sunken` / `.wrap`).
 *
 * `Section` is the vertical rhythm — one clamped block of air above and below, the same for every
 * band, so a page reads as a document and not as a stack of boxes. `sunken` drops the band onto
 * the deeper ecru between two hairlines; it is how the page changes register without changing
 * colour. `Wrap` is the field measure: 1280 centred, with the fluid gutter. A band is always
 * `Section > Wrap` — the band paints edge to edge, the content stays inside the measure. */
const sectionVariants = cva("py-section", {
  variants: {
    variant: {
      plain: "",
      sunken: "border-y border-border bg-muted",
    },
  },
  defaultVariants: { variant: "plain" },
})

function Section({
  className,
  variant = "plain",
  ...props
}: React.ComponentProps<"section"> & VariantProps<typeof sectionVariants>) {
  return (
    <section
      data-slot="section"
      data-variant={variant}
      className={cn(sectionVariants({ variant }), className)}
      {...props}
    />
  )
}

function Wrap({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="wrap"
      className={cn("mx-auto w-full max-w-measure px-gutter", className)}
      {...props}
    />
  )
}

export { Section, Wrap, sectionVariants }
