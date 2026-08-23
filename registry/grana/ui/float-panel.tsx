import * as React from "react"

import { cn } from "@/lib/utils"

/* The white artefact panel floating on a field (RF `.float-panel`).
 *
 * Everything the marketing surface says about the product it says through one of these: a small
 * white card, a firmer hairline than the page's, the deep panel shadow, laid over a `Canvas`. It
 * is decorative by construction — `aria-hidden` on the root, because a screen reader gains
 * nothing from a drawn invoice — and the copy inside it is Italian product-demo data, not prose.
 *
 * It is its own container (`container-type: inline-size`): a card canvas gets narrow long before
 * the viewport does, so the fragments inside compact on the panel's width, not the phone's. The
 * `@max-[…]` rules in `snippets`/`shots` resolve against this element.
 *
 * It does not lift on its own — the card that owns it does (`.ill-card:hover .float-panel`), and
 * the transition that carries the lift lives here so any owner can drive it. */
export interface FloatPanelProps
  extends Omit<React.ComponentProps<"div">, "title" | "children"> {
  /** Mono uppercase header, e.g. "Preventivo · #2026-0184". */
  title?: string
  /** The wide register (RF `.float-panel--wide`): min(430px, 96%) instead of min(340px, 92%). */
  wide?: boolean
  className?: string
  children: React.ReactNode
}

function FloatPanel({ title, wide, className, children, ...props }: FloatPanelProps) {
  return (
    <div
      data-slot="float-panel"
      data-wide={wide ? "" : undefined}
      aria-hidden="true"
      className={cn(
        "@container min-w-0 w-[min(340px,92%)] rounded-sm border border-line-artefact bg-stone-0 px-[1.125rem] py-4 text-left text-[13px] shadow-panel transition-[translate] duration-400 ease-brand-out",
        /* A panel nested in another panel tightens up — the same rule the CSS carries. */
        "@max-[320px]:px-[0.8125rem] @max-[320px]:py-3",
        wide && "w-[min(430px,96%)]",
        className
      )}
      {...props}
    >
      {title ? (
        <h5
          data-slot="float-panel-title"
          className="mb-2.5 font-mono text-[11px] font-medium tracking-[0.08em] text-stone-500 uppercase"
        >
          {title}
        </h5>
      ) : null}
      {children}
    </div>
  )
}

export { FloatPanel }
