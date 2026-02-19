import { useState } from "react"
import { Header } from "./components/Header"
import { BottomNav } from "./components/BottomNav"
import { ProductCard } from "./components/ProductCard"
import { CartDrawer } from "./components/CartDrawer"
import { CircuitBackground } from "./components/CircuitBackground"

import "./style.css"

function SidePanel() {
    const [activeTab, setActiveTab] = useState("home")

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
                                    Welcome Back
                                </h2>
                                <p className="text-sm text-gray-400">Your AI-powered shopping assistant is online.</p>
                            </div>

                            {/* Product Feed */}
                            <div className="space-y-4">
                                <ProductCard
                                    title="Sony WH-1000XM5 Wireless Headphones"
                                    price="¥49,800"
                                    image="https://m.media-amazon.com/images/I/41Kx5gZ-20L._AC_SY580_.jpg"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'search' && (
                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                            Search is coming soon...
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                            Settings are locked.
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
