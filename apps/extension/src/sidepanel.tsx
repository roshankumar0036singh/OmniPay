import { useState } from "react"
import { Header } from "./components/Header"
import { BottomNav } from "./components/BottomNav"
import { ProductCard } from "./components/ProductCard"
import { CartDrawer } from "./components/CartDrawer"
import { CircuitBackground } from "./components/CircuitBackground"
import { SearchBar } from "./components/SearchBar"
import { SearchResults } from "./components/SearchResults"
import { useSearchStore } from "./stores/useSearchStore"
import { ApiClient } from "./services/apiClient"
import { SupportProxy } from "./components/SupportProxy"
import { useTranslation } from "./hooks/useTranslation"
import { motion, AnimatePresence } from "framer-motion"
import { Globe } from "lucide-react"
import { PremiumButton } from "./components/PremiumButton"
import { LanguageDropdown } from "./components/LanguageDropdown"
import { ApiKeySettings } from "./components/ApiKeySettings"

import { initExtensionTelemetry } from "./utils/telemetry"

import "./style.css"

initExtensionTelemetry()

function SidePanel() {
    const [activeTab, setActiveTab] = useState("home")
    const { query, activeRegions, setResults, setLoading } = useSearchStore()
    const { t, locale, changeLanguage } = useTranslation()

    const handleSearch = async () => {
        if (!query.trim()) return
        setLoading(true)
        if (activeTab !== 'search') setActiveTab('search')

        try {
            const results = await ApiClient.search(query, activeRegions)
            setResults(results)
        } catch (e) {
            console.error("Search failed", e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full h-screen bg-lingo-dark text-white font-sans flex flex-col relative overflow-hidden">
            <CircuitBackground />

            {/* Main Content Area */}
            <div className="relative z-10 flex flex-col h-full">
                <Header />

                <main className="flex-1 overflow-y-auto p-4 scrollbar-hide pb-40">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {activeTab === 'home' && (
                                <div className="space-y-6">
                                    <div className="text-center mb-8 pt-4">
                                        <motion.h2
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 italic uppercase tracking-tighter"
                                        >
                                            {t('home.title')}
                                        </motion.h2>
                                        <p className="text-[10px] text-neon/60 font-black uppercase tracking-[0.3em] mt-1">{t('home.subtitle')}</p>
                                    </div>

                                    <SearchBar onSearch={handleSearch} />

                                    <div className="space-y-4 pt-6">
                                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{t('home.trending')}</h3>
                                            <span className="text-[9px] text-neon font-bold cursor-pointer hover:underline">View All</span>
                                        </div>
                                        <ProductCard
                                            id="trending-1"
                                            title="Sony WH-1000XM5 Wireless Headphones"
                                            price="¥49,800"
                                            image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"
                                            region="JP"
                                            site="Amazon"
                                            landedCost="340.50"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'search' && (
                                <div className="space-y-4 h-full flex flex-col">
                                    <SearchBar onSearch={handleSearch} />
                                    <div className="flex-1 mt-2">
                                        <SearchResults />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'cart' && (
                                <div className="h-full flex flex-col">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-black text-white italic uppercase">{t('nav.cart')}</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Review your selection</p>
                                    </div>
                                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                                        <CartDrawer embedded />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'support' && (
                                <div className="h-full">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-black text-white italic uppercase">{t('nav.support')}</h3>
                                        <p className="text-[10px] text-neon/60 font-bold uppercase tracking-widest">Global Intelligence Help</p>
                                    </div>
                                    <SupportProxy />
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="flex flex-col space-y-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex flex-col">
                                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{t('settings.title')}</h3>
                                            <p className="text-[10px] text-neon/60 font-black uppercase tracking-[0.3em] mt-1">Terminal Persistence</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center">
                                            <Globe size={18} className="text-neon" />
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        {/* Language Module */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] whitespace-nowrap">{t('settings.language')}</h4>
                                                <div className="h-[1px] w-12 bg-white/5" />
                                            </div>
                                            <LanguageDropdown
                                                currentLocale={locale}
                                                onSelect={changeLanguage}
                                            />
                                        </div>

                                        {/* API Module */}
                                        <ApiKeySettings />

                                        <div className="pt-4 pb-8 flex flex-col items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                            <p className="text-[8px] text-gray-700 font-black uppercase tracking-[0.4em] mt-2">OmniPay Protocol v2.4.0</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>

                <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
        </div>
    )
}

export default SidePanel
