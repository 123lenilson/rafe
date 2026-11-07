import { useState } from 'react'
import { POSDiscountEditor } from '@/features/pos/components/POSDiscountEditor'
import {
  usePOSCartStore,
  type POSCartItem,
} from '@/features/pos/stores/usePOSCartStore'
import { calculatePOSCartItemNetInCents } from '@/features/pos/utils/posCartFormatters'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover'

interface POSProductActionsPopoverProps {
  item: POSCartItem
}

const productActions = ['Desconto', 'Nota', 'Ofertar'] as const
type POSProductAction = (typeof productActions)[number]

export function POSProductActionsPopover({
  item,
}: POSProductActionsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeAction, setActiveAction] =
    useState<POSProductAction>('Desconto')
  const setItemDiscount = usePOSCartStore((state) => state.setItemDiscount)
  const productNetInCents = calculatePOSCartItemNetInCents(item)

  return (
    <Popover
      onOpenChange={(open) => {
        setIsOpen(open)
        if (open) setActiveAction('Desconto')
      }}
      open={isOpen}
    >
      <PopoverTrigger asChild>
        <button
          aria-label={`Mais opções para ${item.name}`}
          className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-sm leading-none text-foreground hover:bg-border ${
            isOpen ? 'bg-border' : ''
          }`}
          type="button"
        >
          +
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        aria-label={`Opções de ${item.name}`}
        className="w-[25rem] overflow-hidden rounded-md border border-border bg-background p-0 shadow-sm"
        side="top"
        sideOffset={4}
      >
        <div className="flex">
          <div
            aria-label="Opções do produto"
            role="group"
            className="shrink-0 bg-muted pl-2 pr-6 py-6"
          >
            <ul className="flex list-none flex-col gap-1.5">
              {productActions.map((action) => {
                const isActive = activeAction === action
                return (
                  <li key={action}>
                    <button
                      aria-pressed={isActive}
                      className={`flex w-full items-center gap-1 whitespace-nowrap rounded-sm px-2 py-2 text-left text-xs text-foreground focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2 ${
                        isActive ? 'bg-border font-medium' : 'hover:bg-border'
                      }`}
                      onClick={() => setActiveAction(action)}
                      type="button"
                    >
                      {action}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
          <div
            aria-label="Área de conteúdo das opções do produto"
            className="grid min-w-0 flex-1 grid-cols-1 p-4"
            role="region"
          >
            <div
              aria-hidden={activeAction !== 'Desconto'}
              className={`col-start-1 row-start-1 ${
                activeAction === 'Desconto' ? 'visible' : 'invisible'
              }`}
            >
              <POSDiscountEditor
                discount={item.discount}
                inputIdPrefix={`product-${item.id}-discount`}
                onApply={(discount) => {
                  setItemDiscount(item.id, discount)
                  setIsOpen(false)
                }}
                targetLabel={`este produto (${item.name})`}
                totalIliquidoInCents={productNetInCents}
              />
            </div>
            <div
              aria-hidden={activeAction !== 'Nota'}
              className={`col-start-1 row-start-1 ${
                activeAction === 'Nota' ? 'visible' : 'invisible'
              }`}
            />
            <div
              aria-hidden={activeAction !== 'Ofertar'}
              className={`col-start-1 row-start-1 ${
                activeAction === 'Ofertar' ? 'visible' : 'invisible'
              }`}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
