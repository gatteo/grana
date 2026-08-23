import * as React from "react"

import { cn } from "@/lib/utils"

/* The monogram lockup (RF `.brand`), the one place the company signs its name.
 *
 * The mark and the wordmark are one baseline-aligned unit: the tile at 30px with its own 7px
 * corner (softer than the page's 6px panel, harder than an image's 8px — the mark is neither),
 * eleven pixels of air, then the name in the display face at 700 on a tightened track. The space
 * inside "Revenue Farm" is non-breaking: the name never wraps mid-lockup, at any width. With a
 * wordmark the image is decorative and its alt is empty — the text already says the name; without
 * one the image carries the name itself. `href` renders it as a link (the header and footer both
 * link home); without one it is a plain span, so the mark can sit inside another anchor. */
function LogoMark({
  className,
  src = "/img/rf-mark.png",
  wordmark = true,
  href,
  ...props
}: React.ComponentProps<"span"> & {
  /** Mark image (the black rounded tile). */
  src?: string
  /** Show the "Revenue Farm" wordmark (the display face, 700). */
  wordmark?: boolean
  /** Renders as an <a> when set. */
  href?: string
}) {
  const inner = (
    <>
      <img
        data-slot="logo-mark-image"
        className="block size-[30px] rounded-[7px]"
        src={src}
        alt={wordmark ? "" : "Revenue Farm"}
        width={30}
        height={30}
      />
      {wordmark ? "Revenue\u00A0Farm" : null}
    </>
  )
  const cls = cn(
    "inline-flex flex-none items-center gap-[0.6875rem] font-display text-[1.125rem] font-bold tracking-[-0.015em] no-underline",
    className
  )
  if (href) {
    /* The props are typed against the span (the default shape); every attribute a caller can put
     * on one is also legal on an anchor, so the widening is safe. */
    return (
      <a
        data-slot="logo-mark"
        className={cls}
        href={href}
        {...(props as React.ComponentProps<"a">)}
      >
        {inner}
      </a>
    )
  }
  return (
    <span data-slot="logo-mark" className={cls} {...props}>
      {inner}
    </span>
  )
}

export { LogoMark }
