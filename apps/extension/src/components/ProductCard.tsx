import { useState } from "react"
import { Plus, Info, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { useCartStore } from "../stores/useCartStore"
import { PremiumButton } from "./PremiumButton"
import { cn } from "../utils/cn"

export interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  image: string;
  region?: string;
  landedCost?: string;
  site?: string;
  totalPriceUsd?: number;
  savings?: string;
}

export const ProductCard = ({ id, title, price, image, region, landedCost, site = "Amazon JP", savings }: ProductCardProps) => {
  const { addToCart } = useCartStore()
  const [imgError, setImgError] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    // ... logic remains same
    e.stopPropagation();
    e.preventDefault();
    const numericId = parseInt(id.replace(/[^0-9]/g, '').slice(0, 9)) || 1;
    addToCart(numericId);
  };

  const regionFlag = {
    'JP': '🇯🇵',
    'US': '🇺🇸',
    'DE': '🇩🇪',
    'CN': '🇨🇳',
    'ES': '🇪🇸'
  }[region || 'JP'] || '🌐';

  const fallbackImg = "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=400&auto=format&fit=crop";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group glass-card rounded-2xl p-3 flex flex-col gap-3 relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-neon/5 blur-3xl rounded-full -mr-12 -mt-12 pointer-events-none" />

      <div className="flex gap-3 relative z-10">
        {/* Image Section */}
        <div className="w-24 h-24 rounded-xl bg-black/40 border border-white/5 overflow-hidden relative flex-shrink-0">
          <motion.img
            src={imgError ? fallbackImg : image}
            onError={() => setImgError(true)}
            alt={title}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
            whileHover={{ scale: 1.1 }}
          />
          <div className="absolute top-1.5 left-1.5 glass-panel px-1.5 py-0.5 rounded-lg text-[10px] flex items-center gap-1 font-bold shadow-sm">
            <span>{regionFlag}</span>
            <span className="opacity-70">{region}</span>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 min-w-0 flex flex-col pt-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold text-neon uppercase tracking-widest">{site}</span>
            <ExternalLink size={10} className="text-gray-600 hover:text-neon cursor-pointer" />
          </div>

          <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 mb-2 group-hover:text-neon/90 transition-colors">
            {title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mt-auto">
            {savings && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-neon/10 text-neon border border-neon/20 font-black">
                -{savings}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing & Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 relative z-10">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-white">{price}</span>
            {landedCost && <span className="text-[10px] text-gray-500 font-medium">USD</span>}
          </div>
          {landedCost && (
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <span className="opacity-60">Total:</span>
              <span className="font-bold text-white">≈ {landedCost}</span>
              <Info size={10} className="text-gray-600 cursor-help" />
            </div>
          )}
        </div>

        <PremiumButton
          variant="neon"
          size="icon"
          onClick={handleAddToCart}
          className="rounded-xl"
          glow
        >
          <Plus size={18} />
        </PremiumButton>
      </div>
    </motion.div>
  )
}

