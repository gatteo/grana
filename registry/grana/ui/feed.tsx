import * as React from "react"

import { cn } from "@/lib/utils"
import { Avatar } from "@/registry/grana/ui/avatar"
import { getInitials } from "@/lib/utils"
import { Badge } from "@/registry/grana/ui/badge"

/* The activity feed (skin-spec §18): rows of actor + sentence + mono timestamp, and the
 * human/machine contract. Humans: round Avatar with initials. Machines: the Avatar's dashed
 * square tile (`AI`, `SYS`) + a dashed mono Badge after the sentence (inferred, not
 * asserted). The round/square + solid/dashed distinction IS the contract — never use dashed
 * for anything else. The badge's words are the product's (`label`), never hardcoded here. */

type FeedActorKind = "human" | "ai" | "system"

function Feed({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="feed"
      className={cn("m-0 list-none px-4 pt-1.5 pb-4", className)}
      {...props}
    />
  )
}

function FeedItem({
  className,
  kind,
  actor,
  time,
  dateTime,
  label,
  variant = "filled",
  children,
  ...props
}: React.ComponentProps<"li"> & {
  kind: FeedActorKind
  /** Who acted: a person's name (initials are derived) or the agent/system name. */
  actor: string
  /** The display time ("14:32", "ieri"). */
  time: React.ReactNode
  /** The machine-readable instant for the `<time>` element. */
  dateTime?: string
  /** The dashed badge after a machine's sentence ("Azione AI", "Automatico"). Product-supplied. */
  label?: React.ReactNode
  /** The human avatar's fill: `filled` (RF) or `outline` (Luminars). */
  variant?: "filled" | "outline"
}) {
  const machine = kind !== "human"
  return (
    <li
      data-slot="feed-item"
      data-kind={kind}
      className={cn(
        "grid grid-cols-[27px_1fr] gap-3 border-b border-border py-[11px] last:border-b-0",
        className
      )}
      {...props}
    >
      <Avatar
        data-slot="feed-actor"
        size="md"
        kind={machine ? "machine" : "human"}
        variant={variant}
        initials={machine ? (kind === "ai" ? "AI" : "SYS") : getInitials(actor)}
        title={actor}
      />
      <div data-slot="feed-item-body" className="min-w-0">
        <p
          data-slot="feed-item-text"
          className="text-13 leading-[1.45] [&_strong]:font-medium"
        >
          {children}
          {machine && label !== undefined && label !== null ? (
            <Badge
              variant="action"
              data-slot="feed-item-label"
              className="ml-1.5 align-[1px]"
            >
              {label}
            </Badge>
          ) : null}
        </p>
        <time
          data-slot="feed-item-time"
          dateTime={dateTime}
          className="num mt-[3px] block text-[11px] text-faint"
        >
          {time}
        </time>
      </div>
    </li>
  )
}

export { Feed, FeedItem, type FeedActorKind }
