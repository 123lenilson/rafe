export interface CashRegisterEntry {
  id: number
  operatorName: string
  operatorInitials: string
  openingDate: string
  openingTime: string
  closingDate: string
  closingTime: string
  initialValue: number
  finalValue: number
  difference: number
  observation: string
  isClosed: boolean
}
