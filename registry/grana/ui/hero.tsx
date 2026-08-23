import * as React from "react"

import { cn } from "@/lib/utils"
import { Wrap } from "@/registry/grana/ui/section"

/* The surveyed field — the home hero (RF `.hero-field` + `.stake`).
 *
 * A framed field that starts right under the header: the header's ecru is the top edge of the
 * frame, the sides and the bottom carry it, so the header stays optically centred in its own
 * space. Inside, the same five-layer stack every image on this surface uses, and the order is
 * load-bearing: texture (z0), the 102deg legibility wash (z1), the grain veil (z2), the
 * registration marks (z3), the content column (z4). Plain alpha throughout, never a blend mode.
 *
 * It is deliberately NOT a `Canvas`: the root is a `<section>` carrying an `<h1>` (a `<figure>`
 * would lie about what this is), the marks sit at 18px in a lighter ecru than the canvas ones,
 * and the texture layer animates on its own. The measurement stakes are the field's instruments —
 * pinned at coordinates the caller measures, and gone below 940px, where there is no field left
 * to plant them in.
 *
 * The entrances (`img-settle`, the staggered `rise`, `stake-in`) are gated on `html.js`, which
 * `RevealObserver` adds: without scripting there is no hidden state and the page reads as served. */

/* The wash holds white type over an unknown photograph. It is heavy across the text column and
 * opens onto the ridges on the right — the picture keeps breathing where nothing is written. */
const HERO_WASH =
  "linear-gradient(102deg, rgba(12, 11, 9, 0.9) 0%, rgba(12, 11, 9, 0.74) 34%, rgba(12, 11, 9, 0.4) 58%, rgba(12, 11, 9, 0.1) 80%, rgba(12, 11, 9, 0.04) 100%)"

const CORNERS = ["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"] as const

/* The five content children rise in order; the delays live on the container so a hero without a
 * note (or any other missing child) staggers by rendered position, exactly as the CSS does. */
const CONTENT_RISE =
  "[.js_&>*]:animate-rise [.js_&>*:nth-child(1)]:[animation-delay:0.05s] [.js_&>*:nth-child(2)]:[animation-delay:0.14s] [.js_&>*:nth-child(3)]:[animation-delay:0.23s] [.js_&>*:nth-child(4)]:[animation-delay:0.32s] [.js_&>*:nth-child(5)]:[animation-delay:0.41s]"

interface HeroStake {
  /** Mono chip content, e.g. "128 lead · luglio 2026". */
  label: string
  /** Horizontal position within the field, e.g. "60%". */
  x: string
  /** Vertical position within the field, e.g. "22%". */
  y: string
}

type HeroProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** Field image URL. */
  image: string
  /** `background-position` for the image (default: `center 45%`). */
  imagePos?: string
  eyebrow: React.ReactNode
  title: React.ReactNode
  lead: React.ReactNode
  /** Primary action, e.g. `<Button variant="on-dark">`. */
  primary: React.ReactNode
  /** Secondary action, e.g. `<Button variant="glass-dark">`. */
  secondary?: React.ReactNode
  /** Small reassurance line under the actions. */
  note?: React.ReactNode
  /** Measurement stakes pinned on the ridges (hidden below 940px). */
  stakes?: HeroStake[]
}

function Hero({
  className,
  image,
  imagePos,
  eyebrow,
  title,
  lead,
  primary,
  secondary,
  note,
  stakes,
  style,
  ...props
}: HeroProps) {
  return (
    <section
      data-slot="hero"
      style={
        {
          "--img": `url(${image})`,
          ...(imagePos ? { "--img-pos": imagePos } : {}),
          "--wash": HERO_WASH,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "relative isolate mx-frame overflow-hidden rounded-img",
        "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:[background:var(--wash)]",
        "after:pointer-events-none after:absolute after:inset-0 after:z-[2] after:bg-[image:var(--grain)] after:bg-[length:240px_240px] after:opacity-15",
        className
      )}
      {...props}
    >
      <div
        data-slot="hero-image"
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[image:var(--img)] bg-[position:var(--img-pos,center_45%)] bg-cover [.js_&]:animate-img-settle"
      />
      <span
        data-slot="hero-marks"
        aria-hidden="true"
        className="pointer-events-none absolute inset-[18px] z-[3]"
      >
        {CORNERS.map((corner) => (
          <span key={corner} className={cn("absolute size-1.5 bg-ecru/55", corner)} />
        ))}
      </span>

      <Wrap
        data-slot="hero-content"
        className={cn(
          "relative z-[4] pt-[clamp(3.25rem,5.5vw,5rem)] pb-[clamp(9.5rem,15vw,13rem)]",
          CONTENT_RISE
        )}
      >
        <p
          data-slot="hero-eyebrow"
          className="eyebrow mb-7 inline-flex items-center gap-2.5 text-inverse-foreground/78 before:size-1.5 before:bg-ochre-dark before:content-['']"
        >
          {eyebrow}
        </p>
        <h1 data-slot="hero-title" className="display mb-7 max-w-[13ch] text-inverse-foreground">
          {title}
        </h1>
        {/* Tighter than the interior heroes: the stakes are planted to the right. */}
        <p
          data-slot="hero-lead"
          className="mb-10 max-w-[54ch] font-serif text-[clamp(1.1875rem,1.5vw,1.4375rem)] leading-[1.55] text-inverse-foreground/85"
        >
          {lead}
        </p>
        <div data-slot="hero-actions" className="flex flex-wrap gap-3">
          {primary}
          {secondary}
        </div>
        {note ? (
          <p data-slot="hero-note" className="mt-5.5 text-[13px] text-inverse-foreground/58">
            {note}
          </p>
        ) : null}
      </Wrap>

      {stakes?.map((stake, i) => (
        <div
          key={stake.label}
          data-slot="hero-stake"
          aria-hidden="true"
          style={
            {
              left: stake.x,
              top: stake.y,
              "--sd": `${(0.7 + i * 0.15).toFixed(2)}s`,
            } as React.CSSProperties
          }
          className="absolute z-[4] flex flex-col items-start max-[940px]:hidden [.js_&]:animate-stake-in [.js_&]:[animation-delay:var(--sd,0.7s)]"
        >
          <span
            data-slot="hero-stake-label"
            className="rounded-xs border border-stone-900/22 bg-ecru/94 px-[9px] py-[5px] font-mono text-[11px] font-medium tracking-[0.02em] whitespace-nowrap text-ink"
          >
            {stake.label}
          </span>
          <i data-slot="hero-stake-line" className="ml-3 block h-[34px] w-px bg-ecru/50" />
          <span
            data-slot="hero-stake-head"
            className="ml-[9px] size-[7px] rounded-full bg-ochre-dark ring-1 ring-ecru/50"
          />
        </div>
      ))}
    </section>
  )
}

export { Hero }
export type { HeroProps, HeroStake }
