export const SearchBar = () => (
  <div className="relative font-mono">
    <input
      type="text"
      placeholder=">> INPUT_QUERY..."
      className="w-full pl-10 pr-4 py-2 bg-black border-2 border-neon text-neon placeholder-neon-dim outline-none focus:shadow-neon focus:bg-neon/10 transition-all uppercase tracking-wider text-xs"
    />
    <span className="absolute left-3 top-2.5 text-neon animate-pulse">&gt;</span>
  </div>
)
