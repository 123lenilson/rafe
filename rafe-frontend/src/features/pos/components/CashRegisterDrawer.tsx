import React from 'react'
import { Sheet, SheetContent } from '@/shared/components/ui/sheet'
import { NumericKeypad } from '@/shared/components/NumericKeypad'
import { MonetaryDisplay } from '@/shared/components/MonetaryDisplay'
import { useCashRegister } from '@/features/pos/hooks/useCashRegister'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCashRegister } from '@fortawesome/free-solid-svg-icons'
import { History, X, Send, Check, Filter, User, MessageSquare, Coins, Calendar, Search } from 'lucide-react'
import { RippleButton } from '@/shared/components/ui/ripple-button'
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/shared/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

interface CashRegisterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cashRegister?: ReturnType<typeof useCashRegister>
}

export function CashRegisterDrawer({ open, onOpenChange, cashRegister: propCashRegister }: CashRegisterDrawerProps) {
  const [userSearchTerm, setUserSearchTerm] = React.useState("")
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>(["Operador Rafe"])
  const [obsSearchTerm, setObsSearchTerm] = React.useState("")
  const [appliedObservations, setAppliedObservations] = React.useState<string[]>([])
  const [valFilterType, setValFilterType] = React.useState<"Valor Inicial" | "Valor Final" | "Diferença">("Valor Inicial")
  const [valFilterValue, setValFilterValue] = React.useState("")
  const [appliedValFilters, setAppliedValFilters] = React.useState<{ type: string, value: string }[]>([])
  const [appliedDateFilters, setAppliedDateFilters] = React.useState<string[]>([])
  const [customStartDate, setCustomStartDate] = React.useState("")
  const [customEndDate, setCustomEndDate] = React.useState("")
  const [showCustomDate, setShowCustomDate] = React.useState(false)

  const handleValueChange = (val: string) => {
    let cleaned = val.replace(/[^0-9.,]/g, '')
    const firstSeparatorIndex = cleaned.search(/[.,]/)
    if (firstSeparatorIndex !== -1) {
      const beforeSeparator = cleaned.slice(0, firstSeparatorIndex)
      let afterSeparator = cleaned.slice(firstSeparatorIndex + 1).replace(/[.,]/g, '')
      if (afterSeparator.length > 2) {
        afterSeparator = afterSeparator.slice(0, 2)
      }
      cleaned = beforeSeparator + val[firstSeparatorIndex] + afterSeparator
    }
    setValFilterValue(cleaned)
  }

  const handleUserToggle = (userName: string) => {
    setSelectedUsers(prev => 
      prev.includes(userName) 
        ? prev.filter(name => name !== userName) 
        : [...prev, userName]
    )
  }

  const handleObservationRemove = (obsText: string) => {
    setAppliedObservations(prev => prev.filter(item => item !== obsText))
  }

  const handleValFilterRemove = (type: string, value: string) => {
    setAppliedValFilters(prev => prev.filter(f => !(f.type === type && f.value === value)))
  }

  const handleDateFilterRemove = (filterText: string) => {
    setAppliedDateFilters(prev => prev.filter(item => item !== filterText))
  }

  const handleDateFilterAdd = (label: string, detail: string) => {
    const filterText = `${label} ${detail}`
    if (!appliedDateFilters.includes(filterText)) {
      setAppliedDateFilters(prev => [...prev, filterText])
    }
  }

  const getDateFilterOptions = () => {
    const today = new Date()
    const monthsFull = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    const monthsShort = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

    const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const lastMonthLabel = monthsFull[lastMonthDate.getMonth()]
    const lastMonthYear = lastMonthDate.getFullYear()

    const thisMonthLabel = monthsFull[today.getMonth()]
    const thisMonthYear = today.getFullYear()

    const thisQuarter = Math.floor(today.getMonth() / 3) + 1
    const thisQuarterYear = today.getFullYear()

    let lastQuarter = thisQuarter - 1
    let lastQuarterYear = today.getFullYear()
    if (lastQuarter === 0) {
      lastQuarter = 4
      lastQuarterYear = today.getFullYear() - 1
    }

    const thisYear = today.getFullYear()

    const start30 = new Date(today)
    start30.setDate(today.getDate() - 30)
    const start30Month = monthsFull[start30.getMonth()]
    const start30Day = start30.getDate()
    const start30Year = start30.getFullYear()
    const end30Month = monthsFull[today.getMonth()]
    const end30Day = today.getDate()
    const end30Year = today.getFullYear()

    const start90 = new Date(today)
    start90.setDate(today.getDate() - 90)
    const start90Month = monthsShort[start90.getMonth()]
    const start90Day = start90.getDate()
    const start90Year = start90.getFullYear()
    const end90Month = monthsFull[today.getMonth()]
    const end90Day = today.getDate()
    const end90Year = today.getFullYear()

    return {
      ultimoMes: { label: "Último mês", detail: `${lastMonthLabel} ${lastMonthYear}` },
      esteMes: { label: "Este mês", detail: `${thisMonthLabel} ${thisMonthYear}` },
      esteTrimestre: { label: "Este Trimestre", detail: `T${thisQuarter} ${thisQuarterYear}` },
      ultimoTrimestre: { label: "Último Trimestre", detail: `T${lastQuarter} ${lastQuarterYear}` },
      esteAno: { label: "Este ano", detail: `${thisYear}` },
      ultimos30Dias: { label: "Últimos 30 dias", detail: `${start30Month} ${start30Day}, ${start30Year} - ${end30Month} ${end30Day}, ${end30Year}` },
      ultimos90Dias: { label: "Últimos 90 dias", detail: `${start90Month} ${start90Day}, ${start90Year} - ${end90Month} ${end90Day}, ${end90Year}` }
    }
  }

  const handleClearAll = () => {
    setSelectedUsers([])
    setAppliedObservations([])
    setAppliedValFilters([])
    setAppliedDateFilters([])
  }

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

  const activeSession = cashRegister.cashRegisterHistory.find(h => !h.isClosed)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="bg-white p-0 flex flex-col w-full sm:!w-[45vw] sm:!min-w-[780px] sm:!max-w-[960px] overflow-hidden"
      >

        {/* 2. Container Center / Main */}
        <div className="flex-1 grid grid-cols-[300px_1fr] min-h-0 overflow-hidden h-full w-full">
          
          {/* Coluna 1: Abrir / Sessão Ativa */}
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

          {/* Coluna 2: Histórico de Caixa */}
          <div className="flex flex-col pt-[12px] pb-[24px] px-[16px] h-full overflow-y-auto bg-white max-w-[540px] w-full">
            {/* Header da Coluna 2 */}
            <div className="py-0 shrink-0 flex items-center justify-between mb-[8px] min-h-[32px] gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 shrink-0">
                  <History className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                  <h3 className="text-xs font-normal text-zinc-600 font-sans">Histórico de Caixa</h3>
                </div>
                {selectedUsers.map((user) => (
                  <div
                    key={user}
                    className="flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 text-[10px] px-2 py-0.5 rounded-full transition-colors select-none animate-in fade-in zoom-in-95 duration-100"
                  >
                    <span className="text-zinc-400">Usuário: </span>
                    <span className="text-black font-semibold">{user}</span>
                    <button
                      onClick={() => handleUserToggle(user)}
                      className="text-zinc-400 hover:text-zinc-600 font-normal border-0 bg-transparent p-0 cursor-pointer text-[10px] leading-none focus:outline-none select-none transition-colors ml-0.5"
                      title={`Remover ${user}`}
                    >
                      x
                    </button>
                  </div>
                ))}
                {appliedObservations.map((obs) => (
                  <div
                    key={obs}
                    className="flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 text-[10px] px-2 py-0.5 rounded-full transition-colors select-none animate-in fade-in zoom-in-95 duration-100"
                  >
                    <span className="text-zinc-400">Observação: </span>
                    <span className="text-black font-semibold">{obs}</span>
                    <button
                      onClick={() => handleObservationRemove(obs)}
                      className="text-zinc-400 hover:text-zinc-600 font-normal border-0 bg-transparent p-0 cursor-pointer text-[10px] leading-none focus:outline-none select-none transition-colors ml-0.5"
                      title={`Remover ${obs}`}
                    >
                      x
                    </button>
                  </div>
                ))}
                {appliedValFilters.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 text-[10px] px-2 py-0.5 rounded-full transition-colors select-none animate-in fade-in zoom-in-95 duration-100"
                  >
                    <span className="text-zinc-400">{f.type}: </span>
                    <span className="text-black font-semibold">{f.value}</span>
                    <button
                      onClick={() => handleValFilterRemove(f.type, f.value)}
                      className="text-zinc-400 hover:text-zinc-600 font-normal border-0 bg-transparent p-0 cursor-pointer text-[10px] leading-none focus:outline-none select-none transition-colors ml-0.5"
                      title={`Remover ${f.type}: ${f.value}`}
                    >
                      x
                    </button>
                  </div>
                ))}
                {appliedDateFilters.map((dateStr) => (
                  <div
                    key={dateStr}
                    className="flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 text-[10px] px-2 py-0.5 rounded-full transition-colors select-none animate-in fade-in zoom-in-95 duration-100"
                  >
                    <span className="text-zinc-400">Data: </span>
                    <span className="text-black font-semibold">{dateStr}</span>
                    <button
                      onClick={() => handleDateFilterRemove(dateStr)}
                      className="text-zinc-400 hover:text-zinc-600 font-normal border-0 bg-transparent p-0 cursor-pointer text-[10px] leading-none focus:outline-none select-none transition-colors ml-0.5"
                      title={`Remover Data: ${dateStr}`}
                    >
                      x
                    </button>
                  </div>
                ))}
                {(selectedUsers.length > 0 || appliedObservations.length > 0 || appliedValFilters.length > 0 || appliedDateFilters.length > 0) && (
                  <button
                    onClick={handleClearAll}
                    className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100/85 text-[10px] font-normal border-0 bg-transparent px-1.5 py-0.5 rounded cursor-pointer focus:outline-none select-none transition-colors ml-1 animate-in fade-in duration-100 flex items-center gap-0.5"
                    title="Apagar tudo"
                  >
                    <span>Apagar tudo</span>
                    <span className="text-[10px] text-zinc-400 font-normal leading-none ml-0.5">x</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-[4px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <RippleButton
                      rippleColor="#a1a1aa"
                      rippleOnHover={true}
                      className="w-[32px] h-[32px] rounded-full bg-white hover:bg-zinc-50/50 border-0 p-0 flex items-center justify-center transition-colors text-zinc-500 hover:text-zinc-800 focus:outline-none cursor-pointer"
                      title="Filtrar"
                    >
                      <Filter className="h-[16px] w-[16px]" />
                    </RippleButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    sideOffset={4}
                    className="w-44 bg-white border border-zinc-200 text-black shadow-lg rounded-lg p-1 !outline-none !ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    {/* Item Usuário com Input de Pesquisa e Lista de Usuários */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="flex w-full items-center gap-2 px-2 py-1.5 text-xs font-semibold text-black rounded-md cursor-pointer hover:bg-[#f0f0f0] transition-all duration-150 ease-in-out focus:bg-[#f0f0f0] focus:text-black data-[state=open]:bg-[#f0f0f0] data-[state=open]:text-black !outline-none !ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none">
                        <User className="h-4 w-4 text-zinc-400 shrink-0" />
                        <span>Usuário</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent 
                        sideOffset={8}
                        className="w-56 bg-white border border-zinc-200 text-black shadow-lg rounded-lg p-1 !outline-none !ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none"
                      >
                        {/* Input de Pesquisa */}
                        <div 
                          className="flex items-center gap-2 px-2.5 py-1.5 border-b border-zinc-100 bg-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Search className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                          <input
                            type="text"
                            value={userSearchTerm}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === ' ') {
                                e.stopPropagation()
                              }
                            }}
                            placeholder="procurar..."
                            className="w-full bg-transparent text-xs text-black placeholder:text-zinc-400 !outline-none !ring-0 focus:ring-0 focus:outline-none border-0"
                          />
                        </div>
                        {/* Resultados dos Usuários */}
                        <div className="flex flex-col p-1 gap-[3px] max-h-40 overflow-y-auto">
                          {[
                            { name: "Ana Nogueira", initials: "AN" },
                            { name: "João Oliveira", initials: "JO" },
                            { name: "Operador Rafe", initials: "OP" }
                          ]
                            .filter(u => u.name.toLowerCase().includes(userSearchTerm.toLowerCase()))
                            .map((u, idx) => {
                              const isSelected = selectedUsers.includes(u.name)
                              return (
                                <div 
                                  key={idx}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleUserToggle(u.name)
                                  }}
                                  className="flex items-center gap-[6px] px-2 py-[5px] text-xs text-zinc-500 font-normal rounded-md cursor-pointer hover:bg-[#f0f0f0] transition-all duration-150 ease-in-out select-none"
                                >
                                  {/* Checkbox minimalista */}
                                  <div 
                                    className={cn(
                                      "w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors duration-150",
                                      isSelected 
                                        ? "bg-black border-black text-white" 
                                        : "bg-white border-zinc-300"
                                    )}
                                  >
                                    {isSelected && <Check className="h-2.5 w-2.5 stroke-[3.5]" />}
                                  </div>

                                  {/* Avatar minúsculo */}
                                  <Avatar className="h-3 w-3 select-none shrink-0 pointer-events-none">
                                    <AvatarFallback className="font-normal text-[5px] text-zinc-400 bg-zinc-100 border-0 flex items-center justify-center leading-none">
                                      {u.initials}
                                    </AvatarFallback>
                                  </Avatar>

                                  {/* Nome em cinza e font-normal */}
                                  <span className="truncate leading-none">{u.name}</span>
                                </div>
                              )
                            })
                          }
                          {[
                            { name: "Ana Nogueira", initials: "AN" },
                            { name: "João Oliveira", initials: "JO" },
                            { name: "Operador Rafe", initials: "OP" }
                          ].filter(u => u.name.toLowerCase().includes(userSearchTerm.toLowerCase())).length === 0 && (
                            <span className="text-[10px] text-zinc-400 text-center py-2 font-medium">Nenhum resultado</span>
                          )}
                        </div>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="flex w-full items-center gap-2 px-2 py-1.5 text-xs font-semibold text-black rounded-md cursor-pointer hover:bg-[#f0f0f0] transition-all duration-150 ease-in-out focus:bg-[#f0f0f0] focus:text-black data-[state=open]:bg-[#f0f0f0] data-[state=open]:text-black !outline-none !ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none">
                        <MessageSquare className="h-4 w-4 text-zinc-400 shrink-0" />
                        <span>Observação</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent 
                        sideOffset={8}
                        className="w-48 bg-white border border-zinc-200 text-black shadow-lg rounded-lg p-1.5 !outline-none !ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none"
                      >
                        <div 
                          className="px-2 py-1 bg-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={obsSearchTerm}
                            onChange={(e) => setObsSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === ' ') {
                                e.stopPropagation()
                              }
                            }}
                            placeholder="Filtrar por Obs..."
                            className="w-full bg-white border border-zinc-200 rounded px-2 py-1.5 text-xs text-black placeholder:text-zinc-400 !outline-none !ring-0 focus:ring-0 focus:outline-none focus:border-zinc-300"
                          />
                        </div>
                        <div 
                          className="flex items-center justify-end gap-1.5 px-2 pt-1.5 mt-1 border-t border-zinc-100 bg-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => setObsSearchTerm("")}
                            className="text-[10px] text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/80 font-medium px-2 py-1 rounded bg-transparent border-0 cursor-pointer focus:outline-none select-none transition-colors"
                          >
                            Apagar
                          </button>
                          <button
                            onClick={() => {
                              if (obsSearchTerm.trim()) {
                                if (!appliedObservations.includes(obsSearchTerm.trim())) {
                                  setAppliedObservations(prev => [...prev, obsSearchTerm.trim()])
                                }
                                setObsSearchTerm("")
                              }
                            }}
                            className="text-[10px] text-white bg-black hover:bg-black/90 font-medium px-2.5 py-1 rounded border-0 cursor-pointer focus:outline-none select-none transition-all"
                          >
                            Aplicar
                          </button>
                        </div>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="flex w-full items-center gap-2 px-2 py-1.5 text-xs font-semibold text-black rounded-md cursor-pointer hover:bg-[#f0f0f0] transition-all duration-150 ease-in-out focus:bg-[#f0f0f0] focus:text-black data-[state=open]:bg-[#f0f0f0] data-[state=open]:text-black !outline-none !ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none">
                        <Coins className="h-4 w-4 text-zinc-400 shrink-0" />
                        <span>Valores</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent 
                        sideOffset={8}
                        onPointerDownOutside={(e) => {
                          const target = e.target as HTMLElement;
                          if (target && (target.closest('[data-slot="select-content"]') || target.closest('[data-slot="select-trigger"]'))) {
                            e.preventDefault();
                          }
                        }}
                        className="w-56 bg-white border border-zinc-200 text-black shadow-lg rounded-lg p-1.5 !outline-none !ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none"
                      >
                        <div 
                          className="flex items-center gap-1.5 px-1.5 py-1 bg-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Select
                            value={valFilterType}
                            onValueChange={(val) => setValFilterType(val as any)}
                          >
                            <SelectTrigger 
                              className="w-[72px] h-8 px-2 border border-zinc-200 bg-white text-xs font-normal text-black focus:ring-0 focus-visible:ring-0 focus-visible:border-zinc-300 flex items-center justify-between"
                              onPointerDown={(e) => e.stopPropagation()}
                            >
                              <span className="truncate text-left flex-1 min-w-0 pr-1">
                                {valFilterType === "Valor Inicial" ? "Val. In." : valFilterType === "Valor Final" ? "Val. Fi." : "Dif."}
                              </span>
                            </SelectTrigger>
                            <SelectContent 
                              position="popper"
                              align="start"
                              className="bg-white border border-zinc-200 text-black shadow-md rounded-lg p-1 !outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
                              onPointerDown={(e) => e.stopPropagation()}
                            >
                              <SelectItem value="Valor Inicial" className="text-xs text-black cursor-pointer hover:bg-zinc-50 rounded px-2 py-1">Valor Inicial</SelectItem>
                              <SelectItem value="Valor Final" className="text-xs text-black cursor-pointer hover:bg-zinc-50 rounded px-2 py-1">Valor Final</SelectItem>
                              <SelectItem value="Diferença" className="text-xs text-black cursor-pointer hover:bg-zinc-50 rounded px-2 py-1">Diferença</SelectItem>
                            </SelectContent>
                          </Select>
                          <input
                            type="text"
                            value={valFilterValue}
                            onChange={(e) => handleValueChange(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === ' ') {
                                e.stopPropagation()
                              }
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            placeholder="0.00"
                            className="flex-1 min-w-0 bg-white border border-zinc-200 rounded-lg px-2 py-1 h-8 text-xs text-black placeholder:text-zinc-400 !outline-none !ring-0 focus:ring-0 focus:outline-none focus:border-zinc-300"
                          />
                        </div>
                        <div 
                          className="flex items-center justify-end gap-1.5 px-1.5 pt-1.5 mt-1 border-t border-zinc-100 bg-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => setValFilterValue("")}
                            className="text-[10px] text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/80 font-medium px-2 py-1 rounded bg-transparent border-0 cursor-pointer focus:outline-none select-none transition-colors"
                          >
                            Apagar
                          </button>
                          <button
                            onClick={() => {
                              if (valFilterValue.trim()) {
                                const isAlreadyApplied = appliedValFilters.some(
                                  f => f.type === valFilterType && f.value === valFilterValue.trim()
                                )
                                if (!isAlreadyApplied) {
                                  setAppliedValFilters(prev => [
                                    ...prev,
                                    { type: valFilterType, value: valFilterValue.trim() }
                                  ])
                                }
                                setValFilterValue("")
                              }
                            }}
                            className="text-[10px] text-white bg-black hover:bg-black/90 font-medium px-2.5 py-1 rounded border-0 cursor-pointer focus:outline-none select-none transition-all"
                          >
                            Aplicar
                          </button>
                        </div>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="flex w-full items-center gap-2 px-2 py-1.5 text-xs font-semibold text-black rounded-md cursor-pointer hover:bg-[#f0f0f0] transition-all duration-150 ease-in-out focus:bg-[#f0f0f0] focus:text-black data-[state=open]:bg-[#f0f0f0] data-[state=open]:text-black !outline-none !ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none">
                        <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
                        <span>Data</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent 
                        sideOffset={8}
                        onPointerDownOutside={(e) => {
                          const target = e.target as HTMLElement;
                          if (!target || !target.closest || target.tagName === 'INPUT' || target.closest('input')) {
                            e.preventDefault();
                          }
                        }}
                        className="w-[290px] bg-white border border-zinc-200 text-black shadow-lg rounded-lg p-1.5 !outline-none !ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none"
                      >
                        <div className="flex flex-col p-1 gap-[3px]">
                          {(() => {
                            const options = getDateFilterOptions()
                            return [
                              options.ultimoMes,
                              options.esteMes,
                              options.esteTrimestre,
                              options.ultimoTrimestre,
                              options.esteAno,
                              options.ultimos30Dias,
                              options.ultimos90Dias
                            ].map((opt, idx) => (
                              <div
                                key={idx}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleDateFilterAdd(opt.label, opt.detail)
                                }}
                                className="flex flex-wrap items-baseline justify-between px-2 py-1.5 text-xs rounded-md cursor-pointer hover:bg-[#f0f0f0] transition-all duration-150 ease-in-out select-none"
                              >
                                <span className="text-black font-semibold">{opt.label}</span>
                                <span className="text-zinc-400 font-normal text-[10px] ml-1.5">{opt.detail}</span>
                              </div>
                            ))
                          })()}
                        </div>

                        {showCustomDate ? (
                          <div 
                            className="p-2 border-t border-zinc-100 flex flex-col gap-2 bg-white"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                              Customizar Período
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1 flex flex-col gap-0.5">
                                <label className="text-[9px] text-zinc-400 font-medium">De</label>
                                <input
                                  type="date"
                                  value={customStartDate}
                                  onChange={(e) => setCustomStartDate(e.target.value)}
                                  onPointerDown={(e) => e.stopPropagation()}
                                  className="w-full bg-white border border-zinc-200 rounded px-1.5 py-1 text-xs text-black !outline-none focus:border-zinc-300"
                                />
                              </div>
                              <div className="flex-1 flex flex-col gap-0.5">
                                <label className="text-[9px] text-zinc-400 font-medium">Até</label>
                                <input
                                  type="date"
                                  value={customEndDate}
                                  onChange={(e) => setCustomEndDate(e.target.value)}
                                  onPointerDown={(e) => e.stopPropagation()}
                                  className="w-full bg-white border border-zinc-200 rounded px-1.5 py-1 text-xs text-black !outline-none focus:border-zinc-300"
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-end gap-1.5 pt-1 mt-1 border-t border-zinc-50">
                              <button
                                onClick={() => {
                                  setCustomStartDate("")
                                  setCustomEndDate("")
                                  setShowCustomDate(false)
                                }}
                                className="text-[10px] text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/80 font-medium px-2 py-1 rounded bg-transparent border-0 cursor-pointer focus:outline-none select-none transition-colors"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => {
                                  if (customStartDate && customEndDate) {
                                    const formatDateStr = (dStr: string) => {
                                      const parts = dStr.split('-')
                                      if (parts.length === 3) {
                                        return `${parts[2]}/${parts[1]}/${parts[0]}`
                                      }
                                      return dStr
                                    }
                                    const formattedRange = `${formatDateStr(customStartDate)} - ${formatDateStr(customEndDate)}`
                                    if (!appliedDateFilters.includes(formattedRange)) {
                                      setAppliedDateFilters(prev => [...prev, formattedRange])
                                    }
                                    setCustomStartDate("")
                                    setCustomEndDate("")
                                    setShowCustomDate(false)
                                  }
                                }}
                                className="text-[10px] text-white bg-black hover:bg-black/90 font-medium px-2.5 py-1 rounded border-0 cursor-pointer focus:outline-none select-none transition-all"
                              >
                                Aplicar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-1 border-t border-zinc-100">
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setShowCustomDate(true)
                              }}
                              className="w-full flex items-center justify-between px-2 py-1.5 text-xs text-black font-semibold hover:bg-zinc-100/80 rounded transition-colors text-left border-0 bg-transparent cursor-pointer outline-none focus:outline-none"
                            >
                              <span>Customizar Data</span>
                              <span className="text-[10px] text-zinc-400 font-normal">→</span>
                            </button>
                          </div>
                        )}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>

                <RippleButton
                  onClick={() => onOpenChange(false)}
                  rippleColor="#a1a1aa"
                  rippleOnHover={true}
                  className="w-[32px] h-[32px] rounded-full bg-white hover:bg-zinc-50/50 border-0 p-0 flex items-center justify-center transition-colors text-zinc-500 hover:text-zinc-800 focus:outline-none cursor-pointer"
                  title="Fechar"
                >
                  <X className="h-[16px] w-[16px]" />
                </RippleButton>
              </div>
            </div>
            {/* Main da Coluna 2 */}
            <div className="flex-1">
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
