import * as React from "react"

import { cn } from "@/lib/utils"
import { Eyebrow } from "@/registry/grana/ui/eyebrow"
import { Section, Wrap } from "@/registry/grana/ui/section"

/* The dark punctuation (RF `.dark-block`): the one full-bleed inverse moment a page is allowed.
 *
 * It is the page changing register, not a card — so it paints edge to edge and only the content
 * stays inside the measure. Four layers, and the order is load-bearing: the photograph at 55%
 * (z0), a vertical wash that is near-opaque top and bottom and opens to 55% in the middle (z1),
 * the grain veil at 12% (z2), the content (z3). The wash is what makes the ecru type survive an
 * unknown texture; the middle opening is what keeps the picture readable as a picture.
 *
 * The band's own hairlines are `border-inverse-line` (0.14) where the CSS wrote 0.16 — the token
 * is the ruled value; see the port report. */

const WASH =
  "before:[background:linear-gradient(180deg,rgba(12,11,9,0.92)_0%,rgba(12,11,9,0.55)_45%,rgba(12,11,9,0.94)_100%)]"

export interface DarkBandStat {
  /** Mono value, e.g. "2022" or "15". */
  value: string
  label: React.ReactNode
}

export type DarkBandProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** Background image, shown at reduced opacity under the dark wash. */
  image: string
  /** background-position (default: center 30%). */
  imagePos?: string
  /** Image opacity (default: 0.55). */
  imageOpacity?: number
  /** Two-digit section index for the eyebrow. */
  index?: string
  eyebrow: React.ReactNode
  title: React.ReactNode
  /** Serif editorial body. */
  body: React.ReactNode
  /** Action slot, e.g. <Button variant="on-dark">. */
  actions?: React.ReactNode
  /** Stat row over a hairline (3 columns). */
  stats?: DarkBandStat[]
}

/**
 * The dark manifesto band: the one full-bleed inverse moment. Image
 * at reduced opacity under a vertical dark wash and 12% grain,
 * numbered eyebrow, h2, serif body, actions, optional stat row.
 */
function DarkBand({
  image,
  imagePos,
  imageOpacity,
  index,
  eyebrow,
  title,
  body,
  actions,
  stats,
  className,
  style,
  children,
  ...props
}: DarkBandProps) {
  return (
    <Section
      data-slot="dark-band"
      style={
        {
          "--img": `url(${image})`,
          "--img-pos": imagePos ?? "center 30%",
          "--img-o": imageOpacity ?? 0.55,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        /* `!` because `Section` hardcodes `py-section` and tailwind-merge is not taught the
         * `section` spacing key — the dark band keeps its own deeper rhythm (12vw, not 9vw). */
        "relative isolate overflow-hidden bg-inverse py-[clamp(6.5rem,12vw,11rem)]! text-inverse-foreground",
        "before:absolute before:inset-0 before:z-[1]",
        WASH,
        "after:pointer-events-none after:absolute after:inset-0 after:z-[2] after:bg-[image:var(--grain)] after:bg-[length:240px_240px] after:opacity-[0.12]",
        className
      )}
      {...props}
    >
      <div
        data-slot="dark-band-image"
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[image:var(--img)] bg-[position:var(--img-pos)] bg-cover opacity-[var(--img-o)]"
      />
      <Wrap className="relative z-[3]">
        <Eyebrow
          size="lg"
          index={index}
          data-reveal=""
          className="text-inverse-muted [&_[data-slot=eyebrow-index]]:text-ochre-dark"
        >
          {eyebrow}
        </Eyebrow>
        <h2
          data-slot="dark-band-title"
          data-reveal=""
          style={{ "--d": "0.08s" } as React.CSSProperties}
          className="h2 mt-6 mb-7 max-w-[26ch]"
        >
          {title}
        </h2>
        <p
          data-slot="dark-band-body"
          data-reveal=""
          style={{ "--d": "0.16s" } as React.CSSProperties}
          className="max-w-lead font-serif text-lead leading-[1.55] text-inverse-muted"
        >
          {body}
        </p>
        {actions ? (
          <div
            data-slot="dark-band-actions"
            data-reveal=""
            style={{ "--d": "0.24s" } as React.CSSProperties}
            className="mt-10 flex flex-wrap gap-3"
          >
            {actions}
          </div>
        ) : null}
        {stats && stats.length > 0 ? (
          <dl
            data-slot="dark-band-stats"
            data-reveal=""
            style={{ "--d": "0.3s" } as React.CSSProperties}
            className="mt-[clamp(3.5rem,6vw,5.5rem)] grid grid-cols-3 border-t border-inverse-line max-[760px]:grid-cols-1"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                data-slot="dark-band-stat"
                className="border-r border-inverse-line px-6 pt-[1.625rem] first:pl-0 last:border-r-0 last:pr-0 max-[760px]:border-r-0 max-[760px]:px-0"
              >
                <dd
                  data-slot="dark-band-stat-value"
                  className="num text-[1.75rem] leading-none font-medium tracking-[-0.03em]"
                >
                  {stat.value}
                </dd>
                <dt
                  data-slot="dark-band-stat-label"
                  className="mt-2 text-sm leading-[1.6] text-inverse-muted"
                >
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        ) : null}
        {children}
      </Wrap>
    </Section>
  )
}

export { DarkBand }
