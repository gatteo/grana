import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* A Badge names a PROPERTY of the thing — its grade, who authored it — never a state (that
 * is a Chip). Mono caps, hairline. `dashed` is the standing signal for "inferred, not
 * asserted" (machine-made): both kits share that contract; never use dashed for anything else.
 *
 *   outline — Luminars `.badge` (default): pill, 10px mono caps, border-strong
 *   dashed  — `.badge[data-dashed]`: the same, dashed
 *   ink     — filled, for the one badge that must read first (a count, a grade)
 *   tag     — RF `.tag`: 4px square, 9px mono caps, hairline, faint
 *   action  — RF `.by-ai` / "Azione AI": 4px square, dashed stone-400, mono caps */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center border font-mono font-medium uppercase whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        outline:
          "gap-1 border-border-strong px-2 py-0.5 text-[10px] tracking-[.08em] text-muted-foreground [&>svg]:size-2.5",
        dashed:
          "gap-1 border-dashed border-border-strong px-2 py-0.5 text-[10px] tracking-[.08em] text-muted-foreground [&>svg]:size-2.5",
        ink: "gap-1 border-primary bg-primary px-2 py-0.5 text-[10px] tracking-[.08em] text-primary-foreground [&>svg]:size-2.5",
        tag: "gap-1 border-border px-[5px] py-0.5 text-[9px] tracking-[.07em] text-faint [&>svg]:size-2.5",
        action:
          "gap-1 border-dashed border-stone-400 px-[5px] py-px text-[9px] tracking-[.07em] text-muted-foreground [&>svg]:size-2.5",
      },
      shape: {
        pill: "rounded-full",
        square: "rounded-xs",
      },
    },
    defaultVariants: {
      variant: "outline",
      shape: "pill",
    },
  }
)

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>
type BadgeShape = NonNullable<VariantProps<typeof badgeVariants>["shape"]>

/* RF's tags are square, Luminars' badges are pills; the variant picks unless told. */
const defaultShape = (variant: BadgeVariant): BadgeShape =>
  variant === "tag" || variant === "action" ? "square" : "pill"

function Badge({
  className,
  variant = "outline",
  shape,
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  const resolvedShape = shape ?? defaultShape(variant ?? "outline")
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, shape: resolvedShape }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
      shape: resolvedShape,
    },
  })
}

export { Badge, badgeVariants }
