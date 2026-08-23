import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/grana/ui/dialog"
import { SearchIcon, CheckIcon } from "lucide-react"

/* The ⌘K palette: the Luminars menu panel (skin-spec §5) grown a search row. `bg-popover`,
 * hairline, 10px radius, `shadow-panel`; a 40px search row under a bottom hairline; group
 * headings as eyebrows; items = the menu item (7px rows, 6px radius, 13px) lifting to
 * `bg-accent` when highlighted; shortcuts in the mono `num` face. */

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-panel",
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      {/* The Command carries the panel's face, hairline and shadow; the dialog box is bare.
       * Title and description live INSIDE the popup: Base UI's Dialog.Title reads the popup
       * store, and rendered outside it (the stock layout) it throws on open. */}
      <DialogContent
        className={cn(
          "top-1/3 translate-y-0 overflow-hidden rounded-md border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-lg",
          className
        )}
        showCloseButton={showCloseButton}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {/* The cmdk root is supplied here: children are CommandInput / CommandList / …,
         * never a bare Command (its store would otherwise be missing and cmdk throws). */}
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-3"
    >
      <SearchIcon className="size-3.5 shrink-0 text-faint" />
      {/* The palette is the focus context (a dialog with one focusable field); an outline
       * around the search row would double-frame it, so this input alone stays bare. */}
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "h-10 w-full min-w-0 bg-transparent text-13 text-foreground placeholder:text-faint focus-visible:outline-hidden disabled:cursor-default disabled:opacity-60",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto p-1",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-6 text-center text-13 text-muted-foreground", className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden text-foreground **:[[cmdk-group-heading]]:eyebrow **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:pt-2 **:[[cmdk-group-heading]]:pb-1.5",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-[7px] text-13 text-foreground select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:text-faint data-selected:bg-accent data-selected:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-faint [&_svg:not([class*='size-'])]:size-3.5 data-selected:[&_svg]:text-foreground",
        className
      )}
      {...props}
    >
      {children}
      <CheckIcon className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" />
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "num ml-auto text-xs text-faint group-data-selected/command-item:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
