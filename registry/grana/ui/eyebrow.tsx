import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* The mono ALL-CAPS section label (skin-spec §0.5 / §19) as a component. `md` is the
 * `eyebrow` utility verbatim; the other sizes are the kits' smaller and larger caps recipes
 * normalised onto one scale. Always mono, 500, uppercase, `text-faint`. */
const eyebrowVariants = cva("eyebrow inline-flex items-baseline", {
  variants: {
    size: {
      xs: "text-[9.5px] tracking-[0.08em]",
      sm: "text-[10px] tracking-[0.08em]",
      md: "",
      lg: "text-xs tracking-[0.14em]",
    },
    tint: {
      none: "",
      demand: "text-unit-demand",
      piattaforma: "text-unit-piattaforma",
      academy: "text-unit-academy",
      installatori: "text-unit-installatori",
    },
  },
  defaultVariants: {
    size: "md",
    tint: "none",
  },
})

type EyebrowProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof eyebrowVariants> & {
    /** The numbered-index form ("01"…"06"): rendered in the warm accent before the label. */
    index?: string | undefined
  }

function Eyebrow({
  className,
  size = "md",
  tint = "none",
  index,
  render,
  children,
  ...props
}: EyebrowProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(eyebrowVariants({ size, tint }), className),
        children: (
          <>
            {index ? (
              <b
                data-slot="eyebrow-index"
                className="mr-[0.625em] font-medium text-ochre"
              >
                {index}
              </b>
            ) : null}
            {children}
          </>
        ),
      },
      props
    ),
    render,
    state: {
      slot: "eyebrow",
      size,
    },
  })
}

/* The marketing section header (skin-spec §19): numbered eyebrow + h2 + optional lead, with
 * the measure rules. The h2 is the display face on purpose — this is a marketing band, not the
 * product surface, so it does not ask the brand which voice to use. */
function SectionHead({
  className,
  index,
  eyebrow,
  title,
  lead,
  serifLead = false,
  align = "start",
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  index?: string | undefined
  eyebrow: React.ReactNode
  title: React.ReactNode
  lead?: React.ReactNode
  /** Switches the lead to the serif editorial voice. */
  serifLead?: boolean
  align?: "start" | "center"
}) {
  return (
    <div
      data-slot="section-head"
      data-align={align}
      className={cn(
        "mb-[clamp(2.5rem,4vw,3.5rem)] max-w-[max(38rem,70%)]",
        align === "center" && "mx-auto max-w-[56ch] text-center",
        className
      )}
      {...props}
    >
      <Eyebrow size="lg" index={index} className="mb-5 block">
        {eyebrow}
      </Eyebrow>
      <h2
        data-slot="section-head-title"
        className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.04] font-bold tracking-[-0.02em] text-balance"
      >
        {title}
      </h2>
      {lead !== undefined && lead !== null ? (
        <p
          data-slot="section-head-lead"
          className={cn(
            "mt-4 max-w-[max(32rem,62%)] text-muted-foreground",
            align === "center" && "mx-auto max-w-[48ch]",
            serifLead && "font-serif text-lg"
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  )
}

export { Eyebrow, SectionHead, eyebrowVariants }
