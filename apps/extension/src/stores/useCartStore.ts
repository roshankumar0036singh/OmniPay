import { create } from 'zustand'

interface CartItem {
    id: string
    title: string
    price: number
    currency: string
    quantity: number
    image: string
}

interface CartState {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    clearCart: () => void
    total: number
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    total: 0,
    addItem: (item) => set((state) => ({
        items: [...state.items, item],
        total: state.total + item.price * item.quantity
    })),
    removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
    })),
    clearCart: () => set({ items: [], total: 0 }),
}))
