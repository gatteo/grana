"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* The chart (guidelines 03 §Components). HTML/CSS bars, not a charting library: crisp
 * hairlines, selectable labels, hairline gridlines with mono axis values, a legend of 9px
 * squares. Two reasons it is drawn rather than imported — a chart of ten bars does not earn
 * a 200KB dependency, and a library's SVG paints its own colours, which DSN-7 forbids.
 *
 * Colour is opt-in. A single-series chart is INK, because the accent in both brands is the
 * ink itself; `tone` moves a series onto a chart slot only when more than one series shares
 * a plot and the legend has to tell them apart.
 *
 * Every chart is also a table. `Chart` renders a visually-hidden `<table>` of the same
 * numbers, so a screen reader reads the data rather than an alt-text summary of it, and
 * `aria-label` describes what the picture is of. */

type Tone = "ink" | "muted" | "quiet" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface ChartSeries {
  /** Stable key, used for the row identity. */
  key: string
  /** What the legend and the hidden table call it. */
  label: string
  tone?: Tone
}

export interface ChartPoint {
  /** The axis label under the column. */
  label: string
  /** One value per series, in the series order. */
  values: number[]
  /** What the column's title says instead of the default `label · value`. */
  title?: string
}

const FILL: Record<string, string> = {
  ink: "bg-primary",
  /* The second series of a two-series stack. Stone rather than a status hue:
   * a column chart of a fortnight is ambient proof, and a fortnight of red
   * bars reads as an alarm going off (DESIGN §ambient proof, not alarms).
   * The word in the legend carries the meaning; the fill carries the share. */
  muted: "bg-stone-300",
  quiet: "bg-canvas-deep",
  1: "bg-chart-1",
  2: "bg-chart-2",
  3: "bg-chart-3",
  4: "bg-chart-4",
  5: "bg-chart-5",
  6: "bg-chart-6",
  7: "bg-chart-7",
  8: "bg-chart-8",
}

function fillOf(tone: Tone | undefined): string {
  return FILL[String(tone ?? "ink")] ?? "bg-primary"
}

function Chart({
  className,
  label,
  children,
  series,
  data,
  ...props
}: Omit<React.ComponentProps<"figure">, "label"> & {
  /** What the picture is of, in a sentence. Becomes the figure's accessible name. */
  label: string
  /** The series and points behind the hidden table. Omit for a chart that draws its own. */
  series?: ChartSeries[]
  data?: ChartPoint[]
}) {
  return (
    <figure
      data-slot="chart"
      aria-label={label}
      className={cn("flex min-w-0 flex-col gap-3", className)}
      {...props}
    >
      {children}
      {series && data ? <ChartTable label={label} series={series} data={data} /> : null}
    </figure>
  )
}

/** The same numbers as a table, for a screen reader. Never painted. */
function ChartTable({
  label,
  series,
  data,
}: {
  label: string
  series: ChartSeries[]
  data: ChartPoint[]
}) {
  return (
    <table data-slot="chart-table" className="sr-only">
      <caption>{label}</caption>
      <thead>
        <tr>
          <th scope="col">·</th>
          {series.map((s) => (
            <th key={s.key} scope="col">
              {s.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((point, index) => (
          <tr key={`${point.label}-${index}`}>
            <th scope="row">{point.label}</th>
            {series.map((s, i) => (
              <td key={s.key}>{point.values[i] ?? 0}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* The columns. Stacked when a point carries more than one value — the plot is a share of one
 * whole, which is what a stack means; `grouped` puts them side by side instead.
 *
 * `axis` is the mono value ladder on the left: three gridlines (0, half, top) whose numbers
 * the caller formats, because only the caller knows whether the unit is money, minutes or
 * tokens. `every` thins the axis labels under the columns when there are more than a fortnight
 * of them: a label on every third column reads; thirty labels at 10.5px do not. */
function ChartColumns({
  className,
  series,
  data,
  grouped = false,
  height = 140,
  format,
  every,
  barWidth = 30,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  series: ChartSeries[]
  data: ChartPoint[]
  /** Side by side rather than stacked. */
  grouped?: boolean
  /** The plot's height in px. */
  height?: number
  /** The axis and title formatter for one value. */
  format?: (value: number) => string
  /** Label every n-th column (default: enough to keep them legible). */
  every?: number
  /** The widest a bar may be, in px. A week of data across a full-width card
   *  would otherwise draw seven 200px slabs, which is a picture of the card
   *  rather than of the week; the column keeps its share of the width and the
   *  bar sits centred inside it. */
  barWidth?: number
}) {
  const show = format ?? ((value: number) => String(Math.round(value)))
  const totals = data.map((point) =>
    grouped
      ? Math.max(0, ...point.values)
      : point.values.reduce((sum, value) => sum + Math.max(0, value), 0)
  )
  const top = Math.max(1, ...totals)
  const step = every ?? (data.length > 20 ? 5 : data.length > 12 ? 3 : 1)

  return (
    <div
      data-slot="chart-columns"
      className={cn("flex min-w-0 gap-3", className)}
      {...props}
    >
      <div
        data-slot="chart-axis"
        aria-hidden
        className="num flex shrink-0 flex-col justify-between text-2xs text-faint"
        style={{ height }}
      >
        <span>{show(top)}</span>
        <span>{show(top / 2)}</span>
        <span>{show(0)}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div
          data-slot="chart-plot"
          className="relative flex items-end gap-[3px] border-b border-border"
          style={{ height }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-full"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
              backgroundSize: `100% ${height / 2}px`,
            }}
          />
          {data.map((point, index) => {
            const total = totals[index] ?? 0
            return (
              <div
                key={`${point.label}-${index}`}
                data-slot="chart-column"
                title={point.title ?? `${point.label} · ${show(total)}`}
                className={cn(
                  "group/col relative flex min-w-0 flex-1 items-end justify-center self-stretch",
                  grouped ? "gap-[2px]" : "flex-col items-center justify-end"
                )}
              >
                {point.values.map((value, i) => {
                  const share = Math.max(0, value) / top
                  return (
                    <span
                      key={series[i]?.key ?? i}
                      className={cn(
                        "w-full rounded-[2px] transition-opacity duration-180 ease-brand-out group-hover/col:opacity-80",
                        fillOf(series[i]?.tone),
                        value <= 0 && "opacity-0"
                      )}
                      style={{
                        height: `${Math.max(share * 100, value > 0 ? 1.5 : 0)}%`,
                        maxWidth: barWidth,
                      }}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
        <div
          data-slot="chart-labels"
          aria-hidden
          className="mt-1.5 flex gap-[3px] text-2xs text-faint"
        >
          {data.map((point, index) => (
            <span
              key={`${point.label}-${index}`}
              className="num min-w-0 flex-1 truncate text-center"
            >
              {index % step === 0 ? point.label : " "}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/** The 9px squares. One row, wraps, mono-free — these are words, not numbers. */
function ChartLegend({
  className,
  series,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & { series: ChartSeries[] }) {
  return (
    <div
      data-slot="chart-legend"
      aria-hidden
      className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}
      {...props}
    >
      {series.map((s) => (
        <span key={s.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className={cn("size-[9px] rounded-[2px]", fillOf(s.tone))} />
          {s.label}
        </span>
      ))}
    </div>
  )
}

/* The KPI card's trend line: one series, no axis, no labels — the shape of the last n
 * periods and nothing more. SVG because a line is a line; it is `preserveAspectRatio="none"`
 * so it stretches to whatever width the cell has, and the stroke is vector-effect
 * non-scaling so it stays a hairline when it does. */
function Sparkline({
  className,
  values,
  label,
  height = 28,
  ...props
}: Omit<React.ComponentProps<"svg">, "values" | "label"> & {
  values: number[]
  /** What the line is of; the accessible name. */
  label: string
  height?: number
}) {
  if (values.length < 2) return null
  const top = Math.max(1, ...values)
  const points = values
    .map((value, i) => {
      const x = (i / (values.length - 1)) * 100
      const y = 100 - (Math.max(0, value) / top) * 100
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(" ")
  return (
    <svg
      data-slot="sparkline"
      role="img"
      aria-label={label}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("w-full text-muted-foreground", className)}
      style={{ height }}
      {...props}
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export { Chart, ChartColumns, ChartLegend, Sparkline }
