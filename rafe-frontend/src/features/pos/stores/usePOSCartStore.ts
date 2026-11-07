import { create } from 'zustand'
import {
  calculateCartSummary,
  calculatePOSCartItemNetInCents,
  formatCartInputValue,
  normalizePOSDiscount,
  validatePOSCartQuantity,
  type POSDiscount,
  type POSCartQuantityError,
} from '@/features/pos/utils/posCartFormatters'

export interface POSCartItem {
  id: string
  name: string
  quantity: string
  unitPrice: string
  availableQuantity: number | null
  discount: POSDiscount | null
}

export interface POSCartEditableField {
  itemId: string
  field: 'quantity' | 'unitPrice'
}

interface POSCartStore {
  items: POSCartItem[]
  paymentAmounts: Record<string, string>
  discount: POSDiscount | null
  lastAddedId: string | null
  lastAddedAt: number | null
  activeEditableField: POSCartEditableField | null
  keypadEntryStarted: boolean
  addProduct: (product: {
    id: string
    name: string
    price: string
    availableQuantity: number | null
  }) => 'out-of-stock' | 'stock-limit-reached' | null
  setActiveEditableField: (field: POSCartEditableField | null) => void
  applyKeypadInput: (key: string) => POSCartQuantityError | null
  setPaymentAmount: (method: string, amount: string) => void
  setItemDiscount: (id: string, discount: POSDiscount | null) => void
  removePaymentAmount: (method: string) => void
  setDiscount: (discount: POSDiscount | null) => void
  updateQuantity: (id: string, quantity: string) => POSCartQuantityError | null
  updateUnitPrice: (id: string, unitPrice: string) => void
  removeProduct: (id: string) => void
  clearCart: () => void
}

function formatQuantity(quantity: number) {
  return String(quantity).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function normalizeDiscountForItems(
  items: POSCartItem[],
  discount: POSDiscount | null,
) {
  const { iliquidoBeforeDiscountInCents } = calculateCartSummary(items)
  return normalizePOSDiscount(discount, iliquidoBeforeDiscountInCents)
}

function normalizeItemDiscount(item: POSCartItem): POSCartItem {
  return {
    ...item,
    discount: normalizePOSDiscount(
      item.discount,
      calculatePOSCartItemNetInCents(item),
    ),
  }
}

export const usePOSCartStore = create<POSCartStore>((set) => ({
  items: [],
  paymentAmounts: {},
  discount: null,
  lastAddedId: null,
  lastAddedAt: null,
  activeEditableField: null,
  keypadEntryStarted: false,
  addProduct: (product) => {
    let addError: 'out-of-stock' | 'stock-limit-reached' | null = null

    set((state) => {
      if (product.availableQuantity === 0) {
        addError = 'out-of-stock'
        return state
      }

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
        const availableQuantity =
          product.availableQuantity ?? existingItem.availableQuantity

        if (
          availableQuantity !== null &&
          currentQuantity >= availableQuantity
        ) {
          addError = 'stock-limit-reached'
          return state
        }

        const updatedItem = {
          ...existingItem,
          quantity: formatQuantity(currentQuantity + 1),
          availableQuantity,
        }
        const otherItems = state.items.filter((item) => item.id !== product.id)

        return {
          items: [updatedItem, ...otherItems],
          discount: normalizeDiscountForItems(
            [updatedItem, ...otherItems],
            state.discount,
          ),
          lastAddedId: product.id,
          lastAddedAt: now,
        }
      }

      const items = [
        {
          id: product.id,
          name: product.name,
          quantity: '1',
          unitPrice: formattedInitialPrice,
          availableQuantity: product.availableQuantity,
          discount: null,
        },
        ...state.items,
      ]

      return {
        items,
        discount: normalizeDiscountForItems(items, state.discount),
        lastAddedId: product.id,
        lastAddedAt: now,
      }
    })

    return addError
  },
  setActiveEditableField: (activeEditableField) =>
    set({ activeEditableField, keypadEntryStarted: false }),
  setPaymentAmount: (method, amount) =>
    set((state) => ({
      paymentAmounts: { ...state.paymentAmounts, [method]: amount },
    })),
  setItemDiscount: (id, discount) =>
    set((state) => {
      const items = state.items.map((item) =>
        item.id === id
          ? normalizeItemDiscount({ ...item, discount })
          : item,
      )
      return {
        items,
        discount: normalizeDiscountForItems(items, state.discount),
      }
    }),
  removePaymentAmount: (method) =>
    set((state) => {
      const paymentAmounts = { ...state.paymentAmounts }
      delete paymentAmounts[method]
      return { paymentAmounts }
    }),
  setDiscount: (discount) =>
    set((state) => ({
      discount: normalizeDiscountForItems(state.items, discount),
    })),
  applyKeypadInput: (key) => {
    let quantityError: POSCartQuantityError | null = null

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
      const validationError = activeField.field === 'quantity'
        ? validatePOSCartQuantity(
            formattedValue,
            activeItem.availableQuantity,
          )
        : null
      quantityError = validationError
      const safeValue = validationError ? '1' : formattedValue
      const items = state.items.map((item) =>
        item.id === activeField.itemId
          ? normalizeItemDiscount({ ...item, [activeField.field]: safeValue })
          : item,
      )
      return {
        items,
        discount: normalizeDiscountForItems(items, state.discount),
        keypadEntryStarted: validationError !== 'exceeds-stock',
      }
    })

    return quantityError
  },
  updateQuantity: (id, quantity) => {
    let quantityError: POSCartQuantityError | null = null

    set((state) => {
      const item = state.items.find((cartItem) => cartItem.id === id)
      if (!item) return state

      quantityError = validatePOSCartQuantity(
      quantity,
      item.availableQuantity,
      )
      const safeQuantity = quantityError ? '1' : quantity
      const items = state.items.map((item) =>
        item.id === id
          ? normalizeItemDiscount({ ...item, quantity: safeQuantity })
          : item,
      )
      return {
      items,
      discount: normalizeDiscountForItems(items, state.discount),
      }
    })

    return quantityError
  },
  updateUnitPrice: (id, unitPrice) =>
    set((state) => {
      const items = state.items.map((item) =>
        item.id === id
          ? normalizeItemDiscount({ ...item, unitPrice })
          : item,
      )
      return {
        items,
        discount: normalizeDiscountForItems(items, state.discount),
      }
    }),
  removeProduct: (id) =>
    set((state) => {
      const removesActiveField = state.activeEditableField?.itemId === id
      const items = state.items.filter((item) => item.id !== id)
      return {
        items,
        discount: normalizeDiscountForItems(items, state.discount),
        activeEditableField: removesActiveField ? null : state.activeEditableField,
        keypadEntryStarted: removesActiveField ? false : state.keypadEntryStarted,
      }
    }),
  clearCart: () =>
    set({
      items: [],
      paymentAmounts: {},
      discount: null,
      lastAddedId: null,
      lastAddedAt: null,
      activeEditableField: null,
      keypadEntryStarted: false,
    }),
}))
