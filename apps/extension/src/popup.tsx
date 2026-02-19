import { useState } from "react"
import { Header } from "./components/Header"
import { BottomNav } from "./components/BottomNav"
import { SearchBar } from "./components/SearchBar"
import { ProductCard } from "./components/ProductCard"
import { CartDrawer } from "./components/CartDrawer"
import "./style.css"

function IndexPopup() {
    const [activeTab, setActiveTab] = useState("home")

    return (
        <div className="w-[400px] h-[500px] flex flex-col bg-slate-50 relative">
            <Header />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4">
                {activeTab === "home" && (
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <h2 className="text-sm font-medium text-gray-500 mb-1">Global Cart</h2>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl font-bold text-gray-900">$0.00</span>
                                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                                    Checkout
                                </button>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <p className="text-sm text-blue-700">
                                Browse any supported site (Amazon JP, Rakuten) to start shopping globally.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-medium text-gray-900">Trending</h3>
                            <ProductCard title="Sony WH-1000XM5" price="¥42,000" image="https://via.placeholder.com/150" />
                            <ProductCard title="Vintage Film Camera" price="€120.00" image="https://via.placeholder.com/150" />
                        </div>
                    </div>
                )}

                {activeTab === "search" && (
                    <div className="space-y-4">
                        <SearchBar />
                        <div className="text-center text-gray-500 text-sm mt-8">
                            enter a search term to find global products
                        </div>
                    </div>
                )}

                {activeTab === "settings" && (
                    <div className="p-4 text-center text-gray-500">
                        Settings panel coming soon
                    </div>
                )}
            </main>

            <CartDrawer />
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    )
}

export default IndexPopup
