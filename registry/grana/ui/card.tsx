import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* The surface box (skin-spec §13). Luminars `.card` and RF `.panel` agree on the shell:
 * white, 1px hairline, 10px radius. `padded` is the Luminars default (18px 20px); a Card with
 * `padded={false}` is a frame whose children own the edges (a Table, a Feed) — it clips them to
 * its radius. `elevated` resolves to the shadow token, which the RF product surface nulls.
 *
 * `layout` is the card's own direction. `stack` is the default and the only one that touches a
 * child: an eyebrow as a direct child is the card's section label and takes the 10px of air under
 * it. `row` lays the card out as a row and imposes nothing — an eyebrow there is the caller's to
 * place. (The old `[&>.eyebrow]:block` is gone: a direct child of a flex box is blockified anyway,
 * so it only ever overrode a caller's own display.) */
const cardVariants = cva(
  "group/card relative flex rounded-md border border-border bg-card text-card-foreground",
  {
    variants: {
      layout: {
        stack: "flex-col [&>.eyebrow]:mb-2.5",
        row: "flex-row items-center gap-3",
      },
      tone: {
        surface: "",
        sunken: "bg-surface-2",
      },
      padded: {
        true: "px-5 py-[18px]",
        false: "overflow-hidden",
      },
      elevated: {
        true: "shadow-card",
        false: "",
      },
    },
    defaultVariants: {
      layout: "stack",
      tone: "surface",
      padded: true,
      elevated: false,
    },
  }
)

function Card({
  className,
  layout = "stack",
  tone = "surface",
  padded = true,
  elevated = false,
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(cardVariants({ layout, tone, padded, elevated }), className),
      },
      props
    ),
    render,
    state: {
      slot: "card",
      layout,
      tone,
      padded: padded ? "on" : "off",
      elevated: elevated ? "on" : "off",
    },
  })
}

/* RF `PanelHead`: 500-weight title left, mono context right, bottom hairline. Inside an
 * unpadded Card it pads itself (14px 16px); inside a padded Card it sits in the padding and
 * keeps only the hairline below. `title` / `context` / `actions` are the RF prop form; children
 * (CardTitle, CardDescription, CardAction) compose the same row. */
function CardHeader({
  className,
  title,
  context,
  actions,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  title?: React.ReactNode | undefined
  context?: React.ReactNode | undefined
  actions?: React.ReactNode | undefined
}) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header flex items-center justify-between gap-4 border-b border-border",
        "group-data-[padded=off]/card:px-4 group-data-[padded=off]/card:py-3.5",
        "group-data-[padded=on]/card:mb-4 group-data-[padded=on]/card:pb-3.5",
        className
      )}
      {...props}
    >
      {title !== undefined ? (
        <div data-slot="card-header-text" className="flex min-w-0 flex-col gap-0.5">
          <CardTitle>{title}</CardTitle>
          {children}
        </div>
      ) : (
        children
      )}
      {context !== undefined ? (
        <p data-slot="card-context" className="num shrink-0 text-13 text-faint">
          {context}
        </p>
      ) : null}
      {actions !== undefined ? <CardAction>{actions}</CardAction> : null}
    </div>
  )
}

function CardTitle({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "text-[15px] leading-snug font-medium tracking-[-0.012em] text-foreground",
          className
        ),
      },
      props
    ),
    render,
    state: { slot: "card-title" },
  })
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-13 text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("ml-auto flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  )
}

/* Pads itself only inside an unpadded Card; a padded Card already owns its padding. */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("group-data-[padded=off]/card:p-4", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-2 border-t border-border",
        "group-data-[padded=off]/card:px-4 group-data-[padded=off]/card:py-3.5",
        "group-data-[padded=on]/card:mt-4 group-data-[padded=on]/card:pt-3.5",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
