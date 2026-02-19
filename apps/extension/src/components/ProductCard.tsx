export const ProductCard = ({ title, price, image }: { title: string, price: string, image: string }) => (
  <div className="bg-retro-card p-2 border border-neon relative group hover:bg-neon/10 transition-colors">
    <div className="absolute top-0 right-0 w-2 h-2 bg-neon"></div>
    <div className="absolute bottom-0 left-0 w-2 h-2 bg-neon"></div>

    <div className="flex gap-3">
      <div className="relative">
        <img src={image} className="w-16 h-16 object-cover grayscale contrast-125 border border-neon/50" alt={title} />
        <div className="absolute inset-0 bg-neon/20 pointer-events-none mix-blend-overlay"></div>
      </div>

      <div className="flex-1 font-mono">
        <h3 className="text-xs font-bold text-neon truncate max-w-[150px] uppercase tracking-tighter">&gt; {title}</h3>
        <p className="text-white font-bold mt-1 text-sm bg-black inline-block px-1 border-l-2 border-neon">{price}</p>
      </div>

      <button className="h-8 w-8 bg-transparent text-neon border-2 border-neon flex items-center justify-center hover:bg-neon hover:text-black transition-all">
        +
      </button>
    </div>
  </div>
)
