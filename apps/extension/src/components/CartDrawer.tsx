import { useState } from 'react'

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) return null

  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="absolute right-0 top-0 bottom-0 w-3/4 bg-white shadow-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
        {/* Cart items */}
        <div className="flex-1 overflow-y-auto">
          <p className="text-gray-500 text-center mt-10">Cart is empty</p>
        </div>
      </div>
    </div>
  )
}
