import { Plus, Minus, X } from "lucide-react"
import { CartItem, useCartStore } from "../stores/useCartStore"

export const CartItemRow = ({ item }: { item: CartItem }) => {
    const { updateQuantity, removeItem } = useCartStore()

    return (
        <div className="flex gap-3 bg-white/5 p-3 rounded-lg border border-white/5 hover:border-lingo-green/30 transition-colors group">
            {/* Image */}
            <div className="w-16 h-16 bg-black rounded-md overflow-hidden border border-white/10 shrink-0">
                <img src={item.product?.imageUrl || "https://via.placeholder.com/64"} alt={item.product?.title} className="w-full h-full object-cover opacity-80" />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    <h4 className="text-white text-sm font-medium truncate pr-4">{item.product?.title || "Unknown Product"}</h4>
                    <p className="text-gray-400 text-xs">{item.product?.currency} {Number(item.priceAtAdd).toLocaleString()}</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                    {/* Qty Controls */}
                    <div className="flex items-center gap-3 bg-black/50 rounded-full px-2 py-1 border border-white/10">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <Minus size={12} />
                        </button>
                        <span className="text-xs font-mono w-4 text-center">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <Plus size={12} />
                        </button>
                    </div>

                    {/* Remove */}
                    <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}
