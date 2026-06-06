import { useState } from 'react'
import { CashRegisterEntry } from '@/features/pos/types/cash.types'

export function useCashRegister() {
  const [isCashRegisterOpened, setIsCashRegisterOpened] = useState<boolean>(false)
  const [cashRegisterValue, setCashRegisterValue] = useState<string>("0")
  const [cashRegisterObservation, setCashRegisterObservation] = useState<string>("")
  const [cashRegisterHistory, setCashRegisterHistory] = useState<CashRegisterEntry[]>([
    {
      id: 1,
      operatorName: "Ana Nogueira",
      operatorInitials: "AN",
      openingDate: "02/06/2026",
      openingTime: "08:15",
      closingDate: "02/06/2026",
      closingTime: "12:30",
      initialValue: 10000,
      finalValue: 45200,
      difference: 0,
      observation: "Caixa fechado sem inconformidades. Vendas do turno da manhã.",
      isClosed: true
    },
    {
      id: 2,
      operatorName: "João Oliveira",
      operatorInitials: "JO",
      openingDate: "01/06/2026",
      openingTime: "14:00",
      closingDate: "01/06/2026",
      closingTime: "22:15",
      initialValue: 15000,
      finalValue: 98450,
      difference: -150,
      observation: "Falta de 150 kz devido a arredondamento de trocos no POS.",
      isClosed: true
    },
    {
      id: 3,
      operatorName: "Operador Rafe",
      operatorInitials: "OP",
      openingDate: "01/06/2026",
      openingTime: "08:00",
      closingDate: "01/06/2026",
      closingTime: "13:45",
      initialValue: 10000,
      finalValue: 32500,
      difference: 0,
      observation: "Tudo em ordem. Caixa inicial padrão.",
      isClosed: true
    }
  ])

  const formatCurrency = (value?: string | number) => {
    if (value === undefined || value === null) return '0,00'
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) return '0,00'
    return num.toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatDisplayValue = (val: string) => {
    if (!val) return '0,00'
    const clean = val.replace(/[^0-9.]/g, '')
    if (!clean) return '0,00'
    const parts = clean.split('.')
    const integerPart = parts[0]
    const decimalPart = parts[1]
    const formattedInteger = parseInt(integerPart || '0', 10).toLocaleString('pt-AO')
    if (decimalPart !== undefined) {
      return `${formattedInteger},${decimalPart}`
    }
    if (clean.endsWith('.')) {
      return `${formattedInteger},`
    }
    return formattedInteger
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
      setCashRegisterValue(prev => {
        if (prev === "0") return key
        return prev + key
      })
    }
  }

  const handleOpenCashRegister = () => {
    const val = parseFloat(cashRegisterValue)
    if (isNaN(val) || val < 0) return
    const newEntry: CashRegisterEntry = {
      id: Date.now(),
      operatorName: "Operador Rafe",
      operatorInitials: "OP",
      openingDate: new Date().toLocaleDateString('pt-PT'),
      openingTime: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      closingDate: "",
      closingTime: "",
      initialValue: val,
      finalValue: 0,
      difference: 0,
      observation: cashRegisterObservation,
      isClosed: false
    }
    setCashRegisterHistory(prev => [newEntry, ...prev])
    setIsCashRegisterOpened(true)
    setCashRegisterValue("0")
    setCashRegisterObservation("")
  }

  const handleCloseCashRegister = () => {
    setCashRegisterHistory(prev => {
      return prev.map(item => {
        if (!item.isClosed) {
          const finalVal = item.initialValue + 32500
          const diff = 0
          return {
            ...item,
            isClosed: true,
            closingDate: new Date().toLocaleDateString('pt-PT'),
            closingTime: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
            finalValue: finalVal,
            difference: diff
          }
        }
        return item
      })
    })
    setIsCashRegisterOpened(false)
  }

  return {
    isCashRegisterOpened,
    setIsCashRegisterOpened,
    cashRegisterValue,
    setCashRegisterValue,
    cashRegisterObservation,
    setCashRegisterObservation,
    cashRegisterHistory,
    setCashRegisterHistory,
    formatCurrency,
    formatDisplayValue,
    handleKeypadPress,
    handleOpenCashRegister,
    handleCloseCashRegister
  }
}
