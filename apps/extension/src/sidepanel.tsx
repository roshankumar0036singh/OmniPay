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

import "./style.css"

function SidePanel() {
    const [activeTab, setActiveTab] = useState("home")
    const { query, activeRegions, setResults, setLoading } = useSearchStore()
    const { t } = useTranslation()

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

                <main className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                    {activeTab === 'home' && (
                        <div className="space-y-6">
                            {/* Hero / Welcome */}
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                    {t('home.title')}
                                </h2>
                                <p className="text-sm text-gray-400">{t('home.subtitle')}</p>
                            </div>

                            {/* Quick Search */}
                            <SearchBar onSearch={handleSearch} />

                            {/* Trending / Feed */}
                            <div className="space-y-4 pt-4">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('home.trending')}</h3>
                                <ProductCard
                                    id="trending-1"
                                    title="Sony WH-1000XM5 Wireless Headphones"
                                    price="¥49,800"
                                    image="https://m.media-amazon.com/images/I/41Kx5gZ-20L._AC_SY580_.jpg"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'search' && (
                        <div className="space-y-4 h-full flex flex-col">
                            <SearchBar onSearch={handleSearch} />
                            <div className="flex-1">
                                <SearchResults />
                            </div>
                        </div>
                    )}

                    {activeTab === 'support' && (
                        <div className="h-full flex items-center justify-center p-2">
                            <SupportProxy />
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="flex flex-col items-center justify-center h-full space-y-4 p-4">
                            <h3 className="text-lg font-bold w-full text-center border-b border-white/10 pb-4 mb-4">{t('settings.title')}</h3>

                            <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                                <span className="text-sm text-gray-300">{t('settings.language')}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            localStorage.setItem('omnipay-locale', 'en');
                                            window.location.reload();
                                        }}
                                        className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded border border-white/20 text-xs"
                                    >
                                        EN 🇺🇸
                                    </button>
                                    <button
                                        onClick={() => {
                                            localStorage.setItem('omnipay-locale', 'ja');
                                            window.location.reload();
                                        }}
                                        className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded border border-white/20 text-xs"
                                    >
                                        JA 🇯🇵
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
                <CartDrawer />
            </div>
        </div>
    )
}

export default SidePanel
