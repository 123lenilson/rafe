import React from 'react'
import { cn } from '@/lib/utils'

export interface ValueTimelineItem {
  id?: string
  label: string
  value: number
  formattedValue?: string
  subtext?: string
}

export interface ValueTimelineProps {
  items?: ValueTimelineItem[]
  initialValue?: number
  finalValue?: number
  differenceValue?: number
  formattedInitialValue?: string
  formattedFinalValue?: string
  formattedDifferenceValue?: string
  currencySymbol?: string
  isClosed?: boolean
  className?: string
}

function defaultFormat(val: number, symbol = 'Kz'): string {
  const formatted = val.toLocaleString('pt-PT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${formatted} ${symbol}`
}

export function ValueTimeline({
  items,
  initialValue,
  finalValue,
  differenceValue,
  formattedInitialValue,
  formattedFinalValue,
  formattedDifferenceValue,
  currencySymbol = 'Kz',
  isClosed = true,
  className,
}: ValueTimelineProps) {
  // Se não passar `items` explicitamente, constrói a lista padrão de 3 nós
  const timelineItems: ValueTimelineItem[] = items ?? [
    {
      id: 'initial',
      label: 'Valor Inicial',
      value: initialValue ?? 0,
      formattedValue: formattedInitialValue ?? defaultFormat(initialValue ?? 0, currencySymbol),
    },
    {
      id: 'final',
      label: 'Valor Final',
      value: finalValue ?? 0,
      formattedValue: isClosed
        ? (formattedFinalValue ?? defaultFormat(finalValue ?? 0, currencySymbol))
        : 'Em Aberto',
    },
    {
      id: 'difference',
      label: 'Diferença',
      value: differenceValue ?? 0,
      formattedValue: isClosed
        ? (formattedDifferenceValue ?? defaultFormat(differenceValue ?? 0, currencySymbol))
        : '---',
    },
  ]

  return (
    <div className={cn("w-full py-2 flex flex-col", className)}>
      {timelineItems.map((item, index) => {
        const isFirst = index === 0
        const isLast = index === timelineItems.length - 1
        const isPositive = item.value > 0

        return (
          <div key={item.id || index} className="flex items-start group relative">
            {/* Coluna da Bolinha e Linha Conectora Vertical */}
            <div className="flex flex-col items-center mr-3 self-stretch shrink-0 relative w-2.5">
              {/* Linha Conectora Preta Contínua (Liga da 1ª à 2ª e da 2ª à 3ª bolinha) */}
              <div
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 w-[1.5px] z-0",
                  isPositive ? "bg-black" : "bg-zinc-400",
                  isFirst && "top-1.5 bottom-0",
                  !isFirst && !isLast && "top-0 bottom-0",
                  isLast && "top-0 h-1.5"
                )}
              />

              {/* Bolinha Indicadora (Tamanho reduzido para 6px) */}
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-full border z-10 shrink-0 transition-all duration-200 mt-1",
                  isPositive ? "bg-black border-black" : "bg-zinc-400 border-zinc-400"
                )}
                title={isPositive ? `Valor positivo: ${item.value}` : `Valor zero ou negativo: ${item.value}`}
              />
            </div>

            {/* Conteúdo (Rótulo + Valor) */}
            <div className={cn("flex flex-col pb-4 flex-1 min-w-0 font-normal tracking-wide", isLast && "pb-0")}>
              {/* Palavra/Rótulo em menor destaque */}
              <span className="text-[0.6875rem] font-semibold tracking-wide text-zinc-400 leading-none mb-1 font-sans">
                {item.label}
              </span>

              {/* Número/Valor em destaque */}
              <span className="text-[1rem] sm:text-[1.125rem] font-semibold tracking-wide text-zinc-900 leading-snug font-sans break-words">
                {item.formattedValue}
              </span>

              {item.subtext && (
                <span className="text-[0.6875rem] text-zinc-400 mt-0.5 font-normal tracking-wide">
                  {item.subtext}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
