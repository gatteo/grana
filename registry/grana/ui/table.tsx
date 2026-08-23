"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* The calm list (skin-spec §15). Defaults are the Luminars recipe: 13.5px, hairline rows, a
 * mono-caps head with extra top air, no header fill, no hover. RF opts into its `.data` look
 * with `headerFill hover minWidth={720}`. Numeric columns carry `data-num` (or the `num` prop
 * on TableHead/TableCell): right-aligned, mono, tabular, nowrap. */
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
 * band is symmetrical (10px). */
function TableHead({
  className,
  num,
  ...props
}: React.ComponentProps<"th"> & { num?: boolean }) {
  return (
    <th
      data-slot="table-head"
      data-num={num ? "" : undefined}
      className={cn(
        "px-3 pt-3.5 pb-[9px] text-left align-bottom font-mono text-2xs leading-[1.5] font-medium tracking-[0.09em] whitespace-nowrap text-faint uppercase",
        "group-data-header-fill/table:py-2.5",
        "data-num:text-right",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({
  className,
  num,
  ...props
}: React.ComponentProps<"td"> & { num?: boolean }) {
  return (
    <td
      data-slot="table-cell"
      data-num={num ? "" : undefined}
      className={cn(
        "h-(--table-row-h) px-3 py-[9px] align-middle group-data-[align=top]/table:align-top",
        "data-num:num data-num:text-right data-num:whitespace-nowrap",
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
