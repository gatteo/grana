"use client"

import * as React from "react"
import { Toaster as Sonner, toast, type ExternalToast, type ToasterProps } from "sonner"

import { Spinner } from "@/registry/grana/ui/spinner"
import { StatusDot, type StatusTone } from "@/registry/grana/ui/status-dot"

/* The toast is a small popover: `bg-popover`, hairline, `shadow-panel` (the RF app scope
 * nulls the shadow through the token), 10px radius, 13px. A status is a dot + word, so the
 * type icons are StatusDots in the chip tones (success→ok, error→attention, warning→warning,
 * info→info) and the ground never tints. Light only — there is no theme to read.
 *
 * Sonner's own stylesheet is unlayered and therefore beats Tailwind's layered utilities; the
 * overrides below carry `!` for that reason, not for taste. */
function Toaster({ className, toastOptions, ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      className={["toaster group font-sans!", className].filter(Boolean).join(" ")}
      icons={{
        success: <StatusDot tone="ok" />,
        info: <StatusDot tone="info" />,
        warning: <StatusDot tone="warning" />,
        error: <StatusDot tone="attention" />,
        loading: <Spinner className="size-3.5 text-muted-foreground" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-md)",
          "--width": "340px",
        } as React.CSSProperties
      }
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast: "shadow-panel! items-start! gap-2.5! px-3.5! py-3! text-13!",
          title: "font-medium",
          description: "text-muted-foreground! text-xs",
          icon: "mt-[5px]! w-3! justify-center!",
          actionButton:
            "h-6! rounded-full! bg-primary! px-2.5! text-xs! text-primary-foreground!",
          cancelButton:
            "h-6! rounded-full! border! border-border-strong! bg-transparent! px-2.5! text-xs! text-muted-foreground!",
          closeButton: "border-border! bg-popover! text-muted-foreground!",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  )
}

/* 24-hour, two digits, whatever the locale: a timestamp is a readout, not prose. */
const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
})

type NotifyOptions = Omit<ExternalToast, "description" | "icon"> & {
  tone?: StatusTone
  description?: React.ReactNode
  /** The moment the toast reports, stamped in mono at the end of the description.
   * Defaults to now; pass `false` for none. */
  at?: Date | false
}

/**
 * The product's way of raising a toast: a tone (the six chip tones), a title, and a mono
 * timestamp so a toast read late still tells when. Wraps sonner's `toast`; the raw `toast`
 * is re-exported for everything else (promise, dismiss, custom).
 */
function notify(
  title: React.ReactNode,
  { tone = "quiet", description, at = new Date(), ...rest }: NotifyOptions = {}
) {
  const stamp = at ? (
    <time
      data-slot="toast-stamp"
      dateTime={at.toISOString()}
      className="num text-2xs text-faint"
    >
      {timeFormat.format(at)}
    </time>
  ) : null
  const body =
    description != null || stamp ? (
      <span className="flex items-baseline gap-2">
        {description != null ? <span className="min-w-0 flex-1">{description}</span> : null}
        {stamp ? <span className="ml-auto shrink-0">{stamp}</span> : null}
      </span>
    ) : undefined
  return toast(title, {
    ...rest,
    description: body,
    icon: tone === "quiet" ? undefined : <StatusDot tone={tone} />,
  })
}

export { Toaster, notify, toast }
