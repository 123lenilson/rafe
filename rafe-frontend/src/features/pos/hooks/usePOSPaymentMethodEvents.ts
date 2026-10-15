import { useEffect, type RefObject } from 'react'

interface UsePOSPaymentMethodEventsProps {
  activePaymentMethod: string | null
  paymentAmounts: Record<string, string>
  removePaymentAmount: (method: string) => void
  setActivePaymentMethod: (method: string | null) => void
  setArePaymentMethodsExpanded: (expanded: boolean) => void
  componentRootRef: RefObject<HTMLDivElement | null>
  paymentMethodsContainerRef: RefObject<HTMLDivElement | null>
  expandedPaymentMethodsRef: RefObject<HTMLDivElement | null>
  onKeypadPress: (key: string) => void
}

export function usePOSPaymentMethodEvents({
  activePaymentMethod,
  paymentAmounts,
  removePaymentAmount,
  setActivePaymentMethod,
  setArePaymentMethodsExpanded,
  componentRootRef,
  paymentMethodsContainerRef,
  expandedPaymentMethodsRef,
  onKeypadPress,
}: UsePOSPaymentMethodEventsProps) {
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const container = paymentMethodsContainerRef.current
      const expandedArea = expandedPaymentMethodsRef.current
      const root = componentRootRef.current
      const target = event.target as Node

      if (expandedArea && !expandedArea.contains(target)) {
        setArePaymentMethodsExpanded(false)
      }

      if (
        container?.contains(target) ||
        expandedArea?.contains(target) ||
        root?.contains(target)
      ) {
        return
      }

      if (activePaymentMethod) {
        const activeAmount = paymentAmounts[activePaymentMethod]
        if (!activeAmount || activeAmount === '0') {
          removePaymentAmount(activePaymentMethod)
        }
        setActivePaymentMethod(null)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [
    activePaymentMethod,
    componentRootRef,
    expandedPaymentMethodsRef,
    paymentAmounts,
    paymentMethodsContainerRef,
    removePaymentAmount,
    setActivePaymentMethod,
    setArePaymentMethodsExpanded,
  ])

  useEffect(() => {
    function handlePhysicalKeyDown(event: KeyboardEvent) {
      if (!activePaymentMethod) return

      const target = event.target as HTMLElement
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      if (isInput) return

      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault()
        onKeypadPress(event.key)
      } else if (event.key === '.' || event.key === ',') {
        event.preventDefault()
        onKeypadPress('.')
      } else if (event.key === '+' || event.key === '-') {
        event.preventDefault()
        onKeypadPress(event.key)
      } else if (event.key === 'Enter') {
        event.preventDefault()
        onKeypadPress('enter')
      } else if (event.key === 'Backspace') {
        event.preventDefault()
        onKeypadPress('backspace')
      } else if (
        event.key === 'Delete' ||
        event.key === 'Escape' ||
        event.key.toLowerCase() === 'c'
      ) {
        event.preventDefault()
        onKeypadPress('clear')
      }
    }

    window.addEventListener('keydown', handlePhysicalKeyDown)
    return () => window.removeEventListener('keydown', handlePhysicalKeyDown)
  }, [activePaymentMethod, onKeypadPress])
}
