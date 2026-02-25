import { useState } from "react"
import { Search, Globe, ChevronDown, Command } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "../hooks/useTranslation"
import { useSearchStore } from '../stores/useSearchStore';
import { PremiumButton } from "./PremiumButton"
import { cn } from "../utils/cn"

export const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const { query, setQuery, activeRegions, toggleRegion } = useSearchStore();
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
    <div className="relative w-full z-20 space-y-3">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center glass-panel rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-neon/50 transition-all duration-300 shadow-glass">
          <Search className="absolute left-4 text-gray-500 group-focus-within:text-neon transition-colors" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('search.placeholder')}
            className="w-full bg-transparent text-white pl-12 pr-12 py-4 text-sm focus:outline-none placeholder-gray-600 font-medium"
          />
          <div className="absolute right-3 flex items-center gap-2">
            <PremiumButton variant="glass" size="icon" className="h-8 w-8 rounded-lg" type="submit">
              <Command size={14} className="text-gray-400" />
            </PremiumButton>
          </div>
        </div>
      </form>

      {/* Region Toggles */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/5 border border-white/5 mr-1">
          <Globe size={12} className="text-neon" />
          <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest whitespace-nowrap">Global</span>
        </div>

        <div className="flex gap-1.5">
          {regions.map((region) => (
            <motion.button
              key={region.id}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleRegion(region.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[10px] font-black transition-all duration-300 border flex items-center gap-2",
                activeRegions.includes(region.id)
                  ? 'bg-neon/10 border-neon/30 text-neon shadow-[0_0_15px_rgba(0,255,0,0.1)]'
                  : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:border-white/10'
              )}
              title={region.name}
            >
              <span className="text-sm leading-none">{region.label}</span>
              <span>{region.id}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

