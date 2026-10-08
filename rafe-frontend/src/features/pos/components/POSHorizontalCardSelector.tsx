import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface POSHorizontalCardSelectorProps {
  ariaLabel: string
  items: string[]
  nextButtonLabel: string
  onSelect: (item: string) => void
  previousButtonLabel: string
  selectedItem: string
  className?: string
}

export function POSHorizontalCardSelector({
  ariaLabel,
  items,
  nextButtonLabel,
  onSelect,
  previousButtonLabel,
  selectedItem,
  className = 'relative w-full',
}: POSHorizontalCardSelectorProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollButtons = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    setCanScrollLeft(viewport.scrollLeft > 0)
    setCanScrollRight(
      viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 1,
    )
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    updateScrollButtons()
    const resizeObserver = new ResizeObserver(updateScrollButtons)
    resizeObserver.observe(viewport)

    return () => resizeObserver.disconnect()
  }, [updateScrollButtons])

  function scrollCards(direction: -1 | 1) {
    const viewport = viewportRef.current
    if (!viewport) return

    viewport.scrollBy({
      left: direction * viewport.clientWidth * 0.75,
      behavior: 'smooth',
    })
  }

  return (
    <div className={className}>
      <div
        aria-label={ariaLabel}
        className="flex w-full flex-nowrap gap-2 overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden"
        onScroll={updateScrollButtons}
        ref={viewportRef}
        role="region"
        style={{ scrollbarWidth: 'none' }}
        tabIndex={0}
      >
        {items.map((item) => {
          const isSelected = selectedItem === item

          return (
            <button
              aria-pressed={isSelected}
              className={`inline-flex w-fit shrink-0 cursor-pointer items-center rounded-sm px-3 py-1 text-[0.6875rem] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2 ${
                isSelected
                  ? 'bg-primary text-background hover:bg-primary/90'
                  : 'bg-muted text-foreground hover:bg-border'
              }`}
              key={item}
              onClick={() => onSelect(item)}
              type="button"
            >
              {item}
            </button>
          )
        })}
      </div>

      {canScrollLeft && (
        <div className="absolute inset-y-0 left-0 z-10 flex items-center bg-gradient-to-r from-background to-transparent pl-1 pr-4">
          <button
            aria-label={previousButtonLabel}
            className="flex size-8 items-center justify-center rounded-full bg-background text-secondary-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
            onClick={() => scrollCards(-1)}
            type="button"
          >
            <ChevronLeft aria-hidden="true" size="1rem" strokeWidth={2} />
          </button>
        </div>
      )}

      {canScrollRight && (
        <div className="absolute inset-y-0 right-0 z-10 flex items-center bg-gradient-to-l from-background to-transparent pl-4 pr-1">
          <button
            aria-label={nextButtonLabel}
            className="flex size-8 items-center justify-center rounded-full bg-background text-secondary-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
            onClick={() => scrollCards(1)}
            type="button"
          >
            <ChevronRight aria-hidden="true" size="1rem" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  )
}
