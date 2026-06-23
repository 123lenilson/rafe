import React from 'react'
import { History, X } from 'lucide-react'
import { RippleButton } from '@/shared/components/ui/ripple-button'
import { HistoryFilterMenu } from './HistoryFilterMenu'
import { useCashHistoryFilters } from '@/features/pos/hooks/useCashHistoryFilters'
import { useCashRegister } from '@/features/pos/hooks/useCashRegister'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/components/ui/tooltip'

function getFormattedGroupHeader(dateStr: string): string {
  const parts = dateStr.split('/')
  if (parts.length !== 3) return dateStr
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const year = parseInt(parts[2], 10)

  const date = new Date(year, month - 1, day)

  const weekDays = [
    'Domingo',
    'Segunda-Feira',
    'Terça-Feira',
    'Quarta-Feira',
    'Quinta-Feira',
    'Sexta-Feira',
    'Sábado'
  ]
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]

  const weekDay = weekDays[date.getDay()]
  const monthName = months[date.getMonth()]

  const today = new Date()
  const isToday = today.getDate() === day && (today.getMonth() + 1) === month && today.getFullYear() === year

  if (isToday) {
    return `Hoje - ${weekDay}, ${day} de ${monthName} de ${year}`
  }

  return `${weekDay}, ${day} de ${monthName} de ${year}`
}

interface CashHistoryPanelProps {
  filters: ReturnType<typeof useCashHistoryFilters>
  onOpenChange: (open: boolean) => void
  cashRegister: ReturnType<typeof useCashRegister>
}

export function CashHistoryPanel({ filters, onOpenChange, cashRegister }: CashHistoryPanelProps) {
  const {
    selectedUsers,
    handleUserToggle,
    appliedObservations,
    handleObservationRemove,
    appliedValFilters,
    handleValFilterRemove,
    appliedDateFilters,
    handleDateFilterRemove,
    handleClearAll,
  } = filters

  // Group history entries by openingDate
  const uniqueDates: string[] = []
  const groupedHistory: Record<string, typeof cashRegister.cashRegisterHistory> = {}

  cashRegister.cashRegisterHistory.forEach((entry) => {
    const date = entry.openingDate || 'Sem Data'
    if (!uniqueDates.includes(date)) {
      uniqueDates.push(date)
    }
    if (!groupedHistory[date]) {
      groupedHistory[date] = []
    }
    groupedHistory[date].push(entry)
  })

  return (
    <div className="flex flex-col pt-[12px] pb-[24px] px-[16px] h-full overflow-hidden bg-white max-w-[540px] w-full mx-auto">
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
          <HistoryFilterMenu filters={filters} />

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
      <div className="flex-1 mt-[16px] min-h-0 flex flex-col">
        <div className="max-w-[508px] w-full mx-auto bg-white p-[3px] rounded-xl flex-1 overflow-y-auto flex flex-col gap-[16px]">
          {uniqueDates.map((dateStr) => (
            <div key={dateStr} className="flex flex-col gap-[8px]">
              {/* Data agrupada como título */}
              <div className="text-[0.8125rem] font-bold tracking-wider text-black pl-[6px] mb-[2px]">
                {getFormattedGroupHeader(dateStr)}
              </div>
              
              <div className="flex flex-col gap-[6px]">
                {groupedHistory[dateStr].map((entry) => (
                  <CashHistoryCard
                    key={entry.id}
                    entry={entry}
                    formatCurrency={cashRegister.formatCurrency}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface CashHistoryCardProps {
  entry: any
  formatCurrency: (val: any) => string
}

function CashHistoryCard({ entry, formatCurrency }: CashHistoryCardProps) {
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false)
  const [hasTruncation, setHasTruncation] = React.useState(false)
  const commentRef = React.useRef<HTMLParagraphElement>(null)

  const handleMouseEnter = () => {
    if (commentRef.current) {
      const isTruncated = commentRef.current.scrollWidth > commentRef.current.clientWidth
      setHasTruncation(isTruncated)
    }
  }

  const initialStr = `${formatCurrency(entry.initialValue)}kz`
  const finalStr = entry.isClosed ? `${formatCurrency(entry.finalValue)}kz` : '---'
  const diffStr = entry.isClosed ? `${formatCurrency(entry.difference)}kz` : '---'

  return (
    <Tooltip open={isTooltipOpen && hasTruncation} onOpenChange={setIsTooltipOpen}>
      <TooltipTrigger asChild>
        <div 
          className="flex flex-row w-full gap-[24px] px-[6px] py-[4px] bg-[#F5F5F5] hover:bg-[#EAEAEA] transition-colors cursor-pointer rounded-lg shrink-0"
          onMouseEnter={handleMouseEnter}
        >
          <div className="shrink-0 flex flex-col">
            <div className="whitespace-nowrap text-[0.7rem] text-center leading-none">
              <div className="text-zinc-500">Abertura</div>
              <div className="text-black font-bold">às {entry.openingTime}</div>
            </div>
            <div className="w-[1px] h-[35px] bg-zinc-300 mx-auto" />
            <div className="whitespace-nowrap text-[0.7rem] text-center leading-none">
              <div className="text-zinc-500">Fechamento</div>
              <div className="text-black font-bold">
                {entry.isClosed ? `às ${entry.closingTime}` : 'Aberto'}
              </div>
            </div>
          </div>
          {/* bloco-user-valores */}
          <div className="flex-1 pl-0 pr-0 min-w-0 flex flex-col justify-between">
            {/* bloco-user */}
            <div className="w-full shrink-0">
              {/* Avatar com nome */}
              <div className="flex flex-row items-center gap-[6px] w-full">
                <Avatar className="h-[18px] w-[18px] shrink-0">
                  <AvatarFallback className="text-[7px] font-bold">{entry.operatorInitials}</AvatarFallback>
                </Avatar>
                <span className="text-[0.75rem] font-normal text-black">{entry.operatorName}</span>
              </div>
              {/* Comentário */}
              {entry.observation && (
                <p 
                  ref={commentRef}
                  className="text-[0.65rem] text-zinc-400 leading-none truncate mt-0 ml-[24px]"
                >
                  "{entry.observation}"
                </p>
              )}
            </div>
            {/* bloco-valores */}
            <div className="w-full flex-1 flex flex-row items-end pt-[18px] mt-0">
              <div className="flex-1 text-center leading-none">
                <div className="flex flex-row items-center justify-center gap-[3px] text-[0.7rem] text-zinc-500 font-normal">
                  <span className="h-[4px] w-[4px] rounded-full bg-blue-500 shrink-0" />
                  <span>Valor Inicial</span>
                </div>
                <div className="mt-[2px] text-[1.15rem] font-normal text-black">{initialStr}</div>
              </div>
              <div className="w-[1px] h-[24px] bg-zinc-300 self-center" />
              <div className="flex-1 text-center leading-none">
                <div className="flex flex-row items-center justify-center gap-[3px] text-[0.7rem] text-zinc-500 font-normal">
                  <span className="h-[4px] w-[4px] rounded-full bg-orange-500 shrink-0" />
                  <span>Valor Final</span>
                </div>
                <div className="mt-[2px] text-[1.15rem] font-normal text-black">{finalStr}</div>
              </div>
              <div className="w-[1px] h-[24px] bg-zinc-300 self-center" />
              <div className="flex-1 text-center leading-none">
                <div className="flex flex-row items-center justify-center gap-[3px] text-[0.7rem] text-zinc-500 font-normal">
                  <span className="h-[4px] w-[4px] rounded-full bg-green-500 shrink-0" />
                  <span>Diferença</span>
                </div>
                <div className="mt-[2px] text-[1.15rem] font-normal text-black">{diffStr}</div>
              </div>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      {entry.observation && (
        <TooltipContent side="top" align="center" className="bg-black text-white text-[10px] p-2 max-w-xs">
          "{entry.observation}"
        </TooltipContent>
      )}
    </Tooltip>
  )
}
