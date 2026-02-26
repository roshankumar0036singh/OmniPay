import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Globe, Check } from 'lucide-react';
import { cn } from '../utils/cn';

interface Locale {
    code: string;
    label: string;
    flag: string;
    nativeName: string;
}

const LOCALES: Locale[] = [
    { code: 'en', label: 'English', flag: '🇺🇸', nativeName: 'English' },
    { code: 'ja', label: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
    { code: 'es', label: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
    { code: 'zh', label: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
    { code: 'fr', label: 'French', flag: '🇫🇷', nativeName: 'Français' },
    { code: 'de', label: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
    { code: 'it', label: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
    { code: 'pt', label: 'Portuguese', flag: '🇧🇷', nativeName: 'Português' },
    { code: 'ko', label: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
    { code: 'ru', label: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
    { code: 'hi', label: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
    { code: 'ar', label: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
    { code: 'tr', label: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
    { code: 'vi', label: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
    { code: 'th', label: 'Thai', flag: '🇹🇭', nativeName: 'ไทย' },
    { code: 'id', label: 'Indonesian', flag: '🇮🇩', nativeName: 'Bahasa Indonesia' },
    { code: 'nl', label: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' },
    { code: 'pl', label: 'Polish', flag: '🇵🇱', nativeName: 'Polski' },
    { code: 'sv', label: 'Swedish', flag: '🇸🇪', nativeName: 'Svenska' },
    { code: 'da', label: 'Danish', flag: '🇩🇰', nativeName: 'Dansk' },
    { code: 'fi', label: 'Finnish', flag: '🇫🇮', nativeName: 'Suomi' },
    { code: 'no', label: 'Norwegian', flag: '🇳🇴', nativeName: 'Norsk' },
    { code: 'el', label: 'Greek', flag: '🇬🇷', nativeName: 'Ελληνικά' },
    { code: 'he', label: 'Hebrew', flag: '🇮🇱', nativeName: 'עברית' },
];

interface LanguageDropdownProps {
    currentLocale: string;
    onSelect: (code: string) => void;
}

export const LanguageDropdown = ({ currentLocale, onSelect }: LanguageDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedLocale = LOCALES.find(l => l.code === currentLocale) || LOCALES[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredLocales = LOCALES.filter(l =>
        l.label.toLowerCase().includes(search.toLowerCase()) ||
        l.nativeName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-14 px-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between group hover:bg-white/[0.08] transition-all relative overflow-hidden"
            >
                {/* Internal Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-neon/30 transition-colors">
                        <span className="text-lg">{selectedLocale.flag}</span>
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] font-black text-white italic uppercase tracking-[0.15em] leading-none mb-1">{selectedLocale.label}</span>
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{selectedLocale.nativeName}</span>
                    </div>
                </div>
                <ChevronDown className={cn("text-gray-500 transition-transform duration-500 relative z-10", isOpen && "rotate-180 text-neon")} size={16} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="absolute top-full mt-3 w-full max-h-[340px] overflow-hidden bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] flex flex-col"
                    >
                        {/* Search Input - Back to top for downward ergonomic access */}
                        <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="RESTRICT BY REGION..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full h-10 pl-9 pr-4 bg-black/40 border border-white/5 rounded-xl text-[10px] font-black text-white focus:outline-none focus:border-neon/40 placeholder:text-gray-700 uppercase tracking-[0.2em] transition-all"
                                />
                            </div>
                        </div>

                        {/* Locale List */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide py-2 px-2 custom-scrollbar">
                            {filteredLocales.map((locale) => (
                                <button
                                    key={locale.code}
                                    onClick={() => {
                                        onSelect(locale.code);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full px-4 py-3 mb-1 rounded-xl flex items-center justify-between group relative overflow-hidden transition-all",
                                        currentLocale === locale.code ? "bg-neon/10 border border-neon/20" : "hover:bg-white/[0.05] border border-transparent"
                                    )}
                                >
                                    {/* Shimmer Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:animate-shimmer" />

                                    <div className="flex items-center gap-4 text-left relative z-10">
                                        <div className={cn(
                                            "w-7 h-7 rounded-full flex items-center justify-center border transition-colors",
                                            currentLocale === locale.code ? "bg-neon/20 border-neon/40" : "bg-white/5 border-white/10 group-hover:border-white/20"
                                        )}>
                                            <span className="text-sm">{locale.flag}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "text-[10px] font-black italic uppercase tracking-wider",
                                                currentLocale === locale.code ? "text-neon" : "text-white/80 group-hover:text-white"
                                            )}>{locale.label}</span>
                                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tight">{locale.nativeName}</span>
                                        </div>
                                    </div>
                                    {currentLocale === locale.code && (
                                        <div className="relative z-10">
                                            <Check className="text-neon" size={14} />
                                            <div className="absolute inset-0 blur-[8px] bg-neon/50 scale-150 rounded-full" />
                                        </div>
                                    )}
                                </button>
                            ))}
                            {filteredLocales.length === 0 && (
                                <div className="py-10 text-center animate-pulse">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 border border-white/5">
                                        <Globe size={18} className="text-gray-600" />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">No Intel Regions Found</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
