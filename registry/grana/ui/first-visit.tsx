"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/grana/ui/button"

/* The dismissible first-visit panel (skin-spec §17): a per-surface explainer shown until
 * dismissed, remembered in localStorage. Inline, never a modal — the surface stays usable
 * while it teaches. Renders nothing once dismissed. */

const DEFAULT_PREFIX = "grana.guide."

function readDismissed(key: string) {
  try {
    return typeof localStorage !== "undefined" && localStorage.getItem(key) === "dismissed"
  } catch {
    return false
  }
}

function FirstVisit({
  className,
  id,
  title,
  dismissLabel,
  storagePrefix = DEFAULT_PREFIX,
  onDismiss,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title" | "id"> & {
  /** Stable per-surface key; dismissal is remembered under `${storagePrefix}${id}`. */
  id: string
  title: React.ReactNode
  /** The dismiss verb, in the product's words ("Ho capito", "Got it"). */
  dismissLabel: React.ReactNode
  /** Override to keep an existing product's stored dismissals (Luminars: `luminars.guide.`). */
  storagePrefix?: string
  onDismiss?: () => void
}) {
  const storageKey = `${storagePrefix}${id}`
  const [dismissed, setDismissed] = React.useState(() => readDismissed(storageKey))
  if (dismissed) return null
  return (
    <div
      data-slot="first-visit"
      className={cn(
        "mb-4 flex items-start justify-between gap-4 rounded-md border border-border bg-surface-2 px-4 py-3",
        className
      )}
      {...props}
    >
      <div
        data-slot="first-visit-body"
        className="flex max-w-[68ch] min-w-0 flex-col gap-[3px]"
      >
        <span data-slot="first-visit-title" className="text-13 font-semibold">
          {title}
        </span>
        <span
          data-slot="first-visit-text"
          className="text-[12.5px] leading-[1.5] text-muted-foreground"
        >
          {children}
        </span>
      </div>
      <Button
        data-slot="first-visit-dismiss"
        variant="quiet"
        size="xs"
        className="flex-none"
        onClick={() => {
          try {
            localStorage.setItem(storageKey, "dismissed")
          } catch {
            /* private mode: the panel still goes away for this session */
          }
          setDismissed(true)
          onDismiss?.()
        }}
      >
        {dismissLabel}
      </Button>
    </div>
  )
}

export { FirstVisit }
