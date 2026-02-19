export const SearchBar = () => (
  <div className="relative">
    <input 
      type="text" 
      placeholder="Search global products..." 
      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
    />
    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
  </div>
)
