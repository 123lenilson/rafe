import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MonetaryDisplay } from '@/shared/components/MonetaryDisplay'
import { NumericKeypad } from '@/shared/components/NumericKeypad'

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
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(
    [],
  )
  const [amount, setAmount] = useState('0')
  const [arePaymentMethodsExpanded, setArePaymentMethodsExpanded] =
    useState(false)
  const [visiblePaymentMethodCount, setVisiblePaymentMethodCount] = useState(
    paymentMethods.length,
  )
  const [hasMorePaymentMethods, setHasMorePaymentMethods] = useState(false)
  const paymentMethodButtonRefs = useRef(new Map<string, HTMLButtonElement>())
  const paymentMethodsContainerRef = useRef<HTMLDivElement>(null)
  const morePaymentMethodsButtonRef = useRef<HTMLButtonElement>(null)
  const expandedPaymentMethodsRef = useRef<HTMLDivElement>(null)
  const previousPaymentMethodPositions = useRef(
    new Map<string, DOMRect>(),
  )
  const orderedPaymentMethods = [
    ...selectedPaymentMethods,
    ...paymentMethods.filter((method) => !selectedPaymentMethods.includes(method)),
  ]

  function handlePaymentMethodSelect(method: string) {
    previousPaymentMethodPositions.current = new Map(
      Array.from(paymentMethodButtonRefs.current, ([currentMethod, button]) => [
        currentMethod,
        button.getBoundingClientRect(),
      ]),
    )
    setSelectedPaymentMethods((currentMethods) =>
      currentMethods.includes(method)
        ? currentMethods.filter((currentMethod) => currentMethod !== method)
        : [...currentMethods, method],
    )
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
    if (!arePaymentMethodsExpanded) return

    function handlePointerDown(event: PointerEvent) {
      const expandedArea = expandedPaymentMethodsRef.current
      if (expandedArea && !expandedArea.contains(event.target as Node)) {
        setArePaymentMethodsExpanded(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [arePaymentMethodsExpanded])

  function handleKeypadPress(key: string) {
    if (key === 'clear') {
      setAmount('0')
    } else if (key === 'backspace') {
      setAmount((current) =>
        current.length <= 1 ? '0' : current.slice(0, -1),
      )
    } else if (key === '.') {
      setAmount((current) =>
        current.includes('.') ? current : `${current}.`,
      )
    } else {
      setAmount((current) => {
        if (current.includes('.')) {
          const decimals = current.split('.')[1] || ''
          if (decimals.length >= 2) return current
        }

        const nextValue = current === '0' ? key : `${current}${key}`
        const numericValue = Number.parseFloat(nextValue)
        if (!Number.isFinite(numericValue) || numericValue > 999999999.99) {
          return current
        }

        return nextValue
      })
    }
  }

  useEffect(() => {
    const handlePhysicalKeyDown = (event: KeyboardEvent) => {
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
  }, [amount])

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div
        className={`relative z-20 flex min-h-0 flex-1 flex-wrap content-start items-start gap-2 ${arePaymentMethodsExpanded ? 'overflow-visible' : 'overflow-hidden'}`}
        ref={paymentMethodsContainerRef}
      >
        {orderedPaymentMethods.slice(0, visiblePaymentMethodCount).map((method) => {
          const isSelected = selectedPaymentMethods.includes(method)

          return (
            <button
              aria-pressed={isSelected}
              data-payment-method-card
              className={`inline-flex w-fit shrink-0 items-center rounded-sm px-3 py-1 text-[0.5625rem] focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2 ${
                isSelected
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
              {method}
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
                const isSelected = selectedPaymentMethods.includes(method)

                return (
                  <button
                    aria-pressed={isSelected}
                    data-payment-method-card
                    className={`inline-flex w-fit shrink-0 items-center rounded-sm px-3 py-1 text-[0.5625rem] focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2 ${
                      isSelected
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
                    {method}
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
        <div className="[&>div]:bg-border">
          <MonetaryDisplay value={formatDisplayValue(amount)} />
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
          onClearKeyPress={() => {}}
          onKeyPress={handleKeypadPress}
        />
      </div>
    </div>
  )
}
