import * as React from "react"

import { cn } from "@/lib/utils"
import { Canvas } from "@/registry/grana/ui/canvas"

/* One business unit of the group (RF `.unit`).
 *
 * The four units are the same card four times: the same 16/11 field, the same lockup, the same
 * one line of copy. Only the texture and one word change colour — that is the whole identity
 * system, and it is why the tint lives on the unit name and nowhere else. Demand's textures run
 * through the duotone so an unrelated photograph still arrives in cobalt.
 *
 * `href` turns the whole tile into the link; without it the tile is an `<article>`. */

type UnitTint = "demand" | "piattaforma" | "academy" | "installatori"

/* The tint is the only thing that separates one unit from another; it colours the name alone. */
const unitNameTint: Record<UnitTint, string> = {
  demand: "text-unit-demand",
  piattaforma: "text-unit-piattaforma",
  academy: "text-unit-academy",
  installatori: "text-unit-installatori",
}

type UnitCardProps = Omit<React.ComponentProps<"article">, "title"> & {
  /** Unit texture image. */
  image: string
  imagePos?: string
  /** Cobalt duotone filter chain (Demand textures). */
  duotone?: boolean
  /** Unit name, tinted in the lockup, e.g. "Demand". */
  unit: string
  tint: UnitTint
  /** One line of copy. */
  copy: React.ReactNode
  /** Renders the whole tile as an `<a>` when set. */
  href?: string
  /** Reveal stagger delay in seconds. */
  delay?: number
}

function UnitCard({
  className,
  image,
  imagePos,
  duotone = false,
  unit,
  tint,
  copy,
  href,
  delay,
  style,
  ...props
}: UnitCardProps) {
  const rootStyle = {
    ...(delay ? { "--d": `${delay}s` } : {}),
    ...style,
  } as React.CSSProperties
  const rootClass = cn(
    "flex flex-col overflow-hidden rounded-img border border-border bg-card no-underline",
    "transition-[translate,box-shadow] duration-300 ease-brand-out hover:-translate-y-1 hover:shadow-card",
    className
  )
  const inner = (
    <>
      <Canvas
        img={image}
        pos={imagePos}
        duotone={duotone}
        className="mx-[0.4375rem] mt-[0.4375rem] aspect-[16/11] rounded-xs"
      />
      <div data-slot="unit-card-body" className="px-5 pt-5 pb-[1.375rem]">
        <span
          data-slot="unit-card-lockup"
          className="flex items-baseline gap-[0.4375rem] font-display text-[0.9375rem] font-bold tracking-[-0.01em] whitespace-nowrap"
        >
          Revenue Farm <i className="font-normal text-faint not-italic">·</i>{" "}
          <b data-slot="unit-card-name" className={cn("font-bold", unitNameTint[tint])}>
            {unit}
          </b>
        </span>
        <p data-slot="unit-card-copy" className="mt-[0.4375rem] text-[13px] text-muted-foreground">
          {copy}
        </p>
      </div>
    </>
  )

  if (href) {
    return (
      <a
        data-slot="unit-card"
        data-tint={tint}
        data-reveal=""
        href={href}
        style={rootStyle}
        className={rootClass}
        {...(props as React.ComponentProps<"a">)}
      >
        {inner}
      </a>
    )
  }
  return (
    <article
      data-slot="unit-card"
      data-tint={tint}
      data-reveal=""
      style={rootStyle}
      className={rootClass}
      {...props}
    >
      {inner}
    </article>
  )
}

export { UnitCard }
export type { UnitCardProps }
