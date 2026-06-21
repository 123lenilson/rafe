import { useState } from 'react'

export function useCashHistoryFilters() {
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>(["Operador Rafe"])
  const [obsSearchTerm, setObsSearchTerm] = useState("")
  const [appliedObservations, setAppliedObservations] = useState<string[]>([])
  const [valFilterType, setValFilterType] = useState<"Valor Inicial" | "Valor Final" | "Diferença">("Valor Inicial")
  const [valFilterValue, setValFilterValue] = useState("")
  const [appliedValFilters, setAppliedValFilters] = useState<{ type: string; value: string }[]>([])
  const [appliedDateFilters, setAppliedDateFilters] = useState<string[]>([])
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const [showCustomDate, setShowCustomDate] = useState(false)

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

  return {
    userSearchTerm,
    setUserSearchTerm,
    selectedUsers,
    setSelectedUsers,
    obsSearchTerm,
    setObsSearchTerm,
    appliedObservations,
    setAppliedObservations,
    valFilterType,
    setValFilterType,
    valFilterValue,
    setValFilterValue,
    appliedValFilters,
    setAppliedValFilters,
    appliedDateFilters,
    setAppliedDateFilters,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    showCustomDate,
    setShowCustomDate,
    handleValueChange,
    handleUserToggle,
    handleObservationRemove,
    handleValFilterRemove,
    handleDateFilterRemove,
    handleDateFilterAdd,
    getDateFilterOptions,
    handleClearAll
  }
}
