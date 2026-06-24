import { useState } from 'react'
import { CashRegisterEntry } from '@/features/pos/types/cash.types'

export function useCashRegister() {
  const [isCashRegisterOpened, setIsCashRegisterOpened] = useState<boolean>(false)
  const [cashRegisterHistory, setCashRegisterHistory] = useState<CashRegisterEntry[]>([
    {
      id: 1,
      operatorName: "Ana Nogueira",
      operatorInitials: "AN",
      openingDate: "21/06/2026",
      openingTime: "14:15",
      closingDate: "21/06/2026",
      closingTime: "19:00",
      initialValue: 8000,
      finalValue: 25000,
      difference: 17000,
      observation: "Fecho do turno da tarde com saldo positivo.",
      isClosed: true
    },
    {
      id: 2,
      operatorName: "Operador Rafe",
      operatorInitials: "OP",
      openingDate: "20/06/2026",
      openingTime: "15:00",
      closingDate: "20/06/2026",
      closingTime: "18:30",
      initialValue: 5000,
      finalValue: 50000,
      difference: 45000,
      observation: "Fundo de maneio inicial adicionado para iniciar o turno de vendas no POS.",
      isClosed: true
    },
    {
      id: 3,
      operatorName: "Ana Nogueira",
      operatorInitials: "AN",
      openingDate: "02/06/2026",
      openingTime: "08:15",
      closingDate: "02/06/2026",
      closingTime: "12:30",
      initialValue: 10000,
      finalValue: 45200,
      difference: 35200,
      observation: "Caixa fechado sem inconformidades. Vendas do turno da manhã.",
      isClosed: true
    },
    {
      id: 4,
      operatorName: "João Oliveira",
      operatorInitials: "JO",
      openingDate: "01/06/2026",
      openingTime: "14:00",
      closingDate: "01/06/2026",
      closingTime: "22:15",
      initialValue: 15000,
      finalValue: 98450,
      difference: 83450,
      observation: "Tudo em ordem no fecho do turno da noite.",
      isClosed: true
    },
    {
      id: 5,
      operatorName: "Operador Rafe",
      operatorInitials: "OP",
      openingDate: "01/06/2026",
      openingTime: "08:00",
      closingDate: "01/06/2026",
      closingTime: "13:45",
      initialValue: 10000,
      finalValue: 32500,
      difference: 22500,
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

  const handleOpenCashRegister = (valStr: string, observationText: string) => {
    const val = parseFloat(valStr)
    if (isNaN(val) || val < 0) return
    const openingObs = observationText.trim()
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
      openingObservation: openingObs,
      observation: openingObs ? `obs da abertura: "${openingObs}"` : "",
      isClosed: false
    }
    setCashRegisterHistory(prev => [newEntry, ...prev])
    setIsCashRegisterOpened(true)
  }

  const handleCloseCashRegister = (valStr: string, observationText: string) => {
    const finalVal = parseFloat(valStr) || 0
    setCashRegisterHistory(prev => {
      return prev.map(item => {
        if (!item.isClosed) {
          const diff = finalVal - item.initialValue
          const closingObs = observationText.trim()
          const combinedObs = [
            item.openingObservation ? `obs da abertura: "${item.openingObservation}"` : "",
            closingObs ? `obs do fecho: "${closingObs}"` : ""
          ].filter(Boolean).join('\n')
          
          return {
            ...item,
            isClosed: true,
            closingDate: new Date().toLocaleDateString('pt-PT'),
            closingTime: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
            finalValue: finalVal,
            difference: diff,
            closingObservation: closingObs,
            observation: combinedObs
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
    cashRegisterHistory,
    setCashRegisterHistory,
    formatCurrency,
    formatDisplayValue,
    handleOpenCashRegister,
    handleCloseCashRegister
  }
}
