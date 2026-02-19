import { Plus } from "lucide-react"

export const ProductCard = ({ title, price, image }: { title: string, price: string, image: string }) => (
  <div className="group relative bg-lingo-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden hover:border-lingo-green/50 transition-all duration-300 hover:shadow-lingo-glow">
    {/* Subtle gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

    <div className="flex p-3 gap-3">
      {/* Image Container */}
      <div className="w-16 h-16 rounded-lg bg-black/50 border border-white/10 flex-shrink-0 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-white truncate group-hover:text-lingo-green transition-colors font-sans">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">Amazon JP</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-lingo-green/10 text-lingo-green border border-lingo-green/20">Best Price</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-2">
          <span className="text-lg font-bold text-white font-sans tracking-tight">{price}</span>
        </div>
      </div>

      {/* Add Action */}
      <button className="self-center p-2 rounded-full bg-white/5 hover:bg-lingo-green hover:text-black text-gray-400 transition-all border border-white/10 hover:border-lingo-green group-hover:scale-105 active:scale-95">
        <Plus size={18} />
      </button>
    </div>
  </div>
)
