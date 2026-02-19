import { useState } from "react"
import "./style.css"

function IndexPopup() {
    const [activeTab, setActiveTab] = useState("home")

    return (
        <div className="w-[400px] h-[500px] flex flex-col bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">O</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">OmniPay</h1>
                </div>
                <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                    Active
                </div>
            </header>

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
                    </div>
                )}
            </main>

            {/* Bottom Nav */}
            <nav className="bg-white border-t border-gray-200 grid grid-cols-3 p-1">
                <button
                    onClick={() => setActiveTab("home")}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition ${activeTab === "home" ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-gray-600"}`}
                >
                    <span className="text-xs font-medium mt-1">Home</span>
                </button>
                <button
                    onClick={() => setActiveTab("search")}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition ${activeTab === "search" ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-gray-600"}`}
                >
                    <span className="text-xs font-medium mt-1">Search</span>
                </button>
                <button
                    onClick={() => setActiveTab("settings")}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition ${activeTab === "settings" ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-gray-600"}`}
                >
                    <span className="text-xs font-medium mt-1">Settings</span>
                </button>
            </nav>
        </div>
    )
}

export default IndexPopup
