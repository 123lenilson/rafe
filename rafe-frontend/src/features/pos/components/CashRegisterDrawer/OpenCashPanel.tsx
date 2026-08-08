import React, { useRef, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCashRegister } from '@fortawesome/free-solid-svg-icons'
import { X, Send, Check, Copy, Trash2 } from 'lucide-react'
import { RippleButton } from '@/shared/components/ui/ripple-button'
import { NumericKeypad } from '@/shared/components/NumericKeypad'
import { MonetaryDisplay } from '@/shared/components/MonetaryDisplay'
import { useCashRegister } from '@/features/pos/hooks/useCashRegister'
import { toast } from 'sonner'

interface SentObservation {
  id: string
  text: string
  timestamp: string
}

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
  const [draftObservation, setDraftObservation] = useState('')
  const [observationsList, setObservationsList] = useState<SentObservation[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatFeedRef = useRef<HTMLDivElement>(null)

  // Sincronizar observações enviadas com a prop pai
  const syncParentObservation = (newList: SentObservation[]) => {
    const combinedText = newList.map(item => item.text).join(' \n')
    setCashRegisterObservation(combinedText)
  }

  // Ajuste de altura automática do textarea (WhatsApp style)
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setDraftObservation(val)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`
    }
  }

  // Enviar nova observação (adicionar ao chat bubble)
  const handleSendObservation = () => {
    const trimmed = draftObservation.trim()
    if (!trimmed) return

    const now = new Date()
    const timeStr = now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    const newObs: SentObservation = {
      id: `${Date.now()}-${Math.random()}`,
      text: trimmed,
      timestamp: timeStr,
    }

    const updated = [...observationsList, newObs]
    setObservationsList(updated)
    syncParentObservation(updated)
    setDraftObservation('')

    if (textareaRef.current) {
      textareaRef.current.style.height = '38px'
    }

    // Rolagem automática para o fundo do feed de mensagens
    setTimeout(() => {
      if (chatFeedRef.current) {
        chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight
      }
    }, 50)
  }

  // Copiar observação
  const handleCopyObservation = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success("Copiado para a área de transferência")
    setTimeout(() => setCopiedId(null), 1500)
  }

  // Remover observação
  const handleDeleteObservation = (id: string) => {
    const updated = observationsList.filter(item => item.id !== id)
    setObservationsList(updated)
    syncParentObservation(updated)
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
        return prev + '.'
      })
    } else {
      // Tecla numérica (0-9)
      setCashRegisterValue(prev => {
        // Bloqueia se já tiver mais de 2 casas decimais
        if (prev.includes('.')) {
          const decimals = prev.split('.')[1] || ""
          if (decimals.length >= 2) return prev
        }

        const nextValue = prev === "0" ? key : prev + key
        const numVal = parseFloat(nextValue)
        if (isNaN(numVal) || numVal > 999999999.99) {
          return prev
        }
        return nextValue
      })
    }
  }

  const handleOpenCash = () => {
    const numVal = parseFloat(cashRegisterValue) || 0
    if (numVal <= 0) return

    const now = new Date()
    const currentTime = now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    const formattedValue = cashRegister.formatCurrency(cashRegisterValue)
    
    cashRegister.handleOpenCashRegister(cashRegisterValue, cashRegisterObservation)
    onOpenChange(false)
    
    toast.success("Caixa Aberto", {
      description: `O caixa foi aberto às ${currentTime} com o valor de ${formattedValue} Kz.`,
    })
  }

  const handleCloseCash = () => {
    const numVal = parseFloat(cashRegisterValue)
    if (isNaN(numVal) || numVal < 0) return

    const now = new Date()
    const currentTime = now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    const formattedValue = cashRegister.formatCurrency(cashRegisterValue)
    
    cashRegister.handleCloseCashRegister(cashRegisterValue, cashRegisterObservation)
    onOpenChange(false)
    
    toast.success("Caixa Fechado", {
      description: `O caixa foi fechado às ${currentTime} com o valor de ${formattedValue} Kz.`,
    })
  }

  // Capturar eventos de teclado físico quando o painel de caixa está aberto
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      if (e.key === 'Enter' && !e.shiftKey) {
        // Se estiver focado no textarea e premir Enter sem Shift, envia a observação
        if (target === textareaRef.current) {
          e.preventDefault()
          handleSendObservation()
          return
        }

        const numVal = parseFloat(cashRegisterValue)
        if (cashRegister.isCashRegisterOpened) {
          if (!isNaN(numVal) && numVal >= 0) {
            e.preventDefault()
            handleCloseCash()
            return
          }
        } else {
          if (!isNaN(numVal) && numVal > 0) {
            e.preventDefault()
            handleOpenCash()
            return
          }
        }
      }

      if (isInput) return

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
  }, [open, cashRegisterValue, draftObservation, observationsList, cashRegister.isCashRegisterOpened])

  return (
    <div className="flex flex-col pt-[20px] pb-[20px] px-[20px] bg-[#F5F5F5] h-full border-r border-zinc-200 shrink-0 overflow-hidden">
      {/* Header Fixo */}
      <div className="py-0 shrink-0 flex items-center justify-between mb-[12px] min-h-[32px]">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCashRegister} className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
          <h3 className="text-xs font-normal text-zinc-600 font-sans">
            {cashRegister.isCashRegisterOpened ? "Caixa Aberto" : "Abrir Caixa"}
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

      {/* Área Central Scrollável (Display + Teclado + Feed de Observações por Cima do Input) */}
      <div 
        ref={chatFeedRef}
        className="flex-1 min-h-0 overflow-y-auto rafe-table-scroll flex flex-col gap-3 pr-1"
      >
        <div className="flex flex-col gap-4 bg-transparent shrink-0">
          <MonetaryDisplay value={cashRegister.formatDisplayValue(cashRegisterValue)} />
          <NumericKeypad onKeyPress={handleKeypadPress} />
        </div>

        {/* Feed de Observações Enviadas que Sobem Acima do Input */}
        {observationsList.length > 0 && (
          <div className="flex flex-col gap-2 mt-auto pt-2 shrink-0">
            {observationsList.map((obs) => (
              <div 
                key={obs.id} 
                className="self-end bg-white border border-zinc-200/90 text-zinc-900 rounded-2xl rounded-tr-xs px-3 py-2 text-xs flex flex-col gap-1 w-full shadow-2xs animate-in fade-in slide-in-from-bottom-2 duration-150"
              >
                <span className="break-words font-sans text-[0.8125rem] text-zinc-800 leading-snug">
                  {obs.text}
                </span>
                <div className="flex items-center justify-between text-[0.625rem] text-zinc-400 border-t border-zinc-100 pt-1 mt-0.5">
                  <span>{obs.timestamp}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyObservation(obs.id, obs.text)}
                      className="text-zinc-400 hover:text-zinc-700 bg-transparent border-0 p-0.5 cursor-pointer transition-colors"
                      title="Copiar observação"
                    >
                      {copiedId === obs.id ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteObservation(obs.id)}
                      className="text-zinc-400 hover:text-red-600 bg-transparent border-0 p-0.5 cursor-pointer transition-colors"
                      title="Apagar observação"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rodapé Fixo Permanente (Input WhatsApp + Botão Abrir/Fechar Caixa) */}
      <div className="shrink-0 flex flex-col gap-3 pt-3 mt-2 border-t border-zinc-200/60 bg-[#F5F5F5]">
        {/* Input Auto-expansível (WhatsApp Style) */}
        <div className="relative w-full flex items-end bg-white border border-zinc-200 rounded-2xl px-3 py-1.5 focus-within:ring-1 focus-within:ring-black focus-within:border-black transition-all shadow-2xs">
          <textarea
            ref={textareaRef}
            value={draftObservation}
            onChange={handleTextareaInput}
            placeholder="Adicionar observação..."
            className="w-full min-h-[38px] max-h-[100px] py-2 pr-8 resize-none bg-transparent text-xs text-black placeholder:text-zinc-400 focus:outline-none font-sans leading-relaxed border-0 overflow-y-auto rafe-table-scroll"
            rows={1}
          />
          {draftObservation.trim() && (
            <button
              type="button"
              onClick={handleSendObservation}
              title="Enviar observação"
              className="absolute bottom-2 right-2.5 w-7 h-7 rounded-full bg-black hover:bg-zinc-800 text-white transition-all cursor-pointer border-0 flex items-center justify-center focus:outline-none shrink-0 shadow-xs animate-in zoom-in-95 duration-100"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Botão Fixo de Ação */}
        {cashRegister.isCashRegisterOpened ? (
          <RippleButton
            onClick={handleCloseCash}
            rippleColor="#ffffff40"
            className="w-full py-4 text-sm font-bold text-white bg-black hover:bg-black/90 rounded-lg text-center flex items-center justify-center transition-all select-none cursor-pointer border-0 focus:outline-none"
          >
            Fechar Caixa
          </RippleButton>
        ) : (
          <RippleButton
            onClick={handleOpenCash}
            rippleColor="#ffffff40"
            className="w-full py-4 text-sm font-bold text-white bg-black hover:bg-black/90 rounded-lg text-center flex items-center justify-center transition-all select-none cursor-pointer border-0 focus:outline-none"
          >
            Abrir Caixa
          </RippleButton>
        )}
      </div>
    </div>
  )
}
