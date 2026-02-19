import { useState } from 'react'

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) return null

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="absolute right-0 top-0 bottom-0 w-3/4 bg-dark-card shadow-2xl border-l border-dark-border p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Your Cart</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">Close</button>
        </div>
        {/* Cart items */}
        <div className="flex-1 overflow-y-auto">
          <p className="text-gray-500 text-center mt-10">Cart is empty</p>
          <button className="mt-4 w-full py-2 bg-neon/10 text-neon border border-neon/50 rounded-lg hover:bg-neon hover:text-black transition"> Start Shopping </button>
        </div>
      </div>
    </div>
  )
}
