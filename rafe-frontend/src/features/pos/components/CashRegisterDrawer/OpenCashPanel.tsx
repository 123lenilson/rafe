import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCashRegister } from '@fortawesome/free-solid-svg-icons'
import { X, Send, Check } from 'lucide-react'
import { RippleButton } from '@/shared/components/ui/ripple-button'
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar'
import { NumericKeypad } from '@/shared/components/NumericKeypad'
import { MonetaryDisplay } from '@/shared/components/MonetaryDisplay'
import { useCashRegister } from '@/features/pos/hooks/useCashRegister'

interface OpenCashPanelProps {
  cashRegister: ReturnType<typeof useCashRegister>
  onOpenChange: (open: boolean) => void
}

export function OpenCashPanel({ cashRegister, onOpenChange }: OpenCashPanelProps) {
  const [isObservationSent, setIsObservationSent] = React.useState(false)

  const handleSendObservation = () => {
    if (!cashRegister.cashRegisterObservation.trim()) return
    setIsObservationSent(true)
    console.log("Observação enviada:", cashRegister.cashRegisterObservation)
    setTimeout(() => {
      setIsObservationSent(false)
    }, 2000)
  }

  const activeSession = cashRegister.cashRegisterHistory.find(h => !h.isClosed)

  return (
    <div className="flex flex-col pt-[12px] pb-[24px] px-[24px] bg-[#F5F5F5] h-full overflow-y-auto border-r border-zinc-200 shrink-0">
      {cashRegister.isCashRegisterOpened ? (
        // Modo Caixa Aberto (Turno Activo)
        <>
          <div className="py-0 shrink-0 flex items-center justify-between mb-[8px] min-h-[32px]">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCashRegister} className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
              <h3 className="text-xs font-normal text-zinc-600 font-sans">Caixa Aberto</h3>
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
              {/* Cartão de Sessão Activa */}
              <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-green-600">Sessão Activa</span>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 select-none shrink-0">
                    <AvatarImage src="" alt={activeSession?.operatorName || "Operador"} />
                    <AvatarFallback className="font-bold text-[10px] text-black bg-zinc-100 border border-zinc-200">
                      {activeSession?.operatorInitials || "OP"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-black truncate">{activeSession?.operatorName || "Operador Rafe"}</span>
                    <span className="text-[10px] text-zinc-400">Operador do Turno</span>
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-3 flex flex-col gap-1.5 text-xs text-zinc-600">
                  <div className="flex justify-between">
                    <span>Abertura:</span>
                    <span className="font-medium text-black">
                      {activeSession?.openingDate} às {activeSession?.openingTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor Inicial:</span>
                    <span className="font-semibold text-black">
                      {cashRegister.formatCurrency(activeSession?.initialValue)} Kz
                    </span>
                  </div>
                </div>
              </div>

              {activeSession?.observation && (
                <div className="bg-zinc-100/50 border border-zinc-200/50 rounded-xl p-3 flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Observação de Abertura</span>
                  <p className="text-xs text-zinc-700 italic">"{activeSession.observation}"</p>
                </div>
              )}
            </div>

            {/* Botão de Fechar Caixa */}
            <div className="flex flex-col gap-3 mt-4">
              <RippleButton
                onClick={() => {
                  cashRegister.handleCloseCashRegister()
                  onOpenChange(false)
                }}
                rippleColor="#ffffff40"
                className="w-full py-4 text-sm font-bold text-white bg-black hover:bg-black/90 rounded-lg text-center flex items-center justify-center transition-all select-none cursor-pointer border-0 focus:outline-none"
              >
                Fechar Caixa
              </RippleButton>
            </div>
          </div>
        </>
      ) : (
        // Modo Caixa Fechado (Menu de Abertura)
        <>
          <div className="py-0 shrink-0 flex items-center justify-between mb-[8px] min-h-[32px]">
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

          <div className="flex-1 flex flex-col gap-4 bg-transparent mt-2 justify-between">
            <div className="flex flex-col gap-4 bg-transparent">
              <MonetaryDisplay value={cashRegister.formatDisplayValue(cashRegister.cashRegisterValue)} />
              <NumericKeypad onKeyPress={cashRegister.handleKeypadPress} />
            </div>

            {/* Observações e Botão de Abrir Caixa */}
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
        </>
      )}
    </div>
  )
}
