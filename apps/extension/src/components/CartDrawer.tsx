import { useState } from 'react'

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) return null

  return (
    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md font-mono">
      <div className="absolute right-0 top-0 bottom-0 w-3/4 bg-black border-l-2 border-neon p-4 shadow-neon">
        <div className="flex justify-between items-center mb-4 border-b border-neon/50 pb-2">
          <h2 className="text-sm font-bold text-neon uppercase tracking-widest">:: SYSTEM_CART ::</h2>
          <button onClick={() => setIsOpen(false)} className="text-neon hover:text-white hover:bg-neon hover:text-black px-2 transition-colors">[X]</button>
        </div>
        {/* Cart items */}
        <div className="flex-1 overflow-y-auto">
          <p className="text-neon-dim text-center mt-10 text-xs">
            &gt; ERROR: CART_EMPTY<br />
            &gt; ADD_ITEMS_TO_PROCEED
          </p>
          <button className="mt-8 w-full py-2 bg-neon text-black font-bold uppercase tracking-widest border border-neon hover:bg-white transition-all shadow-neon">
            INIT_SHOPPING_PROTOCOL
          </button>
        </div>
      </div>
    </div>
  )
}
