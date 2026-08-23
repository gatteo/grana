import * as React from "react"

import { cn } from "@/lib/utils"
import { Canvas } from "@/registry/grana/ui/canvas"
import { Eyebrow } from "@/registry/grana/ui/eyebrow"

/* The generalised "posto dove il lavoro succede" card (RF `.ill-card`).
 *
 * A 16/10 field carrying an artefact drawn in code — a FloatPanel with a product fragment in it,
 * never a screenshot — and the words under it. The picture is built, not captured, so it stays
 * legible at card size, localises with the page and never goes stale with the product.
 *
 * Hover lifts the card 4px AND the artefact another 4px on top of it, so the panel reads as
 * floating above the field rather than printed on it. The artefact is reached by `data-slot`
 * (`float-panel` / `snippet-browser`) — the same two things RF's CSS names by class. */

type UnitTint = "demand" | "piattaforma" | "academy" | "installatori"

type IllustrationCardProps = Omit<React.ComponentProps<"article">, "title"> & {
  image: string
  imagePos?: string
  /** Cobalt duotone filter chain (Demand textures). */
  duotone?: boolean
  /** Unit tint applied to the eyebrow. */
  tint?: UnitTint
  eyebrow?: React.ReactNode
  title: React.ReactNode
  copy?: React.ReactNode
  /** Built artefact floating on the canvas (FloatPanel, SnippetBrowser…). */
  art?: React.ReactNode
  /** Bottom-pinned text link, e.g. `<a className="link">`. */
  link?: React.ReactNode
  /** Reveal stagger delay in seconds. */
  delay?: number
}

function IllustrationCard({
  className,
  image,
  imagePos,
  duotone = false,
  tint,
  eyebrow,
  title,
  copy,
  art,
  link,
  delay,
  style,
  ...props
}: IllustrationCardProps) {
  return (
    <article
      data-slot="illustration-card"
      data-tint={tint}
      data-reveal=""
      style={
        {
          ...(delay ? { "--d": `${delay}s` } : {}),
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "flex flex-col overflow-hidden rounded-img border border-border bg-card",
        "transition-[translate,box-shadow] duration-300 ease-brand-out hover:-translate-y-1 hover:shadow-card",
        /* The artefact lifts with the card, and again on top of it. */
        "[&:hover_[data-slot=float-panel]]:-translate-y-1 [&:hover_[data-slot=snippet-browser]]:-translate-y-1",
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
        className="mx-[0.4375rem] mt-[0.4375rem] grid aspect-[16/10] place-items-center rounded-xs p-[clamp(1rem,2.5vw,1.75rem)]"
      >
        {art}
      </Canvas>
      <div
        data-slot="illustration-card-body"
        className="flex flex-1 flex-col gap-[0.625rem] p-[1.375rem] pb-6 [&_.link]:mt-auto [&_.link]:self-start"
      >
        {eyebrow ? <Eyebrow tint={tint ?? "none"}>{eyebrow}</Eyebrow> : null}
        <h3
          data-slot="illustration-card-title"
          className="font-display text-[1.125rem] leading-[1.25] font-bold tracking-[-0.012em]"
        >
          {title}
        </h3>
        {copy ? (
          <p
            data-slot="illustration-card-copy"
            className="text-sm leading-[inherit] text-muted-foreground"
          >
            {copy}
          </p>
        ) : null}
        {link}
      </div>
    </article>
  )
}

export { IllustrationCard }
export type { IllustrationCardProps }
