import React, { useLayoutEffect, useRef } from 'react'

interface MonetaryDisplayProps {
  value: string
}

const MAX_FONT_SIZE = 48
const MIN_FONT_SIZE = 14

export function MonetaryDisplay({ value }: MonetaryDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    const containerStyle = window.getComputedStyle(container)
    const paddingLeft = parseFloat(containerStyle.paddingLeft) || 16
    const paddingRight = parseFloat(containerStyle.paddingRight) || 16
    const maxAllowedWidth = container.clientWidth - paddingLeft - paddingRight - 8

    if (maxAllowedWidth <= 0) return

    // Recomeça sempre do tamanho máximo, de forma síncrona
    let size = MAX_FONT_SIZE
    text.style.fontSize = `${size}px`

    // Desce 1px de cada vez só enquanto ultrapassar o limite
    while (text.scrollWidth > maxAllowedWidth && size > MIN_FONT_SIZE) {
      size -= 1
      text.style.fontSize = `${size}px`
    }
  }, [value])

  return (
    <div
      ref={containerRef}
      className="w-full p-4 bg-[#F5F5F5] flex items-center justify-end select-none overflow-hidden h-20"
    >
      <span
        ref={textRef}
        className="font-normal tracking-tight text-black font-sans whitespace-nowrap"
        style={{ fontSize: `${MAX_FONT_SIZE}px` }}
      >
        {value}
      </span>
    </div>
  )
}