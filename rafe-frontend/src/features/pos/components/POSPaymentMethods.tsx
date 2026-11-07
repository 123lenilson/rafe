import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
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
  const cartItems = usePOSCartStore((state) => state.items)
  const applyCartKeypadInput = usePOSCartStore(
    (state) => state.applyKeypadInput,
  )
  const setActiveEditableField = usePOSCartStore(
    (state) => state.setActiveEditableField,
  )
  const [activePaymentMethod, setActivePaymentMethod] = useState<string | null>(null)
  const [paymentExpression, setPaymentExpression] = useState<string | null>(null)
  const paymentExpressionRef = useRef<string | null>(null)
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
  const paymentDisplayValue = paymentExpression ?? formatDisplayValue(currentAmount)
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

  useEffect(() => {
    setVisiblePaymentMethodCount(paymentMethods.length)
    setHasMorePaymentMethods(false)
  }, [outstandingFormatted])

  function handlePaymentMethodSelect(method: string) {
    paymentExpressionRef.current = null
    setPaymentExpression(null)
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

  useEffect(() => {
    paymentExpressionRef.current = null
    setPaymentExpression(null)
  }, [activePaymentMethod])

  function updatePaymentExpression(expression: string | null) {
    paymentExpressionRef.current = expression
    setPaymentExpression(expression)
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
      const quantityError = applyCartKeypadInput(key)
      if (quantityError === 'zero') {
        toast.warning('Quantidade inválida', {
          description: 'A quantidade mínima permitida é 1.',
        })
      } else if (quantityError === 'exceeds-stock') {
        const activeItem = cartItems.find(
          (item) => item.id === activeEditableField.itemId,
        )
        const availableQuantity = activeItem?.availableQuantity
        toast.warning('Limite de stock', {
          description: `Stock disponível: ${availableQuantity ?? 0} ${availableQuantity === 1 ? 'unidade' : 'unidades'}. A quantidade foi reposta para 1.`,
        })
      }
      return
    }

    if (!activePaymentMethod) return

    const current = paymentAmounts[activePaymentMethod] || '0'
    const expression = paymentExpressionRef.current
    let nextValue = current

    if (key === 'clear') {
      updatePaymentExpression(null)
      setPaymentAmount(activePaymentMethod, '0')
      return
    } else if (key === 'backspace') {
      if (expression !== null) {
        const trimmedExpression = expression.trimEnd()
        if (/[+-]$/.test(trimmedExpression)) {
          updatePaymentExpression(null)
        } else {
          const updatedExpression = trimmedExpression.slice(0, -1)
          updatePaymentExpression(/[+-]/.test(updatedExpression) ? updatedExpression : null)
        }
        return
      }
      nextValue = current.length <= 1 ? '0' : current.slice(0, -1)
    } else if (key === '+' || key === '-') {
      if (expression === null) {
        updatePaymentExpression(`${current.replace(/\s+/g, '')} ${key} `)
        return
      }

      const pendingOperatorMatch = expression.match(/^(\d+(?:\.\d{0,2})?)\s*[+-]\s*$/)
      if (pendingOperatorMatch) {
        updatePaymentExpression(`${pendingOperatorMatch[1]} ${key} `)
      }
      return
    } else if (key === 'enter') {
      if (expression === null) {
        return
      }

      const match = expression.match(/^(\d+(?:\.\d{0,2})?)\s*([+-])\s*(\d+(?:\.\d{0,2})?)$/)
      if (!match) {
        return
      }

      const [, leftValue, operator, rightValue] = match
      const leftInCents = Math.round(Number(leftValue) * 100)
      const rightInCents = Math.round(Number(rightValue) * 100)
      const resultInCents = operator === '+'
        ? leftInCents + rightInCents
        : leftInCents - rightInCents

      if (
        !Number.isFinite(resultInCents) ||
        resultInCents < 0 ||
        resultInCents > 99999999999
      ) {
        return
      }

      setPaymentAmount(activePaymentMethod, formatPaymentAmountFromCents(resultInCents))
      updatePaymentExpression(null)
      return
    } else if (key === '.') {
      if (expression !== null) {
        const match = expression.match(/^(\d+(?:\.\d{0,2})?)\s*([+-])\s*(.*)$/)
        if (!match) {
          return
        }
        const [, leftValue, operator, rightValue] = match
        if (rightValue.includes('.')) return
        updatePaymentExpression(`${leftValue} ${operator} ${rightValue || '0'}.`)
        return
      } else {
        nextValue = current.includes('.') ? current : `${current}.`
      }
    } else {
      if (!/^\d$/.test(key)) return

      if (expression !== null) {
        const match = expression.match(/^(\d+(?:\.\d{0,2})?)\s*([+-])\s*(.*)$/)
        if (!match) {
          return
        }
        const [, leftValue, operator, rightValue] = match
        const decimals = rightValue.split('.')[1] || ''
        if (decimals.length >= 2) return
        const rightCandidate = rightValue === '0' ? key : `${rightValue}${key}`
        const numericValue = Number(rightCandidate)
        if (!Number.isFinite(numericValue) || numericValue > 999999999.99) return
        updatePaymentExpression(`${leftValue} ${operator} ${rightCandidate}`)
        return
      } else {
        const decimals = current.split('.')[1] || ''
        if (decimals.length >= 2) return
        const nextCandidate = current === '0' ? key : `${current}${key}`
        const numericValue = Number.parseFloat(nextCandidate)
        if (!Number.isFinite(numericValue) || numericValue > 999999999.99) return
        nextValue = nextCandidate
      }
    }

    setPaymentAmount(activePaymentMethod, nextValue)
  }

  function handleExactPayment() {
    if (!activePaymentMethod || activeEditableField) return
    updatePaymentExpression(null)

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
        displayValue={paymentDisplayValue}
        isExactDisabled={activePaymentMethod === null || activeEditableField !== null}
        onExactPayment={handleExactPayment}
        onKeypadPress={handleKeypadPress}
      />
    </div>
  )
}
