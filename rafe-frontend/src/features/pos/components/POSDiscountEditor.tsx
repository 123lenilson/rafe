import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/shared/components/ui/input-group'
import { Button } from '@/shared/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import {
  calculateMaximumDiscountInCents,
  formatDiscountInputValue,
  formatKwanza,
  formatPaymentAmountFromCents,
  getMaximumDiscountPercentage,
  parseCartItemPriceInCents,
  parseDiscountPercentageInBasisPoints,
  type POSDiscount,
  type POSDiscountType,
} from '@/features/pos/utils/posCartFormatters'

interface POSDiscountEditorProps {
  discount: POSDiscount | null
  totalIliquidoInCents: number
  inputIdPrefix: string
  targetLabel: string
  focusRequest?: number
  onApply: (discount: POSDiscount) => void
}

function handleDiscountInputChange(
  event: ChangeEvent<HTMLInputElement>,
  setValue: (value: string) => void,
  type: POSDiscountType,
  maxValue: number,
  warningState: { current: boolean },
) {
  const input = event.currentTarget
  const cursorPosition = input.selectionStart ?? input.value.length
  const valueBeforeCursor = input.value.slice(0, cursorPosition)
  const digitsBeforeCursor = valueBeforeCursor.replace(/\D/g, '').length
  const decimalSeparatorBeforeCursor = /[.,]/.test(valueBeforeCursor)
  const isMoney = type === 'money'
  const normalizedValue = formatDiscountInputValue(input.value, isMoney)
  const enteredValue = isMoney
    ? parseCartItemPriceInCents(normalizedValue)
    : parseDiscountPercentageInBasisPoints(normalizedValue)
  const isOverLimit = enteredValue > maxValue
  const formattedValue = isOverLimit
    ? isMoney
      ? formatDiscountInputValue(formatPaymentAmountFromCents(maxValue), true)
      : formatDiscountInputValue(String(maxValue / 100))
    : normalizedValue

  if (isOverLimit) {
    if (!warningState.current) {
      toast.warning('Limite de desconto', {
        description: isMoney
          ? `Só pode aplicar desconto até ${formatKwanza(maxValue)}`
          : `Só pode aplicar desconto até ${getMaximumDiscountPercentage()}%`,
      })
    }
    warningState.current = true
  } else {
    warningState.current = false
  }

  setValue(formattedValue)

  requestAnimationFrame(() => {
    if (isOverLimit) {
      input.setSelectionRange(0, formattedValue.length)
      return
    }

    let nextCursorPosition = 0
    let digitsAtCursor = 0
    let decimalSeparatorAtCursor = false

    while (
      nextCursorPosition < formattedValue.length &&
      (digitsAtCursor < digitsBeforeCursor ||
        (decimalSeparatorBeforeCursor && !decimalSeparatorAtCursor))
    ) {
      const character = formattedValue[nextCursorPosition]
      if (/\d/.test(character)) digitsAtCursor += 1
      if (character === ',') decimalSeparatorAtCursor = true
      nextCursorPosition += 1
    }

    input.setSelectionRange(nextCursorPosition, nextCursorPosition)
  })
}

export function POSDiscountEditor({
  discount,
  totalIliquidoInCents,
  inputIdPrefix,
  targetLabel,
  focusRequest = 0,
  onApply,
}: POSDiscountEditorProps) {
  const [discountTab, setDiscountTab] = useState<POSDiscountType>(
    discount?.type ?? 'money',
  )
  const [discountDraft, setDiscountDraft] = useState(discount?.value ?? '')
  const warningShown = useRef(false)
  const moneyInput = useRef<HTMLInputElement>(null)
  const percentageInput = useRef<HTMLInputElement>(null)
  const moneyInputId = `${inputIdPrefix}-money`
  const percentageInputId = `${inputIdPrefix}-percentage`
  const maximumDiscountInCents = calculateMaximumDiscountInCents(
    totalIliquidoInCents,
  )
  const maximumPercentageInBasisPoints = getMaximumDiscountPercentage() * 100
  const draftValue = discountTab === 'money'
    ? parseCartItemPriceInCents(discountDraft)
    : parseDiscountPercentageInBasisPoints(discountDraft)
  const canApplyDiscount = discountDraft !== '' && draftValue > 0

  useEffect(() => {
    setDiscountTab(discount?.type ?? 'money')
    setDiscountDraft(discount?.value ?? '')
  }, [discount?.type, discount?.value])

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const input = discountTab === 'money'
        ? moneyInput.current
        : percentageInput.current
      input?.focus()
    })
    return () => cancelAnimationFrame(frameId)
  }, [discountTab])

  useEffect(() => {
    if (focusRequest === 0 || !discount) return

    const frameId = requestAnimationFrame(() => {
      const input = discount.type === 'money'
        ? moneyInput.current
        : percentageInput.current
      input?.focus()
      input?.select()
    })
    return () => cancelAnimationFrame(frameId)
  }, [discount, focusRequest])

  function applyDiscount() {
    if (!canApplyDiscount) return
    onApply({ type: discountTab, value: discountDraft })
  }

  return (
    <Tabs
      className="flex w-full flex-col gap-0"
      onValueChange={(value) => {
        setDiscountTab(value as POSDiscountType)
        setDiscountDraft('')
        warningShown.current = false
      }}
      value={discountTab}
    >
      <TabsList className="w-fit rounded-t-md rounded-br-none rounded-bl-none bg-muted" variant="default">
        <TabsTrigger
          className="data-[state=active]:bg-background data-[state=active]:text-foreground"
          onClick={() => moneyInput.current?.focus()}
          value="money"
        >
          Dinheiro
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-background data-[state=active]:text-foreground"
          onClick={() => percentageInput.current?.focus()}
          value="percentage"
        >
          Porcento
        </TabsTrigger>
      </TabsList>
      <TabsContent className="mt-0 w-full flex-none" value="money">
        <div className="flex flex-col gap-3 rounded-b-md rounded-tr-md bg-muted p-3">
          <label
            className="text-[0.625rem] leading-3 text-muted-foreground"
            htmlFor={moneyInputId}
          >
            Limite para {targetLabel}: até {formatKwanza(maximumDiscountInCents)}
          </label>
          <InputGroup className="h-9 rounded-md bg-background focus-within:shadow-[0_8px_24px_rgba(16,16,16,0.12)]">
            <InputGroupInput
              aria-label={`Desconto em dinheiro para ${targetLabel}`}
              className="h-full text-xs leading-4"
              id={moneyInputId}
              inputMode="decimal"
              onKeyDown={(event) => {
                if (event.key === 'Enter' && canApplyDiscount) {
                  event.preventDefault()
                  applyDiscount()
                }
              }}
              onChange={(event) =>
                handleDiscountInputChange(
                  event,
                  setDiscountDraft,
                  'money',
                  maximumDiscountInCents,
                  warningShown,
                )
              }
              ref={moneyInput}
              type="text"
              value={discountDraft}
            />
            <InputGroupAddon align="inline-end">Kz</InputGroupAddon>
          </InputGroup>
          <div className="flex justify-end">
            <Button disabled={!canApplyDiscount} onClick={applyDiscount} type="button">
              Aplicar
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent className="mt-0 w-full flex-none" value="percentage">
        <div className="flex flex-col gap-3 rounded-b-md rounded-tr-md bg-muted p-3">
          <label
            className="text-[0.625rem] leading-3 text-muted-foreground"
            htmlFor={percentageInputId}
          >
            Limite permitido: até {getMaximumDiscountPercentage()}%
          </label>
          <InputGroup className="h-9 rounded-md bg-background focus-within:shadow-[0_8px_24px_rgba(16,16,16,0.12)]">
            <InputGroupInput
              aria-label={`Desconto em porcentagem para ${targetLabel}`}
              className="h-full text-xs leading-4"
              id={percentageInputId}
              inputMode="decimal"
              onKeyDown={(event) => {
                if (event.key === 'Enter' && canApplyDiscount) {
                  event.preventDefault()
                  applyDiscount()
                }
              }}
              onChange={(event) =>
                handleDiscountInputChange(
                  event,
                  setDiscountDraft,
                  'percentage',
                  maximumPercentageInBasisPoints,
                  warningShown,
                )
              }
              ref={percentageInput}
              type="text"
              value={discountDraft}
            />
            <InputGroupAddon align="inline-end">%</InputGroupAddon>
          </InputGroup>
          <div className="flex justify-end">
            <Button disabled={!canApplyDiscount} onClick={applyDiscount} type="button">
              Aplicar
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
