import { create } from 'zustand';

interface Product {
    id: number;
    title: string;
    price: string;
    currency: string;
    imageUrl: string;
    siteId: string;
    region?: string;
    landedCost?: string;
}

export interface CartItem {
    id: number;
    productId: number;
    quantity: number;
    priceAtAdd: string;
    product: Product;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    isLoading: boolean;
    total: number;

    toggleCart: () => void;
    fetchCart: () => Promise<void>;
    addToCart: (productId: number, quantity?: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    clearCart: () => void;
    checkout: () => Promise<void>;
}

const API_URL = "http://localhost:3000/api";

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    isOpen: false,
    isLoading: false,
    total: 0,

    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

    fetchCart: async () => {
        set({ isLoading: true });
        try {
            // TODO: Add auth header
            const response = await fetch(`${API_URL}/cart`, {
                headers: { 'Authorization': 'Bearer dev-token' }
            });
            if (response.ok) {
                const cart = await response.json();
                set({ items: cart.items || [] });
                // Calculate total (mock logic, real logic should be in backend or utilize normalized prices)
                const total = (cart.items || []).reduce((sum: number, item: CartItem) => sum + (Number(item.priceAtAdd) * item.quantity), 0);
                set({ total });
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addToCart: async (productId, quantity = 1) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/cart/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer dev-token'
                },
                body: JSON.stringify({ productId, quantity })
            });

            if (response.ok) {
                await get().fetchCart();
                set({ isOpen: true }); // Open cart on add
            }
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    updateQuantity: async (itemId, quantity) => {
        try {
            await fetch(`${API_URL}/cart/items/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer dev-token'
                },
                body: JSON.stringify({ quantity })
            });
            await get().fetchCart();
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    },

    removeItem: async (itemId) => {
        try {
            await fetch(`${API_URL}/cart/items/${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer dev-token' }
            });
            await get().fetchCart();
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    },

    clearCart: () => set({ items: [], total: 0 }),

    checkout: async () => {
        // Placeholder for Phase 13
        alert("Proceeding to checkout...");
    }
}));
