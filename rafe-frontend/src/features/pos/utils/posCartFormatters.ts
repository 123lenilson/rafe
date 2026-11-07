export function formatCartInputValue(value: string, allowDecimals: boolean) {
  const normalizedValue = value.replace(/[^\d.,]/g, '').replace(/\./g, ',')

  if (!allowDecimals) {
    return normalizedValue.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  const decimalSeparatorIndex = normalizedValue.indexOf(',')
  const integerPart = (decimalSeparatorIndex === -1
    ? normalizedValue
    : normalizedValue.slice(0, decimalSeparatorIndex)
  ).replace(/,/g, '')
  const decimalPart = decimalSeparatorIndex === -1
    ? ''
    : normalizedValue.slice(decimalSeparatorIndex + 1).replace(/\D/g, '').slice(0, 2)
  const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  return `${groupedInteger}${decimalSeparatorIndex === -1 ? '' : `,${decimalPart}`}`
}

export type POSCartQuantityError = 'zero' | 'exceeds-stock'

export function validatePOSCartQuantity(
  quantity: string,
  availableQuantity: number | null,
): POSCartQuantityError | null {
  const digits = quantity.replace(/\D/g, '')
  if (!digits) return null

  const quantityValue = Number(digits)
  if (quantityValue === 0) return 'zero'
  if (availableQuantity !== null && quantityValue > availableQuantity) {
    return 'exceeds-stock'
  }

  return null
}

export function formatCartLineTotal(
  unitPrice: string,
  quantity: string,
  discount: POSDiscount | null = null,
) {
  const [integerPart = '0', decimalPart = ''] = unitPrice.replace(/\s/g, '').split(',')
  const unitPriceInCents = Number(`${integerPart}${decimalPart.padEnd(2, '0').slice(0, 2)}`)
  const quantityValue = Number(quantity.replace(/\D/g, '')) || 0
  const totalInCents = discount
    ? calculateDiscountedCartItemTotalInCents(unitPrice, quantity, discount)
    : unitPriceInCents * quantityValue
  const totalInteger = String(Math.floor(totalInCents / 100))
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const totalDecimal = String(totalInCents % 100).padStart(2, '0')

  return `Kz ${totalInteger}${unitPrice.includes(',') ? `,${totalDecimal}` : ''}`
}

export function formatKwanza(cents: number) {
  const integerPart = String(Math.floor(cents / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  const decimalPart = String(cents % 100).padStart(2, '0')
  return `${integerPart},${decimalPart} Kz`
}

export function parseCartItemPriceInCents(unitPrice: string): number {
  const [integerPart = '0', decimalPart = ''] = unitPrice.replace(/\s/g, '').split(',')
  return Number(`${integerPart}${decimalPart.padEnd(2, '0').slice(0, 2)}`) || 0
}

function parsePaymentAmountInCents(amount: string): number {
  const [integerPart = '0', decimalPart = ''] = amount.replace(/[^\d.]/g, '').split('.')
  const wholeAmount = Number.parseInt(integerPart || '0', 10)
  const fractionalAmount = Number.parseInt(decimalPart.padEnd(2, '0').slice(0, 2), 10) || 0

  return Number.isFinite(wholeAmount) ? wholeAmount * 100 + fractionalAmount : 0
}

export function calculatePaymentTotalInCents(
  paymentAmounts: Record<string, string>,
) {
  return Object.values(paymentAmounts).reduce(
    (total, amount) => total + parsePaymentAmountInCents(amount),
    0,
  )
}

export function calculateRemainingPaymentInCents(
  totalDueInCents: number,
  paymentAmounts: Record<string, string>,
  excludedMethod?: string,
) {
  const otherPaymentsInCents = Object.entries(paymentAmounts).reduce(
    (total, [method, amount]) =>
      method === excludedMethod ? total : total + parsePaymentAmountInCents(amount),
    0,
  )

  return Math.max(0, totalDueInCents - otherPaymentsInCents)
}

export function formatPaymentAmountFromCents(cents: number) {
  const wholeAmount = Math.floor(cents / 100)
  const fractionalAmount = cents % 100

  if (fractionalAmount === 0) return String(wholeAmount)

  const decimalPart = String(fractionalAmount).padStart(2, '0').replace(/0$/, '')
  return `${wholeAmount}.${decimalPart}`
}

export type POSDiscountType = 'money' | 'percentage'

export interface POSDiscount {
  type: POSDiscountType
  value: string
}

export function getMaximumDiscountPercentage() {
  return 30
}

export function calculateMaximumDiscountInCents(totalIliquidoInCents: number) {
  return Math.floor(
    Math.max(0, totalIliquidoInCents) * getMaximumDiscountPercentage() / 100,
  )
}

export function calculatePOSCartItemNetInCents(
  item: { unitPrice: string; quantity: string },
) {
  const grossInCents =
    parseCartItemPriceInCents(item.unitPrice) *
    (Number(item.quantity.replace(/\D/g, '')) || 0)
  return Math.round(grossInCents / 1.14)
}

function calculateDiscountInCents(
  discount: POSDiscount | null,
  netInCents: number,
) {
  if (!discount || netInCents <= 0) return 0

  if (discount.type === 'percentage') {
    return Math.round(
      netInCents *
        Math.min(
          getMaximumDiscountPercentage() * 100,
          parseDiscountPercentageInBasisPoints(discount.value),
        ) /
        10000,
    )
  }

  return Math.min(
    parseCartItemPriceInCents(formatDiscountInputValue(discount.value, true)),
    calculateMaximumDiscountInCents(netInCents),
  )
}

function calculateDiscountedCartItemTotalInCents(
  unitPrice: string,
  quantity: string,
  discount: POSDiscount,
) {
  const netInCents = calculatePOSCartItemNetInCents({ unitPrice, quantity })
  const discountInCents = calculateDiscountInCents(discount, netInCents)
  const taxableBaseInCents = netInCents - discountInCents
  return taxableBaseInCents + Math.round(taxableBaseInCents * 0.14)
}

export function formatDiscountInputValue(
  value: string,
  groupThousands = false,
) {
  const normalizedValue = value
    .replace(/[^\d.,]/g, '')
    .replace(/\./g, ',')
  if (!normalizedValue) return ''

  const decimalSeparatorIndex = normalizedValue.indexOf(',')
  const integerPart = (decimalSeparatorIndex === -1
    ? normalizedValue
    : normalizedValue.slice(0, decimalSeparatorIndex)
  ).replace(/,/g, '').replace(/^0+(?=\d)/, '')
  const normalizedIntegerPart = integerPart || (decimalSeparatorIndex === -1 ? '' : '0')
  const decimalPart = decimalSeparatorIndex === -1
    ? ''
    : normalizedValue.slice(decimalSeparatorIndex + 1).replace(/\D/g, '').slice(0, 2)
  const formattedIntegerPart = groupThousands
    ? normalizedIntegerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    : normalizedIntegerPart

  return `${formattedIntegerPart}${decimalSeparatorIndex === -1 ? '' : `,${decimalPart}`}`
}

export function parseDiscountPercentageInBasisPoints(value: string) {
  const [integerPart = '0', decimalPart = ''] = value
    .replace(/\s/g, '')
    .replace(/\./g, ',')
    .split(',')
  const wholePercentage = Number.parseInt(integerPart || '0', 10)
  const fractionalPercentage = Number.parseInt(
    decimalPart.padEnd(2, '0').slice(0, 2),
    10,
  ) || 0

  return Number.isFinite(wholePercentage)
    ? wholePercentage * 100 + fractionalPercentage
    : 0
}

function formatDiscountPercentageInBasisPoints(value: number) {
  const wholePercentage = Math.floor(value / 100)
  const fractionalPercentage = value % 100
  if (fractionalPercentage === 0) return String(wholePercentage)

  const decimalPart = String(fractionalPercentage).padStart(2, '0').replace(/0$/, '')
  return `${wholePercentage},${decimalPart}`
}

export function normalizePOSDiscount(
  discount: POSDiscount | null,
  totalIliquidoInCents: number,
): POSDiscount | null {
  if (!discount || totalIliquidoInCents <= 0) return null

  if (discount.type === 'percentage') {
    const percentageInBasisPoints = parseDiscountPercentageInBasisPoints(
      formatDiscountInputValue(discount.value),
    )
    if (percentageInBasisPoints <= 0) return null
    return {
      ...discount,
      value: formatDiscountPercentageInBasisPoints(
        Math.min(
          getMaximumDiscountPercentage() * 100,
          percentageInBasisPoints,
        ),
      ),
    }
  }

  const maximumDiscountInCents = calculateMaximumDiscountInCents(
    totalIliquidoInCents,
  )
  const discountInCents = Math.min(
    parseCartItemPriceInCents(formatDiscountInputValue(discount.value, true)),
    maximumDiscountInCents,
  )
  if (discountInCents <= 0) return null

  return {
    ...discount,
    value: formatDiscountInputValue(
      formatPaymentAmountFromCents(discountInCents),
      true,
    ),
  }
}

export function calculateCartSummary(
  items: {
    unitPrice: string
    quantity: string
    discount?: POSDiscount | null
  }[],
  discount: POSDiscount | null = null,
) {
  const totalGrossInCents = items.reduce((acc, item) => {
    const unitPriceInCents = parseCartItemPriceInCents(item.unitPrice)
    const quantityValue = Number(item.quantity.replace(/\D/g, '')) || 0
    return acc + unitPriceInCents * quantityValue
  }, 0)

  const netBeforeProductDiscountInCents = totalGrossInCents === 0
    ? 0
    : Math.round(totalGrossInCents / 1.14)
  const productDiscountInCents = items.reduce((total, item) => {
    const itemNetInCents = calculatePOSCartItemNetInCents(item)
    return total + calculateDiscountInCents(item.discount ?? null, itemNetInCents)
  }, 0)
  const iliquidoBeforeDiscountInCents = Math.max(
    0,
    netBeforeProductDiscountInCents - productDiscountInCents,
  )

  if (iliquidoBeforeDiscountInCents === 0) {
    return {
      iliquidoFormatted: '0,00 Kz',
      impostoFormatted: '0,00 Kz',
      retencaoFormatted: '0,00 Kz',
      totalAPagarFormatted: '0,00 Kz',
      discountFormatted: '0,00 Kz',
      discountInCents: 0,
      productDiscountInCents,
      totalDiscountInCents: productDiscountInCents,
      discountValue: '',
      discountType: null,
      iliquidoInCents: 0,
      iliquidoBeforeDiscountInCents: 0,
      totalGrossInCents: 0,
      totalAPagarInCents: 0,
    }
  }

  const discountInCents = calculateDiscountInCents(
    discount,
    iliquidoBeforeDiscountInCents,
  )
  const taxableBaseInCents = iliquidoBeforeDiscountInCents - discountInCents
  const totalDiscountInCents = productDiscountInCents + discountInCents
  const originalImpostoInCents =
    totalGrossInCents - netBeforeProductDiscountInCents
  const impostoInCents = totalDiscountInCents === 0
    ? originalImpostoInCents
    : Math.round(taxableBaseInCents * 0.14)
  const retencaoInCents = 0
  const totalAPagarInCents = taxableBaseInCents + impostoInCents - retencaoInCents

  return {
    iliquidoFormatted: formatKwanza(iliquidoBeforeDiscountInCents),
    impostoFormatted: formatKwanza(impostoInCents),
    retencaoFormatted: formatKwanza(retencaoInCents),
    totalAPagarFormatted: formatKwanza(totalAPagarInCents),
    discountFormatted: formatKwanza(discountInCents),
    discountInCents,
    productDiscountInCents,
    totalDiscountInCents,
    discountValue: discount?.value ?? '',
    discountType: discount?.type ?? null,
    iliquidoInCents: iliquidoBeforeDiscountInCents,
    taxableBaseInCents,
    iliquidoBeforeDiscountInCents,
    totalGrossInCents,
    totalAPagarInCents,
  }
}
