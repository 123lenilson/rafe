import React from 'react'
import { History, X, MoreVertical, ArrowUpDown } from 'lucide-react'
import { RippleButton } from '@/shared/components/ui/ripple-button'
import { HistoryFilterMenu } from './HistoryFilterMenu'
import { useCashHistoryFilters } from '@/features/pos/hooks/useCashHistoryFilters'
import { useCashRegister } from '@/features/pos/hooks/useCashRegister'
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

function capitalizeFirst(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function parseDateStr(dateStr: string): Date {
  const parts = dateStr.split('/')
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const year = parseInt(parts[2], 10)
  return new Date(year, month, day)
}

function getSunday(d: Date): Date {
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.getFullYear(), d.getMonth(), diff)
}

function getWeekKey(d: Date): string {
  const sun = getSunday(d)
  return `${sun.getFullYear()}-${sun.getMonth() + 1}-${sun.getDate()}`
}

function getDayLabel(dateStr: string): string {
  const parts = dateStr.split('/')
  if (parts.length !== 3) return dateStr
  const d = parseDateStr(dateStr)
  
  const today = new Date()
  const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`
  
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  const yesterdayStr = `${String(yesterday.getDate()).padStart(2, '0')}/${String(yesterday.getMonth() + 1).padStart(2, '0')}/${yesterday.getFullYear()}`
  
  const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  
  const weekday = weekdays[d.getDay()]
  const day = parseInt(parts[0], 10)
  const month = months[parseInt(parts[1], 10) - 1]
  
  if (dateStr === todayStr) {
    return `hoje, ${weekday.toLowerCase()}`
  } else if (dateStr === yesterdayStr) {
    return `ontem, ${weekday.toLowerCase()}`
  } else {
    return `${weekday.toLowerCase()}, ${day} de ${month.toLowerCase()}`
  }
}

function getMonthSectionLabel(monthYearKey: string): string {
  const parts = monthYearKey.split('/')
  const monthNum = parseInt(parts[0], 10)
  const year = parseInt(parts[1], 10)
  
  const today = new Date()
  const thisMonth = today.getMonth() + 1
  const thisYear = today.getFullYear()
  
  let lastMonth = thisMonth - 1
  let lastMonthYear = thisYear
  if (lastMonth === 0) {
    lastMonth = 12
    lastMonthYear = thisYear - 1
  }

  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const monthName = months[monthNum - 1]

  if (monthNum === thisMonth && year === thisYear) {
    return `este mês, ${monthName.toLowerCase()} ${year}`
  } else if (monthNum === lastMonth && year === lastMonthYear) {
    return `mês passado, ${monthName.toLowerCase()} ${year}`
  } else {
    return `${monthName.toLowerCase()} ${year}`
  }
}

function getWeekLabel(weekKey: string): string {
  const parts = weekKey.split('-')
  const year = parseInt(parts[0], 10)
  const monthNum = parseInt(parts[1], 10)
  const day = parseInt(parts[2], 10)
  
  const today = new Date()
  const todaySun = getSunday(today)
  
  const formatWeekKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  const todaySunKeyStr = formatWeekKey(todaySun)
  
  const lastWeekSun = new Date(todaySun)
  lastWeekSun.setDate(todaySun.getDate() - 7)
  const lastWeekSunKeyStr = formatWeekKey(lastWeekSun)

  if (weekKey === todaySunKeyStr) {
    return 'esta semana'
  } else if (weekKey === lastWeekSunKeyStr) {
    return 'semana passada'
  } else {
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    return `semana de ${day} de ${months[monthNum - 1]}`
  }
}

interface GroupedSection {
  title: string
  entries: CashRegisterEntry[]
  sortDate: Date
}

function groupHistory(entries: CashRegisterEntry[]): GroupedSection[] {
  const sorted = [...entries].sort((a, b) => {
    const dateA = parseDateStr(a.openingDate)
    const dateB = parseDateStr(b.openingDate)
    if (dateA.getTime() !== dateB.getTime()) {
      return dateB.getTime() - dateA.getTime()
    }
    return b.openingTime.localeCompare(a.openingTime)
  })

  const weeksMap = new Map<string, CashRegisterEntry[]>()
  sorted.forEach(entry => {
    const d = parseDateStr(entry.openingDate)
    const weekKey = getWeekKey(d)
    if (!weeksMap.has(weekKey)) {
      weeksMap.set(weekKey, [])
    }
    weeksMap.get(weekKey)!.push(entry)
  })

  const sections: GroupedSection[] = []
  const monthlySparseEntries = new Map<string, CashRegisterEntry[]>()

  weeksMap.forEach((weekEntries, weekKey) => {
    const dayCounts = new Map<string, number>()
    const dayEntriesMap = new Map<string, CashRegisterEntry[]>()
    
    weekEntries.forEach(entry => {
      dayCounts.set(entry.openingDate, (dayCounts.get(entry.openingDate) || 0) + 1)
      if (!dayEntriesMap.has(entry.openingDate)) {
        dayEntriesMap.set(entry.openingDate, [])
      }
      dayEntriesMap.get(entry.openingDate)!.push(entry)
    })

    const daysWithAtLeastFive = Array.from(dayCounts.values()).filter(count => count >= 5).length

    if (daysWithAtLeastFive >= 6) {
      const firstEntryDate = parseDateStr(weekEntries[0].openingDate)
      sections.push({
        title: capitalizeFirst(getWeekLabel(weekKey)),
        entries: weekEntries,
        sortDate: firstEntryDate
      })
    } else {
      dayEntriesMap.forEach((dayEntries, day) => {
        if (dayEntries.length >= 10) {
          sections.push({
            title: capitalizeFirst(getDayLabel(day)),
            entries: dayEntries,
            sortDate: parseDateStr(day)
          })
        } else {
          const parts = day.split('/')
          if (parts.length === 3) {
            const monthYearKey = `${parts[1]}/${parts[2]}` // MM/YYYY
            if (!monthlySparseEntries.has(monthYearKey)) {
              monthlySparseEntries.set(monthYearKey, [])
            }
            monthlySparseEntries.get(monthYearKey)!.push(...dayEntries)
          }
        }
      })
    }
  })

  monthlySparseEntries.forEach((monthEntries, monthYearKey) => {
    monthEntries.sort((a, b) => {
      const dateA = parseDateStr(a.openingDate)
      const dateB = parseDateStr(b.openingDate)
      if (dateA.getTime() !== dateB.getTime()) {
        return dateB.getTime() - dateA.getTime()
      }
      return b.openingTime.localeCompare(a.openingTime)
    })
    const latestEntryDate = parseDateStr(monthEntries[0].openingDate)
    sections.push({
      title: capitalizeFirst(getMonthSectionLabel(monthYearKey)),
      entries: monthEntries,
      sortDate: latestEntryDate
    })
  })

  sections.sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())

  return sections
}

interface CashHistoryPanelProps {
  filters: ReturnType<typeof useCashHistoryFilters>
  onOpenChange: (open: boolean) => void
  cashRegister: ReturnType<typeof useCashRegister>
  activeValue?: string | null
  activeObservation?: string | null
}

export function CashHistoryPanel({ filters, onOpenChange, cashRegister, activeValue, activeObservation }: CashHistoryPanelProps) {
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

  return (
    <div className="flex flex-col pt-[28px] pb-[40px] px-[16px] h-full overflow-hidden bg-white max-w-[680px] w-full mx-auto">
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
        <div className="max-w-[640px] w-full mx-auto bg-white rounded-xl flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            {(() => {
              const activeSession = cashRegister.cashRegisterHistory.find(h => !h.isClosed)
              const closedHistory = cashRegister.cashRegisterHistory.filter(h => h.isClosed)
              const sections = groupHistory(closedHistory)
              return (
                <>
                  {/* Caixa aberto */}
                  {activeSession && (
                    <div className="mb-[20px]">
                      <div className="mb-[2px] px-[6px]">
                        <span className="text-[12px] font-normal text-black">
                          Caixa aberto
                        </span>
                      </div>
                      <table className="w-full text-[12px] font-sans border-collapse select-none border-none">
                        <thead className="sticky top-0 bg-white z-10 text-[11px] border-b border-zinc-200/60">
                          <tr className="text-black font-semibold h-[28px] border-none">
                            <th className="px-[6px] py-[4px] border-none"></th>
                            <th className="px-[6px] py-[4px] border-none"></th>
                            <th className="px-[6px] py-[4px] border-none"></th>
                            <th className="text-right px-[6px] py-[4px] font-semibold border-none">
                              <span className="inline-flex items-center gap-[4px]">
                                <ArrowUpDown className="h-3 w-3 text-blue-500" />
                                V. Inicial
                              </span>
                            </th>
                            <th className="text-right px-[6px] py-[4px] font-semibold border-none">
                              <span className="inline-flex items-center gap-[4px]">
                                <ArrowUpDown className="h-3 w-3 text-orange-500" />
                                V. Final
                              </span>
                            </th>
                            <th className="text-right px-[6px] py-[4px] font-semibold border-none">
                              <span className="inline-flex items-center gap-[4px]">
                                <ArrowUpDown className="h-3 w-3 text-green-500" />
                                Diferença
                              </span>
                            </th>
                            <th className="w-[36px] px-[4px] py-[4px] border-none"></th>
                          </tr>
                        </thead>

                        <tbody className="divide-none border-none">
                          <tr
                            className="h-[44px] hover:bg-zinc-50/50 transition-colors duration-150 text-black border-none"
                          >
                            <td className="relative pl-[14px] pr-[6px] py-[6px] text-left whitespace-nowrap border-none">
                              {/* Retângulo vertical verde por linha */}
                              <div className="absolute left-0 top-[10px] bottom-[10px] w-[3px] bg-green-500 rounded-sm" />

                              <span className="inline-block border-b border-dotted border-zinc-300 pb-[2px]">
                                {(() => {
                                  const { month, day } = getMonthAndDay(activeSession.openingDate)
                                  return (
                                    <>
                                      <span className="text-zinc-400">{month} {day}</span>
                                      <span className="text-zinc-400 ml-2">ab:</span>{' '}
                                      <span className="text-black font-semibold">{formatTime(activeSession.openingTime)}</span>
                                      <span className="text-zinc-400 ml-2">fe:</span>{' '}
                                      <span className="text-green-600 font-semibold">Aberto</span>
                                    </>
                                  )
                                })()}
                              </span>
                            </td>
                            <td className="px-[6px] py-[6px] text-left max-w-[100px] truncate border-none" title={activeSession.operatorName}>
                              {activeSession.operatorName}
                            </td>
                            {(() => {
                              const activeHasTypedObs = activeObservation !== undefined && activeObservation !== null && activeObservation.trim() !== ""
                              const activeObsPreview = activeHasTypedObs
                                ? `${activeObservation.trim().slice(0, 3)}...`
                                : activeSession.openingObservation
                                ? `${activeSession.openingObservation.slice(0, 3)}...`
                                : activeSession.observation
                                ? `${activeSession.observation.slice(0, 3)}...`
                                : '---'
                              const activeObsTitle = [
                                activeSession.openingObservation ? `obs da abertura: "${activeSession.openingObservation}"` : "",
                                activeObservation && activeObservation.trim() ? `obs do fecho: "${activeObservation.trim()}"` : ""
                              ].filter(Boolean).join('\n') || activeSession.observation || ''
                              return (
                                <td className="px-[6px] py-[6px] text-left max-w-[100px] truncate italic border-none" title={activeObsTitle}>
                                  {activeObsPreview}
                                </td>
                              )
                            })()}
                            <td className="px-[6px] py-[6px] text-right font-sans whitespace-nowrap border-none">
                              <span className="inline-block px-[6px] py-[1px] bg-zinc-50 border border-zinc-200 rounded-[4px] font-semibold">
                                {`${cashRegister.formatCurrency(activeSession.initialValue)}` + 'kz'}
                              </span>
                            </td>
                            {(() => {
                              const hasTyped = activeValue !== undefined && activeValue !== null && activeValue !== "0"
                              const typedVal = parseFloat(activeValue || "0") || 0
                              const finalStr = hasTyped
                                ? `${cashRegister.formatCurrency(typedVal)}kz`
                                : '---'
                              const diff = hasTyped
                                ? typedVal - activeSession.initialValue
                                : 0
                              const diffStr = hasTyped
                                ? `${cashRegister.formatCurrency(diff)}` + 'kz'
                                : '---'
                              return (
                                <>
                                  <td className="px-[6px] py-[6px] text-right font-sans whitespace-nowrap border-none">
                                    <span 
                                      key={finalStr}
                                      className={`inline-block px-[6px] py-[1px] bg-zinc-50 border border-zinc-200 rounded-[4px] font-semibold animate-in zoom-in-95 duration-100 ${hasTyped ? 'text-black' : 'text-zinc-400'}`}
                                    >
                                      {finalStr}
                                    </span>
                                  </td>
                                  <td className="px-[6px] py-[6px] text-right font-sans whitespace-nowrap border-none">
                                    <span 
                                      key={diffStr}
                                      className={`inline-block px-[6px] py-[1px] bg-zinc-50 border border-zinc-200 rounded-[4px] font-semibold animate-in zoom-in-95 duration-100 ${hasTyped && diff < 0 ? 'text-red-600' : hasTyped ? 'text-black' : 'text-zinc-400'}`}
                                    >
                                      {diffStr}
                                    </span>
                                  </td>
                                </>
                              )
                            })()}
                            <td className="px-[4px] py-[6px] text-center w-[36px] border-none">
                              <button className="h-[28px] w-[28px] flex items-center justify-center text-zinc-400 hover:text-black rounded-full hover:bg-zinc-100 transition-colors focus:outline-none cursor-pointer">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Histórico fechado */}
                  {sections.map((section, sectionIdx) => (
                    <div key={section.title} className={sectionIdx > 0 || activeSession ? 'mt-[20px]' : ''}>
                      <div className="mb-[2px] px-[6px]">
                        <span className="text-[12px] font-normal text-black">
                          {section.title}
                        </span>
                      </div>
                      <table className="w-full text-[12px] font-sans border-collapse select-none border-none">
                        <thead className="sticky top-0 bg-white z-10 text-[11px] border-b border-zinc-200/60">
                          <tr className="text-black font-semibold h-[28px] border-none">
                            <th className="px-[6px] py-[4px] border-none"></th>
                            <th className="px-[6px] py-[4px] border-none"></th>
                            <th className="px-[6px] py-[4px] border-none"></th>
                            <th className="text-right px-[6px] py-[4px] font-semibold border-none">
                              <span className="inline-flex items-center gap-[4px]">
                                <ArrowUpDown className="h-3 w-3 text-blue-500" />
                                V. Inicial
                              </span>
                            </th>
                            <th className="text-right px-[6px] py-[4px] font-semibold border-none">
                              <span className="inline-flex items-center gap-[4px]">
                                <ArrowUpDown className="h-3 w-3 text-orange-500" />
                                V. Final
                              </span>
                            </th>
                            <th className="text-right px-[6px] py-[4px] font-semibold border-none">
                              <span className="inline-flex items-center gap-[4px]">
                                <ArrowUpDown className="h-3 w-3 text-green-500" />
                                Diferença
                              </span>
                            </th>
                            <th className="w-[36px] px-[4px] py-[4px] border-none"></th>
                          </tr>
                        </thead>

                        <tbody className="divide-none border-none">
                          {section.entries.map((entry) => {
                            const initialStr = `${cashRegister.formatCurrency(entry.initialValue)}` + 'kz'
                            const finalStr = entry.isClosed ? `${cashRegister.formatCurrency(entry.finalValue)}` + 'kz' : 'Aberto'
                            const diffStr = entry.isClosed ? `${cashRegister.formatCurrency(entry.difference)}` + 'kz' : '---'

                            return (
                              <tr
                                key={entry.id}
                                className="h-[44px] hover:bg-zinc-50/50 transition-colors duration-150 text-black border-none"
                              >
                                <td className="relative pl-[14px] pr-[6px] py-[6px] text-left whitespace-nowrap border-none">
                                  {/* Retângulo vertical azul por linha */}
                                  <div className="absolute left-0 top-[10px] bottom-[10px] w-[3px] bg-blue-500 rounded-sm" />

                                  <span className="inline-block border-b border-dotted border-zinc-300 pb-[2px]">
                                    {(() => {
                                      const { month, day } = getMonthAndDay(entry.openingDate)
                                      return (
                                        <>
                                          <span className="text-zinc-400">{month} {day}</span>
                                          <span className="text-zinc-400 ml-2">ab:</span>{' '}
                                          <span className="text-black font-semibold">{formatTime(entry.openingTime)}</span>
                                          <span className="text-zinc-400 ml-2">fe:</span>{' '}
                                          {entry.isClosed ? (
                                            <span className="text-black font-semibold">{formatTime(entry.closingTime)}</span>
                                          ) : (
                                            <span className="text-green-600 font-semibold">Aberto</span>
                                          )}
                                        </>
                                      )
                                    })()}
                                  </span>
                                </td>
                                <td className="px-[6px] py-[6px] text-left max-w-[100px] truncate border-none" title={entry.operatorName}>
                                  {entry.operatorName}
                                </td>
                                <td className="px-[6px] py-[6px] text-left max-w-[100px] truncate italic border-none" title={entry.observation}>
                                  {(() => {
                                    if (entry.closingObservation) {
                                      return `${entry.closingObservation.slice(0, 3)}...`
                                    }
                                    if (entry.openingObservation) {
                                      return `${entry.openingObservation.slice(0, 3)}...`
                                    }
                                    if (entry.observation) {
                                      return `${entry.observation.slice(0, 3)}...`
                                    }
                                    return '---'
                                  })()}
                                </td>
                                <td className="px-[6px] py-[6px] text-right font-sans whitespace-nowrap border-none">
                                  <span className="inline-block px-[6px] py-[1px] bg-zinc-50 border border-zinc-200 rounded-[4px] font-semibold">
                                    {initialStr}
                                  </span>
                                </td>
                                <td className="px-[6px] py-[6px] text-right font-sans whitespace-nowrap border-none">
                                  <span className="inline-block px-[6px] py-[1px] bg-zinc-50 border border-zinc-200 rounded-[4px] font-semibold">
                                    {finalStr}
                                  </span>
                                </td>
                                <td className="px-[6px] py-[6px] text-right font-sans whitespace-nowrap border-none">
                                  <span className="inline-block px-[6px] py-[1px] bg-zinc-50 border border-zinc-200 rounded-[4px] font-semibold">
                                    {diffStr}
                                  </span>
                                </td>
                                <td className="px-[4px] py-[6px] text-center w-[36px] border-none">
                                  <button className="h-[28px] w-[28px] flex items-center justify-center text-zinc-400 hover:text-black rounded-full hover:bg-zinc-100 transition-colors focus:outline-none cursor-pointer">
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </>
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
