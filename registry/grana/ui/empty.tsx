import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* The generic empty surface (skin-spec §12). `plain` is the RF `.empty` — a centred faint
 * line, no box. `card` is the Luminars `Notice` — a sunken hairline card that reports a
 * condition the person did not cause. The one that TEACHES (what the screen will show and
 * the action that fills it) is `TeachingEmpty`, not this. */
const emptyVariants = cva(
  "flex w-full min-w-0 flex-1 flex-col gap-4 text-balance",
  {
    variants: {
      variant: {
        plain: "items-center justify-center px-6 py-10 text-center",
        card: "max-w-[560px] items-start rounded-md border border-border bg-surface-2 p-8 text-left",
      },
    },
    defaultVariants: { variant: "plain" },
  }
)

function Empty({
  className,
  variant = "plain",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyVariants>) {
  return (
    <div
      data-slot="empty"
      data-variant={variant}
      className={cn(emptyVariants({ variant }), className)}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-sm flex-col gap-1.5 in-data-[variant=plain]:items-center",
        className
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex size-8 shrink-0 items-center justify-center rounded-sm bg-muted text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

/* The title is a voice moment on the card (Luminars notice: display 700 16px); the plain
 * variant keeps it a quiet sans line. */
function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        "text-sm font-medium in-data-[variant=card]:font-voice in-data-[variant=card]:text-base in-data-[variant=card]:font-bold in-data-[variant=card]:tracking-[-0.01em] in-data-[brand=rf]:in-data-[variant=card]:font-medium",
        className
      )}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-description"
      className={cn(
        "text-13 leading-[1.5] text-muted-foreground in-data-[variant=plain]:text-faint [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col gap-2.5 text-sm text-balance in-data-[variant=plain]:items-center",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
  emptyVariants,
}
