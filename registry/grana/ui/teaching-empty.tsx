import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/grana/ui/button"

/* The first-visit empty state that TEACHES (skin-spec §17, DSN-3): what this screen will
 * show and the one action that gets the person there. Exactly one action, and it is the ink
 * primary — an empty surface has no other verb to compete with. Pass `action` as a string
 * (+ `onAction`) and the Button is rendered here; pass a node to own it. */
function TeachingEmpty({
  className,
  eyebrow,
  title,
  body,
  action,
  onAction,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  /** A mono label above the title (the object kind this screen will list). */
  eyebrow?: React.ReactNode
  title: React.ReactNode
  /** One paragraph: what will appear here once there is something. */
  body?: React.ReactNode
  /** The ONE action. A string renders `<Button variant="primary">`; a node is rendered as-is. */
  action?: React.ReactNode
  onAction?: () => void
}) {
  return (
    <div
      data-slot="teaching-empty"
      className={cn(
        "flex flex-col items-start gap-2 rounded-md border border-border bg-card px-8 py-9",
        className
      )}
      {...props}
    >
      {eyebrow !== undefined && eyebrow !== null ? (
        <span data-slot="teaching-empty-eyebrow" className="eyebrow block">
          {eyebrow}
        </span>
      ) : null}
      <div
        data-slot="teaching-empty-title"
        className="font-voice text-[19px] leading-[1.2] font-bold tracking-[-0.01em] text-balance in-data-[brand=rf]:font-medium"
      >
        {title}
      </div>
      {body !== undefined && body !== null ? (
        <p
          data-slot="teaching-empty-body"
          className="max-w-[62ch] text-13 leading-[1.55] text-muted-foreground"
        >
          {body}
        </p>
      ) : null}
      {children}
      {action !== undefined && action !== null ? (
        <div data-slot="teaching-empty-action" className="mt-1.5">
          {typeof action === "string" ? (
            <Button variant="primary" onClick={onAction}>
              {action}
            </Button>
          ) : (
            action
          )}
        </div>
      ) : null}
    </div>
  )
}

export { TeachingEmpty }
