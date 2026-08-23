import * as React from "react"

import { cn } from "@/lib/utils"

/* The canvas: every image on the marketing surface renders through it (RF `.canvas`).
 *
 * Five layers, in this order, and the order is load-bearing: the texture (z0), a legibility wash
 * (z1), the grain veil (z2), the content (z3), the registration marks (z4). `isolation: isolate`
 * keeps the stack out of the page's. Plain alpha throughout — no `mix-blend-mode` anywhere on an
 * image stack; stacked blend layers over large rasters froze the compositor in testing, and the
 * duotone is a filter chain on the image layer instead.
 *
 * The wash is what makes white type legible over an unknown photograph: without it a light patch
 * in the texture eats a word. Override it per canvas when the picture asks for a different fall. */
const DEFAULT_WASH =
  "linear-gradient(180deg, rgba(246, 243, 238, 0.10) 0%, rgba(14, 13, 10, 0.05) 55%, rgba(14, 13, 10, 0.22) 100%)"

const CORNERS = ["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"] as const

function Canvas({
  className,
  img,
  pos,
  grainOpacity = 0.14,
  duotone = false,
  marks = false,
  wash,
  reveal = false,
  style,
  children,
  ...props
}: React.ComponentProps<"figure"> & {
  /** Image URL, painted as the z0 layer. */
  img: string
  /** `background-position` for the image (default: center). */
  pos?: string
  /** Grain overlay opacity. */
  grainOpacity?: number
  /** The unit-tint duotone filter chain (a texture brought to one colour). */
  duotone?: boolean
  /** Registration marks at the corners: `true` = ink, `"light"` = ecru. */
  marks?: boolean | "light"
  /** Replace the legibility wash (any CSS background value). */
  wash?: string
  /** Emit `data-reveal` so the scroll observer animates it in. */
  reveal?: boolean
}) {
  return (
    <figure
      data-slot="canvas"
      data-duotone={duotone || undefined}
      data-reveal={reveal ? "" : undefined}
      style={
        {
          "--img": `url(${img})`,
          "--img-pos": pos ?? "center",
          "--grain-o": grainOpacity,
          "--wash": wash ?? DEFAULT_WASH,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "relative isolate overflow-hidden rounded-img",
        "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:[background:var(--wash)]",
        "after:pointer-events-none after:absolute after:inset-0 after:z-[2] after:bg-[image:var(--grain)] after:bg-[length:240px_240px] after:opacity-[var(--grain-o)]",
        /* The content sits above the veils; the marks are excluded so they keep their own z-4. */
        "[&>*:not([data-slot=canvas-image]):not([data-slot=canvas-marks])]:relative [&>*:not([data-slot=canvas-image]):not([data-slot=canvas-marks])]:z-[3]",
        className
      )}
      {...props}
    >
      <div
        data-slot="canvas-image"
        aria-hidden="true"
        className={cn(
          "absolute inset-0 z-0 bg-[image:var(--img)] bg-[position:var(--img-pos)] bg-cover",
          duotone &&
            "[filter:grayscale(1)_sepia(1)_hue-rotate(178deg)_saturate(2.4)_brightness(0.82)_contrast(1.05)]"
        )}
      />
      {marks ? (
        <span
          data-slot="canvas-marks"
          aria-hidden="true"
          className="pointer-events-none absolute inset-[14px] z-[4]"
        >
          {CORNERS.map((corner) => (
            <span
              key={corner}
              className={cn(
                "absolute size-1.5",
                corner,
                marks === "light" ? "bg-ecru/75" : "bg-inverse/50"
              )}
            />
          ))}
        </span>
      ) : null}
      {children}
    </figure>
  )
}

export { Canvas }
