import * as React from "react"

import { cn } from "@/lib/utils"
import { Eyebrow } from "@/registry/grana/ui/eyebrow"

interface CaseStudyRow {
  label: React.ReactNode
  /** Struck-through mono "before" value, e.g. "18,0%". */
  before: string
  /** Bold mono "after" value, e.g. "27,3%". */
  after: string
}

/* A result told twice (RF `.case`): once as a claim, once as evidence.
 *
 * Left, the claim — the numbered eyebrow, the outcome as a giant mono metric with its unit in the
 * sans face at 0.36em (a unit is not part of the number and must not compete with it), the thing
 * measured, and the client in their own words in the serif. Right, the evidence — the before/after
 * ledger where every claimed number is shown against the baseline it moved from, the measurement
 * period, and the way to the full story. The struck-through "before" in the faint ink is the whole
 * argument of the block: we are not hiding where the client started.
 *
 * The two halves enter separately, the ledger 0.12s behind the claim, so the reader meets the
 * number before the proof of it. Below 900 the columns stack in that same order. */
function CaseStudyBlock({
  className,
  index,
  eyebrow,
  metric,
  metricSuffix,
  label,
  quote,
  cite,
  rows,
  note,
  link,
  ...props
}: Omit<React.ComponentProps<"div">, "cite" | "label" | "content" | "prefix"> & {
  /** Two-digit section index for the eyebrow. */
  index?: string
  eyebrow: React.ReactNode
  /** Giant mono metric, e.g. "+9,3". */
  metric: string
  /** Sans unit suffix, e.g. "punti". */
  metricSuffix?: string
  label: React.ReactNode
  /** Serif quote (upright, no italics). */
  quote: React.ReactNode
  cite?: React.ReactNode
  /** Before/after ledger rows. */
  rows: CaseStudyRow[]
  /** Methodology note under the ledger. */
  note?: React.ReactNode
  /** Link slot, e.g. an <a> carrying the `link` utility. */
  link?: React.ReactNode
}) {
  return (
    <div
      data-slot="case-study-block"
      className={cn(
        "grid grid-cols-[1.05fr_1fr] items-start gap-[clamp(2rem,5vw,4.5rem)] max-[900px]:grid-cols-1",
        className
      )}
      {...props}
    >
      <div data-slot="case-study-claim" data-reveal="">
        <Eyebrow size="lg" index={index}>
          {eyebrow}
        </Eyebrow>
        <p
          data-slot="case-study-metric"
          className="metric mt-[1.375rem] mb-[0.875rem] text-[clamp(3.5rem,7vw,5.75rem)] text-foreground"
        >
          {metric}
          {metricSuffix ? (
            <span
              data-slot="case-study-metric-suffix"
              className="ml-[0.25em] font-sans text-[0.36em] tracking-[-0.02em] text-muted-foreground"
            >
              {metricSuffix}
            </span>
          ) : null}
        </p>
        <p
          data-slot="case-study-label"
          className="max-w-[26ch] text-[length:var(--fs-lead)] text-muted-foreground"
        >
          {label}
        </p>
        <blockquote
          data-slot="case-study-quote"
          className="serif mt-9 mb-4 max-w-[30ch] text-[clamp(1.25rem,1.7vw,1.5625rem)] leading-[1.45]"
        >
          {quote}
        </blockquote>
        {cite ? (
          <cite data-slot="case-study-cite" className="text-sm text-faint not-italic">
            {cite}
          </cite>
        ) : null}
      </div>
      <div
        data-slot="case-study-ledger"
        data-reveal=""
        style={{ "--d": "0.12s" } as React.CSSProperties}
      >
        <dl data-slot="case-study-table" className="border-t border-border">
          {rows.map((row, i) => (
            <div
              key={i}
              data-slot="case-study-row"
              className="grid grid-cols-[1fr_auto_auto] items-baseline gap-4 border-b border-border py-4 text-sm"
            >
              <dt data-slot="case-study-row-label" className="text-muted-foreground">
                {row.label}
              </dt>
              <dd data-slot="case-study-row-before" className="num text-faint line-through">
                {row.before}
              </dd>
              <dd
                data-slot="case-study-row-after"
                className="num min-w-[6ch] text-right text-[17px] font-medium"
              >
                {row.after}
              </dd>
            </div>
          ))}
        </dl>
        {note ? (
          <p data-slot="case-study-note" className="mt-3.5 text-[13px] text-faint">
            {note}
          </p>
        ) : null}
        {link ? (
          <p data-slot="case-study-link" className="mt-6">
            {link}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export { CaseStudyBlock, type CaseStudyRow }
