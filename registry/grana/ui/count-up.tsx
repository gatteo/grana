"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* Italian number formatting for the brand's metrics.
 *
 * CLDR gotcha: it-IT skips grouping on 4-digit numbers (renders `1847`), while the brand always
 * writes `1.847` — hence `useGrouping: "always"`, wrapped in try/catch for engines that reject
 * the string value. */
function formatItalianNumber(
  value: number,
  decimals = 0,
  prefix = "",
  suffix = ""
): string {
  const opts: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }
  /* `useGrouping: "always"` is ES2023; `lib: ES2022` still types the field as a boolean, and a
   * consumer on an older lib would break on it too — hence the cast rather than a lib bump. */
  const always = { ...opts, useGrouping: "always" } as unknown as Intl.NumberFormatOptions
  try {
    return prefix + value.toLocaleString("it-IT", always) + suffix
  } catch {
    return prefix + value.toLocaleString("it-IT", opts) + suffix
  }
}

/* The count-up metric (RF `motion/count-up`), per the brand's motion rules.
 *
 * The static markup already contains the final Italian-formatted value, so the number is right
 * for a crawler, for a print, and for a browser with no scripting; the animation only replaces
 * text that is already correct. On first intersection it counts from 0 with the
 * `1 - (1 - p)^4` easing and never re-runs — a number that re-counts every time it scrolls past
 * reads as a toy. Reduced motion, or a browser without IntersectionObserver, keeps the final
 * value and animates nothing. */
function CountUp({
  className,
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1100,
  ...props
}: Omit<React.ComponentProps<"span">, "children" | "prefix" | "ref"> & {
  /** Target value (unformatted, e.g. 1847 or 4.2). */
  value: number
  decimals?: number
  /** e.g. "€ ". */
  prefix?: string
  /** e.g. " mln". */
  suffix?: string
  /** Animation duration in milliseconds. */
  duration?: number
}) {
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    el.textContent = formatItalianNumber(value, decimals, prefix, suffix)

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced || !("IntersectionObserver" in window)) return

    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          io.disconnect()
          let t0: number | null = null
          const step = (t: number) => {
            if (t0 === null) t0 = t
            const p = Math.min((t - t0) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 4)
            el.textContent = formatItalianNumber(value * eased, decimals, prefix, suffix)
            if (p < 1) raf = requestAnimationFrame(step)
          }
          raf = requestAnimationFrame(step)
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    )
    io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, decimals, prefix, suffix, duration])

  return (
    <span data-slot="count-up" ref={ref} className={cn(className)} {...props}>
      {formatItalianNumber(value, decimals, prefix, suffix)}
    </span>
  )
}

export { CountUp, formatItalianNumber }
