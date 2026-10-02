import React from 'react'
import { X } from 'lucide-react'
import { CashRegisterEntry } from '@/features/pos/types/cash.types'
import { ValueTimeline } from '@/shared/components/ui/ValueTimeline'
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar'

function getMonthAndDay(dateStr?: string): { month: string; day: string } {
  if (!dateStr) return { month: '---', day: '' }
  const parts = dateStr.split('/')
  if (parts.length !== 3) return { month: dateStr, day: '' }
  const day = parseInt(parts[0], 10)
  const monthNum = parseInt(parts[1], 10)
  const monthsAbbr = ['jan,', 'fev,', 'mar,', 'abr,', 'mai,', 'jun,', 'jul,', 'ago,', 'set,', 'out,', 'nov,', 'dez,']
  const month = monthsAbbr[monthNum - 1] || ''
  return { month, day: String(day) }
}

function formatTime(timeStr?: string): string {
  if (!timeStr) return '---'
  const parts = timeStr.split(':')
  if (parts.length === 2) {
    return `${parts[0]}h${parts[1]}`
  }
  return timeStr
}

interface EntryDetailPanelProps {
  entry: CashRegisterEntry | null
  cashRegister: {
    formatCurrency: (value: number) => string
  }
  onClose: () => void
}

export function EntryDetailPanel({ entry, cashRegister, onClose }: EntryDetailPanelProps) {
  if (!entry) return null

  const openingMonthDay = getMonthAndDay(entry.openingDate)
  const closingMonthDay = getMonthAndDay(entry.closingDate)

  const formattedInitial = `${cashRegister.formatCurrency(entry.initialValue)} Kz`
  const formattedFinal = entry.isClosed ? `${cashRegister.formatCurrency(entry.finalValue)} Kz` : 'Em Aberto'
  const formattedDiff = entry.isClosed ? `${cashRegister.formatCurrency(entry.difference)} Kz` : '---'

  return (
    <div className="h-full bg-white border border-zinc-200/80 rounded-lg overflow-auto px-4 py-4 flex flex-col font-sans font-normal tracking-wide" style={{ boxShadow: '0 2px 16px 0 rgba(0,0,0,0.06), 0 1px 4px 0 rgba(0,0,0,0.04)' }}>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100 shrink-0">
        <span className="text-[0.75rem] font-normal tracking-wide text-zinc-900">
          {entry.isClosed ? 'Caixa fechado' : 'Caixa Aberto'}
        </span>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-700 border-0 bg-transparent p-1 rounded-md hover:bg-zinc-100 cursor-pointer transition-colors"
          title="Fechar"
        >
          <X className="h-[14px] w-[14px]" />
        </button>
      </div>

      {/* Linha do Tempo Vertical de Valores (ValueTimeline) */}
      <div className="mb-6 font-normal tracking-wide">
        <ValueTimeline
          initialValue={entry.initialValue}
          finalValue={entry.finalValue}
          differenceValue={entry.difference}
          formattedInitialValue={formattedInitial}
          formattedFinalValue={formattedFinal}
          formattedDifferenceValue={formattedDiff}
          isClosed={entry.isClosed}
        />
      </div>

      {/* Usuário */}
      <div className="flex items-center gap-3 text-black mb-4 pb-3 border-b border-zinc-100">
        <Avatar className="h-8 w-8 select-none shrink-0">
          <AvatarImage src="" alt={entry.operatorName} />
          <AvatarFallback className="font-bold text-xs text-black bg-zinc-100 border border-zinc-200">OP</AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0 text-left gap-0.5">
          <span className="text-sm font-semibold text-black truncate leading-tight">{entry.operatorName}</span>
        </div>
      </div>

      {/* sessao_das_datas */}
      <div className="text-[0.75rem] text-black space-y-[0.875rem] mb-4 pb-3 border-b border-zinc-100 font-normal tracking-wide">
        <div className="flex items-center justify-between">
          <span className="text-[0.76rem] font-semibold tracking-wide text-zinc-400">Abertura:</span>
          <span className="text-[0.76rem] font-medium tracking-wide text-right">
            {openingMonthDay.month} {openingMonthDay.day} {formatTime(entry.openingTime)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[0.76rem] font-semibold tracking-wide text-zinc-400">Fecho:</span>
          <span className="text-[0.76rem] font-medium tracking-wide text-right">
            {closingMonthDay.month} {closingMonthDay.day} {formatTime(entry.closingTime)}
          </span>
        </div>
      </div>

      {/* sessao_das_obs */}
      <div className="text-[0.75rem] text-black space-y-[0.875rem] mb-4 pb-3 border-b border-zinc-100 font-normal tracking-wide">
        <div className="bg-zinc-100 rounded-md px-3 py-2">
          <span className="block text-[0.625rem] font-semibold tracking-wide uppercase text-zinc-600">OBS na Abertura:</span>
          <span className="block mt-1 font-normal tracking-wide text-black">{entry.openingObservation?.trim() || 'Sem observações'}</span>
        </div>
        <div className="bg-zinc-100 rounded-md px-3 py-2">
          <span className="block text-[0.625rem] font-semibold tracking-wide uppercase text-zinc-600">OBS no Fecho:</span>
          <span className="block mt-1 font-normal tracking-wide text-black">{entry.closingObservation?.trim() || 'Sem observações'}</span>
        </div>
      </div>
    </div>
  )
}
