import * as React from "react"

import { cn } from "@/lib/utils"
import { Canvas } from "@/registry/grana/ui/canvas"
import { Wrap } from "@/registry/grana/ui/section"

/* The interior above-the-fold (RF `.page-hero`).
 *
 * Every section of the site opens on its own framed field — the same family as the home hero, one
 * register quieter: a `Canvas` inside the paper frame, its texture chosen per unit, a dark wash
 * over the text zone, light registration marks, and the content rising in on arrival. `tall` is
 * the section hub's version — more air above and below the same type.
 *
 * The facts are the stake heads of the interior page: mono chips that state a measured thing under
 * the copy. They carry no colour and no icon — a number and a date are the whole argument. */

/* The wash holds contrast across the whole text zone. The zone is 70% of the container wide, so
 * the gradient stays heavy to ~72% and only then opens onto the image. */
const HERO_WASH =
  "linear-gradient(96deg, rgba(12,11,9,0.90) 0%, rgba(12,11,9,0.84) 42%, rgba(12,11,9,0.68) 66%, rgba(12,11,9,0.34) 84%, rgba(12,11,9,0.10) 100%)"

/* The content children rise in order. The delays sit on the container and key off rendered
 * position, so a hero without a lead staggers its actions where the lead would have been —
 * exactly what the `nth-child` rules do today. */
const CONTENT_RISE =
  "[.js_&>*]:animate-rise [.js_&>*]:[animation-duration:0.85s] [.js_&>*:nth-child(1)]:[animation-delay:0.04s] [.js_&>*:nth-child(2)]:[animation-delay:0.12s] [.js_&>*:nth-child(3)]:[animation-delay:0.2s] [.js_&>*:nth-child(4)]:[animation-delay:0.28s] [.js_&>*:nth-child(5)]:[animation-delay:0.36s]"

/* The mono fact chip — ecru on the field, an ink hairline, ink type. Same recipe as the home
 * hero's stake label; the two live in different files on purpose (one item, one file). */
const FACT =
  "rounded-xs border border-stone-900/22 bg-ecru/94 px-[9px] py-[5px] font-mono text-[11px] font-medium tracking-[0.02em] whitespace-nowrap text-ink"

type PageHeroProps = Omit<React.ComponentProps<"header">, "title"> & {
  image: string
  imagePos?: string
  /** Cobalt duotone filter chain (Demand pages). */
  duotone?: boolean
  eyebrow: React.ReactNode
  title: React.ReactNode
  /** Serif lead under the title. */
  lead?: React.ReactNode
  /** Button row (`<Button variant="on-dark" | "glass-dark">`). */
  actions?: React.ReactNode
  /** Mono fact chips pinned under the content, stake-style. */
  facts?: string[]
  /** Taller field for section hubs. */
  tall?: boolean
  /** Override the default hero wash. */
  wash?: string
}

function PageHero({
  className,
  image,
  imagePos,
  duotone = false,
  eyebrow,
  title,
  lead,
  actions,
  facts,
  tall = false,
  wash,
  ...props
}: PageHeroProps) {
  return (
    <header
      data-slot="page-hero"
      data-tall={tall || undefined}
      className={cn("px-frame", className)}
      {...props}
    >
      <Canvas
        img={image}
        pos={imagePos}
        duotone={duotone}
        marks="light"
        grainOpacity={0.15}
        wash={wash ?? HERO_WASH}
      >
        <Wrap
          data-slot="page-hero-content"
          className={cn(
            "relative",
            tall
              ? "pt-[clamp(4rem,7vw,6.5rem)] pb-[clamp(3.75rem,6.5vw,6rem)]"
              : "pt-[clamp(3.25rem,5.5vw,5rem)] pb-[clamp(3rem,5vw,4.5rem)]",
            CONTENT_RISE
          )}
        >
          <p
            data-slot="page-hero-eyebrow"
            className="eyebrow mb-5.5 inline-flex items-center gap-2.5 text-inverse-foreground/78 before:size-1.5 before:bg-ochre-dark before:content-['']"
          >
            {eyebrow}
          </p>
          <h1
            data-slot="page-hero-title"
            className="max-w-head font-display text-[clamp(2.5rem,4.8vw,4rem)] leading-[1.02] font-extrabold tracking-[-0.025em] text-balance text-inverse-foreground"
          >
            {title}
          </h1>
          {lead ? (
            <p
              data-slot="page-hero-lead"
              className="mt-5.5 max-w-lead font-serif text-[clamp(1.125rem,1.4vw,1.3125rem)] leading-[1.55] text-inverse-foreground/85"
            >
              {lead}
            </p>
          ) : null}
          {actions ? (
            <div data-slot="page-hero-actions" className="mt-8 flex flex-wrap gap-3">
              {actions}
            </div>
          ) : null}
          {facts && facts.length > 0 ? (
            <p data-slot="page-hero-facts" className="num mt-9 flex flex-wrap gap-2">
              {facts.map((fact) => (
                <span key={fact} data-slot="page-hero-fact" className={FACT}>
                  {fact}
                </span>
              ))}
            </p>
          ) : null}
        </Wrap>
      </Canvas>
    </header>
  )
}

export { PageHero }
export type { PageHeroProps }
