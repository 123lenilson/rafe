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
  openingObservation?: string
  closingObservation?: string
  isClosed: boolean
}
