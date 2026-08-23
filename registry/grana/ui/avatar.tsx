"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn, getInitials } from "@/lib/utils"

/* The human/machine contract (RF §18, shared by Luminars' actor badges): a HUMAN is a round
 * avatar with initials; a MACHINE is a square dashed-border tile ("AI", "SYS") in mono.
 *
 *   variant outline — Luminars shell avatar: canvas-deep fill, hairline, mono 9.5px
 *   variant filled  — RF avatar: stone-300 fill, stone-800, 10px 600
 *   kind machine    — the dashed tile, whatever the variant
 *   size xs 20 · sm 24 (Luminars) · md 27 (RF) · lg 32 */
const avatarVariants = cva(
  "group/avatar relative flex shrink-0 overflow-hidden uppercase select-none",
  {
    variants: {
      size: {
        xs: "size-5",
        sm: "size-6",
        md: "size-[27px]",
        lg: "size-8",
      },
      kind: {
        human: "rounded-full",
        machine:
          "rounded-sm border border-dashed border-stone-400 bg-card font-mono text-[8px] font-semibold tracking-[.02em] text-muted-foreground",
      },
      variant: {
        outline: "",
        filled: "",
      },
    },
    compoundVariants: [
      {
        kind: "human",
        variant: "outline",
        class:
          "border border-border-strong bg-canvas-deep font-mono text-[9.5px] tracking-[.04em] text-muted-foreground",
      },
      {
        kind: "human",
        variant: "filled",
        class: "bg-stone-300 text-[10px] font-semibold text-stone-800",
      },
      { kind: "human", size: "xs", class: "text-[8px]" },
      { kind: "human", size: "lg", class: "text-[11px]" },
      { kind: "machine", size: "lg", class: "text-[9px]" },
    ],
    defaultVariants: {
      size: "sm",
      kind: "human",
      variant: "outline",
    },
  }
)


function Avatar({
  className,
  size = "sm",
  kind = "human",
  variant = "outline",
  initials,
  children,
  ...props
}: AvatarPrimitive.Root.Props &
  VariantProps<typeof avatarVariants> & {
    /** The letters to show when no image is given (or it fails). */
    initials?: string
  }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      data-kind={kind}
      data-variant={variant}
      className={cn(avatarVariants({ size, kind, variant }), className)}
      {...props}
    >
      {children}
      {initials != null ? <AvatarFallback>{initials}</AvatarFallback> : null}
    </AvatarPrimitive.Root>
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center leading-none",
        className
      )}
      {...props}
    />
  )
}

/* A presence mark on the avatar's corner: a dot in the status tone, ringed by the ground. */
function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none",
        "group-data-[size=xs]/avatar:size-1.5 group-data-[size=xs]/avatar:[&>svg]:hidden",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=md]/avatar:size-2.5 group-data-[size=md]/avatar:[&>svg]:size-1.5",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-1.5 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "num relative flex size-6 shrink-0 items-center justify-center rounded-full border border-border-strong bg-canvas-deep text-[9.5px] text-muted-foreground ring-2 ring-background",
        "group-has-data-[size=xs]/avatar-group:size-5 group-has-data-[size=xs]/avatar-group:text-[8px]",
        "group-has-data-[size=md]/avatar-group:size-[27px] group-has-data-[size=md]/avatar-group:text-[10px]",
        "group-has-data-[size=lg]/avatar-group:size-8 group-has-data-[size=lg]/avatar-group:text-[11px]",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
  avatarVariants,
  getInitials,
}
