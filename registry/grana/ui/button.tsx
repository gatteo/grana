import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* The Grana button — skin-spec §1 + §22, one cva for both products.
 *
 * Every variant is a pill and every variant carries a 1px border (transparent where the
 * recipe has none) so all variants share one height per size — the measured "quiet is 2px
 * taller than primary" quirk is gone. The fill clips to the BORDER box, not the padding box:
 * with `bg-clip-padding` a transparent border punched a 1px ring of background through the
 * edge of every filled pill (measured against the RF marketing button, which has no border
 * at all and is solid to its edge). Heights: xs 24 · sm 32 · md 34 · lg 40 · xl 50
 * (marketing). The destructive ladder: `destructive` is rung 1 (a quiet verb that warms to
 * critical under the pointer), `variant="danger"` is rung 2 (critical at rest). `pressed`
 * renders `aria-pressed` — only when given, an ordinary verb must not claim to be a toggle.
 *
 * Two registers, one API: on `data-surface="marketing"` the two everyday sizes drop their fixed
 * height for the RF `.btn` recipe — padding-driven, at the paper size, 14/13px on the body's 1.6
 * leading. The paddings are the CSS ones minus the hairline every variant carries, so a marketing
 * button measures 50px like its BEM ancestor and every variant still shares one height.
 *
 * The global `:focus-visible` outline is the focus state; nothing here paints its own ring. */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border font-medium whitespace-nowrap transition-colors duration-[120ms] ease-out select-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 in-data-[surface=marketing]:active:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:stroke-[1.5] [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /* the ink ground — one per screen (DSN-3) */
        primary:
          "border-transparent bg-primary text-primary-foreground not-disabled:hover:bg-stone-800",
        /* the hairline verb — every other action */
        quiet:
          "border-border-strong bg-transparent text-muted-foreground not-disabled:hover:border-stone-400 not-disabled:hover:text-foreground",
        /* rung 2 of the destructive ladder: critical at rest, fills under the pointer */
        danger:
          "border-destructive bg-transparent text-destructive not-disabled:hover:bg-destructive not-disabled:hover:text-destructive-foreground",
        /* no border, a hover fill — icon triggers, row verbs that must stay out of the way */
        ghost:
          "border-transparent bg-transparent text-faint not-disabled:hover:bg-accent not-disabled:hover:text-accent-foreground",
        /* a text link that sits in a button row */
        link: "h-auto border-transparent bg-transparent px-0 text-[length:inherit] text-foreground underline decoration-stone-400 underline-offset-[3px] not-disabled:hover:decoration-foreground",
        /* marketing: primary on a dark band or imagery (RF `.btn--on-dark`) */
        "on-dark":
          "border-transparent bg-ecru text-ink not-disabled:hover:bg-stone-0",
        /* marketing: the glass secondary on paper (RF `.btn--quiet`) */
        glass:
          "border-border-strong bg-secondary text-foreground backdrop-blur-[10px] backdrop-saturate-[1.4] not-disabled:hover:border-stone-400 not-disabled:hover:bg-stone-0/72",
        /* marketing: the glass secondary on imagery (RF `.btn--ghost-dark`) */
        "glass-dark":
          "border-inverse-foreground/26 bg-inverse-foreground/10 text-inverse-foreground backdrop-blur-[12px] backdrop-saturate-[1.4] not-disabled:hover:border-inverse-foreground/40 not-disabled:hover:bg-inverse-foreground/[0.18]",
      },
      size: {
        xs: "h-6 gap-1 px-2.5 text-[11.5px] [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 px-3.5 text-[12.5px] [&_svg:not([class*='size-'])]:size-3.5 in-data-[surface=marketing]:h-auto in-data-[surface=marketing]:gap-2 in-data-[surface=marketing]:px-[15px] in-data-[surface=marketing]:py-2 in-data-[surface=marketing]:text-[13px] in-data-[surface=marketing]:leading-[1.6] in-data-[surface=marketing]:tracking-[-0.005em]",
        md: "h-[34px] gap-1.5 px-4 text-[12.5px] in-data-[surface=marketing]:h-auto in-data-[surface=marketing]:gap-2 in-data-[surface=marketing]:px-[23px] in-data-[surface=marketing]:py-[13px] in-data-[surface=marketing]:text-sm in-data-[surface=marketing]:leading-[1.6] in-data-[surface=marketing]:tracking-[-0.005em]",
        lg: "h-10 gap-1.5 px-5 text-[13.5px]",
        icon: "size-[34px]",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-10",
      },
      destructive: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      /* rung 1: only a quiet (or ghost) verb warms; other variants ignore the flag */
      {
        variant: "quiet",
        destructive: true,
        class:
          "not-disabled:hover:border-destructive not-disabled:hover:text-destructive",
      },
      {
        variant: "ghost",
        destructive: true,
        class: "not-disabled:hover:text-destructive",
      },
    ],
    defaultVariants: {
      variant: "quiet",
      size: "md",
      destructive: false,
    },
  }
)

/* The pressed ground (a toggle that is on): the deeper canvas tint, ink text, a firmer hairline. */
const pressedClass =
  "aria-pressed:border-stone-400 aria-pressed:bg-canvas-deep aria-pressed:text-foreground"

type ButtonProps = Omit<ButtonPrimitive.Props, "type"> &
  Omit<VariantProps<typeof buttonVariants>, "destructive"> & {
    /** Rung 1 of the destructive ladder: a quiet verb that warms to critical under the pointer. */
    destructive?: boolean
    /** A toggle that is on. Renders `aria-pressed` only when given. */
    pressed?: boolean
    type?: "button" | "submit" | "reset"
  }

function Button({
  className,
  variant = "quiet",
  size = "md",
  destructive = false,
  pressed,
  type = "button",
  render,
  nativeButton,
  ...props
}: ButtonProps) {
  /* `render={<a href>}` replaces links-as-buttons; Base UI wants to know it is not a <button>. */
  const isNative =
    nativeButton ??
    !(React.isValidElement(render) && render.type !== "button")
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-destructive={destructive || undefined}
      data-pressed={pressed || undefined}
      aria-pressed={pressed}
      type={isNative ? type : undefined}
      render={render}
      nativeButton={isNative}
      className={cn(
        buttonVariants({ variant, size, destructive }),
        pressed !== undefined && pressedClass,
        className
      )}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
