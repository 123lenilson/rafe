import { create } from 'zustand'
import { formatCartInputValue } from '@/features/pos/utils/posCartFormatters'

export interface POSCartItem {
  id: string
  name: string
  quantity: string
  unitPrice: string
}

export interface POSCartEditableField {
  itemId: string
  field: 'quantity' | 'unitPrice'
}

interface POSCartStore {
  items: POSCartItem[]
  lastAddedId: string | null
  lastAddedAt: number | null
  activeEditableField: POSCartEditableField | null
  keypadEntryStarted: boolean
  addProduct: (product: { id: string; name: string; price: string }) => void
  setActiveEditableField: (field: POSCartEditableField | null) => void
  applyKeypadInput: (key: string) => void
  updateQuantity: (id: string, quantity: string) => void
  updateUnitPrice: (id: string, unitPrice: string) => void
  removeProduct: (id: string) => void
  clearCart: () => void
}

function formatQuantity(quantity: number) {
  return String(quantity).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export const usePOSCartStore = create<POSCartStore>((set) => ({
  items: [],
  lastAddedId: null,
  lastAddedAt: null,
  activeEditableField: null,
  keypadEntryStarted: false,
  addProduct: (product) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id)
      const now = Date.now()
      const normalizedProductPrice = String(product.price)
        .replace(/\s+/g, '')
        .replace(/\./g, '')
        .replace(/[^\d,]/g, '')
      const formattedInitialPrice = formatCartInputValue(
        normalizedProductPrice,
        true,
      )

      if (existingItem) {
        const currentQuantity = Number(existingItem.quantity.replace(/\D/g, '')) || 0
        const updatedItem = {
          ...existingItem,
          quantity: formatQuantity(currentQuantity + 1),
        }
        const otherItems = state.items.filter((item) => item.id !== product.id)

        return {
          items: [updatedItem, ...otherItems],
          lastAddedId: product.id,
          lastAddedAt: now,
        }
      }

      return {
        items: [
          {
            id: product.id,
            name: product.name,
            quantity: '1',
            unitPrice: formattedInitialPrice,
          },
          ...state.items,
        ],
        lastAddedId: product.id,
        lastAddedAt: now,
      }
    }),
  setActiveEditableField: (activeEditableField) =>
    set({ activeEditableField, keypadEntryStarted: false }),
  applyKeypadInput: (key) =>
    set((state) => {
      const activeField = state.activeEditableField
      if (!activeField) return state

      const activeItem = state.items.find((item) => item.id === activeField.itemId)
      if (!activeItem) return state

      const allowDecimals = activeField.field === 'unitPrice'
      const currentValue = activeItem[activeField.field].replace(/\s/g, '')
      let nextValue: string

      if (key === 'clear') {
        nextValue = ''
      } else if (key === 'backspace') {
        nextValue = currentValue.slice(0, -1)
      } else if (/^\d$/.test(key)) {
        nextValue = state.keypadEntryStarted
          ? `${currentValue}${key}`
          : key
      } else if (key === '.' && allowDecimals) {
        if (currentValue.includes(',')) return state
        nextValue = state.keypadEntryStarted
          ? `${currentValue},`
          : '0,'
      } else {
        return state
      }

      const formattedValue = formatCartInputValue(nextValue, allowDecimals)
      return {
        items: state.items.map((item) =>
          item.id === activeField.itemId
            ? { ...item, [activeField.field]: formattedValue }
            : item,
        ),
        keypadEntryStarted: true,
      }
    }),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) => item.id === id ? { ...item, quantity } : item),
    })),
  updateUnitPrice: (id, unitPrice) =>
    set((state) => ({
      items: state.items.map((item) => item.id === id ? { ...item, unitPrice } : item),
    })),
  removeProduct: (id) =>
    set((state) => {
      const removesActiveField = state.activeEditableField?.itemId === id
      return {
        items: state.items.filter((item) => item.id !== id),
        activeEditableField: removesActiveField ? null : state.activeEditableField,
        keypadEntryStarted: removesActiveField ? false : state.keypadEntryStarted,
      }
    }),
  clearCart: () =>
    set({
      items: [],
      lastAddedId: null,
      lastAddedAt: null,
      activeEditableField: null,
      keypadEntryStarted: false,
    }),
}))
