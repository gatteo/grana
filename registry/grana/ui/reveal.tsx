"use client"

import * as React from "react"

/* The scroll-entrance driver (RF `motion/reveal-observer`), mounted once in the marketing layout.
 *
 * It puts `js` on <html> — the gate every hidden initial state hangs off, so a page rendered
 * without scripting is fully visible — then observes every `[data-reveal]` and adds `in-view` as it
 * enters the viewport, unobserving after. Siblings stagger through an inline `--d`. A
 * MutationObserver picks up elements added by a client navigation. Without IntersectionObserver,
 * or under reduced motion, everything is revealed at once: the entrance is a courtesy, never a
 * condition for reading the page. */
function RevealObserver(): null {
  React.useEffect(() => {
    document.documentElement.classList.add("js")

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const io =
      !reduced && "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (!entry.isIntersecting) continue
                entry.target.classList.add("in-view")
                io?.unobserve(entry.target)
              }
            },
            { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
          )
        : null

    const seen = new WeakSet<Element>()
    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (seen.has(el)) return
        seen.add(el)
        if (io) io.observe(el)
        else el.classList.add("in-view")
      })
    }

    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      mo.disconnect()
      io?.disconnect()
      /* The gate goes with the driver: `js` left behind after unmount would hold every
       * [data-reveal] added afterwards at opacity 0 with nothing left to reveal it. */
      document.documentElement.classList.remove("js")
    }
  }, [])

  return null
}

export { RevealObserver }
