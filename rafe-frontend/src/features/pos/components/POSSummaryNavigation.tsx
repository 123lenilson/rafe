import {
  BadgePercent,
  Check,
  FileText,
  Home,
  ShoppingCart,
  UserRound,
} from 'lucide-react'
import { faCashRegister } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import { useLayoutEffect, useRef, useState, type ChangeEvent } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/shared/components/ui/input-group'
import { Button } from '@/shared/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import {
  defaultPOSCustomer,
  POSCustomerSelector,
  type POSCustomer,
} from '@/features/pos/components/POSCustomerSelector'

export type POSSummaryLink =
  | 'pos'
  | 'customer'
  | 'discount'
  | 'invoice-format'
  | 'cash-register'

interface POSSummaryNavigationProps {
  selectedLink: POSSummaryLink | null
  onSelectLink: (link: POSSummaryLink | null) => void
  onOpenCashRegister: () => void
}

const buttonClassName =
  'min-w-0 cursor-pointer rounded-md px-2 py-1 text-left focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2'
const posNavigationItems = [
  { label: 'Home', icon: Home },
  { label: 'POS', icon: ShoppingCart, isActive: true },
  { label: 'Factura-Proforma', icon: FileText },
  { label: 'Factura', icon: FileText },
  { label: 'Orçamento', icon: FileText },
  { label: 'Nota de Crédito', icon: FileText },
  { label: 'Recibo', icon: FileText },
]
const invoiceFormats = [
  { value: 'A4', label: 'A4', dimensions: '210 x 297 mm', kind: 'sheet' },
  { value: 'A4-right', label: 'A4 Direito', kind: 'sheet' },
  { value: '80mm', label: '80mm', kind: 'roll' },
  { value: '80mm-right', label: '80mm Direito', kind: 'roll' },
  { value: '58mm', label: '58mm', kind: 'roll' },
  { value: '58mm-right', label: '58mm Direito', kind: 'roll' },
] as const

function formatDiscountInputValue(value: string, allowDecimals: boolean) {
  const normalizedValue = value
    .replace(/[^\d.,]/g, '')
    .replace(/\./g, ',')
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

function handleDiscountInputChange(
  event: ChangeEvent<HTMLInputElement>,
  setValue: (value: string) => void,
  allowDecimals: boolean,
) {
  const input = event.currentTarget
  const cursorPosition = input.selectionStart ?? input.value.length
  const valueBeforeCursor = input.value.slice(0, cursorPosition)
  const digitsBeforeCursor = valueBeforeCursor.replace(/\D/g, '').length
  const decimalSeparatorBeforeCursor = allowDecimals && /[.,]/.test(valueBeforeCursor)
  const formattedValue = formatDiscountInputValue(input.value, allowDecimals)

  setValue(formattedValue)

  requestAnimationFrame(() => {
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

export function POSSummaryNavigation({
  selectedLink,
  onSelectLink,
  onOpenCashRegister,
}: POSSummaryNavigationProps) {
  const navigate = useNavigate()
  const [selectedCustomer, setSelectedCustomer] =
    useState<POSCustomer>(defaultPOSCustomer)
  const [discountTab, setDiscountTab] = useState<'money' | 'percentage'>('money')
  const [moneyDiscount, setMoneyDiscount] = useState('')
  const [percentageDiscount, setPercentageDiscount] = useState('')
  const [selectedInvoiceFormat, setSelectedInvoiceFormat] = useState<string | null>('A4')
  const moneyInput = useRef<HTMLInputElement>(null)
  const percentageInput = useRef<HTMLInputElement>(null)
  const selectedInvoiceFormatLabel = invoiceFormats.find(
    (format) => format.value === selectedInvoiceFormat,
  )?.label

  useLayoutEffect(() => {
    if (selectedLink !== 'discount') return

    const input = discountTab === 'money' ? moneyInput.current : percentageInput.current
    input?.focus()
  }, [selectedLink, discountTab])

  function getButtonClassName(link: POSSummaryLink) {
    return `${buttonClassName} ${selectedLink === link ? 'bg-muted' : 'bg-transparent hover:bg-muted'}`
  }

  return (
    <nav
      aria-label="Resumo da operação POS"
      className="flex w-full items-center justify-center gap-6"
    >
      <div className="relative">
        <button
          aria-pressed={selectedLink === 'pos'}
          className={getButtonClassName('pos')}
          onClick={(event) => {
            event.stopPropagation()
            onSelectLink('pos')
          }}
          type="button"
        >
          <p className="inline-flex items-center gap-1 font-medium text-foreground text-[0.6875rem] leading-[0.75rem]">
            <ShoppingCart aria-hidden="true" size="0.6875rem" strokeWidth={1.75} />
            POS
          </p>
          <p className="text-muted-foreground text-[0.625rem] leading-[0.75rem]">
            Página Activa
          </p>
        </button>
        {selectedLink === 'pos' && (
          <div
            className="absolute left-0 top-full z-20 mt-1 w-[25rem] overflow-hidden rounded-md border border-border bg-background shadow-sm"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex">
              <nav
                aria-label="Navegação do POS"
                className="flex shrink-0 flex-col gap-1.5 bg-sidebar pl-2 pr-6 py-6"
              >
                {posNavigationItems.map((item) => (
                  <button
                    aria-current={item.isActive ? 'page' : undefined}
                    className={`inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-sm px-2 py-2 text-left text-xs text-foreground hover:bg-border focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2 ${item.isActive ? 'bg-border font-medium' : ''}`}
                    key={item.label}
                    onClick={item.label === 'Home' ? () => navigate('/dashboard') : undefined}
                    type="button"
                  >
                    <item.icon aria-hidden="true" size="1rem" strokeWidth={1.75} />
                    {item.label}
                  </button>
                ))}
              </nav>
              <div aria-label="Área de conteúdo do POS" className="min-w-0 flex-1" />
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        <button
          aria-pressed={selectedLink === 'customer'}
          className={getButtonClassName('customer')}
          onClick={(event) => {
            event.stopPropagation()
            onSelectLink('customer')
          }}
          type="button"
        >
          <p className="inline-flex items-center gap-1 font-medium text-foreground text-[0.6875rem] leading-[0.75rem]">
            <UserRound aria-hidden="true" size="0.6875rem" strokeWidth={1.75} />
          {selectedCustomer.name}
          </p>
          <p className="text-muted-foreground text-[0.625rem] leading-[0.75rem]">
            Cliente Selecionado
          </p>
        </button>
        {selectedLink === 'customer' && (
          <POSCustomerSelector
            onSelectCustomer={(customer) => {
              setSelectedCustomer(customer)
              onSelectLink(null)
            }}
            selectedCustomer={selectedCustomer}
          />
        )}
      </div>
      <div className="relative">
        <button
          aria-pressed={selectedLink === 'discount'}
          className={getButtonClassName('discount')}
          onClick={(event) => {
            event.stopPropagation()
            onSelectLink('discount')
          }}
          type="button"
        >
          <p className="inline-flex items-center gap-1 font-medium text-foreground text-[0.6875rem] leading-[0.75rem]">
            <BadgePercent aria-hidden="true" size="0.6875rem" strokeWidth={1.75} />
            0% de desc.
          </p>
          <p className="text-muted-foreground text-[0.625rem] leading-[0.75rem]">
            Desconto na factura
          </p>
        </button>
        {selectedLink === 'discount' && (
          <div
            aria-label="Contentor de desconto"
            className="absolute left-0 top-full z-20 mt-1 w-[18.75rem] rounded-md border border-border bg-background p-4 shadow-sm"
            onClick={(event) => event.stopPropagation()}
          >
            <Tabs
              className="flex w-full flex-col gap-0"
              onValueChange={(value) => {
                setDiscountTab(value as 'money' | 'percentage')
              }}
              value={discountTab}
            >
              <TabsList className="w-fit rounded-t-md rounded-br-none rounded-bl-none bg-muted" variant="default">
                <TabsTrigger
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                  onClick={() => {
                    if (discountTab === 'money') moneyInput.current?.focus()
                  }}
                  value="money"
                >
                  Dinheiro
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                  onClick={() => {
                    if (discountTab === 'percentage') percentageInput.current?.focus()
                  }}
                  value="percentage"
                >
                  Porcento
                </TabsTrigger>
              </TabsList>
              <TabsContent className="mt-0 w-full flex-none" value="money">
                <div className="flex flex-col gap-3 rounded-b-md rounded-tr-md bg-muted p-3">
                  <label className="text-[0.625rem] leading-3 text-muted-foreground" htmlFor="discount-money">
                    Informa o valor do desconto em kwanza
                  </label>
                  <InputGroup className="h-9 rounded-md bg-background focus-within:shadow-[0_8px_24px_rgba(16,16,16,0.12)]">
                    <InputGroupInput
                      aria-label="Desconto em dinheiro"
                      className="h-full text-xs leading-4"
                      id="discount-money"
                      inputMode="decimal"
                      onChange={(event) => handleDiscountInputChange(event, setMoneyDiscount, true)}
                      ref={moneyInput}
                      type="text"
                      value={moneyDiscount}
                    />
                    <InputGroupAddon align="inline-end">Kz</InputGroupAddon>
                  </InputGroup>
                  <div className="flex justify-end">
                    <Button type="button">Aplicar</Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent className="mt-0 w-full flex-none" value="percentage">
                <div className="flex flex-col gap-3 rounded-b-md rounded-tr-md bg-muted p-3">
                  <label className="text-[0.625rem] leading-3 text-muted-foreground" htmlFor="discount-percentage">
                    Informa o valor do desconto em Percentagem
                  </label>
                  <InputGroup className="h-9 rounded-md bg-background focus-within:shadow-[0_8px_24px_rgba(16,16,16,0.12)]">
                    <InputGroupInput
                      aria-label="Desconto em porcentagem"
                      className="h-full text-xs leading-4"
                      id="discount-percentage"
                      inputMode="decimal"
                      onChange={(event) => handleDiscountInputChange(event, setPercentageDiscount, false)}
                      ref={percentageInput}
                      type="text"
                      value={percentageDiscount}
                    />
                    <InputGroupAddon align="inline-end">%</InputGroupAddon>
                  </InputGroup>
                  <div className="flex justify-end">
                    <Button type="button">Aplicar</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
      <div className="relative">
        <button
          aria-pressed={selectedLink === 'invoice-format'}
          className={getButtonClassName('invoice-format')}
          onClick={(event) => {
            event.stopPropagation()
            onSelectLink('invoice-format')
          }}
          type="button"
        >
          <p className="inline-flex items-center gap-1 font-medium text-foreground text-[0.6875rem] leading-[0.75rem]">
            <FileText aria-hidden="true" size="0.6875rem" strokeWidth={1.75} />
            Formato {selectedInvoiceFormatLabel ?? 'A4'}
          </p>
          <p className="text-muted-foreground text-[0.625rem] leading-[0.75rem]">
            Formato da Factura
          </p>
        </button>
        {selectedLink === 'invoice-format' && (
          <div
            aria-label="Contentor do formato da factura"
            className="absolute left-0 top-full z-20 mt-1 w-[18.75rem] rounded-md border border-border bg-background p-4 shadow-sm"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="mb-3 text-[0.625rem] leading-3 text-secondary-foreground">
              {selectedInvoiceFormatLabel
                ? `O formato da folha para imprimir a factura é ${selectedInvoiceFormatLabel}.`
                : 'Seleciona o formato da folha para imprimir a factura.'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {invoiceFormats.map((format) => {
                const isSelected = selectedInvoiceFormat === format.value

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`relative flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-[0.1875rem] border focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2 ${isSelected ? 'border-foreground bg-muted' : 'border-border bg-background'}`}
                    key={format.value}
                    onClick={() => {
                      setSelectedInvoiceFormat(format.value)
                      onSelectLink(null)
                    }}
                    type="button"
                  >
                    {isSelected && (
                      <span className="absolute right-0 top-0 flex size-3 items-center justify-center rounded-full bg-foreground text-background">
                        <Check aria-hidden="true" size="0.5rem" strokeWidth={2} />
                      </span>
                    )}
                    <svg
                      aria-hidden="true"
                      className="size-8 text-secondary-foreground"
                      fill="none"
                      viewBox="0 0 40 40"
                    >
                      {format.kind === 'sheet' ? (
                        <>
                          <path
                            d="M11 4.5h12l7 7v24H11z"
                            stroke="currentColor"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M23 4.5v7h7"
                            stroke="currentColor"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M15 19h11M15 23h11M15 27h11"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="1.5"
                          />
                        </>
                      ) : (
                        <>
                          <path
                            d="M13 4.5h14v27l-2 2-2-2-2 2-2-2-2 2-2-2-2 2z"
                            stroke="currentColor"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M16 12h8M16 16h8M16 20h8M16 24h8"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="1.5"
                          />
                        </>
                      )}
                    </svg>
                    <span className="text-[0.625rem] font-medium leading-3 text-foreground">
                      {format.label}
                    </span>
                    {format.dimensions && (
                      <span className="text-[0.5rem] leading-[0.625rem] text-secondary-foreground">
                        {format.dimensions}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
      <button
        aria-pressed={selectedLink === 'cash-register'}
        className={getButtonClassName('cash-register')}
        onClick={(event) => {
          event.stopPropagation()
          onSelectLink('cash-register')
          onOpenCashRegister()
        }}
        type="button"
      >
        <p className="inline-flex items-center gap-1 font-medium text-foreground text-[0.6875rem] leading-[0.75rem]">
          <FontAwesomeIcon aria-hidden="true" icon={faCashRegister} style={{ fontSize: '0.6875rem' }} />
          Aberto a 00:00:00
        </p>
        <p className="text-muted-foreground text-[0.625rem] leading-[0.75rem]">
          Tempo do caixa aberto
        </p>
      </button>
    </nav>
  )
}
