import {
  BadgePercent,
  FileText,
  Home,
  ShoppingCart,
  UserRound,
} from 'lucide-react'
import { faCashRegister } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import { useLayoutEffect, useRef, useState } from 'react'
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

export type POSSummaryLink = 'pos' | 'customer' | 'discount' | 'cash-register'

interface POSSummaryNavigationProps {
  selectedLink: POSSummaryLink | null
  onSelectLink: (link: POSSummaryLink) => void
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
export function POSSummaryNavigation({
  selectedLink,
  onSelectLink,
  onOpenCashRegister,
}: POSSummaryNavigationProps) {
  const navigate = useNavigate()
  const [selectedCustomer, setSelectedCustomer] =
    useState<POSCustomer>(defaultPOSCustomer)
  const [discountTab, setDiscountTab] = useState<'money' | 'percentage'>('money')
  const moneyInput = useRef<HTMLInputElement>(null)
  const percentageInput = useRef<HTMLInputElement>(null)

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
            onSelectCustomer={setSelectedCustomer}
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
                  <InputGroup className="h-9 rounded-md bg-background focus-within:shadow-[0_8px_24px_rgba(16,16,16,0.12)]">
                    <InputGroupInput aria-label="Desconto em dinheiro" className="h-full text-xs leading-4" ref={moneyInput} />
                    <InputGroupAddon align="inline-end">Kz</InputGroupAddon>
                  </InputGroup>
                  <div className="flex justify-end">
                    <Button type="button">Aplicar</Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent className="mt-0 w-full flex-none" value="percentage">
                <div className="flex flex-col gap-3 rounded-b-md rounded-tr-md bg-muted p-3">
                  <InputGroup className="h-9 rounded-md bg-background focus-within:shadow-[0_8px_24px_rgba(16,16,16,0.12)]">
                    <InputGroupInput aria-label="Desconto em porcentagem" className="h-full text-xs leading-4" ref={percentageInput} />
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
