import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* A Notice reports a condition the person did not cause — offline, degraded, nothing yet —
 * calmly, and may have nothing to offer but a single action. It stands apart from Alert on
 * purpose: Alert is `role="alert"` (an assertive live region for a message that just
 * happened); a Notice is a standing state of the page and announces nothing.
 *
 *   card  — Luminars `.notice`: sunken box, hairline, voice-face title (default)
 *   plain — RF `.empty`: a centered faint line, no box */
const noticeVariants = cva("grid", {
  variants: {
    variant: {
      card: "max-w-[560px] gap-1.5 rounded-md border border-border bg-surface-2 p-8",
      plain: "justify-items-center gap-1.5 px-6 py-10 text-center",
    },
  },
  defaultVariants: {
    variant: "card",
  },
})

function Notice({
  className,
  variant = "card",
  eyebrow,
  title,
  action,
  children,
  ...props
}: React.ComponentProps<"section"> &
  VariantProps<typeof noticeVariants> & {
    /** A mono-caps line above the title (RF upsell). */
    eyebrow?: React.ReactNode
    title?: React.ReactNode
    /** The one action that resolves the condition, if there is one. */
    action?: React.ReactNode
  }) {
  return (
    <section
      data-slot="notice"
      data-variant={variant}
      className={cn(noticeVariants({ variant }), className)}
      {...props}
    >
      {eyebrow ? (
        <span data-slot="notice-eyebrow" className="eyebrow">
          {eyebrow}
        </span>
      ) : null}
      {title ? (
        <h3
          data-slot="notice-title"
          className={cn(
            variant === "card"
              ? "font-voice text-base font-bold leading-tight"
              : "text-sm font-medium leading-snug"
          )}
        >
          {title}
        </h3>
      ) : null}
      {children != null ? (
        <div
          data-slot="notice-body"
          className={cn(
            "text-13 leading-normal",
            variant === "card" ? "text-muted-foreground" : "text-faint"
          )}
        >
          {children}
        </div>
      ) : null}
      {action ? (
        <div data-slot="notice-action" className="mt-1 flex flex-wrap items-center gap-2">
          {action}
        </div>
      ) : null}
    </section>
  )
}

export { Notice, noticeVariants }
