import * as React from "react"
import { cn } from "cn"
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"

type ScrollAreaOrientation = "vertical" | "horizontal" | "both"

function ScrollArea({
  className,
  viewportClassName,
  viewportRef,
  viewportOnScroll,
  viewportAriaLabel,
  viewportRole,
  viewportTabIndex,
  showScrollbars = true,
  type = "always",
  orientation = "vertical",
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  orientation?: ScrollAreaOrientation
  viewportClassName?: string
  viewportRef?: React.Ref<HTMLDivElement>
  viewportOnScroll?: React.UIEventHandler<HTMLDivElement>
  viewportAriaLabel?: string
  viewportRole?: React.AriaRole
  viewportTabIndex?: number
  showScrollbars?: boolean
}) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      type={type}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        ref={viewportRef}
        onScroll={viewportOnScroll}
        aria-label={viewportAriaLabel}
        role={viewportRole}
        tabIndex={viewportTabIndex}
        className={cn(
          "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
          viewportClassName,
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {showScrollbars && (orientation === "vertical" || orientation === "both") && (
        <ScrollBar orientation="vertical" />
      )}
      {showScrollbars && (orientation === "horizontal" || orientation === "both") && (
        <ScrollBar orientation="horizontal" />
      )}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "absolute flex touch-none p-px transition-colors select-none data-[orientation=horizontal]:inset-x-0 data-[orientation=horizontal]:bottom-0 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-transparent data-[orientation=vertical]:inset-y-0 data-[orientation=vertical]:right-0 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2.5 data-[orientation=vertical]:border-l data-[orientation=vertical]:border-l-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-muted-foreground"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
