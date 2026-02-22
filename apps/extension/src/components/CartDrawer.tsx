import { useEffect, useState } from 'react'
import { X, ShoppingBag, ArrowRight, CreditCard, CheckCircle } from "lucide-react"
import { useCartStore } from "../stores/useCartStore"
import { CartItemRow } from "./CartItemRow"
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { PaymentForm } from './PaymentForm'

// Initialize Stripe outside component
// Use your publishable key here. For dev, we can use a placeholder which will log errors but show intent.
const stripePromise = loadStripe('pk_test_placeholder');

export const CartDrawer = () => {
  const { isOpen, toggleCart, items, fetchCart, total, clearCart, isLoading } = useCartStore()
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'success'>('cart');
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCart()
      setCheckoutStep('cart') // Reset to cart view on open
    }
  }, [isOpen])

  const startCheckout = async () => {
    // Call backend to create payment intent
    try {
      const response = await fetch('http://localhost:3000/api/orders/checkout', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer dev-token', 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingAddress: { country: 'US' } })
      });
      const data = await response.json();

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setCheckoutStep('payment');
      } else {
        alert('Checkout failed: ' + (data.error || 'Unknown error'));
      }
    } catch (e) {
      console.error(e);
      alert('Failed to initiate checkout');
    }
  };

  const handlePaymentSuccess = async () => {
    // Finalize order in backend
    try {
      await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer dev-token', 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingAddress: { country: 'US' } }) // Re-send address for now
      });
      clearCart();
      setCheckoutStep('success');
    } catch (e) {
      console.error(e);
      alert('Order creation failed after payment');
    }
  };

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
            {checkoutStep === 'cart' && <ShoppingBag className="text-lingo-green" size={18} />}
            {checkoutStep === 'payment' && <CreditCard className="text-lingo-green" size={18} />}
            {checkoutStep === 'success' && <CheckCircle className="text-lingo-green" size={18} />}
            <h2 className="text-sm font-bold text-white tracking-wide">
              {checkoutStep === 'cart' ? 'MY CART' : checkoutStep === 'payment' ? 'CHECKOUT' : 'ORDER CONFIRMED'}
            </h2>
            {checkoutStep === 'cart' && <span className="bg-white/10 text-white text-[10px] px-1.5 rounded-full font-mono">{items.length}</span>}
          </div>
          <button onClick={toggleCart} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content based on Step */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">

          {/* STEP 1: CART ITEMS */}
          {checkoutStep === 'cart' && (
            <div className="p-4 space-y-3">
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
          )}

          {/* STEP 2: STRIPE PAYMENT */}
          {checkoutStep === 'payment' && clientSecret && (
            <div className="p-4">
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', labels: 'floating' } }}>
                <PaymentForm
                  amount={total}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setCheckoutStep('cart')}
                />
              </Elements>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {checkoutStep === 'success' && (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-lingo-green/20 rounded-full flex items-center justify-center mb-2">
                <CheckCircle size={32} className="text-lingo-green" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
                <p className="text-gray-400 text-sm">Your global order has been placed. You will receive a confirmation email shortly.</p>
              </div>
              <button
                onClick={toggleCart}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer (Only for Cart Step) */}
        {checkoutStep === 'cart' && items.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-black/20 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>$ {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={startCheckout}
              className="w-full py-3 bg-lingo-green text-black font-bold text-sm rounded-xl hover:bg-lingo-green/90 transition-colors flex items-center justify-center gap-2"
            >
              Secure Checkout <ArrowRight size={16} />
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
