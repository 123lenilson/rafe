import { usePOSCartStore } from '@/features/pos/stores/usePOSCartStore'

const products = [
  { name: 'Água Mineral', price: 'Kz 500', quantity: 0 },
  { name: 'Sumo de Laranja', price: 'Kz 1 200', quantity: 6 },
  { name: 'Pão de Forma', price: 'Kz 2 500', quantity: 12 },
  { name: 'Arroz 1 kg', price: 'Kz 1 800', quantity: 3 },
  { name: 'Leite 1 L', price: 'Kz 1 300', quantity: 5 },
  { name: 'Açúcar 1 kg', price: 'Kz 1 500', quantity: 9 },
  { name: 'Sabão', price: 'Kz 900', quantity: 1 },
  { name: 'Café 250 g', price: 'Kz 3 500', quantity: 8 },
  { name: 'Óleo 1 L', price: 'Kz 2 800', quantity: 11 },
  { name: 'Bolachas', price: 'Kz 750', quantity: 4 },
  { name: 'Massa 500 g', price: 'Kz 1 000', quantity: 10 },
  { name: 'Água 1,5 L', price: 'Kz 700', quantity: 15 },
  { name: 'Serviço de Entrega', price: 'Kz 1 500', type: 'service' },
]

function getStockStatus(quantity: number) {
  if (quantity === 0) return { color: 'text-border', label: 'Sem stock' }
  if (quantity <= 3) return { color: 'text-error', label: 'Stock baixo' }
  if (quantity <= 8) return { color: 'text-warning', label: 'Stock médio' }
  return { color: 'text-success', label: 'Stock completo' }
}

function StockIndicator({ quantity }: { quantity: number }) {
  const stockStatus = getStockStatus(quantity)

  return (
    <span
      aria-label={`${quantity} unidades, ${stockStatus.label}`}
      className="flex items-center gap-1 text-[0.6875rem] leading-[0.875rem] text-foreground"
      role="img"
    >
      <span>{quantity}</span>
      <svg aria-hidden="true" className="size-3" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          className="fill-background stroke-border"
          strokeWidth="2"
        />
        {quantity >= 9 && (
          <circle
            cx="12"
            cy="12"
            r="10"
            className="fill-none stroke-success"
            strokeWidth="2"
          />
        )}
        {quantity >= 4 && quantity <= 8 && (
          <path
            d="M2 12a10 10 0 0 1 20 0"
            className="fill-none stroke-warning"
            strokeWidth="2"
          />
        )}
        {quantity >= 1 && quantity <= 3 && (
          <path
            d="M6.34 4.93a10 10 0 0 1 11.32 0"
            className="fill-none stroke-error"
            strokeWidth="2"
          />
        )}
      </svg>
    </span>
  )
}

export function POSProductIllustration({
  className = 'h-3/4 w-auto text-secondary-foreground',
}: {
  className?: string
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 128 128"
    >
      <path
        d="M49 15h30v15H49z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M43 30h42l9 13v68H34V43l9-13Z"
        fill="var(--background)"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path d="M35 48h58" stroke="currentColor" strokeWidth="3" />
      <rect
        fill="var(--muted)"
        height="27"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
        width="42"
        x="43"
        y="64"
      />
      <path
        d="M53 73h22m-22 8h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  )
}

function ProductImagePlaceholder() {
  return (
    <div className="-mx-2 -mt-2 flex h-24 shrink-0 aspect-auto items-center justify-center rounded-t-sm bg-muted">
      <POSProductIllustration />
    </div>
  )
}

function ServiceImagePlaceholder() {
  return (
    <div className="-mx-2 -mt-2 flex h-24 shrink-0 items-center justify-center rounded-t-sm bg-muted">
      <svg
        aria-hidden="true"
        className="h-3/4 w-auto text-secondary-foreground"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94L14.7 6.3z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
        />
      </svg>
    </div>
  )
}

export function POSProductGrid() {
  const cartItems = usePOSCartStore((state) => state.items)
  const addProduct = usePOSCartStore((state) => state.addProduct)

  return (
    <div
      aria-label="Produtos"
      className="grid min-h-0 w-full flex-1 content-start gap-2 overflow-y-auto"
      role="list"
      style={{
        gridTemplateColumns: 'repeat(4, minmax(8rem, 1fr))',
      }}
    >
      {products.map((product) => {
        const isSelected = cartItems.some((item) => item.id === product.name)

        return (
          <button
            aria-pressed={isSelected}
            className={`flex flex-col gap-1 rounded-md border p-2 text-left ${
              isSelected
                ? 'border-primary bg-background text-foreground shadow-md'
                : 'border-border bg-background text-foreground hover:shadow-md'
            }`}
            key={product.name}
            onClick={() =>
              addProduct({ id: product.name, name: product.name, price: product.price })
            }
            role="listitem"
            type="button"
          >
            {'quantity' in product ? (
              <ProductImagePlaceholder />
            ) : (
              <ServiceImagePlaceholder />
            )}
            <span className="text-[0.6875rem] leading-[0.875rem]">
              {product.name}
            </span>
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-medium">{product.price}</span>
              {'quantity' in product ? (
                <StockIndicator quantity={product.quantity} />
              ) : (
                <span className="text-[0.6875rem] leading-[0.875rem] text-secondary-foreground">
                  Serviço
                </span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
