import { useState } from 'react'
import { ShoppingCart, X } from 'lucide-react'
import { POSProductIllustration } from '@/features/pos/components/POSProductGrid'
import {
  InputGroup,
  InputGroupInput,
} from '@/shared/components/ui/input-group'

export function POSCheckoutCart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Arroz 1 kg', price: 'Kz 1.800' },
    { id: 2, name: 'Água Mineral', price: 'Kz 500' },
    { id: 3, name: 'Sumo de Laranja', price: 'Kz 1.200' },
    { id: 4, name: 'Pão de Forma', price: 'Kz 2.500' },
    { id: 5, name: 'Leite 1 L', price: 'Kz 1.300' },
    { id: 6, name: 'Açúcar 1 kg', price: 'Kz 1.500' },
    { id: 7, name: 'Sabão', price: 'Kz 900' },
    { id: 8, name: 'Café 250 g', price: 'Kz 3.500' },
    { id: 9, name: 'Óleo 1 L', price: 'Kz 2.800' },
    { id: 10, name: 'Bolachas', price: 'Kz 750' },
    { id: 11, name: 'Massa 500 g', price: 'Kz 1.000' },
    { id: 12, name: 'Água 1,5 L', price: 'Kz 700' },
    { id: 13, name: 'Serviço de Entrega', price: 'Kz 1.500' },
    { id: 14, name: 'Feijão 1 kg', price: 'Kz 2.200' },
    { id: 15, name: 'Farinha de Milho 1 kg', price: 'Kz 1.100' },
    { id: 16, name: 'Detergente 1 L', price: 'Kz 1.800' },
    { id: 17, name: 'Ovos (dúzia)', price: 'Kz 2.400' },
    { id: 18, name: 'Sumo de Manga', price: 'Kz 1.000' },
    { id: 19, name: 'Sal 1 kg', price: 'Kz 300' },
    { id: 20, name: 'Papel Higiénico (4 rolos)', price: 'Kz 1.600' },
  ])

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
                      <span className="min-w-0 flex-1 text-xs font-medium text-foreground">
                        {item.name} × 1
                      </span>
                      <span className="shrink-0 text-xs font-medium text-foreground">
                        {item.price}
                      </span>
                      <button
                        aria-label={`Remover ${item.name} do carrinho`}
                        className="absolute -top-2 right-0 flex h-8 w-8 shrink-0 items-center justify-center text-secondary-foreground focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
                        onClick={() =>
                          setCartItems((currentItems) =>
                            currentItems.filter((currentItem) => currentItem.id !== item.id),
                          )
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
                          className="absolute inset-0 h-full w-full appearance-none p-0 text-center text-[0.25rem] leading-[1.75rem] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          defaultValue="1"
                          id={`cart-quantity-${item.id}`}
                          type="number"
                        />
                      </InputGroup>
                      <InputGroup className="h-7 w-24 rounded-[0.1875rem] border-border bg-background">
                        <span className="pointer-events-none absolute left-0 top-0 text-[0.5rem] leading-[0.625rem] text-secondary-foreground">
                          Preço
                        </span>
                        <InputGroupInput
                          aria-label={`Preço de ${item.name}`}
                          className="absolute inset-0 h-full w-full appearance-none p-0 text-center text-[0.25rem] leading-[1.75rem] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          defaultValue="1800"
                          id={`cart-price-${item.id}`}
                          type="number"
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
          )}
        </section>
        <section
          aria-label="Order Summary"
          className="min-h-0 rounded-md"
        >
          <div className="flex h-full flex-col justify-end gap-1 px-2 pt-2 text-xs text-foreground">
            <div className="flex items-center justify-between">
              <span>Total Íliquido</span>
              <span>0,00 Kz</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total de Imposto</span>
              <span>0,00 Kz</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Retenção</span>
              <span>0,00 Kz</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
