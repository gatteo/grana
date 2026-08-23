import * as React from "react"

import { cn } from "@/lib/utils"
import { Canvas } from "@/registry/grana/ui/canvas"
import { Eyebrow } from "@/registry/grana/ui/eyebrow"

/* An article, a guide or a tool as a card (RF `.post`).
 *
 * A wide 21/9 header so the texture reads as a band and not as a photograph, the mono category
 * above the title, and the verified stamp pinned to the bottom edge — the dated-truth device:
 * the rules change every year, so the card says when it was last checked instead of pretending
 * to be timeless. Hover lifts the whole card 4px onto the card shadow.
 *
 * `href` turns the whole card into the link; without it, pass a link element as `title`. */

type PostCardProps = Omit<React.ComponentProps<"article">, "title"> & {
  /** Header image (21/9 canvas). */
  image: string
  imagePos?: string
  /** Mono category eyebrow, e.g. "Guida". */
  category: React.ReactNode
  /**
   * Post title (display face, 700). Pass a link element here for localized
   * routing when the card itself is not an anchor.
   */
  title: React.ReactNode
  /** The dated-truth stamp, e.g. "Verificato il 12/07/2026". */
  verified?: React.ReactNode
  /** Renders the whole card as an `<a>` when set. */
  href?: string
  /** Reveal stagger delay in seconds. */
  delay?: number
}

function PostCard({
  className,
  image,
  imagePos,
  category,
  title,
  verified,
  href,
  delay,
  style,
  ...props
}: PostCardProps) {
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
        className="mx-[0.4375rem] mt-[0.4375rem] aspect-[21/9] rounded-xs"
      />
      <div
        data-slot="post-card-body"
        className="flex flex-1 flex-col gap-3 p-[1.375rem] pb-6"
      >
        <Eyebrow>{category}</Eyebrow>
        <h4
          data-slot="post-card-title"
          className="font-display text-[1.125rem] leading-[1.3] font-bold tracking-[-0.012em]"
        >
          {title}
        </h4>
        {verified ? (
          <p
            data-slot="post-card-verified"
            className="mt-auto pt-[0.875rem] font-mono text-[0.6875rem] tracking-[0.02em] text-faint"
          >
            {verified}
          </p>
        ) : null}
      </div>
    </>
  )

  if (href) {
    return (
      <a
        data-slot="post-card"
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
      data-slot="post-card"
      data-reveal=""
      style={rootStyle}
      className={rootClass}
      {...props}
    >
      {inner}
    </article>
  )
}

export { PostCard }
export type { PostCardProps }
