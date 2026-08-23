import * as React from "react"

import { cn } from "@/lib/utils"
import { Canvas } from "@/registry/grana/ui/canvas"
import { Section, Wrap } from "@/registry/grana/ui/section"

/* The closing band (RF `.final`): the last thing on the page, and the only one that asks.
 *
 * The band itself is the dotted paper — the section rhythm, nothing else — and the ask lives on a
 * framed canvas inside the measure, centred. Its wash is flatter and darker than the canvas
 * default (0.38 → 0.58 top to bottom, no ecru lift at the top) because centred type crosses the
 * whole picture and cannot pick a quiet corner to sit in. One question, two verbs, light marks. */

const CTA_WASH =
  "linear-gradient(180deg, rgba(12, 11, 9, 0.38), rgba(12, 11, 9, 0.58))"

export type CtaBandProps = Omit<React.ComponentProps<"section">, "title"> & {
  image: string
  imagePos?: string
  title: React.ReactNode
  /** Serif line under the title. */
  line?: React.ReactNode
  /** Action slot, e.g. on-dark + glass-dark buttons. */
  actions?: React.ReactNode
  /** Override the default CTA wash. */
  wash?: string
  /** Override the default grain opacity (0.14). */
  grainOpacity?: number
}

/**
 * Final CTA: a framed canvas on the dotted section background,
 * centre-aligned h2 + serif line + actions, light marks.
 */
function CtaBand({
  image,
  imagePos,
  title,
  line,
  actions,
  wash,
  grainOpacity,
  className,
  ...props
}: CtaBandProps) {
  return (
    <Section
      data-slot="cta-band"
      className={cn(
        "bg-[image:var(--dots)] bg-[length:var(--dots-size)]",
        className
      )}
      {...props}
    >
      <Wrap>
        <Canvas
          img={image}
          pos={imagePos}
          marks="light"
          wash={wash ?? CTA_WASH}
          grainOpacity={grainOpacity ?? 0.14}
          reveal
          className="px-[clamp(1.5rem,5vw,4rem)] py-[clamp(5rem,10vw,8.5rem)] text-center text-inverse-foreground"
        >
          <h2 data-slot="cta-band-title" className="h2 mx-auto max-w-[22ch]">
            {title}
          </h2>
          {line ? (
            <p
              data-slot="cta-band-line"
              className="mx-auto mt-[1.375rem] mb-10 max-w-[44ch] font-serif text-lead leading-[1.6] text-inverse-foreground/88"
            >
              {line}
            </p>
          ) : null}
          {actions ? (
            <div
              data-slot="cta-band-actions"
              className="flex flex-wrap justify-center gap-3"
            >
              {actions}
            </div>
          ) : null}
        </Canvas>
      </Wrap>
    </Section>
  )
}

export { CtaBand }
