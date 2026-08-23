import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* The page skeleton on paper (RF `.section` / `.section--sunken` / `.wrap`).
 *
 * `Section` is the vertical rhythm — one clamped block of air above and below, the same for every
 * band, so a page reads as a document and not as a stack of boxes. `sunken` drops the band onto
 * the deeper ecru between two hairlines; it is how the page changes register without changing
 * colour. `Wrap` is the field measure: 1280 centred, with the fluid gutter. A band is always
 * `Section > Wrap` — the band paints edge to edge, the content stays inside the measure.
 *
 * Both take `render`: the band that is the page's `<main>`, the aside that runs beside it, the
 * wrap that is really a `<form>` — same recipe, the tag the document needs. */
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
  render,
  ...props
}: useRender.ComponentProps<"section"> & VariantProps<typeof sectionVariants>) {
  return useRender({
    defaultTagName: "section",
    props: mergeProps<"section">(
      {
        className: cn(sectionVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "section",
      variant: variant ?? "plain",
    },
  })
}

function Wrap({ className, render, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("mx-auto w-full max-w-measure px-gutter", className),
      },
      props
    ),
    render,
    state: { slot: "wrap" },
  })
}

export { Section, Wrap, sectionVariants }
