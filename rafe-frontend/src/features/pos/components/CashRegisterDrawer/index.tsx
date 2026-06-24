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

  const [cashRegisterValue, setCashRegisterValue] = React.useState<string>("0")
  const [cashRegisterObservation, setCashRegisterObservation] = React.useState<string>("")

  // Resetar estados locais ao abrir o painel
  React.useEffect(() => {
    if (open) {
      setCashRegisterValue("0")
      setCashRegisterObservation("")
    }
  }, [open])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="bg-white p-0 flex flex-col w-full sm:!w-[60vw] sm:!min-w-[980px] sm:!max-w-[1180px] overflow-hidden"
      >
        {/* 2. Container Center / Main */}
        <div className="flex-1 grid grid-cols-[300px_1fr] min-h-0 overflow-hidden h-full w-full">
          <OpenCashPanel 
            cashRegister={cashRegister} 
            onOpenChange={onOpenChange} 
            open={open} 
            cashRegisterValue={cashRegisterValue}
            setCashRegisterValue={setCashRegisterValue}
            cashRegisterObservation={cashRegisterObservation}
            setCashRegisterObservation={setCashRegisterObservation}
          />
          <CashHistoryPanel 
            filters={filters} 
            onOpenChange={onOpenChange} 
            cashRegister={cashRegister} 
            activeValue={cashRegisterValue}
            activeObservation={cashRegisterObservation}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
