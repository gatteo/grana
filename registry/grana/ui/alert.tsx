import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* An inline message about something that just happened (`role="alert"`). Hairline on the
 * card ground, 13px; a leading mark — a lucide icon or a `StatusDot` — takes the first
 * column. Status never decorates: the destructive variant colours the mark, the title and
 * the hairline (the one permitted coloured border), never a fill.
 *
 * For a standing condition the person did not cause (offline, nothing yet) use `Notice`. */
const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-md border border-border bg-card px-3.5 py-3 text-left text-13 has-data-[slot=alert-action]:pr-20 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 has-[>[data-slot=status-dot]]:grid-cols-[auto_1fr] has-[>[data-slot=status-dot]]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-px *:[svg]:text-current *:[svg:not([class*='size-'])]:size-3.5 *:data-[slot=status-dot]:row-span-2 *:data-[slot=status-dot]:mt-[6px]",
  {
    variants: {
      variant: {
        default: "text-foreground",
        destructive:
          "border-destructive text-foreground *:[svg]:text-destructive *:data-[slot=alert-title]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 group-has-[>[data-slot=status-dot]]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-13 text-pretty text-muted-foreground group-has-[>svg]/alert:col-start-2 group-has-[>[data-slot=status-dot]]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-3",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2 right-2", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction, alertVariants }
