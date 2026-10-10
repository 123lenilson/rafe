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

export function formatCartLineTotal(unitPrice: string, quantity: string) {
  const [integerPart = '0', decimalPart = ''] = unitPrice.replace(/\s/g, '').split(',')
  const unitPriceInCents = Number(`${integerPart}${decimalPart.padEnd(2, '0').slice(0, 2)}`)
  const quantityValue = Number(quantity.replace(/\D/g, '')) || 0
  const totalInCents = unitPriceInCents * quantityValue
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

export function calculateCartSummary(items: { unitPrice: string; quantity: string }[]) {
  const totalGrossInCents = items.reduce((acc, item) => {
    const unitPriceInCents = parseCartItemPriceInCents(item.unitPrice)
    const quantityValue = Number(item.quantity.replace(/\D/g, '')) || 0
    return acc + unitPriceInCents * quantityValue
  }, 0)

  if (totalGrossInCents === 0) {
    return {
      iliquidoFormatted: '0,00 Kz',
      impostoFormatted: '0,00 Kz',
      retencaoFormatted: '0,00 Kz',
      totalAPagarFormatted: '0,00 Kz',
      totalGrossInCents: 0,
    }
  }

  const iliquidoInCents = Math.round(totalGrossInCents / 1.14)
  const impostoInCents = totalGrossInCents - iliquidoInCents
  const retencaoInCents = 0
  const totalAPagarInCents = totalGrossInCents - retencaoInCents

  return {
    iliquidoFormatted: formatKwanza(iliquidoInCents),
    impostoFormatted: formatKwanza(impostoInCents),
    retencaoFormatted: formatKwanza(retencaoInCents),
    totalAPagarFormatted: formatKwanza(totalAPagarInCents),
    totalGrossInCents,
  }
}

