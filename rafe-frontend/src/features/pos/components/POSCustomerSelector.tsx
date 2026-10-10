import { ArrowLeft, Check, Plus, Search, Settings, X } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/components/ui/input-group'
import { Input } from '@/shared/components/ui/input'
import { RippleButton } from '@/shared/components/ui/ripple-button'
import { Separator } from '@/shared/components/ui/separator'

export const defaultPOSCustomer = {
  name: 'Consumidor Final',
  nif: '50000000ABCD01',
}

const recentCustomers = [
  defaultPOSCustomer,
  { name: 'Cliente de exemplo 2', nif: '50000001EFGH02' },
  { name: 'Cliente de exemplo 3', nif: '50000002IJKL03' },
  { name: 'Cliente de exemplo 4', nif: '50000003MNOP04' },
  { name: 'Cliente de exemplo 5', nif: '50000004QRST05' },
  { name: 'Cliente de exemplo 6', nif: '50000005UVWX06' },
  { name: 'Cliente de exemplo 7', nif: '50000006YZAB07' },
  { name: 'Cliente de exemplo 8', nif: '50000007CDEF08' },
]

export type POSCustomer = (typeof recentCustomers)[number]

interface POSCustomerSelectorProps {
  selectedCustomer: POSCustomer
  onSelectCustomer: (customer: POSCustomer) => void
}

export function POSCustomerSelector({
  selectedCustomer,
  onSelectCustomer,
}: POSCustomerSelectorProps) {
  const [customerSearchTerm, setCustomerSearchTerm] = useState('')
  const customerSearchInput = useRef<HTMLInputElement>(null)
  const customerRows = useRef(new Map<string, HTMLButtonElement>())
  const previousCustomerTops = useRef(new Map<string, number>())
  const secondPhoneRow = useRef<HTMLDivElement>(null)
  const secondPhoneExit = useRef<Animation | null>(null)
  const [phoneFieldActive, setPhoneFieldActive] = useState(false)
  const [hasSecondPhone, setHasSecondPhone] = useState(false)
  const visibleCustomers = recentCustomers
    .filter((customer) =>
      `${customer.name} ${customer.nif}`
        .toLowerCase()
        .includes(customerSearchTerm.trim().toLowerCase()),
    )
    .sort((first, second) =>
      first.nif === selectedCustomer.nif
        ? -1
        : second.nif === selectedCustomer.nif
          ? 1
          : 0,
    )
    .slice(0, 6)

  useLayoutEffect(() => {
    customerSearchInput.current?.focus()
  }, [])

  useLayoutEffect(() => {
    if (!hasSecondPhone || !secondPhoneRow.current) return

    secondPhoneRow.current.animate(
      [{ transform: 'translateY(100%)' }, { transform: 'translateY(0%)' }],
      { duration: 200, easing: 'ease-out' },
    )
  }, [hasSecondPhone])

  useLayoutEffect(() => {
    const previousTops = previousCustomerTops.current
    if (previousTops.size === 0) return

    customerRows.current.forEach((row, nif) => {
      const previousTop = previousTops.get(nif)
      if (previousTop === undefined) return

      const movement = previousTop - row.getBoundingClientRect().top
      if (movement === 0) return

      row.animate(
        [
          { transform: `translateY(${movement}px)` },
          { transform: 'translateY(0)' },
        ],
        { duration: 200, easing: 'ease-in-out' },
      )
    })

    previousTops.clear()
  }, [selectedCustomer])

  function selectCustomer(customer: POSCustomer) {
    previousCustomerTops.current = new Map(
      Array.from(customerRows.current, ([nif, row]) => [
        nif,
        row.getBoundingClientRect().top,
      ]),
    )
    onSelectCustomer(customer)
  }

  function removeSecondPhone() {
    const row = secondPhoneRow.current
    if (!row || secondPhoneExit.current) return

    const animation = row.animate(
      [{ transform: 'translateY(0%)' }, { transform: 'translateY(100%)' }],
      { duration: 200, easing: 'ease-in', fill: 'forwards' },
    )
    secondPhoneExit.current = animation
    animation.onfinish = () => {
      secondPhoneExit.current = null
      setHasSecondPhone(false)
    }
  }

  return (
    <div
      className="absolute left-0 top-full z-20 mt-1 w-[18.75rem] rounded-md border border-border bg-background p-4 shadow-sm"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex flex-col gap-3">
        {visibleCustomers.length === 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                aria-label="Voltar à pesquisa de clientes"
                className="flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
                onClick={() => {
                  setCustomerSearchTerm('')
                  customerSearchInput.current?.focus()
                }}
                type="button"
              >
                <ArrowLeft aria-hidden="true" size="1rem" strokeWidth={1.75} />
              </button>
              <p className="text-[0.6875rem] leading-[0.875rem] text-muted-foreground">
                <span className="font-medium text-foreground underline">
                  Cliente não existe
                </span>
                <span>, Salvar como novo</span>
              </p>
            </div>
            <div>
              <button
                aria-label="Definições do cliente"
                className="flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
                type="button"
              >
                <Settings aria-hidden="true" size="1rem" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        )}
        <InputGroup className="h-9 rounded-md focus-within:shadow-[0_4px_12px_rgba(16,16,16,0.08)]">
          {visibleCustomers.length !== 0 && (
            <InputGroupAddon>
              <Search
                aria-hidden="true"
                className="text-muted-foreground"
                size="1rem"
                strokeWidth={1.75}
              />
            </InputGroupAddon>
          )}
          <InputGroupInput
            aria-label={visibleCustomers.length === 0 ? 'Nome do cliente' : 'Pesquisar cliente'}
            className={`h-full text-xs leading-4 placeholder:text-muted-foreground md:text-xs [&::-webkit-search-cancel-button]:brightness-0 ${visibleCustomers.length === 0 ? 'peer px-3 pb-0 pt-3 placeholder-transparent' : ''}`}
            id={visibleCustomers.length === 0 ? 'customer-name' : undefined}
            onChange={(event) => setCustomerSearchTerm(event.target.value)}
            placeholder={visibleCustomers.length === 0 ? ' ' : 'Informa o nome do cliente'}
            ref={customerSearchInput}
            type={visibleCustomers.length === 0 ? 'text' : 'search'}
            value={customerSearchTerm}
          />
          {visibleCustomers.length === 0 && (
            <label
              className="pointer-events-none absolute left-2 top-0 z-10 -translate-y-0 bg-background px-1 text-[0.5rem] leading-[0.625rem] text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-xs peer-focus:top-0 peer-focus:translate-y-0 peer-focus:text-[0.5rem]"
              htmlFor="customer-name"
            >
              Nome
            </label>
          )}
        </InputGroup>
        {visibleCustomers.length === 0 ? (
          <div className="flex flex-col gap-4">
            <InputGroup className="h-9 rounded-md focus-within:shadow-[0_4px_12px_rgba(16,16,16,0.08)]">
              <InputGroupInput aria-label="NIF do cliente" className="peer h-full px-3 pb-0 pt-3 text-xs leading-4 placeholder-transparent md:text-xs" id="customer-nif" placeholder=" " />
              <label className="pointer-events-none absolute left-2 top-0 z-10 -translate-y-0 bg-background px-1 text-[0.5rem] leading-[0.625rem] text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-xs peer-focus:top-0 peer-focus:translate-y-0 peer-focus:text-[0.5rem]" htmlFor="customer-nif">
                NIF
              </label>
            </InputGroup>
            <InputGroup
              className="h-9 rounded-md focus-within:shadow-[0_4px_12px_rgba(16,16,16,0.08)]"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setPhoneFieldActive(false)
                }
              }}
              onFocus={() => setPhoneFieldActive(true)}
            >
              <InputGroupInput aria-label="Telefone do cliente" className="peer h-full px-3 pb-0 pt-3 text-xs leading-4 placeholder-transparent md:text-xs" id="customer-phone" placeholder=" " />
              <label className="pointer-events-none absolute left-2 top-0 z-10 -translate-y-0 bg-background px-1 text-[0.5rem] leading-[0.625rem] text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-xs peer-focus:top-0 peer-focus:translate-y-0 peer-focus:text-[0.5rem]" htmlFor="customer-phone">
                Telefone
              </label>
              {phoneFieldActive && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Adicionar segundo telefone"
                    onClick={() => setHasSecondPhone(true)}
                    onMouseDown={(event) => event.preventDefault()}
                    size="icon-sm"
                    type="button"
                  >
                    <Plus aria-hidden="true" size="1rem" strokeWidth={1.75} />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>
            {hasSecondPhone && (
              <div ref={secondPhoneRow}>
                <InputGroup className="h-9 rounded-md focus-within:shadow-[0_4px_12px_rgba(16,16,16,0.08)]">
                  <InputGroupInput aria-label="Segundo telefone do cliente" className="peer h-full px-3 pb-0 pt-3 text-xs leading-4 placeholder-transparent md:text-xs" id="customer-phone-2" placeholder=" " />
                  <label className="pointer-events-none absolute left-2 top-0 z-10 -translate-y-0 bg-background px-1 text-[0.5rem] leading-[0.625rem] text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-xs peer-focus:top-0 peer-focus:translate-y-0 peer-focus:text-[0.5rem]" htmlFor="customer-phone-2">
                    Telefone 2
                  </label>
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      aria-label="Remover segundo telefone"
                      onClick={removeSecondPhone}
                      onMouseDown={(event) => event.preventDefault()}
                      size="icon-sm"
                      type="button"
                    >
                      <X aria-hidden="true" size="1rem" strokeWidth={1.75} />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            )}
            <InputGroup className="h-9 rounded-md focus-within:shadow-[0_4px_12px_rgba(16,16,16,0.08)]">
              <InputGroupInput aria-label="Endereço do cliente" className="peer h-full px-3 pb-0 pt-3 text-xs leading-4 placeholder-transparent md:text-xs" id="customer-address" placeholder=" " />
              <label className="pointer-events-none absolute left-2 top-0 z-10 -translate-y-0 bg-background px-1 text-[0.5rem] leading-[0.625rem] text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-xs peer-focus:top-0 peer-focus:translate-y-0 peer-focus:text-[0.5rem]" htmlFor="customer-address">
                Endereço
              </label>
            </InputGroup>
            <div className="flex justify-end">
              <RippleButton
                className="h-8 rounded-lg border-0 bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                rippleColor="#ffffff40"
                type="button"
              >
                Salvar Cliente
              </RippleButton>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <p className="text-[0.6875rem] leading-[0.875rem] text-muted-foreground">
                Recentes
              </p>
              <Separator className="h-px w-full bg-border" orientation="horizontal" />
            </div>
            <div className="flex flex-col gap-2">
              {visibleCustomers.map((customer) => {
                const isSelected = selectedCustomer.nif === customer.nif
                const initials = customer.name
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join('')
                  .toUpperCase()

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`relative flex w-full cursor-pointer items-center gap-2 rounded-[0.1875rem] p-2 text-left focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2 ${isSelected ? 'bg-muted' : 'bg-background'}`}
                    key={customer.nif}
                    onClick={() => selectCustomer(customer)}
                    ref={(row) => {
                      if (row) customerRows.current.set(customer.nif, row)
                      else customerRows.current.delete(customer.nif)
                    }}
                    type="button"
                  >
                    {isSelected && (
                      <span className="absolute right-0 top-0 flex size-3 items-center justify-center rounded-full bg-foreground text-background">
                        <Check aria-hidden="true" size="0.5rem" strokeWidth={2} />
                      </span>
                    )}
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-[0.1875rem] border border-border bg-muted text-[0.625rem] font-medium text-foreground">
                      {initials}
                    </span>
                    <span className="flex flex-col text-secondary-foreground">
                      <span className="text-xs font-medium tracking-wide">
                        {customer.name}
                      </span>
                      <span className="text-[0.625rem] leading-[0.75rem]">
                        {customer.nif}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
