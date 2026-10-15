import type { Ref } from 'react'

interface POSPaymentMethodListProps {
  methods: string[]
  visibleMethodCount: number
  paymentAmounts: Record<string, string>
  activePaymentMethod: string | null
  outstandingFormatted: string | null
  formatDisplayValue: (value: string) => string
  arePaymentMethodsExpanded: boolean
  hasMorePaymentMethods: boolean
  onSelectMethod: (method: string) => void
  onExpand: () => void
  onCollapse: () => void
  setMethodButtonRef: (method: string, button: HTMLButtonElement | null) => void
  moreButtonRef: Ref<HTMLButtonElement>
  expandedAreaRef: Ref<HTMLDivElement>
}

export function POSPaymentMethodList({
  methods,
  visibleMethodCount,
  paymentAmounts,
  activePaymentMethod,
  outstandingFormatted,
  formatDisplayValue,
  arePaymentMethodsExpanded,
  hasMorePaymentMethods,
  onSelectMethod,
  onExpand,
  onCollapse,
  setMethodButtonRef,
  moreButtonRef,
  expandedAreaRef,
}: POSPaymentMethodListProps) {
  function renderMethod(method: string) {
    const methodAmount = paymentAmounts[method]
    const hasValue = Boolean(methodAmount && methodAmount !== '0')
    const isActive = activePaymentMethod === method
    const isSelected = hasValue || isActive
    const displayedAmount = hasValue
      ? formatDisplayValue(methodAmount)
      : isActive || outstandingFormatted === null
        ? null
        : outstandingFormatted

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
        onClick={() => onSelectMethod(method)}
        ref={(button) => setMethodButtonRef(method, button)}
        type="button"
      >
        <span className="font-medium leading-none">{method}</span>
        {displayedAmount !== null && (
          <span className="mt-1 text-xs font-semibold leading-none opacity-95">
            {displayedAmount}
          </span>
        )}
      </button>
    )
  }

  return (
    <>
      {methods
        .slice(0, arePaymentMethodsExpanded ? methods.length : visibleMethodCount)
        .map(renderMethod)}
      {!arePaymentMethodsExpanded && hasMorePaymentMethods && (
        <button
          aria-expanded={false}
          className="inline-flex w-fit shrink-0 items-center rounded-sm bg-muted px-3 py-1 text-[0.6875rem] text-foreground focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
          onClick={onExpand}
          ref={moreButtonRef}
          type="button"
        >
          Ver mais
        </button>
      )}
      {arePaymentMethodsExpanded && (
        <div
          className="absolute inset-x-0 top-0 -m-2 rounded-md border border-border bg-background p-2"
          ref={expandedAreaRef}
        >
          <div className="flex flex-wrap gap-2">
            {methods.map(renderMethod)}
            <button
              aria-expanded={true}
              className="inline-flex w-fit shrink-0 items-center rounded-sm bg-muted px-3 py-1 text-[0.6875rem] text-foreground focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
              onClick={onCollapse}
              type="button"
            >
              Ver menos
            </button>
          </div>
        </div>
      )}
    </>
  )
}
