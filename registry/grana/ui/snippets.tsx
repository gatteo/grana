import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

/* Built artefacts: small product-true illustrations drawn in code — a ledger, a chat, a quote, a
 * review, a chart, a checklist, a website. They float on a canvas field inside cards (the "posto
 * dove il lavoro succede" concept, generalised), normally inside a `FloatPanel`, which marks the
 * subtree `aria-hidden`: these are pictures of the product, not content.
 *
 * Everything here is fixed-shape, so every fragment is a plain `cn()` — the one real variant on
 * this surface is `FloatPanel`'s width. The sizes are the CSS's own (11px, 12px, 9px…), written as
 * arbitrary values on purpose: the named steps (`text-13`, `text-2xs`) carry a line-height these
 * fragments must not inherit — they read on the body's 1.6.
 *
 * Numbers: the marketing `.num` is tabular figures with the face left alone (the `tabular`
 * utility); only where the CSS reaches for `--font-num` does the readout switch to mono (`num`). */

export interface SnippetRowsProps {
  /** Data rows as [left, right]; strings get .who / .num treatment. */
  rows: [ReactNode, ReactNode][]
}

/** Ledger rows (the way-card snippet register). */
export function SnippetRows({ rows }: SnippetRowsProps) {
  return (
    <>
      {rows.map(([left, right], i) => (
        <div
          key={i}
          data-slot="snippet-row"
          className="flex items-center justify-between gap-3 border-t border-t-stone-100 py-[0.4375rem] first-of-type:border-t-0"
        >
          <span>
            {typeof left === "string" ? (
              <span data-slot="snippet-row-who" className="font-medium">
                {left}
              </span>
            ) : (
              left
            )}
          </span>
          {typeof right === "string" ? (
            /* Values never wrap: a broken "€ 198.000" reads as two numbers. */
            <span data-slot="snippet-row-value" className="num flex-none whitespace-nowrap">
              {right}
            </span>
          ) : (
            right
          )}
        </div>
      ))}
    </>
  )
}

export interface SnippetChatMessage {
  text: string
  /** Outgoing (ink) bubble instead of incoming (grey). */
  out?: boolean
}

export interface SnippetChatProps {
  messages: SnippetChatMessage[]
  /** Mono timestamp under the last bubble. */
  time?: string
}

/** A WhatsApp-register exchange: lead writes, the system answers. */
export function SnippetChat({ messages, time }: SnippetChatProps) {
  return (
    <div data-slot="snippet-chat" className="flex flex-col gap-[0.4375rem]">
      {messages.map((message, i) => (
        <p
          key={i}
          data-slot="snippet-chat-message"
          data-out={message.out ? "" : undefined}
          className="max-w-[88%] self-start rounded-[9px] bg-stone-100 px-2.5 py-[0.4375rem] text-[12px] leading-[1.45] data-[out]:self-end data-[out]:bg-stone-900 data-[out]:text-stone-0"
        >
          {message.text}
        </p>
      ))}
      {time ? (
        <time data-slot="snippet-chat-time" className="num self-end text-[10px] text-faint">
          {time}
        </time>
      ) : null}
    </div>
  )
}

export interface SnippetQuoteProps {
  /** Mono header left side, e.g. "Preventivo #2026-0184". */
  heading: string
  /** Mono header right side, e.g. "27/07/2026". */
  meta?: string
  /** Line items as [label, formatted value]. */
  rows: [string, string][]
  /** Total row as [label, formatted value]. */
  total?: [string, string]
}

/** A document with line items and a total: the quote artefact. */
export function SnippetQuote({ heading, meta, rows, total }: SnippetQuoteProps) {
  return (
    <div data-slot="snippet-quote">
      <div
        data-slot="snippet-quote-head"
        className="flex justify-between gap-3 pb-2 font-mono text-[10px] tracking-[0.06em] text-stone-500 uppercase"
      >
        <span>{heading}</span>
        {meta ? <span className="tabular">{meta}</span> : null}
      </div>
      {rows.map(([label, value]) => (
        <div
          key={label}
          data-slot="snippet-quote-row"
          className="flex justify-between gap-3 border-t border-t-stone-100 py-1.5 text-[12px]"
        >
          <span>{label}</span>
          <span className="num">{value}</span>
        </div>
      ))}
      {total ? (
        <div
          data-slot="snippet-quote-total"
          className="flex justify-between gap-3 border-t border-t-stone-300 py-1.5 text-[12px] font-medium"
        >
          <span>{total[0]}</span>
          <span className="num">{total[1]}</span>
        </div>
      ) : null}
    </div>
  )
}

export interface SnippetReviewProps {
  /** 1–5 (default 5). */
  stars?: number
  quote: string
  /** Mono attribution line, e.g. "Recensione Google · 27/07/2026". */
  author: string
}

/** A five-star review card. */
export function SnippetReview({ stars = 5, quote, author }: SnippetReviewProps) {
  return (
    <div data-slot="snippet-review">
      {/* The review gold is its own colour — brighter than ochre, and not a status. */}
      <span
        data-slot="snippet-review-stars"
        className="text-[14px] tracking-[0.14em] text-[#d99a06]"
      >
        {"★".repeat(Math.max(1, Math.min(5, stars)))}
      </span>
      <p data-slot="snippet-review-quote" className="mt-2 text-[12px] leading-[1.5]">
        {quote}
      </p>
      <p
        data-slot="snippet-review-author"
        className="mt-2 font-mono text-[10px] text-faint"
      >
        {author}
      </p>
    </div>
  )
}

export interface SnippetChartProps {
  /** Bar heights in %, series 1; optional paired series 2. */
  bars: number[] | [number, number][]
  labels?: string[]
}

/** Crisp HTML bars, the product's chart register. */
export function SnippetChart({ bars, labels }: SnippetChartProps) {
  return (
    <div data-slot="snippet-chart">
      <div
        data-slot="snippet-chart-bars"
        className="flex h-[74px] items-end gap-[4px] border-b border-b-stone-300"
      >
        {bars.map((bar, i) =>
          Array.isArray(bar) ? (
            /* `self-stretch` is a fix, not a port: the RF wrapper is content-height, so the
             * paired bars' percentage heights resolved against `auto` and drew nothing. The
             * pair only ever appeared in this file's own type, never on a page — see the
             * report. Stretching the wrapper to the 74px track is what the CSS meant. */
            <span key={i} className="flex flex-1 items-end gap-[2px] self-stretch">
              <i className="flex-1 rounded-t-[2px] bg-chart-1" style={{ height: `${bar[0]}%` }} />
              <i
                data-s="2"
                className="flex-1 rounded-t-[2px] bg-chart-2"
                style={{ height: `${bar[1]}%` }}
              />
            </span>
          ) : (
            <i
              key={i}
              className="flex-1 rounded-t-[2px] bg-chart-1"
              style={{ height: `${bar}%` }}
            />
          )
        )}
      </div>
      {labels ? (
        <div data-slot="snippet-chart-labels" className="mt-1.5 flex gap-[4px]">
          {labels.map((label) => (
            <span key={label} className="num flex-1 text-center text-[9px] text-faint">
              {label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export interface SnippetChecklistItem {
  label: string
  /** Unchecked, rendered faint. */
  todo?: boolean
}

export interface SnippetChecklistProps {
  items: SnippetChecklistItem[]
}

/** Checked steps: onboarding, practices, process artefacts. */
export function SnippetChecklist({ items }: SnippetChecklistProps) {
  return (
    <ul data-slot="snippet-checklist" className="m-0 list-none p-0">
      {items.map((item) => (
        <li
          key={item.label}
          data-slot="snippet-checklist-item"
          data-todo={item.todo ? "" : undefined}
          className={cn(
            "flex items-baseline gap-2 py-[0.3125rem] text-[12px]",
            item.todo && "text-faint"
          )}
        >
          {/* The tick is drawn, not a glyph: two 1.5px borders rotated into a check. */}
          <i
            className={cn(
              "relative size-3 flex-none translate-y-px rounded-[3px] bg-stone-900",
              "after:absolute after:top-[2.5px] after:left-[3px] after:h-[3.5px] after:w-[5px] after:rotate-[-45deg] after:border-b-[1.5px] after:border-l-[1.5px] after:border-stone-0 after:content-['']",
              item.todo &&
                "bg-transparent shadow-[inset_0_0_0_1px_var(--stone-300)] after:hidden"
            )}
          />
          {item.label}
        </li>
      ))}
    </ul>
  )
}

export interface SnippetBrowserProps {
  /** Address-bar URL, e.g. "elettrorossi.it". */
  url: string
  /** Hero-block tint (any CSS color) for the default skeleton. */
  tint?: string
  /** Custom page content; omit for the skeleton layout. */
  children?: ReactNode
  className?: string
}

/** A browser frame: the websites we build, drawn not screenshotted. */
export function SnippetBrowser({ url, tint, children, className }: SnippetBrowserProps) {
  return (
    <div
      data-slot="snippet-browser"
      aria-hidden="true"
      className={cn(
        "w-[min(360px,94%)] overflow-hidden rounded-img border border-line-artefact bg-stone-0 text-left shadow-panel transition-[translate] duration-400 ease-brand-out",
        className
      )}
    >
      <div
        data-slot="snippet-browser-bar"
        className="flex items-center gap-2 border-b border-b-stone-100 px-2.5 py-[0.4375rem]"
      >
        <span data-slot="snippet-browser-dots" className="flex flex-none gap-[4px]">
          <i className="size-[7px] rounded-full bg-stone-200" />
          <i className="size-[7px] rounded-full bg-stone-200" />
          <i className="size-[7px] rounded-full bg-stone-200" />
        </span>
        <span
          data-slot="snippet-browser-url"
          className="flex-1 overflow-hidden rounded-[5px] bg-stone-50 px-2 py-[0.1875rem] text-center font-mono text-[10px] text-ellipsis whitespace-nowrap text-muted-foreground"
        >
          {url}
        </span>
      </div>
      <div
        data-slot="snippet-browser-page"
        className="flex flex-col gap-[0.4375rem] p-3"
        style={tint ? ({ "--tint": tint } as CSSProperties) : undefined}
      >
        {children ?? (
          <>
            <div className="h-[52px] rounded-xs bg-[var(--tint,var(--stone-200))]" />
            <div className="h-2 w-[60%] rounded-xs bg-stone-100" />
            <div className="h-2 w-[38%] rounded-xs bg-stone-100" />
            <div className="flex gap-[0.4375rem]">
              <div className="h-[34px] flex-1 rounded-xs bg-stone-100" />
              <div className="h-[34px] flex-1 rounded-xs bg-stone-100" />
              <div className="h-[34px] flex-1 rounded-xs bg-stone-100" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
