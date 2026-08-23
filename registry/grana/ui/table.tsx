"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* The calm list (skin-spec §15). Defaults are the Luminars recipe: 13.5px, hairline rows, a
 * mono-caps head with extra top air, no header fill, no hover. RF opts into its `.data` look
 * with `headerFill hover minWidth={720}`. Numeric columns carry `data-num` (or the `num` prop
 * on TableHead/TableCell): right-aligned, mono, tabular, nowrap — and `align` / `tabular` take
 * that shorthand apart when a column needs only one half of it. */
function Table({
  className,
  headerFill = false,
  hover = false,
  bleed = false,
  align = "middle",
  rowHeight,
  minWidth,
  style,
  ...props
}: Omit<React.ComponentProps<"table">, "align"> & {
  /** RF: a sunken head band under the mono caps. */
  headerFill?: boolean
  /** RF: rows tint under the pointer. Luminars lists stay calm. */
  hover?: boolean
  /** Luminars: the rules reach past a padded Card's edge (12px each side). */
  bleed?: boolean
  /** Cell vertical alignment. */
  align?: "middle" | "top"
  /** A fixed row height in px (the Luminars `--kit-row-h`). */
  rowHeight?: number
  /** The table's minimum width in px; the container scrolls sideways (RF `TableWrap`, 720). */
  minWidth?: number
}) {
  return (
    <div
      data-slot="table-container"
      data-bleed={bleed ? "on" : "off"}
      className={cn(
        "relative w-full overflow-x-auto",
        bleed && "-mx-3 w-[calc(100%+24px)]"
      )}
    >
      <table
        data-slot="table"
        data-header-fill={headerFill ? "" : undefined}
        data-hover={hover ? "" : undefined}
        data-align={align}
        className={cn(
          "group/table w-full border-collapse caption-bottom text-[13.5px]",
          className
        )}
        style={
          {
            ...(rowHeight !== undefined
              ? { "--table-row-h": `${rowHeight}px` }
              : null),
            ...(minWidth !== undefined ? { minWidth } : null),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "group-data-header-fill/table:bg-muted",
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-b-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-border bg-muted font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border transition-colors duration-100 data-[state=selected]:bg-muted",
        "group-data-hover/table:hover:bg-accent",
        className
      )}
      {...props}
    />
  )
}

/* The mono-caps column head. `14px 12px 9px`: extra top air so caps never sit flush under a
 * card edge; line-height 1.5 so a 12px marker glyph is not cropped. Under `headerFill` the
 * band is symmetrical (10px).
 *
 * `num` is the numeric column, which right-aligns; `align` is the alignment on its own, so a
 * numeric column that must stay left-aligned writes `num align="left"` on the head and its
 * cells. `data-num` stays the whole numeric recipe for a caller who sets the bare attribute, so
 * the prop hands the alignment over to plain classes the moment `align` disagrees with it. */
function TableHead({
  className,
  num,
  align,
  ...props
}: Omit<React.ComponentProps<"th">, "align"> & {
  /** The numeric column: right-aligned, unless `align` says otherwise. */
  num?: boolean
  /** The column's horizontal alignment on its own. */
  align?: "left" | "center" | "right"
}) {
  const alignment = align ?? (num ? "right" : undefined)
  /* `data-num` marks the cells whose resolved recipe IS the numeric one, so a caller can still
   * set the bare attribute by hand and get all of it; the moment `align` disagrees, the props
   * take over in plain classes and nothing has to out-specify a descendant rule. */
  const numAttribute = num === true && alignment === "right"
  return (
    <th
      data-slot="table-head"
      data-num={numAttribute ? "" : undefined}
      className={cn(
        "px-3 pt-3.5 pb-[9px] text-left align-bottom font-mono text-2xs leading-[1.5] font-medium tracking-[0.09em] whitespace-nowrap text-faint uppercase",
        "group-data-header-fill/table:py-2.5",
        "data-num:text-right",
        alignment === "left" && "text-left",
        alignment === "center" && "text-center",
        alignment === "right" && "text-right",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

/* `num` is still the numeric column in one word — mono tabular figures, right-aligned, never
 * wrapped — but it is now the shorthand for two decisions that can be taken apart:
 * `align` sets the alignment alone (`num align="left"` is a left-aligned numeric column) and
 * `tabular` sets the figures alone (tabular numerals without leaving the text face, for a column
 * that must stay in the sans). A bare `data-num` / `data-tabular` attribute means the same. */
function TableCell({
  className,
  num,
  tabular,
  align,
  ...props
}: Omit<React.ComponentProps<"td">, "align"> & {
  /** The numeric column: mono tabular figures, right-aligned, never wrapped. */
  num?: boolean
  /** Tabular figures without leaving the text face — the sans, aligned in columns. */
  tabular?: boolean
  /** The cell's horizontal alignment on its own; overrides the right that `num` implies. */
  align?: "left" | "center" | "right"
}) {
  const alignment = align ?? (num ? "right" : undefined)
  /* `data-num` marks the cells whose resolved recipe IS the numeric one, so a caller can still
   * set the bare attribute by hand and get all of it; the moment `align` disagrees, the props
   * take over in plain classes and nothing has to out-specify a descendant rule. */
  const numAttribute = num === true && alignment === "right"
  return (
    <td
      data-slot="table-cell"
      data-num={numAttribute ? "" : undefined}
      data-tabular={tabular ? "" : undefined}
      className={cn(
        "h-(--table-row-h) px-3 py-[9px] align-middle group-data-[align=top]/table:align-top",
        "data-num:num data-num:text-right data-num:whitespace-nowrap",
        "data-tabular:tabular",
        num && !numAttribute && "num whitespace-nowrap",
        alignment === "left" && "text-left",
        alignment === "center" && "text-center",
        alignment === "right" && "text-right",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-3 text-13 text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
