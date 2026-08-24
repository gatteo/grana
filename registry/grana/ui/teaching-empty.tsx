import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/grana/ui/button"

/* The first-visit empty state that TEACHES (skin-spec §17, DSN-3): what this screen will
 * show and the one action that gets the person there. Exactly one action, and it is the ink
 * primary — an empty surface has no other verb to compete with. Pass `action` as a string
 * (+ `onAction`) and the Button is rendered here; pass a node to own it.
 *
 * With `media` it becomes the two-column shape from the Luminars Home drawing (2026-08-24):
 * copy on the left, VERTICALLY CENTRED against the picture so a short block does not strand
 * its title at the top of an otherwise empty card, and the picture in a 296px column that
 * bleeds past the card's right and bottom edges so it reads as cropped rather than inset.
 * The frame paints the dotted ground; what sits on it is the caller's node, and it should be
 * a miniature of the real thing drawn from the same tokens — never an imported screenshot,
 * which goes stale the moment the product moves.
 *
 * `dim` fades that picture to half: a ghost of what belongs here. Two states want it — day
 * zero, where the thing has not happened yet, and a read that FAILED, where a bright
 * illustration would read as a healthy specimen of something the app cannot actually see. */
function TeachingEmpty({
  className,
  eyebrow,
  title,
  body,
  action,
  onAction,
  media,
  dim = false,
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
  /** A drawn miniature of what belongs here, cropped by the card's right and bottom edges. */
  media?: React.ReactNode
  /** Fade the picture to half — a ghost, not a specimen. */
  dim?: boolean
}) {
  const framed = media !== undefined && media !== null
  const copy = (
    <>
      {eyebrow !== undefined && eyebrow !== null ? (
        <span data-slot="teaching-empty-eyebrow" className="eyebrow block">
          {eyebrow}
        </span>
      ) : null}
      <div
        data-slot="teaching-empty-title"
        className="voice text-[19px] leading-[1.2] tracking-[-0.01em] text-balance"
      >
        {title}
      </div>
      {body !== undefined && body !== null ? (
        <p
          data-slot="teaching-empty-body"
          className="max-w-[52ch] text-13 leading-[1.55] text-muted-foreground"
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
    </>
  )

  if (!framed) {
    return (
      <div
        data-slot="teaching-empty"
        className={cn(
          "flex flex-col items-start gap-2 rounded-md border border-border bg-card px-8 py-9",
          className
        )}
        {...props}
      >
        {copy}
      </div>
    )
  }

  return (
    <div
      data-slot="teaching-empty"
      data-media="on"
      data-dim={dim ? "on" : undefined}
      className={cn(
        "relative grid grid-cols-[minmax(0,1fr)_296px] items-stretch overflow-hidden rounded-md border border-border bg-card",
        className
      )}
      {...props}
    >
      <div
        data-slot="teaching-empty-copy"
        className="flex flex-col items-start justify-center gap-[7px] px-7 py-[26px]"
      >
        {copy}
      </div>
      {/* The negative margins eat the card's own hairline on three sides, so the picture
          runs off the edge instead of stopping a pixel short of it. */}
      <div
        data-slot="teaching-empty-media"
        className="relative -mt-px -mr-px -mb-px min-h-[172px] overflow-hidden border-l border-border bg-surface-2"
      >
        <span
          aria-hidden="true"
          data-slot="teaching-empty-ground"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--stone-300)_1px,transparent_1px)] opacity-50 [background-size:13px_13px]"
        />
        <div className={cn("absolute inset-0", dim && "opacity-50")}>{media}</div>
      </div>
    </div>
  )
}

export { TeachingEmpty }
