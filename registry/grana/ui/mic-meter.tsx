import * as React from "react"

import { cn } from "@/lib/utils"

/* A live microphone meter: ten bars that rise with what the machine is hearing.
 *
 * The ten weights are FIXED, so the same level always draws the same picture. A meter with a
 * random element is a decoration that happens to move; this one is a readout — hold the level
 * and the shape holds with it, and the difference between 0.3 and 0.8 is legible.
 *
 * DSN-6: the meter is never the only thing saying what is happening. The bar it sits in names
 * the state in words beside it, and the meter's own accessible name changes with the mute —
 * which is why `label` is required. Muted also flattens the bars here rather than trusting the
 * caller to pass 0: a mute you can see is a mute, a mute you merely clicked is a hope.
 *
 *   <MicMeter level={0.62} muted={false} label="Microphone level" />
 *   <MicMeter level={0.62} muted label="Narration muted" />
 */

/** Each bar's share of the level, so the row reads as a meter and not as one number ten times. */
const WEIGHTS = [0.42, 0.62, 0.82, 1, 0.9, 0.55, 0.7, 0.95, 0.6, 0.38]
const MIN_HEIGHT = 3
const MAX_HEIGHT = 16

function MicMeter({
  className,
  level,
  muted,
  label,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  /** 0..1. Values outside the range are clamped; `muted` forces it to 0. */
  level: number
  /** Muted: the bars go flat and take the quiet ramp. */
  muted: boolean
  /** REQUIRED accessible name. It changes with the mute — "Microphone level" / "Narration muted". */
  label: string
}) {
  const value = muted ? 0 : Math.min(1, Math.max(0, level))

  return (
    <span
      data-slot="mic-meter"
      data-muted={muted ? "on" : "off"}
      role="img"
      aria-label={label}
      className={cn("flex h-4 flex-none items-end gap-[2px]", className)}
      {...props}
    >
      {WEIGHTS.map((weight, index) => (
        <span
          key={index}
          data-slot="mic-meter-bar"
          aria-hidden="true"
          className={cn(
            "block w-[2.5px] rounded-full transition-[height] duration-70 ease-brand-out",
            muted ? "bg-stone-400" : "bg-status-good"
          )}
          style={{
            height: `${MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) * Math.min(1, value * weight)}px`,
          }}
        />
      ))}
    </span>
  )
}

export { MicMeter }
