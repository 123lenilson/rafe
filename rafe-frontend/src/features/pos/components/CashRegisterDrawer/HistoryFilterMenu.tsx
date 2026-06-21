import React from 'react'
import { Filter, Search, Check, User, MessageSquare, Coins, Calendar } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/shared/components/ui/dropdown-menu'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/shared/components/ui/select'
import { RippleButton } from '@/shared/components/ui/ripple-button'
import { cn } from '@/lib/utils'
import { useCashHistoryFilters } from '@/features/pos/hooks/useCashHistoryFilters'

interface HistoryFilterMenuProps {
  filters: ReturnType<typeof useCashHistoryFilters>
}

export function HistoryFilterMenu({ filters }: HistoryFilterMenuProps) {
  const {
    userSearchTerm,
    setUserSearchTerm,
    selectedUsers,
    handleUserToggle,
    obsSearchTerm,
    setObsSearchTerm,
    appliedObservations,
    setAppliedObservations,
    valFilterType,
    setValFilterType,
    valFilterValue,
    handleValueChange,
    setValFilterValue,
    appliedValFilters,
    setAppliedValFilters,
    getDateFilterOptions,
    handleDateFilterAdd,
    showCustomDate,
    setShowCustomDate,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    appliedDateFilters,
    setAppliedDateFilters,
  } = filters

  return (
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
  )
}
