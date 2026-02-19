export const ProductCard = ({ title, price, image }: { title: string, price: string, image: string }) => (
  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex gap-3">
    <img src={image} className="w-16 h-16 object-cover rounded-md" alt={title} />
    <div className="flex-1">
      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{title}</h3>
      <p className="text-blue-600 font-bold mt-1">{price}</p>
    </div>
    <button className="h-8 w-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-100">
      +
    </button>
  </div>
)
