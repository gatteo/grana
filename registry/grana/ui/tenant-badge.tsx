import * as React from "react"

import { cn } from "@/lib/utils"

/* The tenant identity row (skin-spec §18): a 28px square ink tile with the customer's
 * initials (or logo) + name + a meta line. In a neutral multi-tenant tool the customer's
 * mark is the only identity the chrome carries. */

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => (part[0] ?? "").toUpperCase())
    .join("")
}

function TenantTile({
  className,
  name,
  logoUrl,
  ...props
}: React.ComponentProps<"span"> & {
  name: string
  logoUrl?: string
}) {
  return (
    <span
      data-slot="tenant-tile"
      className={cn(
        "grid size-7 shrink-0 place-items-center overflow-hidden rounded-sm bg-primary text-[11px] font-semibold tracking-[0.01em] text-primary-foreground select-none",
        className
      )}
      {...props}
    >
      {logoUrl ? (
        <img src={logoUrl} alt="" className="size-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  )
}

function TenantBadge({
  className,
  name,
  detail,
  logoUrl,
  ...props
}: React.ComponentProps<"div"> & {
  name: string
  /** The meta line under the name: the plan, the unit, the seat count. */
  detail?: React.ReactNode
  logoUrl?: string
}) {
  return (
    <div
      data-slot="tenant-badge"
      className={cn("flex min-w-0 items-center gap-2.5 px-2 pt-1.5 pb-4", className)}
      {...props}
    >
      <TenantTile name={name} logoUrl={logoUrl} />
      <span data-slot="tenant-badge-text" className="flex min-w-0 flex-col">
        <span
          data-slot="tenant-badge-name"
          className="truncate text-sm leading-[1.3] font-medium tracking-[-0.01em]"
        >
          {name}
        </span>
        {detail !== undefined && detail !== null ? (
          <span
            data-slot="tenant-badge-detail"
            className="truncate text-[11px] leading-[1.4] text-faint"
          >
            {detail}
          </span>
        ) : null}
      </span>
    </div>
  )
}

export { TenantBadge, TenantTile }
