import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* The module map (RF `.modules` / `.module`).
 *
 * A hairline grid, not a row of cards: the 1px gaps are the page's line colour showing through,
 * so the whole map reads as one drawn table. Four columns, two at 1000, one at 560.
 *
 * Every cell carries its state in words — Live, Beta, In arrivo — because the roadmap is public:
 * what does not exist yet is printed next to what does, and a customer can tell them apart
 * without asking. No icons anywhere; the group label and the state are the only ornament. */

type ModuleStatusTone = "live" | "beta" | "soon"

interface ModuleStatus {
  /** Chip label, passed in as a string (e.g. "Live", "Beta", "In arrivo"). */
  label: string
  tone: ModuleStatusTone
}

/* The state chip: mono caps at 10px, and the three tones the roadmap needs. `live` is the only
 * one that carries colour, and it carries the AA-safe ink over a 12% wash — never colour alone,
 * the word is always there. `soon` is a hairline outline: an outline is a thing not filled in. */
const moduleStatusVariants = cva(
  "rounded-[3px] px-[0.4375rem] py-[0.1875rem] font-mono text-[0.625rem] tracking-[0.06em] uppercase",
  {
    variants: {
      tone: {
        live: "bg-status-good/12 text-status-good-ink",
        beta: "bg-stone-100 text-muted-foreground",
        soon: "bg-transparent text-stone-400 inset-ring inset-ring-border-strong",
      },
    },
    defaultVariants: { tone: "live" },
  }
)

type ModulesGridProps = React.ComponentProps<"div"> & {
  /** `<ModuleCell />` children. */
  children: React.ReactNode
  /** Reveal stagger delay in seconds. */
  delay?: number
}

/** Hairline-gap grid: 1px gaps on the line background, 4/2/1 columns. */
function ModulesGrid({ className, children, delay, style, ...props }: ModulesGridProps) {
  return (
    <div
      data-slot="modules-grid"
      data-reveal=""
      style={
        {
          ...(delay ? { "--d": `${delay}s` } : {}),
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "grid grid-cols-4 gap-px overflow-hidden rounded-img border border-border bg-border",
        "max-[1000px]:grid-cols-2 max-[560px]:grid-cols-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

type ModuleCellProps = React.ComponentProps<"article"> & {
  /** Mono uppercase group label, e.g. "Acquisizione". */
  group: React.ReactNode
  status?: ModuleStatus
  /** Display-face module name; pass a link element to make it navigable. */
  name: React.ReactNode
  copy: React.ReactNode
}

/** One module cell: group label + status chip, name, xs copy. No icons. */
function ModuleCell({ className, group, status, name, copy, ...props }: ModuleCellProps) {
  return (
    <article
      data-slot="module-cell"
      className={cn(
        "flex min-h-[176px] flex-col gap-2 bg-card px-[1.375rem] pt-6 pb-[1.625rem]",
        "transition-[background-color] duration-180 ease-brand hover:bg-stone-50",
        className
      )}
      {...props}
    >
      <div data-slot="module-cell-top" className="flex items-center justify-between gap-3">
        <span
          data-slot="module-cell-group"
          className="font-mono text-[0.625rem] tracking-[0.1em] text-stone-400 uppercase"
        >
          {group}
        </span>
        {status ? (
          <span
            data-slot="module-cell-status"
            data-tone={status.tone}
            className={moduleStatusVariants({ tone: status.tone })}
          >
            {status.label}
          </span>
        ) : null}
      </div>
      <h4
        data-slot="module-cell-name"
        className="mt-[0.375rem] font-display text-[1.125rem] font-bold tracking-[-0.012em]"
      >
        {name}
      </h4>
      <p data-slot="module-cell-copy" className="text-[13px] leading-[1.5] text-muted-foreground">
        {copy}
      </p>
    </article>
  )
}

export { ModulesGrid, ModuleCell, moduleStatusVariants }
export type { ModulesGridProps, ModuleCellProps, ModuleStatus, ModuleStatusTone }
