import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MonetaryDisplay } from '@/shared/components/MonetaryDisplay'
import { NumericKeypad } from '@/shared/components/NumericKeypad'
import { usePOSCartStore } from '@/features/pos/stores/usePOSCartStore'

const paymentMethods = [
  'Dinheiro',
  'TPA',
  'Transferência',
  'Cartão',
  'Multicaixa Express',
  'Depósito',
  'Cheque',
]

interface POSPaymentMethodsProps {
  formatDisplayValue: (value: string) => string
}

export function POSPaymentMethods({
  formatDisplayValue,
}: POSPaymentMethodsProps) {
  const activeEditableField = usePOSCartStore(
    (state) => state.activeEditableField,
  )
  const applyCartKeypadInput = usePOSCartStore(
    (state) => state.applyKeypadInput,
  )
  const setActiveEditableField = usePOSCartStore(
    (state) => state.setActiveEditableField,
  )
  const [activePaymentMethod, setActivePaymentMethod] = useState<string | null>(null)
  const [methodAmounts, setMethodAmounts] = useState<Record<string, string>>({})
  const [arePaymentMethodsExpanded, setArePaymentMethodsExpanded] =
    useState(false)
  const [visiblePaymentMethodCount, setVisiblePaymentMethodCount] = useState(
    paymentMethods.length,
  )
  const [hasMorePaymentMethods, setHasMorePaymentMethods] = useState(false)
  const paymentMethodButtonRefs = useRef(new Map<string, HTMLButtonElement>())
  const componentRootRef = useRef<HTMLDivElement>(null)
  const paymentMethodsContainerRef = useRef<HTMLDivElement>(null)
  const morePaymentMethodsButtonRef = useRef<HTMLButtonElement>(null)
  const expandedPaymentMethodsRef = useRef<HTMLDivElement>(null)
  const previousPaymentMethodPositions = useRef(
    new Map<string, DOMRect>(),
  )

  const selectedPaymentMethods = Array.from(
    new Set([
      ...Object.keys(methodAmounts).filter(
        (m) => methodAmounts[m] && methodAmounts[m] !== '0',
      ),
      ...(activePaymentMethod ? [activePaymentMethod] : []),
    ]),
  )

  const orderedPaymentMethods = [
    ...selectedPaymentMethods,
    ...paymentMethods.filter((method) => !selectedPaymentMethods.includes(method)),
  ]

  const currentAmount = activePaymentMethod ? (methodAmounts[activePaymentMethod] || '0') : '0'

  function handlePaymentMethodSelect(method: string) {
    setActiveEditableField(null)
    previousPaymentMethodPositions.current = new Map(
      Array.from(paymentMethodButtonRefs.current, ([currentMethod, button]) => [
        currentMethod,
        button.getBoundingClientRect(),
      ]),
    )

    if (
      activePaymentMethod &&
      activePaymentMethod !== method &&
      (!methodAmounts[activePaymentMethod] || methodAmounts[activePaymentMethod] === '0')
    ) {
      setMethodAmounts((prev) => {
        const next = { ...prev }
        delete next[activePaymentMethod]
        return next
      })
    }

    setActivePaymentMethod(method)
  }

  useLayoutEffect(() => {
    const previousPositions = previousPaymentMethodPositions.current
    if (previousPositions.size === 0) return

    for (const [method, button] of paymentMethodButtonRefs.current) {
      const previousPosition = previousPositions.get(method)
      if (!previousPosition) continue

      const currentPosition = button.getBoundingClientRect()
      const deltaX = previousPosition.left - currentPosition.left
      const deltaY = previousPosition.top - currentPosition.top
      if (deltaX === 0 && deltaY === 0) continue

      button.animate(
        [
          {
            transform: `translate(${(deltaX / currentPosition.width) * 100}%, ${(deltaY / currentPosition.height) * 100}%)`,
          },
          { transform: 'translate(0, 0)' },
        ],
        {
          duration: 220,
          easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        },
      )
    }

    previousPositions.clear()
  }, [selectedPaymentMethods])

  useLayoutEffect(() => {
    if (arePaymentMethodsExpanded) return

    const container = paymentMethodsContainerRef.current
    if (!container) return

    const methodCards = Array.from(
      container.querySelectorAll<HTMLElement>('[data-payment-method-card]'),
    )
    const methodsOverflow = methodCards.some(
      (card) => card.offsetTop + card.offsetHeight > container.clientHeight,
    )

    if (visiblePaymentMethodCount === paymentMethods.length) {
      if (methodsOverflow) {
        setHasMorePaymentMethods(true)
        setVisiblePaymentMethodCount(paymentMethods.length - 1)
      } else {
        setHasMorePaymentMethods(false)
      }
      return
    }

    const moreButton = morePaymentMethodsButtonRef.current
    const moreButtonOverflows =
      !moreButton ||
      moreButton.offsetTop + moreButton.offsetHeight > container.clientHeight

    if ((methodsOverflow || moreButtonOverflows) && visiblePaymentMethodCount > 0) {
      setVisiblePaymentMethodCount((count) => Math.max(0, count - 1))
    }
  }, [
    arePaymentMethodsExpanded,
    hasMorePaymentMethods,
    selectedPaymentMethods,
    visiblePaymentMethodCount,
  ])

  useLayoutEffect(() => {
    if (arePaymentMethodsExpanded) return

    setVisiblePaymentMethodCount(paymentMethods.length)
    setHasMorePaymentMethods(false)
  }, [arePaymentMethodsExpanded, selectedPaymentMethods])

  useEffect(() => {
    if (arePaymentMethodsExpanded) return

    const container = paymentMethodsContainerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver(() => {
      setVisiblePaymentMethodCount(paymentMethods.length)
      setHasMorePaymentMethods(false)
    })

    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [arePaymentMethodsExpanded])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const container = paymentMethodsContainerRef.current
      const expandedArea = expandedPaymentMethodsRef.current
      const root = componentRootRef.current
      const target = event.target as Node

      if (expandedArea && !expandedArea.contains(target)) {
        setArePaymentMethodsExpanded(false)
      }

      if (
        container?.contains(target) ||
        expandedArea?.contains(target) ||
        root?.contains(target)
      ) {
        return
      }

      if (activePaymentMethod) {
        const activeAmount = methodAmounts[activePaymentMethod]
        if (!activeAmount || activeAmount === '0') {
          setMethodAmounts((prev) => {
            const next = { ...prev }
            delete next[activePaymentMethod]
            return next
          })
        }
        setActivePaymentMethod(null)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [activePaymentMethod, methodAmounts])

  function handleKeypadPress(key: string) {
    if (activeEditableField) {
      applyCartKeypadInput(key)
      return
    }

    if (!activePaymentMethod) return

    setMethodAmounts((prevAmounts) => {
      const current = prevAmounts[activePaymentMethod] || '0'
      let nextValue = current

      if (key === 'clear') {
        nextValue = '0'
      } else if (key === 'backspace') {
        nextValue = current.length <= 1 ? '0' : current.slice(0, -1)
      } else if (key === '.') {
        nextValue = current.includes('.') ? current : `${current}.`
      } else {
        if (current.includes('.')) {
          const decimals = current.split('.')[1] || ''
          if (decimals.length >= 2) return prevAmounts
        }

        const nextCandidate = current === '0' ? key : `${current}${key}`
        const numericValue = Number.parseFloat(nextCandidate)
        if (!Number.isFinite(numericValue) || numericValue > 999999999.99) {
          return prevAmounts
        }
        nextValue = nextCandidate
      }

      return {
        ...prevAmounts,
        [activePaymentMethod]: nextValue,
      }
    })
  }

  function handleKeypadClear() {
    if (activeEditableField) applyCartKeypadInput('clear')
  }

  useEffect(() => {
    const handlePhysicalKeyDown = (event: KeyboardEvent) => {
      if (!activePaymentMethod) return

      const target = event.target as HTMLElement
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      if (isInput) return

      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault()
        handleKeypadPress(event.key)
      } else if (event.key === '.' || event.key === ',') {
        event.preventDefault()
        handleKeypadPress('.')
      } else if (event.key === 'Backspace') {
        event.preventDefault()
        handleKeypadPress('backspace')
      } else if (
        event.key === 'Delete' ||
        event.key === 'Escape' ||
        event.key.toLowerCase() === 'c'
      ) {
        event.preventDefault()
        handleKeypadPress('clear')
      }
    }

    window.addEventListener('keydown', handlePhysicalKeyDown)
    return () => window.removeEventListener('keydown', handlePhysicalKeyDown)
  }, [activeEditableField, activePaymentMethod, methodAmounts])

  return (
    <div className="relative flex h-full min-h-0 flex-col" ref={componentRootRef}>
      <div
        className={`relative z-20 flex min-h-0 flex-1 flex-wrap content-start items-start gap-2 ${arePaymentMethodsExpanded ? 'overflow-visible' : 'overflow-x-hidden overflow-y-visible'}`}
        ref={paymentMethodsContainerRef}
      >
        {orderedPaymentMethods.slice(0, visiblePaymentMethodCount).map((method) => {
          const hasValue = Boolean(methodAmounts[method] && methodAmounts[method] !== '0')
          const isActive = activePaymentMethod === method
          const isSelected = hasValue || isActive
          const methodAmount = methodAmounts[method]

          return (
            <button
              aria-pressed={isSelected}
              data-payment-method-card
              className={`inline-flex w-fit shrink-0 flex-col items-center justify-center rounded-sm px-3 py-1 text-center text-[0.6875rem] transition-colors focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2 ${
                isActive
                  ? 'bg-primary text-background ring-1 ring-foreground'
                  : isSelected
                    ? 'bg-primary text-background'
                    : 'bg-muted text-foreground'
              }`}
              key={method}
              onClick={() => handlePaymentMethodSelect(method)}
              ref={(button) => {
                if (button) paymentMethodButtonRefs.current.set(method, button)
                else paymentMethodButtonRefs.current.delete(method)
              }}
              type="button"
            >
              <span className="font-medium leading-none">{method}</span>
              {methodAmount && methodAmount !== '0' && (
                <span className="mt-1 text-xs font-semibold leading-none opacity-95">
                  {formatDisplayValue(methodAmount)}
                </span>
              )}
            </button>
          )
        })}
        {!arePaymentMethodsExpanded && hasMorePaymentMethods && (
          <button
            aria-expanded={false}
            className="inline-flex w-fit shrink-0 items-center rounded-sm bg-muted px-3 py-1 text-[0.6875rem] text-foreground focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
            onClick={() => setArePaymentMethodsExpanded(true)}
            ref={morePaymentMethodsButtonRef}
            type="button"
          >
            Ver mais
          </button>
        )}
        {arePaymentMethodsExpanded && (
          <div
            className="absolute inset-x-0 top-0 -m-2 rounded-md border border-border bg-background p-2"
            ref={expandedPaymentMethodsRef}
          >
            <div className="flex flex-wrap gap-2">
              {orderedPaymentMethods.map((method) => {
                const hasValue = Boolean(methodAmounts[method] && methodAmounts[method] !== '0')
                const isActive = activePaymentMethod === method
                const isSelected = hasValue || isActive
                const methodAmount = methodAmounts[method]

                return (
                  <button
                    aria-pressed={isSelected}
                    data-payment-method-card
                    className={`inline-flex w-fit shrink-0 flex-col items-center justify-center rounded-sm px-3 py-1 text-center text-[0.6875rem] transition-colors focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2 ${
                      isActive
                        ? 'bg-primary text-background ring-1 ring-foreground'
                        : isSelected
                          ? 'bg-primary text-background'
                          : 'bg-muted text-foreground'
                    }`}
                    key={method}
                    onClick={() => handlePaymentMethodSelect(method)}
                    ref={(button) => {
                      if (button) paymentMethodButtonRefs.current.set(method, button)
                      else paymentMethodButtonRefs.current.delete(method)
                    }}
                    type="button"
                  >
                    <span className="font-medium leading-none">{method}</span>
                    {methodAmount && methodAmount !== '0' && (
                      <span className="mt-1 text-xs font-semibold leading-none opacity-95">
                        {formatDisplayValue(methodAmount)}
                      </span>
                    )}
                  </button>
                )
              })}
              <button
                aria-expanded={true}
                className="inline-flex w-fit shrink-0 items-center rounded-sm bg-muted px-3 py-1 text-[0.6875rem] text-foreground focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
                onClick={() => setArePaymentMethodsExpanded(false)}
                type="button"
              >
                Ver menos
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-2 flex shrink-0 flex-col gap-2">
        <div
          className={`[&>div]:bg-border transition-opacity duration-150 ${
            activePaymentMethod === null ? 'pointer-events-none opacity-40' : 'opacity-100'
          }`}
        >
          <MonetaryDisplay value={activePaymentMethod ? formatDisplayValue(currentAmount) : '0,00 Kz'} />
        </div>
        <div
          aria-label="Troco"
          className="relative w-full"
          role="group"
        >
          <div className="mx-auto flex w-full max-w-xs items-center">
            <span className="text-sm leading-[1.125rem] text-secondary-foreground">
              Troco:
            </span>
          </div>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm leading-[1.125rem] text-foreground">
            0,00kz
          </span>
        </div>
        <NumericKeypad
          clearKeyLabel="Ex"
          onClearKeyPress={handleKeypadClear}
          onKeyPress={handleKeypadPress}
        />
      </div>
    </div>
  )
}
