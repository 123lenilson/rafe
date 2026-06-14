import React, { MouseEvent, useEffect, useState } from "react"

import { cn } from "@/lib/utils"

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rippleColor?: string
  rippleHoverColor?: string
  duration?: string
  rippleOnHover?: boolean
}

export const RippleButton = React.forwardRef<
  HTMLButtonElement,
  RippleButtonProps
>(
  (
    {
      className,
      children,
      rippleColor = "#ffffff",
      rippleHoverColor = "#D9D9D9",
      duration = "600ms",
      rippleOnHover = false,
      onClick,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const [buttonRipples, setButtonRipples] = useState<
      Array<{ x: number; y: number; size: number; key: number; isHover?: boolean; color?: string }>
    >([])

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      createRipple(event, false)
      onClick?.(event)
    }

    const createRipple = (event: MouseEvent<HTMLButtonElement>, isHover = false) => {
      const button = event.currentTarget
      const rect = button.getBoundingClientRect()
      const size = isHover ? Math.max(rect.width, rect.height) * 2.5 : Math.max(rect.width, rect.height)
      const x = event.clientX - rect.left - size / 2
      const y = event.clientY - rect.top - size / 2

      const newRipple = {
        x,
        y,
        size,
        key: Date.now(),
        isHover,
        color: isHover ? rippleHoverColor : rippleColor
      }
      setButtonRipples((prevRipples) => [...prevRipples, newRipple])
    }

    const handleMouseEnter = (event: MouseEvent<HTMLButtonElement>) => {
      if (rippleOnHover) {
        createRipple(event, true)
      }
      onMouseEnter?.(event)
    }

    const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
      if (rippleOnHover) {
        setButtonRipples((prevRipples) => prevRipples.filter((ripple) => !ripple.isHover))
      }
      onMouseLeave?.(event)
    }

    useEffect(() => {
      let timeout: ReturnType<typeof setTimeout> | null = null

      if (buttonRipples.length > 0) {
        const lastRipple = buttonRipples[buttonRipples.length - 1]
        if (!lastRipple.isHover) {
          timeout = setTimeout(() => {
            setButtonRipples((prevRipples) =>
              prevRipples.filter((ripple) => ripple.key !== lastRipple.key)
            )
          }, parseInt(duration))
        }
      }

      return () => {
        if (timeout !== null) {
          clearTimeout(timeout)
        }
      }
    }, [buttonRipples, duration])

    return (
      <button
        className={cn(
          "bg-background text-primary relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 px-4 py-2 text-center",
          className
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={ref}
        {...props}
      >
        <div className="relative z-10">{children}</div>
        <span className="pointer-events-none absolute inset-0">
          {buttonRipples.map((ripple) => (
            <span
              className={cn(
                "absolute rounded-full pointer-events-none",
                ripple.isHover ? "animate-ripple-hover" : "animate-rippling opacity-30"
              )}
              key={ripple.key}
              style={
                {
                  width: `${ripple.size}px`,
                  height: `${ripple.size}px`,
                  top: `${ripple.y}px`,
                  left: `${ripple.x}px`,
                  backgroundColor: ripple.color,
                  transform: `scale(0)`,
                  "--duration": duration,
                } as React.CSSProperties
              }
            />
          ))}
        </span>
      </button>
    )
  }
)

RippleButton.displayName = "RippleButton"
