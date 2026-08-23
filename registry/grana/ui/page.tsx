import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* The content-panel page and its header (skin-spec §14).
 *
 * The readable column is a design rule, not a per-screen taste: `narrow` (760) reads —
 * settings, a history; `medium` (860) mixes prose with objects; `wide` (1080) is for tables.
 * `full` fills the card (the RF page) and pairs with `stack` (flex column, gap 20). */

const pageVariants = cva("mx-auto w-full min-w-0", {
  variants: {
    width: {
      narrow: "max-w-[760px]",
      medium: "max-w-[860px]",
      wide: "max-w-[1080px]",
      full: "max-w-none",
    },
    pad: {
      tight: "px-7 pt-[22px] pb-10",
      default: "px-8 pt-7 pb-10",
      roomy: "px-10 py-8",
      none: "p-0",
    },
    stack: {
      true: "flex flex-col gap-5",
      false: "",
    },
  },
  defaultVariants: {
    width: "medium",
    pad: "default",
    stack: false,
  },
})

function Page({
  className,
  width = "medium",
  pad = "default",
  stack = false,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof pageVariants>) {
  return (
    <div
      data-slot="page"
      data-width={width}
      data-pad={pad}
      className={cn(pageVariants({ width, pad, stack }), className)}
      {...props}
    />
  )
}

/* The title speaks in the product's voice: `font-voice` resolves to Cabinet Grotesk on
 * Luminars and General Sans on RF from the token alone. The weight follows the same split
 * (Luminars 700, RF 500 — skin-spec §14); there is no weight token yet, so it reads the
 * brand attribute directly. */
const pageTitleVariants = cva(
  "font-voice font-bold tracking-[-0.01em] text-balance in-data-[brand=rf]:font-medium in-data-[brand=rf]:tracking-[-0.022em]",
  {
    variants: {
      size: {
        page: "text-2xl leading-[1.15]",
        object: "text-xl leading-[1.2]",
      },
    },
    defaultVariants: { size: "page" },
  }
)

function PageHead({
  className,
  title,
  subtitle,
  eyebrow,
  actions,
  size = "page",
  children,
  ...props
}: Omit<React.ComponentProps<"header">, "title"> & {
  title: React.ReactNode
  /** One line under the title; carries tabular figures for the counts it usually holds. */
  subtitle?: React.ReactNode
  /** A mono label above the title (a section, an object kind). */
  eyebrow?: React.ReactNode
  /** The right-hand verbs. One primary at most — weight, not colour. */
  actions?: React.ReactNode
  /** `page` is a top-level surface's own name; `object` the smaller size of a detail screen. */
  size?: "page" | "object"
}) {
  return (
    <header
      data-slot="page-head"
      data-size={size}
      className={cn(
        "mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3",
        className
      )}
      {...props}
    >
      <div data-slot="page-head-text" className="min-w-0 flex-1">
        {eyebrow !== undefined && eyebrow !== null ? (
          <span data-slot="page-head-eyebrow" className="eyebrow mb-1.5 block">
            {eyebrow}
          </span>
        ) : null}
        <h1 data-slot="page-title" className={pageTitleVariants({ size })}>
          {title}
        </h1>
        {subtitle !== undefined && subtitle !== null ? (
          <p
            data-slot="page-subtitle"
            className="tabular mt-1 max-w-[62ch] text-muted-foreground"
          >
            {subtitle}
          </p>
        ) : null}
        {children}
      </div>
      {actions !== undefined && actions !== null ? (
        <div
          data-slot="page-head-actions"
          className="flex flex-none items-center gap-2"
        >
          {actions}
        </div>
      ) : null}
    </header>
  )
}

export { Page, PageHead, pageVariants, pageTitleVariants }
