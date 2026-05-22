import * as React from "react"
import { Dialog as OverlayPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function Overlay({ className, ...props }) {
  return (
    <OverlayPrimitive.Overlay
      data-slot="overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/20 duration-300 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

export { Overlay }
