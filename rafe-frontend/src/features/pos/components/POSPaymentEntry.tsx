import { MonetaryDisplay } from '@/shared/components/MonetaryDisplay'
import { NumericKeypad } from '@/shared/components/NumericKeypad'
import { formatKwanza } from '@/features/pos/utils/posCartFormatters'

interface POSPaymentEntryProps {
  activePaymentMethod: string | null
  currentAmount: string
  changeInCents: number
  formatDisplayValue: (value: string) => string
  isExactDisabled: boolean
  onKeypadPress: (key: string) => void
  onExactPayment: () => void
}

export function POSPaymentEntry({
  activePaymentMethod,
  currentAmount,
  changeInCents,
  formatDisplayValue,
  isExactDisabled,
  onKeypadPress,
  onExactPayment,
}: POSPaymentEntryProps) {
  return (
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
          {formatKwanza(changeInCents)}
        </span>
      </div>
      <NumericKeypad
        clearKeyDisabled={isExactDisabled}
        clearKeyLabel="Ex"
        onClearKeyPress={onExactPayment}
        onKeyPress={onKeypadPress}
        showMathOperators={Boolean(activePaymentMethod)}
      />
    </div>
  )
}
