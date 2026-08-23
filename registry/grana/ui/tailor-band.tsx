import * as React from "react"

import { Eyebrow } from "@/registry/grana/ui/eyebrow"
import { Section, Wrap } from "@/registry/grana/ui/section"

/* The tailoring promise (RF `.tailor__*` on a sunken section): a missing module or an adjustment
 * gets built and shipped into the customer's own platform at no extra cost.
 *
 * It reads as a ledger rather than a claim — the three steps are what makes it credible, so they
 * are part of the component, not optional decoration, and they sit in a ruled grid under a strong
 * hairline: request, spec, ship, read left to right like a receipt. The band is on sunken paper
 * between two hairlines so it separates from the sections around it without a photographed
 * field — a promise about work does not get a picture. */

export interface TailorStep {
  /** Mono ordinal, e.g. "01". */
  index: string
  title: string
  copy: string
}

export type TailorBandProps = Omit<React.ComponentProps<"section">, "title"> & {
  index?: string
  eyebrow: React.ReactNode
  title: React.ReactNode
  lead: React.ReactNode
  /** The three steps from request to shipped module. */
  steps: TailorStep[]
  /** Closing line: what this means against a packaged product. */
  note?: React.ReactNode
  actions?: React.ReactNode
}

/**
 * The tailoring promise: a missing module or an adjustment gets built and
 * shipped into the customer's own platform at no extra cost.
 *
 * It reads as a ledger rather than a claim — the three steps are what
 * makes it credible, so they are part of the component, not optional
 * decoration. On sunken paper so it separates from the sections around it
 * without needing a photographed field.
 */
function TailorBand({
  index,
  eyebrow,
  title,
  lead,
  steps,
  note,
  actions,
  className,
  ...props
}: TailorBandProps) {
  return (
    <Section
      variant="sunken"
      data-slot="tailor-band"
      className={className}
      {...props}
    >
      <Wrap>
        <div data-slot="tailor-band-head" data-reveal="" className="max-w-head">
          <Eyebrow size="lg" index={index} className="mb-5 block leading-[1.6]">
            {eyebrow}
          </Eyebrow>
          <h2 data-slot="tailor-band-title" className="h2">
            {title}
          </h2>
          <p
            data-slot="tailor-band-lead"
            className="serif mt-5 max-w-lead text-lead leading-[1.55] text-muted-foreground"
          >
            {lead}
          </p>
        </div>

        <ol
          data-slot="tailor-band-steps"
          className="mt-[clamp(2.5rem,4vw,3.5rem)] grid list-none grid-cols-3 border-t border-border-strong max-[820px]:grid-cols-1"
        >
          {steps.map((step, i) => (
            <li
              key={step.index}
              data-slot="tailor-band-step"
              data-reveal=""
              style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}
              className="border-r border-border px-7 pt-7 pb-8 first:pl-0 last:border-r-0 last:pr-0 max-[820px]:border-r-0 max-[820px]:border-b max-[820px]:px-0 max-[820px]:last:border-b-0"
            >
              <span
                data-slot="tailor-band-step-index"
                className="num text-sm leading-[1.6] font-medium text-ochre"
              >
                {step.index}
              </span>
              <h3
                data-slot="tailor-band-step-title"
                className="mt-2.5 font-display text-[1.1875rem] leading-[1.2] font-bold tracking-[-0.012em]"
              >
                {step.title}
              </h3>
              <p
                data-slot="tailor-band-step-copy"
                className="mt-2 text-sm leading-[1.6] text-muted-foreground"
              >
                {step.copy}
              </p>
            </li>
          ))}
        </ol>

        {note || actions ? (
          <div
            data-slot="tailor-band-foot"
            data-reveal=""
            className="mt-9 flex flex-wrap items-center justify-between gap-x-8 gap-y-4"
          >
            {note ? (
              <p
                data-slot="tailor-band-note"
                className="max-w-lead text-sm leading-[1.6] text-muted-foreground"
              >
                {note}
              </p>
            ) : null}
            {actions ? (
              <div
                data-slot="tailor-band-actions"
                className="flex flex-wrap gap-3"
              >
                {actions}
              </div>
            ) : null}
          </div>
        ) : null}
      </Wrap>
    </Section>
  )
}

export { TailorBand }
