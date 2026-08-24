import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* The assistant's state indicator: ONE sphere. A soft shadow beneath it so it has somewhere
 * to stand, and a ball holding three blurred cloud masses that drift at different speeds. No
 * rings, no collar, no text inside — the orb is a figure, not a widget.
 *
 * Colour says WHICH state; motion says WHETHER anything is running. `level` (0..1) is the one
 * runtime input: it lands as `--orb-level` and from there drives the breath amplitude, the
 * cloud opacity AND the depth of the shadow, so a caller animating a single number animates
 * the whole figure. Everything else is CSS.
 *
 * DSN-6 — a colour never carries meaning alone, and this component is nothing but a colour.
 * It is safe only because every screen that shows it NAMES THE STATE IN WORDS TWICE: once in
 * the headline beside the orb, once in the status line under it. Compose it that way or do
 * not use it. `label` is required for the same reason: an orb with no accessible name says
 * nothing at all to a reader who cannot see the hue.
 *
 * `still` — and `prefers-reduced-motion` — stops the breath and the drift dead. Nothing moves,
 * and the sphere still reads: the tone, the modelling and the shadow are painted, not
 * animated.
 *
 *   <Orb tone="listening" level={0.8} label="Recording — listening" />
 */

export type OrbTone = "listening" | "thinking" | "ready" | "stalled" | "warning"

/* The tone sets exactly one thing: `--orb`, the hue the whole sphere is mixed from. */
/* `inline-block` is load-bearing: the root sizes itself from `--orb-size`, and a bare inline
 * span ignores width and height — the orb collapsed to 0×0 wherever it was not a flex or grid
 * item (measured in the playground). */
const orbVariants = cva("relative isolate inline-block flex-none", {
  variants: {
    tone: {
      listening: "[--orb:var(--status-critical)]",
      thinking: "[--orb:var(--status-info)]",
      ready: "[--orb:var(--status-good)]",
      stalled: "[--orb:var(--status-serious)]",
      warning: "[--orb:var(--status-warning)]",
    },
  },
  defaultVariants: { tone: "thinking" },
})

/* One cloud mass. `drift` is the whole motion contract: pass nothing and it holds still. */
function OrbCloud({ className, drift }: { className: string; drift?: string | undefined }) {
  return (
    <span
      data-slot="orb-cloud"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full blur-[calc(var(--orb-size,140px)*0.062)] opacity-[calc(0.62_+_var(--orb-level,0.5)_*_0.3)]",
        className,
        drift
      )}
    />
  )
}

function Orb({
  className,
  tone,
  level = 0.5,
  size = 140,
  still = false,
  label,
  style,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof orbVariants> & {
    /** Which state the assistant is in. Colour is the only thing it changes. */
    tone: OrbTone
    /** 0..1 — how much is happening. Breath amplitude, cloud opacity, shadow depth. */
    level?: number | undefined
    /** Diameter in px. 140 in the recording sheet, 44 in the pill. */
    size?: number | undefined
    /** A settled state holds still: the cloud stops moving, the sphere stops breathing. */
    still?: boolean | undefined
    /** REQUIRED accessible name — the state in words, e.g. "Recording — listening". */
    label: string
  }) {
  const clamped = Math.min(1, Math.max(0, level))
  /* One switch for all three animations, so `still` can never half-stop the figure. Reduced
   * motion is handled beside it rather than by the sheet's blanket duration clamp: an
   * infinite animation clamped to 0.01ms still runs, it just runs invisibly fast. */
  const moves = still ? undefined : "motion-reduce:animate-none"

  return (
    <span
      data-slot="orb"
      data-tone={tone}
      data-still={still ? "on" : "off"}
      role="img"
      aria-label={label}
      className={cn(orbVariants({ tone }), "size-(--orb-size)", className)}
      style={
        {
          "--orb-size": `${size}px`,
          "--orb-level": clamped,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* The shadow sits behind and below, so the sphere has somewhere to stand. */}
      <span
        data-slot="orb-shadow"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[12%] -bottom-[7%] h-[34%] rounded-full bg-[radial-gradient(ellipse,color-mix(in_srgb,var(--stone-900)_26%,transparent)_0%,transparent_72%)] opacity-[calc(0.5_+_var(--orb-level,0.5)_*_0.3)] blur-[13px]"
      />
      <span
        data-slot="orb-ball"
        aria-hidden="true"
        className={cn(
          "absolute inset-0 overflow-hidden rounded-full",
          "bg-[radial-gradient(circle_at_34%_26%,color-mix(in_srgb,var(--orb)_16%,var(--card))_0%,color-mix(in_srgb,var(--orb)_44%,var(--card))_56%,color-mix(in_srgb,var(--orb)_78%,var(--card))_100%)]",
          /* The modelling of a drawn sphere, not the elevation of a surface: two inset lights
           * and the contact glow. See the report — this is the one place a box-shadow is not
           * shadow-card/shadow-panel. */
          "[box-shadow:inset_0_-14px_30px_color-mix(in_srgb,var(--orb)_34%,transparent),inset_0_8px_22px_color-mix(in_srgb,var(--card)_70%,transparent),0_10px_26px_color-mix(in_srgb,var(--orb)_20%,transparent)]",
          !still && "animate-orb-breathe",
          moves
        )}
      >
        {/* A deep mass low and right, so the sphere has weight where the shadow is. */}
        <OrbCloud
          className="inset-[34%_-8%_-14%_26%] bg-[color-mix(in_srgb,var(--orb)_92%,transparent)]"
          drift={still ? undefined : cn("animate-orb-drift-b", moves)}
        />
        {/* A mid mass drifting across the middle. */}
        <OrbCloud
          className="inset-[-10%_40%_40%_-6%] bg-[color-mix(in_srgb,var(--orb)_66%,transparent)]"
          drift={still ? undefined : cn("animate-orb-drift-a", moves)}
        />
        {/* The highlight, high and left, where the light comes from. It holds its own opacity:
         * the light does not get brighter because more is happening. */}
        <OrbCloud
          className="inset-[8%_44%_52%_12%] bg-[color-mix(in_srgb,var(--card)_92%,transparent)] opacity-85"
          drift={
            still
              ? undefined
              : cn("animate-orb-drift-a [animation-duration:21s] [animation-direction:reverse]", moves)
          }
        />
      </span>
    </span>
  )
}

export { Orb, orbVariants }
