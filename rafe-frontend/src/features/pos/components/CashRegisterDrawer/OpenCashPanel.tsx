import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCashRegister } from '@fortawesome/free-solid-svg-icons'
import { X, Send, Check } from 'lucide-react'
import { RippleButton } from '@/shared/components/ui/ripple-button'
import { NumericKeypad } from '@/shared/components/NumericKeypad'
import { MonetaryDisplay } from '@/shared/components/MonetaryDisplay'
import { useCashRegister } from '@/features/pos/hooks/useCashRegister'
import { toast } from 'sonner'

interface OpenCashPanelProps {
  cashRegister: ReturnType<typeof useCashRegister>
  onOpenChange: (open: boolean) => void
  open: boolean
  cashRegisterValue: string
  setCashRegisterValue: React.Dispatch<React.SetStateAction<string>>
  cashRegisterObservation: string
  setCashRegisterObservation: React.Dispatch<React.SetStateAction<string>>
}

export function OpenCashPanel({ 
  cashRegister, 
  onOpenChange, 
  open,
  cashRegisterValue,
  setCashRegisterValue,
  cashRegisterObservation,
  setCashRegisterObservation
}: OpenCashPanelProps) {
  const [isObservationSent, setIsObservationSent] = React.useState(false)

  const handleSendObservation = () => {
    if (!cashRegisterObservation.trim()) return
    setIsObservationSent(true)
    console.log("Observação enviada:", cashRegisterObservation)
    setTimeout(() => {
      setIsObservationSent(false)
    }, 2000)
  }

  const handleKeypadPress = (key: string) => {
    if (key === 'clear') {
      setCashRegisterValue("0")
    } else if (key === 'backspace') {
      setCashRegisterValue(prev => {
        if (prev.length <= 1) return "0"
        return prev.slice(0, -1)
      })
    } else if (key === '.') {
      setCashRegisterValue(prev => {
        if (prev.includes('.')) return prev
        if (prev.length >= 10) return prev
        return prev + '.'
      })
    } else {
      setCashRegisterValue(prev => {
        if (prev === "0") return key
        if (prev.includes('.')) {
          const parts = prev.split('.')
          const decimals = parts[1] || ""
          if (decimals.length >= 2) {
            return prev
          }
        }
        if (prev.length >= 10) return prev
        return prev + key
      })
    }
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
        handleKeypadPress(key)
      } else if (key === '.' || key === ',') {
        e.preventDefault()
        handleKeypadPress('.')
      } else if (key === 'Backspace') {
        e.preventDefault()
        handleKeypadPress('backspace')
      } else if (key === 'Delete' || key === 'Escape' || key.toLowerCase() === 'c') {
        e.preventDefault()
        handleKeypadPress('clear')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, cashRegisterValue])

  return (
    <div className="flex flex-col pt-[28px] pb-[40px] px-[24px] bg-[#F5F5F5] h-full overflow-y-auto border-r border-zinc-200 shrink-0">
      <div className="py-0 shrink-0 flex items-center justify-between mb-[8px] min-h-[32px]">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCashRegister} className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
          <h3 className="text-xs font-normal text-zinc-600 font-sans">
            {cashRegister.isCashRegisterOpened ? "Fechar Caixa" : "Abrir Caixa"}
          </h3>
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

      <div className="flex-1 flex flex-col gap-4 bg-transparent mt-2 justify-between">
        <div className="flex flex-col gap-4 bg-transparent">
          <MonetaryDisplay value={cashRegister.formatDisplayValue(cashRegisterValue)} />
          <NumericKeypad onKeyPress={handleKeypadPress} />
        </div>

        {/* Observações e Botão de Ação */}
        <div className="flex flex-col gap-3 mt-4">
          <div className="relative w-full">
            <textarea
              value={cashRegisterObservation}
              onChange={(e) => setCashRegisterObservation(e.target.value)}
              placeholder="Observações..."
              className="w-full h-[80px] min-h-[80px] pl-3 pr-10 py-2 resize-y rounded-lg border border-zinc-200 bg-white text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
              rows={3}
            />
            {cashRegisterObservation.trim() && (
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
              const typedVal = parseFloat(cashRegisterValue) || 0
              const formattedVal = cashRegister.formatCurrency(typedVal)
              const currentObs = cashRegisterObservation.trim()
              if (cashRegister.isCashRegisterOpened) {
                cashRegister.handleCloseCashRegister(cashRegisterValue, cashRegisterObservation)
                toast.success("Caixa fechado com sucesso", {
                  description: (
                    <div className="flex flex-col gap-1 mt-1 text-zinc-500 font-sans text-xs">
                      <div><strong className="text-black font-semibold">Operador:</strong> Operador Rafe</div>
                      <div><strong className="text-black font-semibold">Valor Final:</strong> {formattedVal} Kz</div>
                      {currentObs && (
                        <div className="mt-0.5 border-t border-zinc-100 pt-1 text-[11px] italic">
                          <strong className="text-zinc-700 not-italic font-semibold">Obs: </strong>
                          "{currentObs}"
                        </div>
                      )}
                    </div>
                  ),
                  action: {
                    label: "Abortar",
                    onClick: () => {
                      cashRegister.setCashRegisterHistory(prev => {
                        return prev.map((item, idx) => {
                          if (idx === 0) {
                            return {
                              ...item,
                              isClosed: false,
                              closingDate: "",
                              closingTime: "",
                              finalValue: 0,
                              difference: 0,
                              closingObservation: undefined
                            }
                          }
                          return item
                        })
                      })
                      cashRegister.setIsCashRegisterOpened(true)
                      toast.info("Fecho de caixa abortado")
                    }
                  }
                })
              } else {
                cashRegister.handleOpenCashRegister(cashRegisterValue, cashRegisterObservation)
                toast.success("Caixa aberto com sucesso", {
                  description: (
                    <div className="flex flex-col gap-1 mt-1 text-zinc-500 font-sans text-xs">
                      <div><strong className="text-black font-semibold">Operador:</strong> Operador Rafe</div>
                      <div><strong className="text-black font-semibold">Valor Inicial:</strong> {formattedVal} Kz</div>
                      {currentObs && (
                        <div className="mt-0.5 border-t border-zinc-100 pt-1 text-[11px] italic">
                          <strong className="text-zinc-700 not-italic font-semibold">Obs: </strong>
                          "{currentObs}"
                        </div>
                      )}
                    </div>
                  ),
                  action: {
                    label: "Abortar",
                    onClick: () => {
                      cashRegister.setCashRegisterHistory(prev => prev.slice(1))
                      cashRegister.setIsCashRegisterOpened(false)
                      toast.info("Abertura de caixa abortada")
                    }
                  }
                })
              }
              onOpenChange(false)
            }}
            rippleColor="#ffffff40"
            className="w-full py-4 text-sm font-bold text-white bg-black hover:bg-black/90 rounded-lg text-center flex items-center justify-center transition-all select-none cursor-pointer border-0 focus:outline-none"
          >
            {cashRegister.isCashRegisterOpened ? "Fechar Caixa" : "Abrir Caixa"}
          </RippleButton>
        </div>
      </div>
    </div>
  )
}
