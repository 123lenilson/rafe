import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePOSCartStore } from '@/features/pos/stores/usePOSCartStore'
import {
  calculatePaymentTotalInCents,
  calculateRemainingPaymentInCents,
  formatKwanza,
  formatPaymentAmountFromCents,
} from '@/features/pos/utils/posCartFormatters'
import { POSPaymentEntry } from '@/features/pos/components/POSPaymentEntry'
import { POSPaymentMethodList } from '@/features/pos/components/POSPaymentMethodList'
import { usePOSPaymentMethodEvents } from '@/features/pos/hooks/usePOSPaymentMethodEvents'

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
  totalAPagarInCents: number
}

export function POSPaymentMethods({
  formatDisplayValue,
  totalAPagarInCents,
}: POSPaymentMethodsProps) {
  const paymentAmounts = usePOSCartStore((state) => state.paymentAmounts)
  const setPaymentAmount = usePOSCartStore((state) => state.setPaymentAmount)
  const removePaymentAmount = usePOSCartStore((state) => state.removePaymentAmount)
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
      ...Object.keys(paymentAmounts).filter(
        (method) => paymentAmounts[method] && paymentAmounts[method] !== '0',
      ),
      ...(activePaymentMethod ? [activePaymentMethod] : []),
    ]),
  )

  const orderedPaymentMethods = [
    ...selectedPaymentMethods,
    ...paymentMethods.filter((method) => !selectedPaymentMethods.includes(method)),
  ]

  const currentAmount = activePaymentMethod ? (paymentAmounts[activePaymentMethod] || '0') : '0'
  const totalPaidInCents = calculatePaymentTotalInCents(paymentAmounts)
  const changeInCents = Math.max(0, totalPaidInCents - totalAPagarInCents)
  const outstandingInCents = calculateRemainingPaymentInCents(
    totalAPagarInCents,
    paymentAmounts,
  )
  const outstandingFormatted = totalAPagarInCents > 0
    ? outstandingInCents > 0
      ? `-${formatKwanza(outstandingInCents)}`
      : formatKwanza(0)
    : null

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
      (!paymentAmounts[activePaymentMethod] || paymentAmounts[activePaymentMethod] === '0')
    ) {
      removePaymentAmount(activePaymentMethod)
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

  function handleKeypadPress(key: string) {
    if (activeEditableField) {
      applyCartKeypadInput(key)
      return
    }

    if (!activePaymentMethod) return

    const current = paymentAmounts[activePaymentMethod] || '0'
    const normalizedCurrent = current.replace(/\s+/g, '')
    let nextValue = current

    if (key === 'clear') {
      nextValue = '0'
    } else if (key === 'backspace') {
      nextValue = current.length <= 1 ? '0' : current.slice(0, -1)
    } else if (key === '+' || key === '-') {
      if (/[+-]/.test(normalizedCurrent)) {
        return
      }
      nextValue = `${normalizedCurrent} ${key} `
    } else if (key === 'enter') {
      if (!/[+-]/.test(normalizedCurrent)) {
        setPaymentAmount(activePaymentMethod, normalizedCurrent)
        return
      }

      const [leftValue = '0', operator, rightValue = '0'] = normalizedCurrent.split(/([+-])/)
      const leftNumber = Number.parseFloat(leftValue)
      const rightNumber = Number.parseFloat(rightValue)

      if (!Number.isFinite(leftNumber) || !Number.isFinite(rightNumber) || !operator) {
        return
      }

      const result = operator === '+' ? leftNumber + rightNumber : leftNumber - rightNumber
      if (!Number.isFinite(result) || result < 0) {
        return
      }

      setPaymentAmount(activePaymentMethod, String(result))
      return
    } else if (key === '.') {
      if (/[+-]/.test(normalizedCurrent)) {
        const [leftValue = '0', operator, rightValue = ''] = normalizedCurrent.split(/([+-])/)
        if (!operator || rightValue.includes('.')) {
          return
        }
        nextValue = `${leftValue} ${operator} ${rightValue || '0'}.`
      } else {
        nextValue = normalizedCurrent.includes('.') ? normalizedCurrent : `${normalizedCurrent}.`
      }
    } else {
      if (/[+-]/.test(normalizedCurrent)) {
        const [leftValue = '0', operator, rightValue = ''] = normalizedCurrent.split(/([+-])/)
        const rightCandidate = rightValue === '0' ? key : `${rightValue}${key}`
        const numericValue = Number.parseFloat(rightCandidate)

        if (!Number.isFinite(numericValue) || numericValue > 999999999.99) {
          return
        }

        nextValue = `${leftValue} ${operator} ${rightCandidate}`
      } else {
        const nextCandidate = normalizedCurrent === '0' ? key : `${normalizedCurrent}${key}`
        const numericValue = Number.parseFloat(nextCandidate)

        if (!Number.isFinite(numericValue) || numericValue > 999999999.99) {
          return
        }

        nextValue = nextCandidate
      }
    }

    setPaymentAmount(activePaymentMethod, nextValue)
  }

  function handleExactPayment() {
    if (!activePaymentMethod || activeEditableField) return

    const exactAmountInCents = calculateRemainingPaymentInCents(
      totalAPagarInCents,
      paymentAmounts,
      activePaymentMethod,
    )
    setPaymentAmount(
      activePaymentMethod,
      formatPaymentAmountFromCents(exactAmountInCents),
    )
  }

  usePOSPaymentMethodEvents({
    activePaymentMethod,
    componentRootRef,
    expandedPaymentMethodsRef,
    onKeypadPress: handleKeypadPress,
    paymentAmounts,
    paymentMethodsContainerRef,
    removePaymentAmount,
    setActivePaymentMethod,
    setArePaymentMethodsExpanded,
  })

  return (
    <div className="relative flex h-full min-h-0 flex-col" ref={componentRootRef}>
      <div
        className={`relative z-20 flex min-h-0 flex-1 flex-wrap content-start items-start gap-2 ${arePaymentMethodsExpanded ? 'overflow-visible' : 'overflow-hidden'}`}
        ref={paymentMethodsContainerRef}
      >
        <POSPaymentMethodList
          activePaymentMethod={activePaymentMethod}
          arePaymentMethodsExpanded={arePaymentMethodsExpanded}
          expandedAreaRef={expandedPaymentMethodsRef}
          formatDisplayValue={formatDisplayValue}
          hasMorePaymentMethods={hasMorePaymentMethods}
          methods={orderedPaymentMethods}
          moreButtonRef={morePaymentMethodsButtonRef}
          onCollapse={() => setArePaymentMethodsExpanded(false)}
          onExpand={() => setArePaymentMethodsExpanded(true)}
          onSelectMethod={handlePaymentMethodSelect}
          outstandingFormatted={outstandingFormatted}
          paymentAmounts={paymentAmounts}
          setMethodButtonRef={(method, button) => {
            if (button) paymentMethodButtonRefs.current.set(method, button)
            else paymentMethodButtonRefs.current.delete(method)
          }}
          visibleMethodCount={visiblePaymentMethodCount}
        />
      </div>
      <POSPaymentEntry
        activePaymentMethod={activePaymentMethod}
        changeInCents={changeInCents}
        currentAmount={currentAmount}
        formatDisplayValue={formatDisplayValue}
        isExactDisabled={activePaymentMethod === null || activeEditableField !== null}
        onExactPayment={handleExactPayment}
        onKeypadPress={handleKeypadPress}
      />
    </div>
  )
}
