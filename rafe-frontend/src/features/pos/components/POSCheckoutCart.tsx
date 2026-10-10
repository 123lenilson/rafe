import { useEffect, useState, type ChangeEvent } from 'react'
import { ShoppingCart, X } from 'lucide-react'
import { POSProductIllustration } from '@/features/pos/components/POSProductGrid'
import { usePOSCartStore, type POSCartItem } from '@/features/pos/stores/usePOSCartStore'
import {
  calculateCartSummary,
  formatCartInputValue,
  formatCartLineTotal,
} from '@/features/pos/utils/posCartFormatters'
import {
  InputGroup,
  InputGroupInput,
} from '@/shared/components/ui/input-group'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'

function handleCartInputChange(
  event: ChangeEvent<HTMLInputElement>,
  setValue: (value: string) => void,
  allowDecimals: boolean,
) {
  const input = event.currentTarget
  const cursorPosition = input.selectionStart ?? input.value.length
  const valueBeforeCursor = input.value.slice(0, cursorPosition)
  const digitsBeforeCursor = valueBeforeCursor.replace(/\D/g, '').length
  const decimalSeparatorBeforeCursor = allowDecimals && /[.,]/.test(valueBeforeCursor)
  const formattedValue = formatCartInputValue(input.value, allowDecimals)

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

export function POSCheckoutCart() {
  const cartItems = usePOSCartStore((state) => state.items)
  const lastAddedId = usePOSCartStore((state) => state.lastAddedId)
  const lastAddedAt = usePOSCartStore((state) => state.lastAddedAt)
  const setActiveEditableField = usePOSCartStore(
    (state) => state.setActiveEditableField,
  )
  const updateQuantity = usePOSCartStore((state) => state.updateQuantity)
  const updateUnitPrice = usePOSCartStore((state) => state.updateUnitPrice)
  const removeProduct = usePOSCartStore((state) => state.removeProduct)
  const clearCart = usePOSCartStore((state) => state.clearCart)
  const [itemPendingRemoval, setItemPendingRemoval] = useState<POSCartItem | null>(null)
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false)

  function handleEditableFieldSelection(
    input: HTMLInputElement,
    itemId: string,
    field: 'quantity' | 'unitPrice',
  ) {
    setActiveEditableField({ itemId, field })
    input.select()
  }

  function handleConfirmRemoval() {
    if (itemPendingRemoval) {
      removeProduct(itemPendingRemoval.id)
      setItemPendingRemoval(null)
    }
  }

  function handleConfirmClearCart() {
    clearCart()
    setIsClearCartModalOpen(false)
  }

  const summary = calculateCartSummary(cartItems)

  useEffect(() => {
    if (!lastAddedId || !lastAddedAt) return

    const frameId = requestAnimationFrame(() => {
      const quantityInput = document.getElementById(
        `cart-quantity-${lastAddedId}`,
      ) as HTMLInputElement | null

      if (quantityInput) {
        quantityInput.focus()
        quantityInput.select()
      }
    })

    return () => cancelAnimationFrame(frameId)
  }, [lastAddedId, lastAddedAt])

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <section
        aria-label="Cliente seleccionado"
        className="shrink-0 rounded-md bg-muted p-1"
      >
        <div className="flex min-w-0 items-start gap-2">
          <span className="flex shrink-0 self-stretch items-center rounded-sm bg-border px-2 py-1 text-[0.625rem] font-semibold leading-3 tracking-wider text-foreground">
            LP
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium leading-4 text-foreground">
              Lenilson Pascoal
            </p>
            <div className="mt-1 flex items-center gap-2 whitespace-nowrap text-[0.625rem] leading-3 text-secondary-foreground">
              <span className="flex min-w-0 items-center gap-1">
                <span>Tel:</span>
                <span>9252157</span>
              </span>
              <span className="flex min-w-0 items-center gap-1">
                <span>NIF:</span>
                <span>007121388LA042</span>
              </span>
            </div>
          </div>
        </div>
      </section>
      <div aria-hidden="true" className="-mx-2 h-px bg-muted" />
      <div
        className="grid min-h-0 flex-1 gap-2"
        style={{ gridTemplateRows: '80fr 20fr' }}
      >
        <section
          aria-label="Área do carrinho"
          className="flex min-h-0 items-center justify-center rounded-md"
        >
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <ShoppingCart aria-hidden="true" size="1.25rem" strokeWidth={1.75} />
              <p className="text-xs">Carrinho vazio</p>
            </div>
          ) : (
            <div className="flex h-full w-full min-h-0 flex-col gap-1 self-stretch">
              <div className="flex shrink-0 items-center justify-end">
                <button
                  aria-label="Limpar carrinho"
                  className="bg-transparent p-0 text-[0.625rem] font-medium text-[#EF4444] transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
                  onClick={() => setIsClearCartModalOpen(true)}
                  type="button"
                >
                  Limpar Carrinho
                </button>
              </div>
              <div className="rafe-table-scroll flex min-h-0 w-full flex-col gap-1 self-stretch overflow-y-auto bg-border">
                {cartItems.map((item) => (
                <article
                  className="flex min-w-0 items-start gap-2 rounded-md bg-muted p-1"
                  key={item.id}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-border">
                    <POSProductIllustration className="h-5 w-5 text-secondary-foreground" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="relative flex min-w-0 items-start gap-2 pr-8">
                      <span className="min-w-0 flex-1 text-[0.6875rem] font-medium leading-[0.875rem] text-foreground">
                        {item.name} × {item.quantity || '0'}
                      </span>
                      <span className="shrink-0 text-[0.6875rem] font-medium leading-[0.875rem] text-foreground">
                        {formatCartLineTotal(item.unitPrice, item.quantity)}
                      </span>
                      <button
                        aria-label={`Remover ${item.name} do carrinho`}
                        className="absolute -top-2 right-0 flex h-8 w-8 shrink-0 items-center justify-center text-secondary-foreground focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
                        onClick={() =>
                          setItemPendingRemoval(item)
                        }
                        type="button"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background">
                          <X aria-hidden="true" size="0.75rem" strokeWidth={1.75} />
                        </span>
                      </button>
                    </div>
                    <div className="mt-1 flex w-fit gap-1.5">
                      <InputGroup className="h-7 w-16 rounded-[0.1875rem] border-border bg-background">
                        <span className="pointer-events-none absolute left-0 top-0 text-[0.5rem] leading-[0.625rem] text-secondary-foreground">
                          Qtd
                        </span>
                        <InputGroupInput
                          aria-label={`Quantidade de ${item.name}`}
                          className="absolute inset-0 h-full w-full appearance-none p-0 text-center text-[0.5rem] leading-[1.75rem] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          onFocus={(event) =>
                            handleEditableFieldSelection(
                              event.currentTarget,
                              item.id,
                              'quantity',
                            )
                          }
                          onClick={(event) =>
                            handleEditableFieldSelection(
                              event.currentTarget,
                              item.id,
                              'quantity',
                            )
                          }
                          inputMode="numeric"
                          id={`cart-quantity-${item.id}`}
                          onChange={(event) =>
                            handleCartInputChange(
                              event,
                              (value) => updateQuantity(item.id, value),
                              false,
                            )
                          }
                          type="text"
                          value={item.quantity}
                        />
                      </InputGroup>
                      <InputGroup className="h-7 w-24 rounded-[0.1875rem] border-border bg-background">
                        <span className="pointer-events-none absolute left-0 top-0 text-[0.5rem] leading-[0.625rem] text-secondary-foreground">
                          Preço
                        </span>
                        <InputGroupInput
                          aria-label={`Preço de ${item.name}`}
                          className="absolute inset-0 h-full w-full appearance-none p-0 text-center text-[0.5rem] leading-[1.75rem] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          id={`cart-price-${item.id}`}
                          inputMode="decimal"
                          onFocus={(event) =>
                            handleEditableFieldSelection(
                              event.currentTarget,
                              item.id,
                              'unitPrice',
                            )
                          }
                          onClick={(event) =>
                            handleEditableFieldSelection(
                              event.currentTarget,
                              item.id,
                              'unitPrice',
                            )
                          }
                          onChange={(event) =>
                            handleCartInputChange(
                              event,
                              (value) => updateUnitPrice(item.id, value),
                              true,
                            )
                          }
                          type="text"
                          value={item.unitPrice}
                        />
                      </InputGroup>
                      <button
                        aria-label={`Mais opções para ${item.name}`}
                        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-sm leading-none text-foreground hover:bg-border"
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
        <section
          aria-label="Order Summary"
          className="min-h-0 rounded-md"
        >
          <div className="flex h-full flex-col justify-end gap-1 px-2 pt-2 text-xs text-foreground">
            <div className="flex items-center justify-between">
              <span>Total Íliquido</span>
              <span>{summary.iliquidoFormatted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total de Imposto</span>
              <span>{summary.impostoFormatted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Retenção</span>
              <span>{summary.retencaoFormatted}</span>
            </div>
          </div>
        </section>
      </div>
      <AlertDialog
        open={itemPendingRemoval !== null}
        onOpenChange={(open) => {
          if (!open) setItemPendingRemoval(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza de que pretende remover &quot;{itemPendingRemoval?.name}&quot; do carrinho?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemPendingRemoval(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirmRemoval}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={isClearCartModalOpen}
        onOpenChange={setIsClearCartModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar carrinho</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza de que pretende remover todos os produtos do carrinho? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsClearCartModalOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirmClearCart}>
              Limpar tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
