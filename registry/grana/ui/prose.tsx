import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* Prose styles RENDERED MARKDOWN — the caller renders the HTML (sanitized) and Prose dresses
 * every descendant tag, so a product never writes per-element CSS again.
 *
 * TWO REGISTERS, and they share almost nothing but the wrapper. `product` is a message in a rail
 * or a report in a card: sans headings at the body's size, a sunken code block, hairline table
 * rows, the outer margins trimmed so the block sits flush in a bubble. `editorial` is an ARTICLE
 * on paper: display-face headings that breathe like section titles, a 62ch measure, links ruled in
 * stone that warm to ochre, a dash instead of a bullet, a serif blockquote against an ochre rule.
 *
 * Each register owns its whole recipe — none of it lives in the cva base. The two were briefly
 * layered instead, and the leaks were invisible until measured: the product's first-child margin
 * reset silently ate the first heading's air on every article (−61px a page), its `font-serif`
 * reading size turned a manifesto serif, and two different arbitrary variants for the same
 * padding (`[&_ul]:` vs `[&_:is(ul,ol)]:`) let source order pick the winner. A register is a
 * whole recipe or it is a trap.
 *
 * Sizes, per register:
 *   product   sm — the rail (13/1.5) · md — the run report (13.5/1.55, default) · lg — the
 *             console's reading column (serif 15/1.6, 66ch)
 *   editorial md — an article · lg — the manifesto: one size up, headings held to 18ch with the
 *             air of a section title over them; the page is read, not scanned */
const proseVariants = cva("min-w-0 text-foreground", {
  /* `size` is declared first on purpose: cva emits the variants in key order, so `variant` lands
   * after it, and the compounds after both. */
  variants: {
    size: { sm: "", md: "", lg: "" },
    variant: {
      product: [
        "[overflow-wrap:anywhere]",
        "[&>:first-child]:mt-0 [&>:last-child]:mb-0",
        "[&_p]:mb-2",
        // headings: sans medium, the body's size, a little air above
        "[&_:is(h1,h2,h3,h4,h5,h6)]:mt-3 [&_:is(h1,h2,h3,h4,h5,h6)]:mb-1 [&_:is(h1,h2,h3,h4,h5,h6)]:font-sans [&_:is(h1,h2,h3,h4,h5,h6)]:font-medium [&_:is(h1,h2,h3,h4,h5,h6)]:leading-[1.4]",
        // the system's one emphasis weight is 500, never 700
        "[&_strong]:font-medium [&_b]:font-medium",
        // lists: preflight strips the markers — put them back; markers read faint
        "[&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-[18px] [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-[18px] [&_li]:my-0.5 marker:text-faint",
        "[&_code]:rounded-xs [&_code]:border [&_code]:border-border [&_code]:bg-muted [&_code]:px-1 [&_code]:py-px [&_code]:font-mono [&_code]:text-[11.5px]",
        "[&_pre]:mb-2 [&_pre]:overflow-x-auto [&_pre]:rounded-sm [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted [&_pre]:px-2.5 [&_pre]:py-2 [&_pre]:font-mono [&_pre]:text-[11.5px] [&_pre]:leading-[1.55]",
        "[&_pre_code]:rounded-none [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_blockquote]:mb-2 [&_blockquote]:border-l-2 [&_blockquote]:border-border-strong [&_blockquote]:pl-2.5 [&_blockquote]:text-muted-foreground",
        "[&_a]:text-foreground [&_a]:underline [&_a]:decoration-border-strong [&_a]:underline-offset-2 [&_a:hover]:decoration-foreground",
        // tables: a block that scrolls sideways inside a rail; hairline rows; tabular figures
        "[&_table]:tabular [&_table]:mb-2 [&_table]:block [&_table]:overflow-x-auto [&_table]:border-collapse [&_table]:text-xs [&_table]:leading-[1.45]",
        "[&_th]:border-b [&_th]:border-border-strong [&_th]:px-2 [&_th]:py-[3px] [&_th]:text-left [&_th]:align-bottom [&_th]:font-medium",
        "[&_td]:border-b [&_td]:border-border [&_td]:px-2 [&_td]:py-[3px] [&_td]:text-left [&_td]:align-top",
        "[&_hr]:my-2.5 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-border",
        "[&_img]:max-w-full [&_img]:rounded-sm",
      ],
      editorial: [
        // the reading measure and the one rhythm rule: every block is 1.1em from the last
        "max-w-text font-sans text-base leading-[1.6] [&>*+*]:mt-[1.1em]",
        // headings are the display face here — an article on paper has a voice. The
        // `>h2:first-child` form is deliberate: a leading heading keeps its air.
        "[&_h2]:mb-0 [&_h2]:font-display [&_h2]:text-[1.75rem] [&_h2]:leading-[1.15] [&_h2]:font-bold [&_h2]:tracking-[-0.015em] [&_h2]:mt-[2.2em] [&>h2:first-child]:mt-[2.2em]",
        "[&_h3]:mb-0 [&_h3]:font-display [&_h3]:text-[1.25rem] [&_h3]:leading-[1.22] [&_h3]:font-bold [&_h3]:tracking-normal [&_h3]:mt-[1.8em] [&>h3:first-child]:mt-[1.8em]",
        // h1 and h4–h6 are not styled by this register at all — the rhythm rule carries them
        "[&_:is(h1,h4,h5,h6)]:my-0 [&_:is(h1,h4,h5,h6)]:font-sans [&_:is(h1,h4,h5,h6)]:text-[length:inherit] [&_:is(h1,h4,h5,h6)]:leading-[inherit] [&_:is(h1,h4,h5,h6)]:font-semibold",
        // a deep-linked heading must not land under the sticky header
        "[&_:is(h2,h3)]:scroll-mt-24",
        "[&_p]:mb-0 [&_pre]:mb-0 [&_blockquote]:mb-0",
        // links are ruled, never underlined by the browser; the rule warms under the pointer
        "[&_a]:font-medium [&_a]:text-foreground [&_a]:no-underline [&_a]:border-b [&_a]:border-stone-400 [&_a]:transition-colors [&_a:hover]:border-ochre",
        // a list marker is a dash, not a bullet: the document is written, not bulleted
        "[&_ul]:mb-0 [&_ul]:pl-5 [&_ol]:mb-0 [&_ol]:pl-5 [&_li]:my-0 [&_li+li]:mt-[0.4em]",
        "[&_ul_li]:relative [&_ul_li]:list-none",
        "[&_ul_li]:before:absolute [&_ul_li]:before:-left-5 [&_ul_li]:before:top-[0.7em] [&_ul_li]:before:h-px [&_ul_li]:before:w-2.5 [&_ul_li]:before:bg-stone-400 [&_ul_li]:before:content-['']",
        // the quote is the one serif moment, held by an ochre rule
        "[&_blockquote]:border-l-2 [&_blockquote]:border-ochre [&_blockquote]:pl-5 [&_blockquote]:font-serif [&_blockquote]:text-lead [&_blockquote]:text-foreground",
        // tables: mono uppercase heads, hairline rows, no grid — a real table filling the column
        "[&_table]:mb-0 [&_table]:table [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_table]:leading-[var(--lh-body)]",
        "[&_th]:eyebrow [&_th]:border-b [&_th]:border-border-strong [&_th]:px-3 [&_th]:py-2 [&_th]:pl-0 [&_th]:text-left [&_th]:align-middle [&_th]:text-muted-foreground",
        "[&_td]:border-b [&_td]:border-border [&_td]:px-3 [&_td]:py-2.5 [&_td]:pl-0 [&_td]:align-top",
        // inline code sits on the deeper paper, not on a card
        "[&_code]:rounded-xs [&_code]:border-0 [&_code]:bg-ecru-deep [&_code]:px-[0.35em] [&_code]:py-[0.1em] [&_code]:font-mono [&_code]:text-[0.875em]",
        "[&_strong]:font-semibold [&_b]:font-semibold",
        "[&_img]:max-w-full",
      ],
    },
  },
  compoundVariants: [
    {
      variant: "product",
      size: "sm",
      class: "text-13 leading-[1.5] [&_:is(h1,h2,h3,h4,h5,h6)]:text-[13.5px]",
    },
    {
      variant: "product",
      size: "md",
      class: "text-[13.5px] leading-[1.55] [&_:is(h1,h2,h3,h4,h5,h6)]:text-[13.5px]",
    },
    {
      variant: "product",
      size: "lg",
      class: [
        "max-w-[66ch] font-serif text-[15px] leading-[1.6]",
        "[&_:is(h1,h2,h3,h4,h5,h6)]:text-[15px] [&_:is(h1,h2,h3,h4,h5,h6)]:mt-4 [&_:is(h1,h2,h3,h4,h5,h6)]:mb-1.5",
        "[&_p]:mb-3 [&_ul]:mb-3 [&_ol]:mb-3 [&_pre]:mb-3 [&_blockquote]:mb-3 [&_table]:mb-3 [&_hr]:my-4",
        "[&_code]:text-[13px] [&_pre]:text-[12.5px] [&_table]:text-13 [&_table]:font-sans",
      ],
    },
    {
      variant: "editorial",
      size: "lg",
      /* The manifesto: read, not scanned — one size up, a shorter measure on the headings, and the
       * air above a heading matched to the air under the hero band. The h2 leading is restated
       * because a font-size utility drops a preceding leading of the same variant in the merge. */
      class: [
        "text-[clamp(1.125rem,1.4vw,1.3125rem)] leading-[1.55]",
        "[&_h2]:mt-[3.25rem] [&_h2]:max-w-[18ch] [&_h2]:text-[clamp(1.75rem,3vw,2.375rem)] [&_h2]:leading-[1.15]",
        "[&>p:first-child]:mt-0 [&>h2:first-child]:mt-0 [&_li]:mt-[0.75em] [&_li+li]:mt-[0.75em]",
      ],
    },
  ],
  defaultVariants: {
    size: "md",
    variant: "product",
  },
})

function Prose({
  className,
  size = "md",
  variant = "product",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof proseVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(proseVariants({ size, variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "prose",
      size,
      variant,
    },
  })
}

export { Prose, proseVariants }
