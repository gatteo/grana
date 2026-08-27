import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* The assistant's state indicator: ONE sphere. A soft shadow beneath it so it has somewhere to
 * stand, a coloured bloom around it, and a ball whose surface is a MESH — five conic wedges
 * orbiting at five different speeds behind a blur, a contrast pass and a fine dot screen, lit by
 * a drifting specular sheen and a rim. No rings, no collar, no text inside — the orb is a figure,
 * not a widget.
 *
 * Colour says WHICH state; motion says WHETHER anything is running. `level` (0..1) is the one
 * runtime input: it lands as `--orb-level` and from there drives the breath amplitude, the mesh's
 * focus (a louder signal tightens the blur), the bloom AND the depth of the shadow, so a caller
 * animating a single number animates the whole figure. Everything else is CSS.
 *
 * The whole surface is mixed from `--orb`, the tone's single hue — the four mesh stops are that
 * one colour at four strengths, spread over a hue arc so the mesh has life without the state
 * losing its identity. The arc is BIASED PER TONE (`--orb-arc`), because a symmetric spread is
 * not safe: +25° off the warning yellow is green, which is the READY orb, and −25° off the
 * thinking blue is violet, which is no state at all (both measured). Each tone spreads only
 * toward hues that belong to it — warning toward amber, thinking toward cyan. A red state
 * churns red.
 *
 * DSN-6 — a colour never carries meaning alone, and this component is nothing but a colour.
 * It is safe only because every screen that shows it NAMES THE STATE IN WORDS TWICE: once in
 * the headline beside the orb, once in the status line under it. Compose it that way or do
 * not use it. `label` is required for the same reason: an orb with no accessible name says
 * nothing at all to a reader who cannot see the hue.
 *
 * `still` — and `prefers-reduced-motion` — stops the orbit, the sheen and the breath dead.
 * Nothing moves, and the sphere still reads: each wedge holds a different resting angle, so a
 * settled orb is a composed mesh rather than five wedges stacked in one place.
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
      listening: "[--orb:var(--status-critical)] [--orb-arc:0deg]",
      thinking: "[--orb:var(--status-info)] [--orb-arc:-18deg]",
      ready: "[--orb:var(--status-good)] [--orb-arc:0deg]",
      stalled: "[--orb:var(--status-serious)] [--orb-arc:-10deg]",
      warning: "[--orb:var(--status-warning)] [--orb-arc:-22deg]",
    },
  },
  defaultVariants: { tone: "thinking" },
})

/* The mesh, one row per orbiting wedge.
 *
 * `at` is where the wedge's conic origin sits, so rotating the LAYER swings that off-centre mass
 * around the sphere instead of spinning a centred gradient in place (which would render an
 * identical image every frame). `from` is its resting angle — five different ones, which is what
 * lets `still` read as a composed surface. `hue` spreads the four stops off `--orb` far enough to
 * read as a mesh and not far enough to change which state you are looking at.
 *
 * These are per-layer one-offs, so they are written as data and applied inline rather than as
 * five hand-expanded arbitrary-value class strings: the numbers ARE the design here, and a wall
 * of `bg-[conic-gradient(from_0deg_at_25%_70%,…)]` hides them. */
const ORB_MESH = [
  { at: "25% 70%", from: 0, stop: "var(--orb-c3)", wedge: "38% 62%", seconds: 26, hue: -20, reverse: false },
  { at: "45% 75%", from: 72, stop: "var(--orb-c2)", wedge: "28% 72%", seconds: 17, hue: 12, reverse: true },
  { at: "80% 20%", from: 145, stop: "var(--orb-c4)", wedge: "42% 58%", seconds: 21, hue: 0, reverse: false },
  { at: "60% 35%", from: 210, stop: "var(--orb-c2)", wedge: "26% 74%", seconds: 33, hue: 22, reverse: true },
  { at: "15% 8%", from: 295, stop: "var(--orb-c3)", wedge: "36% 64%", seconds: 44, hue: -10, reverse: false },
] as const

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
    /** 0..1 — how much is happening. Breath amplitude, mesh focus, bloom, shadow depth. */
    level?: number | undefined
    /** Diameter in px. 152 in the recording sheet, 128 on the start step, 44 beside a word. */
    size?: number | undefined
    /** A settled state holds still: the mesh stops orbiting, the sphere stops breathing. */
    still?: boolean | undefined
    /** REQUIRED accessible name — the state in words, e.g. "Recording — listening". */
    label: string
  }) {
  const clamped = Math.min(1, Math.max(0, level))
  /* One switch for all the animations, so `still` can never half-stop the figure. Reduced
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
          /* The four mesh stops and the ground, all mixed from the one tone colour. `oklab`
           * rather than sRGB: mixing #d03b3b toward white in sRGB goes chalky-pink long before
           * it goes light, and the mesh needs the chroma to survive the blur. */
          "--orb-c1": "var(--orb)",
          "--orb-c2": "color-mix(in oklab, var(--orb) 70%, var(--card))",
          "--orb-c3": "color-mix(in oklab, var(--orb) 44%, var(--stone-900))",
          "--orb-c4": "color-mix(in oklab, var(--orb) 82%, var(--stone-500))",
          "--orb-ground": "color-mix(in oklab, var(--orb) 34%, var(--card))",
          /* Every dimension of the material is a fraction of the diameter, so the same recipe
           * reads at 44px and at 152px without the component branching on size. */
          "--orb-blur": "max(1px, calc(var(--orb-size) * 0.026))",
          "--orb-dot": "max(0.18px, calc(var(--orb-size) * 0.007))",
          "--orb-rim": "max(1.5px, calc(var(--orb-size) * 0.06))",
          "--orb-vignette": "max(2px, calc(var(--orb-size) * 0.012))",
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* The bloom: the sphere's own colour thrown onto the ground around it. It lives OUTSIDE
        * the disc, because the disc clips itself. */}
      <span
        data-slot="orb-bloom"
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[12%] rounded-full opacity-[calc(0.16_+_var(--orb-level,0.5)_*_0.3)]"
        style={{
          background: "radial-gradient(circle at 50% 50%, var(--orb) 0%, transparent 64%)",
          filter: "blur(calc(var(--orb-size) * 0.22))",
        }}
      />
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
          /* The clip is a `clip-path`, not `overflow-hidden`. MEASURED in a real WKWebView (the
           * engine Tauri ships, not Playwright's, which renders this correctly and hides the
           * bug): a blurred descendant of a rounded `overflow-hidden` box is clipped to the
           * box's RECT, so the mesh paints into the corners and a settled orb reads as a circle
           * inside a faint square. An animation on the ball happens to hide it — which is why
           * the bug only ever showed on `still` and under reduced motion. Forcing a compositing
           * layer (`will-change`, `translateZ(0)`) does NOT fix it; only a real clip does.
           * `isolate` keeps the screen and sheen blending against the mesh and nothing else. */
          "absolute inset-0 isolate overflow-hidden rounded-full [clip-path:circle(50%)]",
          !still && "animate-orb-breathe",
          moves
        )}
      >
        {/* The mesh. The blur, the contrast and the saturate pass apply to the five wedges
          * COMPOSITED, which is the whole trick: separately they are five flat wedges, together
          * and squeezed they are a churning surface. `--orb-level` tightens the blur — a louder
          * signal reads as the orb focusing — and grows the mesh a little inside its own clip. */}
        <span
          data-slot="orb-mesh"
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{
            filter:
              "blur(calc(var(--orb-blur) * (1 - var(--orb-level, 0.5) * 0.3))) contrast(1.28) saturate(1.55)",
            /* The vignette in the ground colour tucks the mesh back inside the sphere; it is
             * inside the filtered layer on purpose, so the blur softens the tuck too. */
            boxShadow:
              "inset 0 0 var(--orb-vignette) calc(var(--orb-vignette) * 0.2) var(--orb-ground)",
            scale: "calc(1 + var(--orb-level, 0.5) * 0.06)",
          }}
        >
          {/* The body. Five wedges with transparent middles do not cover a circle — without a
            * solid sphere beneath them the card shows straight through the middle, and every
            * orb reads as a white blob with a coloured rim (measured, first pass). It is FLAT on
            * purpose: a modelled radial gradient here is a finished sphere, and the wedges on
            * top of one read as a faint stain (measured, third pass). The mesh models the
            * surface; the rim makes it a ball. */}
          <span
            data-slot="orb-body"
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--orb-c1)" }}
          />
          {ORB_MESH.map((mass) => (
            <span
              key={mass.from}
              data-slot="orb-mass"
              aria-hidden="true"
              className={cn(
                "absolute inset-0 rounded-full",
                !still && "animate-orb-swirl",
                moves
              )}
              style={{
                backgroundImage: `conic-gradient(from ${mass.from}deg at ${mass.at}, ${mass.stop}, transparent ${mass.wedge}, ${mass.stop})`,
                animationDuration: `${mass.seconds}s`,
                ...(mass.reverse ? { animationDirection: "reverse" as const } : {}),
                filter: `hue-rotate(calc(var(--orb-arc, 0deg) + ${mass.hue}deg))`,
              }}
            />
          ))}
        </span>
        {/* The dot screen: a fine grid of ground-coloured dots over the mesh, strongest in the
          * middle and gone by the rim. It is what keeps a blurred gradient from reading as a
          * cheap blurred gradient. */}
        <span
          data-slot="orb-screen"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, var(--orb-ground) var(--orb-dot), transparent var(--orb-dot))",
            backgroundSize: "calc(var(--orb-dot) * 2) calc(var(--orb-dot) * 2)",
            /* Half a dot of blur: enough that the grain never resolves into a grid, which is
             * what the source buys with a backdrop-filter we are not willing to ship into
             * WKWebView. */
            filter: "blur(calc(var(--orb-dot) * 0.5))",
            maskImage: "radial-gradient(black 18%, transparent 78%)",
          }}
        />
        {/* The specular sheen, high and left, where the light comes from. It drifts slower than
          * anything in the mesh, so the highlight never sits still enough to read as painted on
          * — and it holds its own opacity: the light does not get brighter because more is
          * happening. */}
        <span
          data-slot="orb-sheen"
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full mix-blend-screen",
            !still && "animate-orb-sheen",
            moves
          )}
          style={{
            background:
              "radial-gradient(circle at 30% 24%, color-mix(in srgb, var(--card) 30%, transparent), transparent 22%), radial-gradient(circle at 72% 80%, color-mix(in srgb, var(--card) 7%, transparent), transparent 40%)",
          }}
        />
        {/* The modelling of a drawn sphere, not the elevation of a surface: a lit top edge, a
          * shaded bottom and a thin inner ring. See the report — this is the one place a
          * box-shadow is not shadow-card/shadow-panel. */}
        <span
          data-slot="orb-rim"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            boxShadow:
              "inset 0 0 0 1px color-mix(in srgb, var(--card) 16%, transparent), inset 0 var(--orb-rim) calc(var(--orb-rim) * 2) color-mix(in srgb, var(--card) 22%, transparent), inset 0 calc(var(--orb-rim) * -1.2) calc(var(--orb-rim) * 2.4) color-mix(in srgb, var(--stone-900) 40%, transparent)",
          }}
        />
      </span>
    </span>
  )
}

export { Orb, orbVariants }
