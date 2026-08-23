import * as React from "react"

import { cn } from "@/lib/utils"
import { Canvas } from "@/registry/grana/ui/canvas"
import { Eyebrow } from "@/registry/grana/ui/eyebrow"
import { Wrap } from "@/registry/grana/ui/section"

/* The contextual sales moment (RF `.consult`): a framed field mid-page carrying a message
 * written for what the reader is looking at right now, not a generic pitch.
 *
 * One register below `CtaBand` on purpose — left-aligned, compact, and on the tight air of its
 * own clamp instead of the full section rhythm, so a page can carry several without any of them
 * reading as the ending. Its wash falls sideways (96°, 0.82 → 0.34) rather than down: the copy
 * lives on the left, the actions on the right, and the picture stays visible under the verbs.
 *
 * It stays an `<aside>` — a complementary landmark next to the page's argument, not a section of
 * it — so it composes `Wrap` directly instead of `Section`. */

const CONSULT_WASH =
  "linear-gradient(96deg, rgba(12,11,9,0.82) 0%, rgba(12,11,9,0.6) 55%, rgba(12,11,9,0.34) 100%)"

export type ConsultBandProps = Omit<React.ComponentProps<"aside">, "title"> & {
  image: string
  imagePos?: string
  duotone?: boolean
  /** Mono context label, e.g. "Parla con noi". */
  eyebrow?: React.ReactNode
  title: React.ReactNode
  /** Serif line under the title — contextual to the page. */
  line?: React.ReactNode
  /** Button row (usually one on-dark CTA + one glass-dark link). */
  actions: React.ReactNode
}

/**
 * Contextual sales moment: a framed field mid-page with a message
 * written for what the reader is looking at, not a generic pitch.
 * One register below CtaBand — left-aligned, compact.
 */
function ConsultBand({
  image,
  imagePos,
  duotone = false,
  eyebrow,
  title,
  line,
  actions,
  className,
  ...props
}: ConsultBandProps) {
  return (
    <aside
      data-slot="consult-band"
      className={cn("py-[clamp(1.5rem,3vw,2.5rem)]", className)}
      {...props}
    >
      <Wrap>
        <Canvas
          img={image}
          pos={imagePos}
          duotone={duotone}
          marks="light"
          grainOpacity={0.14}
          wash={CONSULT_WASH}
          reveal
        >
          <div
            data-slot="consult-band-inner"
            className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6 px-[clamp(1.5rem,3.5vw,3rem)] py-[clamp(2rem,4vw,3rem)]"
          >
            <div data-slot="consult-band-copy">
              {eyebrow ? (
                <Eyebrow
                  size="lg"
                  className="mb-3 block leading-[1.6] text-inverse-foreground/70"
                >
                  {eyebrow}
                </Eyebrow>
              ) : null}
              <h3
                data-slot="consult-band-title"
                className="max-w-[24ch] font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.12] font-bold tracking-[-0.015em] text-balance text-inverse-foreground"
              >
                {title}
              </h3>
              {line ? (
                <p
                  data-slot="consult-band-line"
                  className="mt-3 max-w-[48ch] font-serif text-[1.0625rem] leading-[1.55] text-inverse-foreground/85"
                >
                  {line}
                </p>
              ) : null}
            </div>
            <div
              data-slot="consult-band-actions"
              className="flex flex-wrap gap-3"
            >
              {actions}
            </div>
          </div>
        </Canvas>
      </Wrap>
    </aside>
  )
}

export { ConsultBand }
