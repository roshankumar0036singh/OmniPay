import { useEffect, useState } from 'react'
import { X, ShoppingBag, ArrowRight, CreditCard, CheckCircle, ArrowLeft, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from "../stores/useCartStore"
import { CartItemRow } from "./CartItemRow"
import { PremiumButton } from './PremiumButton'
import { cn } from '../utils/cn'

export const CartDrawer = ({ embedded = false }: { embedded?: boolean }) => {
  const { isOpen, toggleCart, items, fetchCart, total, clearCart, isLoading } = useCartStore()
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'success'>('cart');

  useEffect(() => {
    if (isOpen) {
      fetchCart()
      setCheckoutStep('cart')
    }
  }, [isOpen])

  useEffect(() => {
    if (embedded) {
      fetchCart()
    }
  }, [embedded])

  const startCheckout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/orders/checkout', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer dev-token', 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingAddress: { country: 'US' } })
      });
      const data = await response.json();

      if (data.url) {
        // Redirect to Mock Checkout page
        window.open(data.url, '_blank', 'width=600,height=800,left=200,top=200');
        clearCart();
        setCheckoutStep('success');
      } else {
        alert('Checkout failed: ' + (data.error || 'Unknown error'));
      }
    } catch (e) {
      console.error(e);
      alert('Failed to initiate checkout');
    }
  };

  const handlePaymentSuccess = async () => {
    // This will now be handled via Stripe Webhooks or redirect back to OmniPay
    clearCart();
    setCheckoutStep('success');
  };

  const content = (
    <div className={cn(
      "flex flex-col h-full",
      embedded ? "bg-transparent" : "absolute top-0 right-0 bottom-0 w-[85%] max-w-sm z-50 bg-lingo-dark/95 backdrop-blur-2xl border-l border-white/5 shadow-glass"
    )}>
      {/* Header (Only if not embedded) */}
      {!embedded && (
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neon/10 flex items-center justify-center border border-neon/20">
              <ShoppingBag size={20} className="text-neon" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white italic uppercase tracking-tight">Your Cart</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{items.length} Items</p>
            </div>
          </div>
          <PremiumButton variant="ghost" size="icon" onClick={toggleCart} className="h-10 w-10 hover:bg-white/5 rounded-full">
            <X size={20} className="text-gray-400" />
          </PremiumButton>
        </div>
      )}

      {/* Multi-step Header */}
      {(checkoutStep !== 'cart' || (embedded && checkoutStep === 'cart')) && !embedded && (
        <div className="px-5 py-3 bg-white/5 flex items-center gap-3 border-b border-white/5">
          <PremiumButton variant="ghost" size="icon" onClick={() => setCheckoutStep('cart')} className="h-8 w-8 hover:bg-white/5">
            <ArrowLeft size={16} className="text-gray-400" />
          </PremiumButton>
          <span className="text-[10px] font-black text-neon uppercase tracking-[0.2em]">Step: {checkoutStep.toUpperCase()}</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          {checkoutStep === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="p-5 space-y-4"
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
                  <Loader2 className="animate-spin text-neon" size={32} />
                  <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing OmniCart...</span>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4 opacity-30">
                  <ShoppingBag size={48} />
                  <p className="text-xs font-black uppercase tracking-widest tracking-tighter">Your cart is empty</p>
                </div>
              ) : (
                items.map((item, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={item.id}
                  >
                    <CartItemRow item={item} />
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {checkoutStep === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full p-10 text-center gap-6"
            >
              <div className="w-20 h-20 bg-neon/10 rounded-full flex items-center justify-center border-2 border-neon/20 shadow-neon/10">
                <CheckCircle size={40} className="text-neon" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-2">Order Confirmed</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">Your global order has been placed. You'll receive a confirmation email shortly.</p>
              </div>
              <PremiumButton variant="neon" glow onClick={toggleCart} className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest">
                Continue Shopping
              </PremiumButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {
        checkoutStep === 'cart' && items.length > 0 && (
          <div className="p-6 bg-white/5 border-t border-white/5 space-y-5">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Subtotal</span>
                <span className="text-xl font-black text-white italic">$ {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-600">Global Shipping</span>
                <span className="text-neon">Free</span>
              </div>
            </div>

            <PremiumButton
              variant="neon"
              glow
              onClick={startCheckout}
              className="w-full py-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3"
            >
              Secure Checkout <ArrowRight size={18} />
            </PremiumButton>

            <div className="flex items-center justify-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
              <CreditCard size={12} className="text-gray-400" />
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">SSL Encrypted Checkout</span>
            </div>
          </div>
        )
      }
    </div >
  );

  if (!isOpen && !embedded) return null

  if (embedded) return content;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={toggleCart}
          />
        )}
      </AnimatePresence>

      {/* Drawer Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 left-0 z-50 pointer-events-none"
          >
            <div className="pointer-events-auto h-full w-full flex justify-end">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
