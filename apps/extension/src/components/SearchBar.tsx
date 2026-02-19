export const SearchBar = () => (
  <div className="relative">
    <input
      type="text"
      placeholder="Search global products..."
      className="w-full pl-10 pr-4 py-2 rounded-lg bg-dark-card border border-dark-border text-white placeholder-gray-500 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition duration-200"
    />
    <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
  </div>
)
