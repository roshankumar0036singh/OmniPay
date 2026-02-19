import { Plus, Info } from "lucide-react"

export interface ProductCardProps {
  title: string;
  price: string;
  image: string;
  region?: string;
  landedCost?: string;
  site?: string;
  totalPriceUsd?: number;
  savings?: string;
}

export const ProductCard = ({ title, price, image, region, landedCost, site = "Amazon JP", savings }: ProductCardProps) => {
  const regionFlag = {
    'JP': '🇯🇵',
    'US': '🇺🇸',
    'DE': '🇩🇪',
    'CN': '🇨🇳',
    'ES': '🇪🇸'
  }[region || 'JP'] || '🌐';

  return (
    <div className="group relative bg-lingo-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden hover:border-lingo-green/50 transition-all duration-300 hover:shadow-lingo-glow flex flex-col">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="flex p-3 gap-3">
        {/* Image Container */}
        <div className="w-20 h-20 rounded-lg bg-black/50 border border-white/10 flex-shrink-0 overflow-hidden relative">
          <img src={image} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          {region && (
            <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-sm px-1.5 rounded text-xs border border-white/10">
              {regionFlag}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-lingo-green transition-colors font-sans leading-tight mb-1">{title}</h3>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                {site}
              </span>
              {savings && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-lingo-green/10 text-lingo-green border border-lingo-green/20 font-bold">
                  -{savings}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-end justify-between mt-auto pt-2">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white font-sans tracking-tight leading-none">{price}</span>
              {landedCost && (
                <span className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                  ≈ {landedCost} Landed <Info size={10} className="text-gray-600" />
                </span>
              )}
            </div>

            <button className="p-2 rounded-full bg-white/5 hover:bg-lingo-green hover:text-black text-gray-400 transition-all border border-white/10 hover:border-lingo-green group-hover:scale-105 active:scale-95">
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
