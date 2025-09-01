"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "./types"

interface CartStore {
  items: CartItem[]
  tableNumber: number | null
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  setTableNumber: (tableNumber: number) => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      tableNumber: null,

      addItem: (newItem: CartItem) =>
        set((state: CartStore) => {
          const existingItem = state.items.find((item) => item.id === newItem.id)
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item,
              ),
            }
          }
          return { items: [...state.items, newItem] }
        }),

      removeItem: (itemId) =>
        set((state: CartStore) => ({
          items: state.items.filter((item: CartItem) => item.id !== itemId),
        })),

      updateQuantity: (itemId: string, quantity: number) =>
        set((state: CartStore) => ({
          items:
            quantity <= 0
              ? state.items.filter((item: CartItem) => item.id !== itemId)
              : state.items.map((item: CartItem) => (item.id === itemId ? { ...item, quantity } : item)),
        })),

      clearCart: () => set({ items: [], tableNumber: null }),

      setTableNumber: (tableNumber: number) => set({ tableNumber }),

      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0)
      },

      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total: number, item: CartItem) => total + item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
