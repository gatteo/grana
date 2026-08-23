import type { ReactNode } from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* An ExecutorChip names WHO performs a step — the AI, you, a connected tool, the screen — in
 * the executor hues (Luminars `flow .agentChip/.humanChip/.apiChip/.screenChip`, the console
 * `.execBadge`). Pill, medium weight, the soft fill with the hue as text and a 30% hairline.
 *
 *   agent  — the DASHED chip: an inferred AI step (the dashed-means-machine contract)
 *   human  — "Your step" / "Waits for you"
 *   api    — a connected tool
 *   screen — browser or desktop (both Luminars executors collapse to one hue)
 *   wait   — not an executor at all: a quiet stone chip (the console's `wait` tone)
 *
 * Under the RF brand the hues collapse to stone through the tokens, so the chip still reads —
 * and the agent still reads dashed. The label is always the caller's word (i18n). */
const executorChipVariants = cva(
  "inline-flex w-fit shrink-0 items-center rounded-full border font-medium whitespace-nowrap",
  {
    variants: {
      executor: {
        agent: "border-dashed border-exec-agent bg-exec-agent-soft text-exec-agent",
        human: "border-exec-human/30 bg-exec-human-soft text-exec-human",
        api: "border-exec-api/30 bg-exec-api-soft text-exec-api",
        screen: "border-exec-screen/30 bg-exec-screen-soft text-exec-screen",
        wait: "border-border bg-muted text-muted-foreground",
      },
      size: {
        /* the flow node chip: 10.5px, 2px 9px */
        sm: "gap-1 px-[9px] py-0.5 text-[10.5px]",
        /* the console step row: 11.5px; 3px 10px so it sits level with a Chip on the same row */
        md: "gap-1.5 px-2.5 py-[3px] text-[11.5px]",
      },
    },
    defaultVariants: {
      executor: "agent",
      size: "md",
    },
  }
)

type Executor = NonNullable<VariantProps<typeof executorChipVariants>["executor"]>

function ExecutorChip({
  className,
  executor,
  label,
  dot = false,
  size = "md",
  render,
  ...props
}: Omit<useRender.ComponentProps<"span">, "children"> &
  VariantProps<typeof executorChipVariants> & {
    executor: Executor
    /** The word. Always the caller's copy — never hardcoded here. */
    label: ReactNode
    /** A 6px dot in the executor's hue before the word. Off by default (the sources have none). */
    dot?: boolean
  }) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(executorChipVariants({ executor, size }), className),
        children: (
          <>
            {dot ? (
              <span
                data-slot="executor-chip-dot"
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-current"
              />
            ) : null}
            {label}
          </>
        ),
      },
      props
    ),
    render,
    state: {
      slot: "executor-chip",
      executor,
      size,
      dot,
    },
  })
}

export { ExecutorChip, executorChipVariants, type Executor }
