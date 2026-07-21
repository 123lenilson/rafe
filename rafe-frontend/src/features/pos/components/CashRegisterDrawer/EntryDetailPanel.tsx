import React from 'react'
import { X } from 'lucide-react'
import { CashRegisterEntry } from '@/features/pos/types/cash.types'

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

  return (
    <div className="mt-[16px]">
      <div className="flex items-center justify-between mb-[8px]">
        <span className="text-[0.75rem] font-normal text-black">
          Detalhes da entrada
        </span>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-800 border-0 bg-transparent p-0 cursor-pointer"
          title="Fechar"
        >
          <X className="h-[16px] w-[16px]" />
        </button>
      </div>
      <div className="text-[0.75rem] text-black space-y-[4px]">
        <div>
          <span className="text-zinc-500">Abertura: </span>
          <span className="font-semibold">
            {openingMonthDay.month} {openingMonthDay.day} {formatTime(entry.openingTime)}
          </span>
        </div>
        <div>
          <span className="text-zinc-500">Fecho: </span>
          <span className="font-semibold">
            {closingMonthDay.month} {closingMonthDay.day} {formatTime(entry.closingTime)}
          </span>
        </div>
        <div>
          <span className="text-zinc-500">Operador: </span>
          <span className="font-semibold">{entry.operatorName}</span>
        </div>
        <div>
          <span className="text-zinc-500">V. Inicial: </span>
          <span className="font-semibold">
            {`${cashRegister.formatCurrency(entry.initialValue)}` + 'kz'}
          </span>
        </div>
        <div>
          <span className="text-zinc-500">V. Final: </span>
          <span className="font-semibold">
            {entry.isClosed ? `${cashRegister.formatCurrency(entry.finalValue)}kz` : 'Aberto'}
          </span>
        </div>
        <div>
          <span className="text-zinc-500">Diferença: </span>
          <span className="font-semibold">
            {entry.isClosed ? `${cashRegister.formatCurrency(entry.difference)}kz` : '---'}
          </span>
        </div>
      </div>
    </div>
  )
}
