import { Search, Globe } from 'lucide-react';
import { useSearchStore } from '../stores/useSearchStore';

export const SearchBar = ({ onSearch }: { onSearch: () => void }) => {
  const { query, setQuery, activeRegions, toggleRegion } = useSearchStore();

  const regions = [
    { id: 'JP', label: '🇯🇵', name: 'Japan' },
    { id: 'US', label: '🇺🇸', name: 'USA' },
    { id: 'DE', label: '🇩🇪', name: 'Germany' },
    { id: 'CN', label: '🇨🇳', name: 'China' },
    { id: 'ES', label: '🇪🇸', name: 'Spain' }
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400 group-focus-within:text-lingo-green transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 bg-black/40 border border-white/10 rounded-xl text-sm placeholder-gray-500 text-white focus:outline-none focus:border-lingo-green/50 focus:ring-1 focus:ring-lingo-green/50 transition-all shadow-lg backdrop-blur-sm"
          placeholder="Search global products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
          <div className="h-5 w-5 rounded border border-white/10 flex items-center justify-center bg-white/5 text-[10px] text-gray-400">⌘K</div>
        </div>
      </div>

      {/* Region Toggles */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1">
          <Globe size={10} /> Regions
        </span>
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => toggleRegion(region.id)}
            className={`
                            px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 border
                            ${activeRegions.includes(region.id)
                ? 'bg-lingo-green/20 border-lingo-green/50 text-lingo-green shadow-[0_0_10px_rgba(74,222,128,0.2)]'
                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'}
                        `}
            title={region.name}
          >
            {region.label} {region.id}
          </button>
        ))}
      </div>
    </div>
  );
};
