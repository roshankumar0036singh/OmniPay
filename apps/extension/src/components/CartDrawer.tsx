import { useEffect } from 'react'
import { X, ShoppingBag, ArrowRight } from "lucide-react"
import { useCartStore } from "../stores/useCartStore"
import { CartItemRow } from "./CartItemRow"

export const CartDrawer = () => {
  const { isOpen, toggleCart, items, fetchCart, total, checkout, isLoading } = useCartStore()

  useEffect(() => {
    if (isOpen) {
      fetchCart()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm z-50 bg-lingo-dark border-l border-white/10 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-lingo-green" size={18} />
            <h2 className="text-sm font-bold text-white tracking-wide">MY CART</h2>
            <span className="bg-white/10 text-white text-[10px] px-1.5 rounded-full font-mono">{items.length}</span>
          </div>
          <button onClick={toggleCart} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 space-y-2">
              <div className="w-6 h-6 border-2 border-lingo-green/30 border-t-lingo-green rounded-full animate-spin" />
              <span className="text-xs">Syncing cart...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 space-y-4">
              <ShoppingBag size={32} className="opacity-20" />
              <p className="text-sm">Your cart is empty</p>
              <button onClick={toggleCart} className="text-xs text-lingo-green hover:underline">
                Start Shopping
              </button>
            </div>
          ) : (
            items.map(item => (
              <CartItemRow key={item.id} item={item} />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-black/20 space-y-4">
            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>$ {total.toLocaleString()}</span>
              </div>
              {/* Placeholder for shipping/tax */}
              <div className="flex justify-between text-gray-500 text-xs">
                <span>Est. Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={checkout}
              className="w-full py-3 bg-lingo-green text-black font-bold text-sm rounded-xl hover:bg-lingo-green/90 transition-colors flex items-center justify-center gap-2"
            >
              Checkout <ArrowRight size={16} />
            </button>

            <p className="text-[10px] text-center text-gray-600">
              Protected by OmniPay Secure Checkout
            </p>
          </div>
        )}
      </div>
    </>
  )
}
