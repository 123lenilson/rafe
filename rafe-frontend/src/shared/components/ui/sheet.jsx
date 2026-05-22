"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as SheetPrimitive } from "radix-ui"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/button"
import { Overlay } from "@/shared/components/ui/overlay"

function Sheet({ ...props }) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

const sheetVariants = cva(
  "fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition ease-in-out data-closed:duration-300 data-open:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 h-auto border-b data-open:slide-in-from-top data-closed:slide-out-to-top data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        bottom: "inset-x-0 bottom-0 h-auto border-t data-open:slide-in-from-bottom data-closed:slide-out-to-bottom data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm data-open:slide-in-from-left data-closed:slide-out-to-left data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}) {
  return (
    <SheetPortal>
      <Overlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close data-slot="sheet-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-3 right-3"
              size="icon-sm"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "cn-font-heading text-base font-medium text-foreground",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
