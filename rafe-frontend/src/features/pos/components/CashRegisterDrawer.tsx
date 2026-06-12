import React from 'react'
import { Sheet, SheetContent } from '@/shared/components/ui/sheet'
import { NumericKeypad } from '@/shared/components/NumericKeypad'
import { MonetaryDisplay } from '@/shared/components/MonetaryDisplay'
import { useCashRegister } from '@/features/pos/hooks/useCashRegister'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCashRegister } from '@fortawesome/free-solid-svg-icons'
import { History } from 'lucide-react'

interface CashRegisterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cashRegister?: ReturnType<typeof useCashRegister>
}

export function CashRegisterDrawer({ open, onOpenChange, cashRegister: propCashRegister }: CashRegisterDrawerProps) {
  // Chamada ao hook useCashRegister para obter estados e funções locais como fallback
  const localCashRegister = useCashRegister()
  const cashRegister = propCashRegister || localCashRegister

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
        className="bg-white p-6 flex flex-col gap-6 w-full sm:!w-[780px] sm:!max-w-[780px]"
      >
        {/* 1. Header do Painel */}
        <div className="p-[1px] shrink-0" />

        {/* 2. Container Center / Main */}
        <div className="flex-1 grid grid-cols-[300px_1fr] gap-3 min-h-0 overflow-hidden">
          {/* Coluna 1: Abrir Caixa */}
          <div className="flex flex-col pt-0 pb-4 px-0 overflow-hidden pr-3">
            {/* Header da Coluna 1 */}
            <div className="py-0 shrink-0 flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={faCashRegister} className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
              <h3 className="text-xs font-normal text-zinc-600 font-sans">Abrir Caixa</h3>
            </div>
            {/* Main da Coluna 1 */}
            <div className="flex-1 flex flex-col gap-4 bg-transparent mt-2">
              <MonetaryDisplay value={cashRegister.formatDisplayValue(cashRegister.cashRegisterValue)} />
              <NumericKeypad onKeyPress={cashRegister.handleKeypadPress} />
            </div>
          </div>

          {/* Coluna 2: Histórico de Caixa */}
          <div className="flex flex-col pt-0 pb-4 px-0 overflow-hidden">
            {/* Header da Coluna 2 */}
            <div className="py-0 shrink-0 flex items-center gap-2 mb-4">
              <History className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
              <h3 className="text-xs font-normal text-zinc-600 font-sans">Histórico de Caixa</h3>
            </div>
            {/* Main da Coluna 2 - Placeholder */}
            <div className="flex-1 flex items-center justify-center text-center p-4 bg-transparent">
              <span className="text-zinc-500 text-xs font-normal font-sans">
                Por enquanto escreve somente aqui vai ter coisa (Histórico de Caixa)
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
