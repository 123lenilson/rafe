import React from 'react'
import { Sheet, SheetContent } from '@/shared/components/ui/sheet'
import { useCashRegister } from '@/features/pos/hooks/useCashRegister'
import { useCashHistoryFilters } from '@/features/pos/hooks/useCashHistoryFilters'
import { OpenCashPanel } from './OpenCashPanel'
import { CashHistoryPanel } from './CashHistoryPanel'

interface CashRegisterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cashRegister?: ReturnType<typeof useCashRegister>
}

export function CashRegisterDrawer({ open, onOpenChange, cashRegister: propCashRegister }: CashRegisterDrawerProps) {
  const localCashRegister = useCashRegister()
  const cashRegister = propCashRegister || localCashRegister

  const filters = useCashHistoryFilters()

  // Capturar eventos de teclado físico quando o painel de caixa está aberto
  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar digitação caso o foco esteja num campo de texto ou textarea
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      const key = e.key

      if (/[0-9]/.test(key)) {
        e.preventDefault()
        cashRegister.handleKeypadPress(key)
      } else if (key === '.' || key === ',') {
        e.preventDefault()
        cashRegister.handleKeypadPress('.')
      } else if (key === 'Backspace') {
        e.preventDefault()
        cashRegister.handleKeypadPress('backspace')
      } else if (key === 'Delete' || key === 'Escape' || key.toLowerCase() === 'c') {
        e.preventDefault()
        cashRegister.handleKeypadPress('clear')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, cashRegister])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="bg-white p-0 flex flex-col w-full sm:!w-[50vw] sm:!min-w-[858px] sm:!max-w-[1056px] overflow-hidden"
      >
        {/* 2. Container Center / Main */}
        <div className="flex-1 grid grid-cols-[300px_1fr] min-h-0 overflow-hidden h-full w-full">
          <OpenCashPanel cashRegister={cashRegister} onOpenChange={onOpenChange} />
          <CashHistoryPanel filters={filters} onOpenChange={onOpenChange} cashRegister={cashRegister} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
