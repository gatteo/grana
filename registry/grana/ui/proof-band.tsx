import * as React from "react"

import { cn } from "@/lib/utils"
import { CountUp } from "@/registry/grana/ui/count-up"
import { Wrap } from "@/registry/grana/ui/section"

/* The proof band (RF `.proof`): the company's numbers, stated once, with nothing around them.
 *
 * A white band edged top and bottom by hairlines, laid on the dotted paper — the dots are the
 * only decoration the band gets, and they belong to the page, not to the numbers. Four equal
 * columns split by hairlines, the outer two flush to the measure so the row reads as a ledger
 * ruled across the field rather than four boxes. Below 820 it folds to two columns and the
 * split rules follow: the second column loses its right rule, the first pair gains a bottom one.
 *
 * It is a `<dl>` because that is what it is: a value and the term it answers to. The value comes
 * first in the source and the label under it — the number is the headline. */
function ProofBand({ className, children, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="proof-band"
      className={cn(
        "border-y border-border bg-card bg-[image:var(--dots)] bg-[length:var(--dots-size)]",
        className
      )}
      {...props}
    >
      <Wrap>
        <dl
        data-slot="proof-band-grid"
        /* `repeat(N,1fr)`, not Tailwind's `grid-cols-N` (= minmax(0,1fr)): a metric that must not
           wrap (“€ 3,7 mln”) holds its column open, and clipping it into an equal share drops a
           line off every label beside it. */
        className="grid grid-cols-[repeat(4,1fr)] max-[820px]:grid-cols-[repeat(2,1fr)]"
      >
          {children}
        </dl>
      </Wrap>
    </section>
  )
}

/* One proof column: the counting metric, then the term it measures on a 22ch measure so four
 * labels of different lengths still stack into the same shape. */
function ProofStat({
  className,
  style,
  value,
  decimals,
  prefix,
  suffix,
  label,
  delay,
  ...props
}: Omit<React.ComponentProps<"div">, "prefix"> & {
  /** Target value (unformatted, e.g. 1847 or 4.2). */
  value: number
  decimals?: number
  /** e.g. "€ ". */
  prefix?: string
  /** e.g. " mln". */
  suffix?: string
  label: React.ReactNode
  /** Reveal stagger delay in seconds (the band steps in 0.08). */
  delay?: number
}) {
  return (
    <div
      data-slot="proof-stat"
      data-reveal=""
      style={delay ? ({ "--d": `${delay}s`, ...style } as React.CSSProperties) : style}
      className={cn(
        "border-r border-border px-7 py-[clamp(2rem,4vw,3rem)] first:pl-0 last:border-r-0 last:pr-0",
        "max-[820px]:[&:nth-child(2)]:border-r-0 max-[820px]:[&:nth-child(-n+2)]:border-b",
        className
      )}
      {...props}
    >
      <dd data-slot="proof-stat-value" className="metric mb-2.5 whitespace-nowrap">
        <CountUp value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
      </dd>
      <dt data-slot="proof-stat-label" className="max-w-[22ch] text-sm text-muted-foreground">
        {label}
      </dt>
    </div>
  )
}

export { ProofBand, ProofStat }
