import type { ReactNode } from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* Product-simulation primitives: the shapes a module page needs to show what the software
 * actually looks like, drawn in HTML rather than screenshotted. They compose inside `FloatPanel`
 * on a `Canvas`, the same way the fragments in `snippets.tsx` do, and share its register so a
 * module artefact and the full `ProductShot` read as one product. All are decorative: callers pass
 * Italian product-demo data and the wrapper marks the subtree `aria-hidden`.
 *
 * Product surfaces stay neutral and shadow-free here — depth comes from the `FloatPanel` around
 * them, never from the fragment. Sizes are the CSS's own arbitrary steps (9px, 11px, 17px…): the
 * named scale would drag a line-height these dense fragments must not inherit.
 *
 * Two compaction registers, both from the CSS: `@max-[320px]`/`@max-[330px]` answer to the
 * `FloatPanel`'s own inline size — a card canvas gets narrow long before the viewport does — and
 * `max-[560px]` is the phone. Neither breakpoint is on Tailwind's scale, and neither is snapped. */

export interface ShotScoreFactor {
  label: string
  /** 0–100. Drives the bar width and the strength word. */
  value: number
  /** Overrides the derived strength word ("Forte" / "Medio" / "Debole"). */
  note?: string
}

export interface SnippetScoreProps {
  /** Headline score out of 100. */
  value: number
  /** Who is being scored, e.g. "Studio Sereni · Monza". */
  subject: string
  /** Where the record came from, e.g. "Modulo sito · 2 minuti fa". */
  meta?: string
  factors: ShotScoreFactor[]
  /** One-line conclusion under the factors. */
  verdict?: string
}

function strength(value: number): string {
  if (value >= 75) return "Forte"
  if (value >= 45) return "Medio"
  return "Debole"
}

/** A qualification score with its reasons: the AI's work, made auditable. */
export function SnippetScore({ value, subject, meta, factors, verdict }: SnippetScoreProps) {
  return (
    <div data-slot="snippet-score">
      <div data-slot="snippet-score-head" className="flex items-center gap-2.5">
        <span
          data-slot="snippet-score-value"
          className="tabular grid size-[42px] flex-none place-items-center rounded-[9px] bg-stone-900 text-[17px] font-medium tracking-[-0.03em] text-stone-0"
        >
          {value}
        </span>
        <span>
          <b className="block text-[13px] font-medium tracking-[-0.01em]">{subject}</b>
          {meta ? <small className="tabular text-[10px] text-faint">{meta}</small> : null}
        </span>
      </div>
      <ul
        data-slot="snippet-score-factors"
        className="mx-0 mt-3 mb-0 grid list-none gap-[0.4375rem] p-0"
      >
        {factors.map((factor) => (
          <li
            key={factor.label}
            className="grid grid-cols-[88px_minmax(0,1fr)_46px] items-center gap-2 text-[11px] text-muted-foreground max-[560px]:grid-cols-[72px_minmax(0,1fr)_42px]"
          >
            <span>{factor.label}</span>
            <i className="block h-1 rounded-[2px] bg-stone-200">
              <b
                className="block h-full rounded-[2px] bg-chart-1"
                style={{ width: `${Math.max(4, Math.min(100, factor.value))}%` }}
              />
            </i>
            <em className="text-right text-[10px] text-faint not-italic">
              {factor.note ?? strength(factor.value)}
            </em>
          </li>
        ))}
      </ul>
      {verdict ? (
        <p
          data-slot="snippet-score-verdict"
          className="mt-[11px] border-t border-t-stone-200 pt-[9px] text-[11px] leading-[1.45] text-muted-foreground"
        >
          {verdict}
        </p>
      ) : null}
    </div>
  )
}

export interface ShotCompareColumn {
  title: string
  /** Highlighted as the recommended path. */
  primary?: boolean
  rows: [string, string][]
  /** Bottom emphasis row, e.g. ["Esborso iniziale", "€ 0"]. */
  footer?: [string, string]
}

export interface SnippetCompareProps {
  heading?: string
  columns: [ShotCompareColumn, ShotCompareColumn]
}

/* The row shape is shared by the line items and the footer; the footer adds the rule above it. */
const compareRow = "flex justify-between gap-2 py-1 text-[10px] text-muted-foreground @max-[320px]:gap-1 @max-[320px]:py-0.5 @max-[320px]:text-[9px]"

/** Two payment paths side by side: the block that unsticks a negotiation. */
export function SnippetCompare({ heading, columns }: SnippetCompareProps) {
  return (
    <div data-slot="snippet-compare">
      {heading ? (
        <p
          data-slot="snippet-compare-head"
          className="mb-[9px] text-[12px] font-medium @max-[320px]:mb-[7px] @max-[320px]:text-[11px]"
        >
          {heading}
        </p>
      ) : null}
      <div
        data-slot="snippet-compare-cols"
        className="grid grid-cols-[1fr_1fr] gap-2 @max-[320px]:gap-1.5 max-[560px]:grid-cols-[1fr]"
        /* marketing.css declared `@container (max-width:330px) { 1fr }` at :955 and then `1fr 1fr`
           at :1339 — the later rule won, so the container query never fired on the live site.
           Reproducing it would narrow the ecosystem band; the viewport rule below was the live one. */
      >
        {columns.map((column) => (
          <div
            key={column.title}
            data-slot="snippet-compare-col"
            data-primary={column.primary ? "" : undefined}
            className="rounded-img border border-stone-200 px-2.5 pt-[9px] pb-2 data-[primary]:border-stone-400 data-[primary]:bg-stone-100 @max-[320px]:px-2 @max-[320px]:pt-[7px] @max-[320px]:pb-1.5"
          >
            <h6 className="mb-[0.4375rem] text-[11px] font-medium @max-[320px]:mb-[5px] @max-[320px]:text-[10px]">
              {column.title}
            </h6>
            {column.rows.map(([label, value]) => (
              <div key={label} className={compareRow}>
                <span>{label}</span>
                <span className="num text-foreground">{value}</span>
              </div>
            ))}
            {column.footer ? (
              <div
                className={cn(
                  compareRow,
                  "mt-1 border-t border-t-stone-200 pt-1.5 font-medium text-foreground @max-[320px]:mt-[3px] @max-[320px]:pt-1"
                )}
              >
                <span>{column.footer[0]}</span>
                <span className="num text-foreground">{column.footer[1]}</span>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export interface ShotPipelineCard {
  name: string
  meta: string
  value: string
  /** Renders the card as the one being dragged between columns. */
  moving?: boolean
}

export interface ShotPipelineColumn {
  title: string
  count: string
  cards: ShotPipelineCard[]
}

export interface SnippetPipelineProps {
  columns: ShotPipelineColumn[]
}

/** Kanban columns of deals: the pipeline, at a glance. */
export function SnippetPipeline({ columns }: SnippetPipelineProps) {
  return (
    <div
      data-slot="snippet-pipeline"
      className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[0.4375rem] max-[560px]:grid-cols-[1fr]"
    >
      {columns.map((column) => (
        <div key={column.title} data-slot="snippet-pipeline-col">
          <div
            data-slot="snippet-pipeline-colhead"
            className="flex items-center justify-between px-0.5 pb-1.5 font-mono text-[9px] font-medium tracking-[0.08em] text-stone-500 uppercase"
          >
            <span>{column.title}</span>
            <span className="tabular">{column.count}</span>
          </div>
          {column.cards.map((card) => (
            <div
              key={card.name}
              data-slot="snippet-pipeline-card"
              data-moving={card.moving ? "" : undefined}
              className="mb-1.5 rounded-[7px] border border-stone-200 bg-stone-0 px-2 py-[0.4375rem] data-[moving]:rotate-[-1.4deg] data-[moving]:border-stone-500"
            >
              <b className="block text-[11px] font-medium tracking-[-0.01em]">{card.name}</b>
              <small className="mt-px block text-[9px] text-faint">{card.meta}</small>
              <span className="num mt-1 block text-[10px]">{card.value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export interface ShotTimelineStep {
  label: string
  /** Mono side note: a date, an office, a duration. */
  meta?: string
  state: "done" | "current" | "todo" | "late"
}

export interface SnippetTimelineProps {
  title?: string
  steps: ShotTimelineStep[]
}

const STATE_WORD: Record<ShotTimelineStep["state"], string> = {
  done: "Completata",
  current: "In corso",
  todo: "Da fare",
  late: "In ritardo",
}

/* The dot carries the state; the word next to it says the same thing (never colour alone). */
const STATE_DOT: Record<ShotTimelineStep["state"], string> = {
  done: "bg-status-good",
  current: "bg-stone-900",
  todo: "shadow-[inset_0_0_0_1px_var(--stone-300)]",
  late: "bg-status-warning",
}

/** A sequence with states and dates: paperwork, an installation, a bando. */
export function SnippetTimeline({ title, steps }: SnippetTimelineProps) {
  return (
    <div data-slot="snippet-timeline">
      {title ? (
        <p data-slot="snippet-timeline-head" className="mb-2 text-[12px] font-medium">
          {title}
        </p>
      ) : null}
      <ol className="m-0 list-none p-0">
        {steps.map((step) => (
          <li
            key={step.label}
            data-slot="snippet-timeline-step"
            data-state={step.state}
            className="grid grid-cols-[14px_minmax(0,1fr)_auto] items-center gap-2 border-b border-b-stone-200 py-1.5 last:border-b-0"
          >
            <i className={cn("size-[10px] justify-self-center rounded-full", STATE_DOT[step.state])} />
            <span>
              <b className="text-[11px] font-medium">{step.label}</b>
              {step.meta ? (
                <small className="tabular block text-[9px] text-faint">{step.meta}</small>
              ) : null}
            </span>
            <em
              className={cn(
                "rounded-xs border border-stone-200 px-[5px] py-0.5 font-mono text-[8px] tracking-[0.07em] text-stone-500 uppercase not-italic",
                step.state === "late" && "border-status-warning text-status-warning-ink"
              )}
            >
              {STATE_WORD[step.state]}
            </em>
          </li>
        ))}
      </ol>
    </div>
  )
}

export interface ShotStat {
  label: string
  value: string
  /** Small line under the value: the baseline or the period. */
  base?: string
  /** Direction arrow on the value. */
  trend?: "up" | "down"
}

export interface SnippetStatsProps {
  items: ShotStat[]
}

/** A compact KPI strip, the product's own number register. */
export function SnippetStats({ items }: SnippetStatsProps) {
  return (
    <dl
      data-slot="snippet-stats"
      className="m-0 grid grid-cols-[repeat(auto-fit,minmax(96px,1fr))] gap-3"
    >
      {items.map((item) => (
        <div key={item.label} data-slot="snippet-stats-item">
          <dt className="mb-[3px] text-[10px] text-muted-foreground">{item.label}</dt>
          <dd className="m-0 flex items-baseline gap-[5px]">
            <span className="num text-[17px] font-medium tracking-[-0.03em]">{item.value}</span>
            {item.trend ? (
              <i
                data-trend={item.trend}
                className={cn(
                  "text-[9px] not-italic",
                  item.trend === "up" ? "text-status-good-ink" : "text-status-warning-ink"
                )}
              >
                {item.trend === "up" ? "▲" : "▼"}
              </i>
            ) : null}
          </dd>
          {item.base ? <p className="num mt-0.5 text-[9px] text-faint">{item.base}</p> : null}
        </div>
      ))}
    </dl>
  )
}

export interface ShotFormField {
  label: string
  value: string
  /** Renders as the field currently being answered. */
  active?: boolean
}

export interface SnippetFormProps {
  /** Mono header, e.g. "Richiedi un preventivo". */
  title: string
  fields: ShotFormField[]
  /** The button label. */
  action: string
  /** Result line under the button, e.g. "Lead creato in Deals · fonte registrata". */
  result?: string
}

/** An embedded qualification form and what it produces. */
export function SnippetForm({ title, fields, action, result }: SnippetFormProps) {
  return (
    <div data-slot="snippet-form">
      <p
        data-slot="snippet-form-head"
        className="mb-2 font-mono text-[9px] font-medium tracking-[0.09em] text-stone-500 uppercase"
      >
        {title}
      </p>
      {fields.map((field) => (
        <div
          key={field.label}
          data-slot="snippet-form-field"
          data-active={field.active ? "" : undefined}
          className="mb-1 flex justify-between gap-2 rounded-sm border border-stone-200 px-2 py-1.5 text-[11px] text-muted-foreground data-[active]:border-stone-500 data-[active]:bg-stone-100"
        >
          <span>{field.label}</span>
          <b className="font-medium text-foreground">{field.value}</b>
        </div>
      ))}
      {/* A drawn button, not a `Button`: it is part of the picture and never receives a click. */}
      <span
        data-slot="snippet-form-button"
        className="mt-2 block rounded-full bg-stone-900 py-[0.4375rem] text-center text-[11px] font-medium text-stone-0"
      >
        {action}
      </span>
      {result ? (
        <p
          data-slot="snippet-form-result"
          className="mt-2 font-mono text-[9px] tracking-[0.04em] text-faint"
        >
          {result}
        </p>
      ) : null}
    </div>
  )
}

export interface ShotCallLine {
  who: string
  text: string
  /** The automated side of the conversation. */
  machine?: boolean
}

export interface SnippetCallProps {
  /** Mono header, e.g. "Chiamata in uscita · 20:14". */
  title: string
  duration: string
  lines: ShotCallLine[]
  /** Outcome chip under the transcript. */
  outcome?: string
}

/** A call transcript with its outcome: what the voice agent actually did. */
export function SnippetCall({ title, duration, lines, outcome }: SnippetCallProps) {
  return (
    <div data-slot="snippet-call">
      <div
        data-slot="snippet-call-head"
        className="mb-2 flex items-center gap-[0.4375rem] border-b border-b-stone-200 pb-2 font-mono text-[9px] tracking-[0.06em] text-stone-500 uppercase"
      >
        <span data-slot="snippet-call-dot" className="size-1.5 flex-none rounded-full bg-status-good" />
        <span>{title}</span>
        <span className="tabular ml-auto tracking-normal normal-case">{duration}</span>
      </div>
      {lines.map((line, i) => (
        <p
          key={i}
          data-slot="snippet-call-line"
          data-machine={line.machine ? "" : undefined}
          className="mb-1.5 text-[11px] leading-[1.45] text-muted-foreground"
        >
          <b
            className={cn(
              "mr-1.5 font-medium text-foreground",
              line.machine && "font-mono text-[9px] tracking-[0.05em] uppercase"
            )}
          >
            {line.who}
          </b>
          {line.text}
        </p>
      ))}
      {outcome ? (
        <span
          data-slot="snippet-call-outcome"
          className="mt-[5px] inline-block rounded-[5px] bg-[color-mix(in_srgb,var(--status-good)_12%,transparent)] px-[0.4375rem] py-[0.1875rem] text-[10px] font-medium text-status-good-ink"
        >
          {outcome}
        </span>
      ) : null}
    </div>
  )
}

export interface ShotSplitRow {
  name: string
  meta: string
  share: string
  /** 0–100, the bar width. */
  weight: number
}

export interface SnippetSplitProps {
  title?: string
  /** The pool being divided, e.g. "Incentivo del mese · € 1.284". */
  total?: string
  rows: ShotSplitRow[]
}

/** A pool divided among members: energy shared, incentives, referrals. */
export function SnippetSplit({ title, total, rows }: SnippetSplitProps) {
  return (
    <div data-slot="snippet-split">
      {title || total ? (
        <div
          data-slot="snippet-split-head"
          className="mb-[0.4375rem] flex justify-between gap-2 border-b border-b-stone-200 pb-[0.4375rem] text-[12px] font-medium"
        >
          {title ? <span>{title}</span> : null}
          {total ? <span className="num">{total}</span> : null}
        </div>
      ) : null}
      {rows.map((row) => (
        <div
          key={row.name}
          data-slot="snippet-split-row"
          className="grid grid-cols-[minmax(0,1fr)_64px_56px] items-center gap-2 py-[5px]"
        >
          <span>
            <b className="block text-[11px] font-medium">{row.name}</b>
            <small className="text-[9px] text-faint">{row.meta}</small>
          </span>
          <i className="block h-1 rounded-[2px] bg-stone-200">
            <b
              className="block h-full rounded-[2px] bg-chart-2"
              style={{ width: `${Math.max(4, Math.min(100, row.weight))}%` }}
            />
          </i>
          <span className="num text-right text-[11px]">{row.share}</span>
        </div>
      ))}
    </div>
  )
}

/* The only real variant in this file: a warning reads amber, a note reads neutral. */
const alertVariants = cva("rounded-img border px-[11px] py-2.5", {
  variants: {
    tone: {
      warn: "border-status-warning bg-[color-mix(in_srgb,var(--status-warning)_8%,transparent)]",
      note: "border-stone-200 bg-stone-100",
    },
  },
  defaultVariants: { tone: "warn" },
})

export interface SnippetAlertProps {
  /** Severity register: a warning reads amber, a note reads neutral. */
  tone?: "warn" | "note"
  title: string
  body: string
  /** Mono footer, e.g. "Rilevato il 28/07/2026 alle 06:15". */
  meta?: string
  /** Optional action pill. */
  action?: string
}

/** The system noticing something before the customer does. */
export function SnippetAlert({ tone = "warn", title, body, meta, action }: SnippetAlertProps) {
  return (
    <div data-slot="snippet-alert" data-tone={tone} className={alertVariants({ tone })}>
      <p data-slot="snippet-alert-title" className="text-[12px] font-medium">
        {title}
      </p>
      <p
        data-slot="snippet-alert-body"
        className="mt-1 text-[11px] leading-[1.45] text-muted-foreground"
      >
        {body}
      </p>
      {meta ? (
        <p data-slot="snippet-alert-meta" className="num mt-1.5 text-[9px] text-faint">
          {meta}
        </p>
      ) : null}
      {action ? (
        <span
          data-slot="snippet-alert-action"
          className="mt-[0.4375rem] inline-block rounded-full bg-stone-900 px-[9px] py-1 text-[10px] font-medium text-stone-0"
        >
          {action}
        </span>
      ) : null}
    </div>
  )
}

export interface ShotVariant {
  title: string
  price: string
  meta: string
  /** The option presented as recommended. */
  primary?: boolean
}

export interface SnippetVariantsProps {
  heading: string
  meta?: string
  variants: ShotVariant[]
  /** Line under the options, e.g. "Generate in 4 minuti dallo stesso sopralluogo". */
  note?: string
}

/** Three versions of the same plant: the move from "if" to "which". */
export function SnippetVariants({ heading, meta, variants, note }: SnippetVariantsProps) {
  return (
    <div data-slot="snippet-variants">
      <div
        data-slot="snippet-variants-head"
        className="mb-2 flex justify-between gap-2 border-b border-b-stone-200 pb-[0.4375rem] font-mono text-[9px] tracking-[0.07em] text-stone-500 uppercase"
      >
        <span>{heading}</span>
        {meta ? <span className="tabular tracking-normal normal-case">{meta}</span> : null}
      </div>
      <div
        data-slot="snippet-variants-row"
        className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-1.5 max-[560px]:grid-cols-[1fr]"
      >
        {variants.map((variant) => (
          <div
            key={variant.title}
            data-slot="snippet-variants-card"
            data-primary={variant.primary ? "" : undefined}
            className="rounded-img border border-stone-200 px-[0.4375rem] py-2 text-center data-[primary]:border-stone-400 data-[primary]:bg-stone-100"
          >
            <small className="block text-[9px] text-faint">{variant.title}</small>
            <b className="num mx-0 mt-1 mb-0.5 block text-[14px] font-medium tracking-[-0.02em]">
              {variant.price}
            </b>
            <span className="text-[9px] text-muted-foreground">{variant.meta}</span>
          </div>
        ))}
      </div>
      {note ? (
        <p data-slot="snippet-variants-note" className="mt-2 text-[10px] text-faint">
          {note}
        </p>
      ) : null}
    </div>
  )
}

export interface SnippetResultProps {
  /** Mono header, e.g. "Il tuo impianto · 6 kWp · Bergamo". */
  title: string
  /** The three numbers a customer decides on. */
  rows: { label: string; value: string; sub?: string }[]
  /** Verification stamp, e.g. "Regole aggiornate al 30/07/2026". */
  stamp?: string
  children?: ReactNode
}

/** A calculator answer: never gated, always dated. */
export function SnippetResult({ title, rows, stamp, children }: SnippetResultProps) {
  return (
    <div data-slot="snippet-result">
      <p
        data-slot="snippet-result-head"
        className="mb-2 border-b border-b-stone-200 pb-[0.4375rem] font-mono text-[9px] font-medium tracking-[0.09em] text-stone-500 uppercase"
      >
        {title}
      </p>
      <div
        data-slot="snippet-result-rows"
        className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-2 max-[560px]:grid-cols-[1fr]"
      >
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-[9px] text-muted-foreground">{row.label}</dt>
            <dd className="num mx-0 mt-[3px] mb-0 text-[15px] font-medium tracking-[-0.02em]">
              {row.value}
            </dd>
            {row.sub ? <p className="mt-px text-[9px] text-faint">{row.sub}</p> : null}
          </div>
        ))}
      </div>
      {children}
      {stamp ? (
        <p
          data-slot="snippet-result-stamp"
          className="num mt-[9px] border-t border-t-stone-200 pt-[0.4375rem] text-[9px] text-faint"
        >
          {stamp}
        </p>
      ) : null}
    </div>
  )
}
