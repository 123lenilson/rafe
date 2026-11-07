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
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { toast } from 'sonner'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover'
import {
  POSCustomerSelector,
  type POSCustomer,
} from '@/features/pos/components/POSCustomerSelector'
import { POSDiscountEditor } from '@/features/pos/components/POSDiscountEditor'
import { usePOSCartStore } from '@/features/pos/stores/usePOSCartStore'
import {
  calculateMaximumDiscountInCents,
  formatKwanza,
  parseCartItemPriceInCents,
} from '@/features/pos/utils/posCartFormatters'

export type POSSummaryLink =
  | 'pos'
  | 'customer'
  | 'discount'
  | 'invoice-format'
  | 'cash-register'

interface POSSummaryNavigationProps {
  selectedLink: POSSummaryLink | null
  selectedCustomer: POSCustomer
  onSelectCustomer: (customer: POSCustomer) => void
  onSelectLink: Dispatch<SetStateAction<POSSummaryLink | null>>
  onOpenCashRegister: () => void
  totalIliquidoInCents: number
  discountEditRequest: number
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

export function POSSummaryNavigation({
  selectedLink,
  selectedCustomer,
  onSelectCustomer,
  onSelectLink,
  onOpenCashRegister,
  totalIliquidoInCents,
  discountEditRequest,
}: POSSummaryNavigationProps) {
  const navigate = useNavigate()
  const discount = usePOSCartStore((state) => state.discount)
  const setDiscount = usePOSCartStore((state) => state.setDiscount)
  const previousDiscountState = useRef({
    discount,
    totalIliquidoInCents,
  })
  const [selectedInvoiceFormat, setSelectedInvoiceFormat] = useState<string | null>('A4')
  const selectedInvoiceFormatLabel = invoiceFormats.find(
    (format) => format.value === selectedInvoiceFormat,
  )?.label
  const maximumDiscountInCents = calculateMaximumDiscountInCents(
    totalIliquidoInCents,
  )
  useEffect(() => {
    const previous = previousDiscountState.current
    const currentDiscountValue = discount?.type === 'money'
      ? parseCartItemPriceInCents(discount.value)
      : null
    const previousDiscountValue = previous.discount?.type === 'money'
      ? parseCartItemPriceInCents(previous.discount.value)
      : null

    if (
      totalIliquidoInCents > 0 &&
      previous.totalIliquidoInCents !== totalIliquidoInCents &&
      previousDiscountValue !== null &&
      (currentDiscountValue === null || currentDiscountValue < previousDiscountValue)
    ) {
      toast.warning('Limite de desconto actualizado', {
        description: `Só pode aplicar desconto até ${formatKwanza(maximumDiscountInCents)}`,
      })
    }

    previousDiscountState.current = { discount, totalIliquidoInCents }
  }, [discount, maximumDiscountInCents, totalIliquidoInCents])

  useEffect(() => {
    if (totalIliquidoInCents === 0 && selectedLink === 'discount') {
      onSelectLink(null)
    }
  }, [onSelectLink, selectedLink, totalIliquidoInCents])

  function getButtonClassName(link: POSSummaryLink) {
    const isDisabled = link === 'discount' && totalIliquidoInCents === 0
    const stateClassName = isDisabled
      ? 'cursor-not-allowed text-muted-foreground'
      : selectedLink === link
        ? 'bg-muted'
        : 'bg-transparent hover:bg-muted'
    return `${buttonClassName} ${stateClassName}`
  }

  function handlePopoverOpenChange(link: POSSummaryLink, open: boolean) {
    if (open) {
      onSelectLink(link)
    } else {
      onSelectLink((currentLink) => (currentLink === link ? null : currentLink))
    }
  }

  return (
    <nav
      aria-label="Resumo da operação POS"
      className="flex w-full items-center justify-center gap-6"
    >
      <Popover
        onOpenChange={(open) => handlePopoverOpenChange('pos', open)}
        open={selectedLink === 'pos'}
      >
        <PopoverTrigger asChild>
          <button
            aria-pressed={selectedLink === 'pos'}
            className={getButtonClassName('pos')}
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
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[25rem] overflow-hidden rounded-md border border-border bg-background p-0 shadow-sm"
          side="bottom"
          sideOffset={4}
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
        </PopoverContent>
      </Popover>
      <Popover
        onOpenChange={(open) => handlePopoverOpenChange('customer', open)}
        open={selectedLink === 'customer'}
      >
        <PopoverTrigger asChild>
          <button
            aria-pressed={selectedLink === 'customer'}
            className={getButtonClassName('customer')}
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
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[18.75rem] overflow-visible rounded-md border border-border bg-background p-0 shadow-sm"
          side="bottom"
          sideOffset={4}
        >
          <POSCustomerSelector
            onSelectCustomer={(customer) => {
              onSelectCustomer(customer)
              onSelectLink(null)
            }}
            selectedCustomer={selectedCustomer}
          />
        </PopoverContent>
      </Popover>
      <Popover
        onOpenChange={(open) => handlePopoverOpenChange('discount', open)}
        open={selectedLink === 'discount'}
      >
        <PopoverTrigger asChild>
          <button
            aria-pressed={selectedLink === 'discount'}
            className={getButtonClassName('discount')}
            disabled={totalIliquidoInCents === 0}
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
        </PopoverTrigger>
        <PopoverContent
          align="start"
          aria-label="Contentor de desconto"
          className="w-[18.75rem] rounded-md border border-border bg-background p-4 shadow-sm"
          side="bottom"
          sideOffset={4}
        >
            <POSDiscountEditor
              discount={discount}
              focusRequest={discountEditRequest}
              inputIdPrefix="invoice-discount"
              onApply={(nextDiscount) => {
                setDiscount(nextDiscount)
                onSelectLink(null)
              }}
              targetLabel="esta factura"
              totalIliquidoInCents={totalIliquidoInCents}
            />
        </PopoverContent>
      </Popover>
      <Popover
        onOpenChange={(open) => handlePopoverOpenChange('invoice-format', open)}
        open={selectedLink === 'invoice-format'}
      >
        <PopoverTrigger asChild>
          <button
            aria-pressed={selectedLink === 'invoice-format'}
            className={getButtonClassName('invoice-format')}
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
        </PopoverTrigger>
        <PopoverContent
          align="start"
          aria-label="Contentor do formato da factura"
          className="w-[18.75rem] rounded-md border border-border bg-background p-4 shadow-sm"
          side="bottom"
          sideOffset={4}
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
        </PopoverContent>
      </Popover>
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
