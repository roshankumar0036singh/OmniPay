export const ProductCard = ({ title, price, image }: { title: string, price: string, image: string }) => (
  <div className="bg-dark-card p-3 rounded-lg border border-dark-border shadow-md flex gap-3 hover:border-neon/50 transition duration-200 group">
    <img src={image} className="w-16 h-16 object-cover rounded-md bg-gray-800" alt={title} />
    <div className="flex-1">
      <h3 className="text-sm font-medium text-gray-200 line-clamp-2 group-hover:text-white">{title}</h3>
      <p className="text-neon font-bold mt-1 shadow-neon">{price}</p>
    </div>
    <button className="h-8 w-8 bg-neon text-black rounded-full flex items-center justify-center hover:bg-neon-hover hover:scale-105 transition shadow-[0_0_5px_rgba(204,255,0,0.4)]">
      +
    </button>
  </div>
)
