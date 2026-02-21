import { useState } from "react"
import { Search, Globe, ChevronDown } from "lucide-react"
import { useTranslation } from "../hooks/useTranslation"
import { useSearchStore } from '../stores/useSearchStore';

export const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const { query, setQuery, activeRegions, toggleRegion } = useSearchStore();
  const [showRegions, setShowRegions] = useState(false)
  const { t } = useTranslation()

  const regions = [
    { id: 'JP', label: '🇯🇵', name: 'Japan' },
    { id: 'US', label: '🇺🇸', name: 'USA' },
    { id: 'DE', label: '🇩🇪', name: 'Germany' },
    { id: 'CN', label: '🇨🇳', name: 'China' },
    { id: 'ES', label: '🇪🇸', name: 'Spain' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full z-20">
      <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-lingo-green transition-colors shadow-lg">
        <Search className="absolute left-4 text-gray-400" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('search.placeholder')}
          className="w-full bg-transparent text-white pl-12 pr-24 py-4 text-sm focus:outline-none placeholder-gray-500"
        />
      </div>
      {/* Region Toggles */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2 mt-2">
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1">
          <Globe size={10} /> Regions
        </span>
        {regions.map((region) => (
          <button
            key={region.id}
            type="button"
            onClick={() => toggleRegion(region.id)}
            className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 border
                    \${activeRegions.includes(region.id)
                    ? 'bg-lingo-green/20 border-lingo-green/50 text-lingo-green shadow-[0_0_10px_rgba(74,222,128,0.2)]'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'}`}
            title={region.name}
          >
            {region.label} {region.id}
          </button>
        ))}
      </div>
    </form>
  );
};
