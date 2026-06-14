import React, { useLayoutEffect, useRef } from 'react'

interface MonetaryDisplayProps {
  value: string
}

export function MonetaryDisplay({ value }: MonetaryDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    const adjustFontSize = () => {
      // Começa com o tamanho máximo de 48px (equivalente a text-5xl)
      let currentSize = 48
      text.style.fontSize = `${currentSize}px`

      const containerStyle = window.getComputedStyle(container)
      const paddingLeft = parseFloat(containerStyle.paddingLeft) || 16
      const paddingRight = parseFloat(containerStyle.paddingRight) || 16
      // Calcula a largura interna útil (subtraindo os paddings e margem extra)
      const maxAllowedWidth = container.clientWidth - paddingLeft - paddingRight - 8

      // Reduz o font-size até caber totalmente no espaço
      while (text.scrollWidth > maxAllowedWidth && currentSize > 14) {
        currentSize -= 1
        text.style.fontSize = `${currentSize}px`
      }
    }

    // Executa o ajuste imediatamente no render
    adjustFontSize()

    // Ajusta também se o ecrã/gaveta for redimensionada
    window.addEventListener('resize', adjustFontSize)
    return () => {
      window.removeEventListener('resize', adjustFontSize)
    }
  }, [value])

  return (
    <div 
      ref={containerRef}
      className="w-full p-4 bg-[#F5F5F5] flex items-center justify-end select-none overflow-hidden h-20"
    >
      <span 
        ref={textRef}
        className="text-5xl font-normal tracking-tight text-black font-sans whitespace-nowrap"
      >
        {value}
      </span>
    </div>
  )
}
