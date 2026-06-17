import React from 'react'
import { Sheet, SheetContent } from '@/shared/components/ui/sheet'
import { NumericKeypad } from '@/shared/components/NumericKeypad'
import { MonetaryDisplay } from '@/shared/components/MonetaryDisplay'
import { useCashRegister } from '@/features/pos/hooks/useCashRegister'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCashRegister } from '@fortawesome/free-solid-svg-icons'
import { History, X, Send, Check } from 'lucide-react'
import { RippleButton } from '@/shared/components/ui/ripple-button'

interface CashRegisterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cashRegister?: ReturnType<typeof useCashRegister>
}

export function CashRegisterDrawer({ open, onOpenChange, cashRegister: propCashRegister }: CashRegisterDrawerProps) {
  // Chamada ao hook useCashRegister para obter estados e funções locais como fallback
  const localCashRegister = useCashRegister()
  const cashRegister = propCashRegister || localCashRegister

  const [isObservationSent, setIsObservationSent] = React.useState(false)

  const handleSendObservation = () => {
    if (!cashRegister.cashRegisterObservation.trim()) return
    setIsObservationSent(true)
    console.log("Observação enviada:", cashRegister.cashRegisterObservation)
    setTimeout(() => {
      setIsObservationSent(false)
    }, 2000)
  }

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
        className="bg-white p-0 flex flex-col w-full sm:!w-[45vw] sm:!min-w-[780px] sm:!max-w-[960px] overflow-hidden"
      >

        {/* 2. Container Center / Main */}
        <div className="flex-1 grid grid-cols-[300px_1fr] min-h-0 overflow-hidden h-full w-full">
          {/* Coluna 1: Abrir Caixa */}
          <div className="flex flex-col p-6 bg-[#F5F5F5] h-full overflow-y-auto border-r border-zinc-200 shrink-0">
            {/* Header da Coluna 1 */}
            <div className="py-0 shrink-0 flex items-center justify-between mb-4 min-h-[32px]">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCashRegister} className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                <h3 className="text-xs font-normal text-zinc-600 font-sans">Abrir Caixa</h3>
              </div>
              <RippleButton
                onClick={() => onOpenChange(false)}
                rippleColor="#a1a1aa"
                rippleOnHover={true}
                className="w-[32px] h-[32px] rounded-full bg-[#F5F5F5] hover:bg-zinc-200/50 border-0 p-0 flex items-center justify-center transition-colors text-zinc-500 hover:text-zinc-800 focus:outline-none"
              >
                <X className="h-[16px] w-[16px]" />
              </RippleButton>
            </div>
            {/* Main da Coluna 1 */}
            <div className="flex-1 flex flex-col gap-4 bg-transparent mt-2 justify-between">
              <div className="flex flex-col gap-4 bg-transparent">
                <MonetaryDisplay value={cashRegister.formatDisplayValue(cashRegister.cashRegisterValue)} />
                <NumericKeypad onKeyPress={cashRegister.handleKeypadPress} />
              </div>

              {/* Novo Container para Observações e Botão de Abrir Caixa */}
              <div className="flex flex-col gap-3 mt-4">
                <div className="relative w-full">
                  <textarea
                    value={cashRegister.cashRegisterObservation}
                    onChange={(e) => cashRegister.setCashRegisterObservation(e.target.value)}
                    placeholder="Observações..."
                    className="w-full h-[80px] min-h-[80px] pl-3 pr-10 py-2 resize-y rounded-lg border border-zinc-200 bg-white text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    rows={3}
                  />
                  {cashRegister.cashRegisterObservation.trim() && (
                    <button
                      type="button"
                      onClick={handleSendObservation}
                      title="Enviar observação"
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-black transition-all cursor-pointer border-0 flex items-center justify-center focus:outline-none"
                    >
                      {isObservationSent ? (
                        <Check className="h-3.5 w-3.5 text-green-600 animate-in zoom-in duration-200" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>
                <RippleButton
                  onClick={() => {
                    cashRegister.handleOpenCashRegister()
                    onOpenChange(false)
                  }}
                  rippleColor="#ffffff40"
                  className="w-full py-4 text-sm font-bold text-white bg-black hover:bg-black/90 rounded-lg text-center flex items-center justify-center transition-all select-none cursor-pointer border-0 focus:outline-none"
                >
                  Abrir Caixa
                </RippleButton>
              </div>
            </div>
          </div>

          {/* Coluna 2: Histórico de Caixa */}
          <div className="flex flex-col p-6 h-full overflow-y-auto bg-white max-w-[540px] w-full">
            {/* Header da Coluna 2 */}
            <div className="py-0 shrink-0 flex items-center justify-between mb-4 min-h-[32px]">
              <div className="flex items-center gap-2">
                <History className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                <h3 className="text-xs font-normal text-zinc-600 font-sans">Histórico de Caixa</h3>
              </div>
              <RippleButton
                onClick={() => onOpenChange(false)}
                rippleColor="#a1a1aa"
                rippleOnHover={true}
                className="w-[32px] h-[32px] rounded-full bg-white hover:bg-zinc-50/50 border-0 p-0 flex items-center justify-center transition-colors text-zinc-500 hover:text-zinc-800 focus:outline-none"
              >
                <X className="h-[16px] w-[16px]" />
              </RippleButton>
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
