import * as React from "react"

import { cn } from "@/lib/utils"
import { Canvas } from "@/registry/grana/ui/canvas"
import { Eyebrow } from "@/registry/grana/ui/eyebrow"

/* One of the ways to work with us (RF `.way`).
 *
 * A card whose top third is a photographed field with a white product fragment floating on it,
 * and whose bottom two thirds are the promise in words: the phrase rides the eyebrow slot in the
 * unit's tint, the family name is the title in plain ink, then the copy, a hairline-dash list and
 * a link pinned to the bottom edge. The card itself does not move under the pointer — only the
 * snippet lifts 4px, so the picture reads as a thing sitting on a surface and not as a button.
 *
 * The snippet is `aria-hidden`: it is an illustration of the product, not content to read. */

type UnitTint = "demand" | "piattaforma" | "academy" | "installatori"

interface WayCardSnippet {
  /** Mono uppercase header, e.g. "Lead · provincia di Bergamo". */
  title: string
  /**
   * Data rows as [left, right]. Strings get the PoC treatment
   * (left → `.who`, right → `.num`); pass ReactNodes for richer rows
   * (sub-lines with `.sub`, status pills).
   */
  rows: [React.ReactNode, React.ReactNode][]
}

type WayCardProps = Omit<React.ComponentProps<"article">, "title"> & {
  image: string
  imagePos?: string
  /** Cobalt duotone filter chain (Demand textures). */
  duotone?: boolean
  /** Unit tint applied to the eyebrow. */
  tint: UnitTint
  eyebrow?: React.ReactNode
  /** Colour the title with the unit tint (family-name titles). */
  tintTitle?: boolean
  title: React.ReactNode
  copy: React.ReactNode
  /** Hairline-dash list items. */
  items: string[]
  /** Text link pinned to the bottom, e.g. `<a className="link">`. */
  link: React.ReactNode
  /** Floating UI snippet centred on the canvas. */
  snippet?: WayCardSnippet
  /** Reveal stagger delay in seconds. */
  delay?: number
}

/* The row inside the snippet. `.who` / `.num` / `.sub` stay as class hooks so a caller can pass
 * a richer ReactNode row and still get the PoC treatment — `num` is the Grana mono-readout
 * utility, so it already carries the face; only the "never wrap a price" rules are added here. */
const snippetRowClass = cn(
  "flex items-center justify-between gap-3 border-t border-t-stone-100 py-[0.4375rem] first-of-type:border-t-0",
  "[&_.who]:font-medium",
  "[&_.num]:flex-none [&_.num]:whitespace-nowrap",
  "[&_.sub]:block [&_.sub]:text-[0.6875rem] [&_.sub]:text-faint"
)

function WayCard({
  className,
  image,
  imagePos,
  duotone = false,
  tint,
  eyebrow,
  tintTitle = false,
  title,
  copy,
  items,
  link,
  snippet,
  delay,
  style,
  ...props
}: WayCardProps) {
  return (
    <article
      data-slot="way-card"
      data-tint={tint}
      data-reveal=""
      style={
        {
          ...(delay ? { "--d": `${delay}s` } : {}),
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "group/way-card flex flex-col overflow-hidden rounded-img border border-border bg-card shadow-card",
        className
      )}
      {...props}
    >
      <Canvas
        img={image}
        pos={imagePos}
        duotone={duotone}
        marks="light"
        grainOpacity={0.15}
        /* Inset into the card: 7px of breathing room on three sides, and the field is 16/9.5. */
        className="mx-[0.4375rem] mt-[0.4375rem] grid aspect-[16/9.5] place-items-center rounded-xs p-[clamp(1.25rem,3vw,2.25rem)]"
      >
        {snippet ? (
          <div
            data-slot="way-card-snippet"
            aria-hidden="true"
            className={cn(
              "w-[min(360px,92%)] rounded-sm border border-line-artefact bg-stone-0 px-[1.125rem] py-4 text-left text-[13px] shadow-panel",
              "transition-[translate] duration-400 ease-brand-out group-hover/way-card:-translate-y-1"
            )}
          >
            <h5
              data-slot="way-card-snippet-title"
              className="mb-[0.625rem] font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-stone-500 uppercase"
            >
              {snippet.title}
            </h5>
            {snippet.rows.map(([left, right], i) => (
              <div key={i} data-slot="snippet-row" className={snippetRowClass}>
                <span>
                  {typeof left === "string" ? <span className="who">{left}</span> : left}
                </span>
                {typeof right === "string" ? <span className="num">{right}</span> : right}
              </div>
            ))}
          </div>
        ) : null}
      </Canvas>
      <div
        data-slot="way-card-body"
        /* The link is pinned to the bottom edge: `mt-auto` on the anchor, `flex-1` on the body. */
        className="flex flex-1 flex-col gap-3 p-[clamp(1.5rem,3vw,2rem)] [&_a]:mt-auto [&_a]:self-start"
      >
        {eyebrow ? (
          <Eyebrow tint={tint} className="font-bold">
            {eyebrow}
          </Eyebrow>
        ) : null}
        <h3
          data-slot="way-card-title"
          className={cn(
            "h3 text-[length:clamp(1.75rem,2.6vw,2.125rem)] tracking-[-0.02em]",
            tintTitle && "text-foreground"
          )}
        >
          {title}
        </h3>
        <p
          data-slot="way-card-copy"
          className="max-w-[52ch] text-sm leading-[inherit] text-muted-foreground"
        >
          {copy}
        </p>
        <ul
          data-slot="way-card-items"
          className="mt-[0.375rem] mb-3 flex list-none flex-col gap-[0.4375rem]"
        >
          {items.map((item) => (
            <li
              key={item}
              data-slot="way-card-item"
              className="relative pl-[1.125rem] text-sm leading-[inherit] text-muted-foreground before:absolute before:top-[0.6875em] before:left-0 before:h-px before:w-2 before:bg-border-strong before:content-['']"
            >
              {item}
            </li>
          ))}
        </ul>
        {link}
      </div>
    </article>
  )
}

export { WayCard }
export type { WayCardProps, WayCardSnippet }
