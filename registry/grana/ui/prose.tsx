import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* Prose styles RENDERED MARKDOWN — the model's words in the agent rail, a run's notes and
 * streamed partials, the console's reading column. The caller renders the HTML (sanitized)
 * and Prose dresses every descendant tag, so the product never writes per-element CSS again.
 *
 * One recipe, reconciled from three near-duplicate sources (Luminars `runs .prose`, `agent
 * .reply`, the console `.prose`):
 *   - headings are sans, medium, at the body's size (no display face inside prose — the
 *     sources used Cabinet Grotesk 700 at 13.5px; the system keeps the voice face for titles)
 *   - inline code: mono 11.5px on the sunken fill, a hairline, 4px corners
 *   - pre: the same sunken block, 6px corners, scrolls sideways
 *   - blockquote: a 2px border-strong left rule, muted text
 *   - tables: hairline ROWS (not the sources' full grid), tabular figures
 *   - links: underlined in the hairline colour; the ink underline arrives on hover
 *   - first/last child drop their outer margin so the block sits flush in a bubble or a card
 *
 *   sm — the rail (agent `.reply`): 13px / 1.5
 *   md — the run report (runs `.prose`): 13.5px / 1.55 (default)
 *   lg — the console's reading column (`kit .prose`): serif 15px / 1.6, 66ch */
const proseVariants = cva(
  [
    // min-w-0: as a grid or flex-row item the block yields to its column; the pre scrolls inside
    "min-w-0 [overflow-wrap:anywhere] text-foreground",
    "[&>:first-child]:mt-0 [&>:last-child]:mb-0",
    // paragraphs
    "[&_p]:mb-2",
    // headings: sans medium, the body's size, a little air above
    "[&_:is(h1,h2,h3,h4,h5,h6)]:mt-3 [&_:is(h1,h2,h3,h4,h5,h6)]:mb-1 [&_:is(h1,h2,h3,h4,h5,h6)]:font-sans [&_:is(h1,h2,h3,h4,h5,h6)]:font-medium [&_:is(h1,h2,h3,h4,h5,h6)]:leading-[1.4]",
    // emphasis: the system's one emphasis weight is 500, never 700
    "[&_strong]:font-medium [&_b]:font-medium",
    // lists: preflight strips the markers — put them back; markers read faint
    "[&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-[18px] [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-[18px] [&_li]:my-0.5 marker:text-faint",
    // inline code
    "[&_code]:rounded-xs [&_code]:border [&_code]:border-border [&_code]:bg-muted [&_code]:px-1 [&_code]:py-px [&_code]:font-mono [&_code]:text-[11.5px]",
    // code block (and the code inside it drops the inline dressing)
    "[&_pre]:mb-2 [&_pre]:overflow-x-auto [&_pre]:rounded-sm [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted [&_pre]:px-2.5 [&_pre]:py-2 [&_pre]:font-mono [&_pre]:text-[11.5px] [&_pre]:leading-[1.55]",
    "[&_pre_code]:rounded-none [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
    // blockquote
    "[&_blockquote]:mb-2 [&_blockquote]:border-l-2 [&_blockquote]:border-border-strong [&_blockquote]:pl-2.5 [&_blockquote]:text-muted-foreground",
    // links
    "[&_a]:text-foreground [&_a]:underline [&_a]:decoration-border-strong [&_a]:underline-offset-2 [&_a:hover]:decoration-foreground",
    // tables: a block that scrolls sideways; hairline rows; tabular figures
    "[&_table]:tabular [&_table]:mb-2 [&_table]:block [&_table]:overflow-x-auto [&_table]:border-collapse [&_table]:text-xs [&_table]:leading-[1.45]",
    "[&_th]:border-b [&_th]:border-border-strong [&_th]:px-2 [&_th]:py-[3px] [&_th]:text-left [&_th]:align-bottom [&_th]:font-medium",
    "[&_td]:border-b [&_td]:border-border [&_td]:px-2 [&_td]:py-[3px] [&_td]:text-left [&_td]:align-top",
    // rule
    "[&_hr]:my-2.5 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-border",
    // images never overflow the column
    "[&_img]:max-w-full [&_img]:rounded-sm",
  ],
  {
    variants: {
      size: {
        sm: "text-13 leading-[1.5] [&_:is(h1,h2,h3,h4,h5,h6)]:text-[13.5px]",
        md: "text-[13.5px] leading-[1.55] [&_:is(h1,h2,h3,h4,h5,h6)]:text-[13.5px]",
        lg: [
          "max-w-[66ch] font-serif text-[15px] leading-[1.6]",
          "[&_:is(h1,h2,h3,h4,h5,h6)]:text-[15px] [&_:is(h1,h2,h3,h4,h5,h6)]:mt-4 [&_:is(h1,h2,h3,h4,h5,h6)]:mb-1.5",
          "[&_p]:mb-3 [&_ul]:mb-3 [&_ol]:mb-3 [&_pre]:mb-3 [&_blockquote]:mb-3 [&_table]:mb-3 [&_hr]:my-4",
          "[&_code]:text-[13px] [&_pre]:text-[12.5px] [&_table]:text-13 [&_table]:font-sans",
        ],
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

function Prose({
  className,
  size = "md",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof proseVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(proseVariants({ size }), className),
      },
      props
    ),
    render,
    state: {
      slot: "prose",
      size,
    },
  })
}

export { Prose, proseVariants }
