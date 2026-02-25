import { Plus, Minus, X, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { CartItem, useCartStore } from "../stores/useCartStore"
import { PremiumButton } from "./PremiumButton"

export const CartItemRow = ({ item }: { item: CartItem }) => {
    const { updateQuantity, removeItem } = useCartStore()

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex gap-4 glass-card p-3 rounded-2xl group relative overflow-hidden"
        >
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-white/5 blur-2xl rounded-full -ml-8 -mt-8 pointer-events-none" />

            {/* Image */}
            <div className="w-20 h-20 bg-black/40 rounded-xl overflow-hidden border border-white/5 shrink-0 flex items-center justify-center relative z-10">
                <img src={item.product?.imageUrl || "https://via.placeholder.com/80"} alt={item.product?.title} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500" />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1 relative z-10">
                <div>
                    <h4 className="text-white text-sm font-bold truncate pr-6 group-hover:text-neon transition-colors leading-tight">{item.product?.title || "Unknown Product"}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{item.product?.region || 'Global'}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-neon text-[10px] font-bold">{item.product?.currency} {Number(item.priceAtAdd).toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                    {/* Qty Controls */}
                    <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/5 shadow-inner">
                        <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        >
                            <Minus size={12} />
                        </button>
                        <span className="text-sm font-black w-6 text-center text-white">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        >
                            <Plus size={12} />
                        </button>
                    </div>

                    {/* Remove */}
                    <PremiumButton
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-400/10"
                    >
                        <Trash2 size={14} />
                    </PremiumButton>
                </div>
            </div>
        </motion.div>
    )
}

