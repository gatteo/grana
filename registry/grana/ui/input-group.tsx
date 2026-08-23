import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/grana/ui/button"
import { Input } from "@/registry/grana/ui/input"
import { Textarea } from "@/registry/grana/ui/textarea"

/* The field shell (input.tsx) drawn on the GROUP so addons (an icon, a unit, a kbd, a quiet
 * button) sit inside the hairline; the control inside is bare. Because the control has no
 * edge of its own, the group paints the global focus outline on itself when the control is
 * focus-visible — the one place a field relays the outline rather than showing it directly. */
const inputGroupVariants = cva(
  "group/input-group relative flex h-[34px] w-full min-w-0 items-center rounded-sm border border-input bg-card transition-colors duration-[120ms] not-has-disabled:hover:border-border-strong has-disabled:bg-muted has-disabled:opacity-60 has-[[data-slot=input-group-control]:focus-visible]:outline-2 has-[[data-slot=input-group-control]:focus-visible]:outline-offset-2 has-[[data-slot=input-group-control]:focus-visible]:outline-ring has-[[data-slot][aria-invalid=true]]:border-destructive has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5",
  {
    variants: {
      variant: {
        default: "",
        /* RF `.search`: the topbar search, sunken a half step onto `stone-50`. */
        search: "bg-stone-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function InputGroup({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupVariants>) {
  return (
    <div
      data-slot="input-group"
      data-variant={variant}
      role="group"
      className={cn(inputGroupVariants({ variant }), className)}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-13 text-faint select-none group-has-disabled/input-group:opacity-60 [&>kbd]:rounded-xs [&>svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-2.5 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
        "inline-end":
          "order-last pr-2.5 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
        "block-start":
          "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
        "block-end":
          "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

/* Sizes are local: the Button's own size prop is not forwarded, so whatever scale Button
 * ships, the in-field button stays 22px (xs) or 26px (sm) tall and never outgrows the shell. */
const inputGroupButtonVariants = cva(
  "flex items-center gap-1 text-xs shadow-none",
  {
    variants: {
      size: {
        xs: "h-[22px] px-2 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-[26px] px-2.5 text-13",
        "icon-xs": "size-[22px] p-0 has-[>svg]:p-0",
        "icon-sm": "size-[26px] p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
)

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset"
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-13 text-faint [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "h-auto flex-1 self-stretch rounded-none border-0 bg-transparent focus-visible:outline-hidden disabled:bg-transparent disabled:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-[7px] focus-visible:outline-hidden disabled:bg-transparent disabled:opacity-100",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
  inputGroupVariants,
}
