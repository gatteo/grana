import * as React from "react"

import { cn } from "@/lib/utils"

/* A live state and its one recovery, in ONE shape for every state (Luminars Home drawing,
 * 2026-08-24): a status mark, the state named in words, a description of what that means
 * right now, and the single action that changes it.
 *
 * It is not a Notice. A Notice reports a condition and may have nothing to offer; a band
 * reports something that is TRUE AT THIS MOMENT and always carries the lever that changes
 * it. Keeping one component per state — running, held, degraded — is the point: three
 * hand-assembled blocks drift, and a degraded state that has drifted is exactly the one the
 * reader most needs to trust (CST-10, 002-AC-2).
 *
 * `status` is a node rather than a tone, because the mark is often a StatusDot with `live`
 * and sometimes an icon; the caller owns it. Whatever it is, it sits BESIDE a word — the
 * band never reports state by colour alone (DSN-6). */
function ContextBand({
  className,
  status,
  title,
  description,
  action,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  /** The status mark — usually a StatusDot, sometimes a 14px icon. */
  status?: React.ReactNode
  /** The state, in words. "Context Collection is on". */
  title: React.ReactNode
  /** What that means now: elapsed time, a resume time, the reason it is degraded. */
  description?: React.ReactNode
  /** The one lever that changes the state. */
  action?: React.ReactNode
}) {
  return (
    <div
      data-slot="context-band"
      className={cn(
        "relative flex items-start gap-2.5 rounded-md border border-border bg-surface-2 py-[11px] pr-3 pb-3 pl-[13px]",
        className
      )}
      {...props}
    >
      {status !== undefined && status !== null ? (
        <span
          data-slot="context-band-status"
          className="mt-1 flex flex-none items-center"
        >
          {status}
        </span>
      ) : null}
      <span data-slot="context-band-text" className="min-w-0 flex-1">
        <span
          data-slot="context-band-title"
          className="block text-13 leading-[1.35] font-medium text-foreground"
        >
          {title}
        </span>
        {description !== undefined && description !== null ? (
          <span
            data-slot="context-band-description"
            className="mt-[3px] flex flex-wrap items-center gap-x-[5px] gap-y-1 text-xs leading-[1.5] text-muted-foreground"
          >
            {description}
          </span>
        ) : null}
        {children}
      </span>
      {action !== undefined && action !== null ? (
        <span
          data-slot="context-band-action"
          className="mt-px flex flex-none items-center gap-[7px]"
        >
          {action}
        </span>
      ) : null}
    </div>
  )
}

export { ContextBand }
