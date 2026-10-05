import { Plus, Search, Settings, X } from 'lucide-react'
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
  const customerRows = useRef(new Map<string, HTMLLabelElement>())
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
            <p className="text-[0.6875rem] leading-[0.875rem] text-muted-foreground">
              <span className="font-medium text-foreground underline">
                Cliente não existe
              </span>
              <span>, Salvar como novo</span>
            </p>
            <button
              aria-label="Definições do cliente"
              className="flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
              type="button"
            >
              <Settings aria-hidden="true" size="1rem" strokeWidth={1.75} />
            </button>
          </div>
        )}
        <InputGroup className="h-9 rounded-md focus-within:shadow-[0_4px_12px_rgba(16,16,16,0.08)]">
          {visibleCustomers.length === 0 ? (
            <InputGroupAddon className="text-xs font-normal">Nome</InputGroupAddon>
          ) : (
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
            className="h-full text-xs leading-4 placeholder:text-muted-foreground md:text-xs [&::-webkit-search-cancel-button]:brightness-0"
            onChange={(event) => setCustomerSearchTerm(event.target.value)}
            placeholder={visibleCustomers.length === 0 ? '' : 'Informa o nome do cliente'}
            ref={customerSearchInput}
            type={visibleCustomers.length === 0 ? 'text' : 'search'}
            value={customerSearchTerm}
          />
        </InputGroup>
        {visibleCustomers.length === 0 ? (
          <div className="flex flex-col gap-4">
            <InputGroup className="h-9 rounded-md focus-within:shadow-[0_4px_12px_rgba(16,16,16,0.08)]">
              <InputGroupAddon className="text-xs font-normal">NIF</InputGroupAddon>
              <InputGroupInput aria-label="NIF do cliente" className="h-full text-xs leading-4 md:text-xs" />
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
              <InputGroupAddon className="text-xs font-normal">Telefone</InputGroupAddon>
              <InputGroupInput aria-label="Telefone do cliente" className="h-full text-xs leading-4 md:text-xs" />
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
                  <InputGroupAddon className="text-xs font-normal">Telefone 2</InputGroupAddon>
                  <InputGroupInput aria-label="Segundo telefone do cliente" className="h-full text-xs leading-4 md:text-xs" />
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
              <InputGroupAddon className="text-xs font-normal">Endereço</InputGroupAddon>
              <InputGroupInput aria-label="Endereço do cliente" className="h-full text-xs leading-4 md:text-xs" />
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
              {visibleCustomers.map((customer) => (
                <label
                  className="flex cursor-pointer items-center gap-2"
                  key={customer.nif}
                  ref={(row) => {
                    if (row) customerRows.current.set(customer.nif, row)
                    else customerRows.current.delete(customer.nif)
                  }}
                >
                  <input
                    aria-label={`Seleccionar ${customer.name}`}
                    checked={selectedCustomer.nif === customer.nif}
                    className="size-4 accent-foreground"
                    onChange={() => selectCustomer(customer)}
                    type="checkbox"
                  />
                  <span className="flex flex-col text-secondary-foreground">
                    <span className="text-xs font-medium tracking-wide">
                      {customer.name}
                    </span>
                    <span className="text-[0.625rem] leading-[0.75rem]">
                      {customer.nif}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
