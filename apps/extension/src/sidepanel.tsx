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
        <div className="w-full h-screen flex flex-col bg-retro-bg text-neon font-mono relative overflow-hidden">
            {/* CRT Overlay Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 z-50"></div>
            <div className="absolute inset-0 pointer-events-none shadow-crt z-40"></div>

            <Header />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {activeTab === "home" && (
                    <div className="space-y-6">
                        <div className="bg-retro-card p-4 rounded-none border-2 border-neon shadow-neon relative">
                            <div className="absolute top-0 left-0 bg-neon text-black text-[10px] px-1 font-bold">SYS_CART_STATUS</div>
                            <h2 className="text-sm font-bold text-neon-dim mb-1 mt-2">GLOBAL_CART_TOTAL</h2>
                            <div className="flex items-end justify-between border-t border-neon/30 pt-2">
                                <span className="text-3xl font-bold tracking-tighter text-white glitch-text" data-text="$0.00">$0.00</span>
                                <button className="px-4 py-1 bg-neon text-black text-sm font-bold hover:bg-white hover:text-black transition-all uppercase tracking-widest border border-neon shadow-[4px_4px_0px_#003300] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                                    Checkout_&gt;
                                </button>
                            </div>
                        </div>

                        <div className="border border-dashed border-neon/50 p-4 bg-neon/5">
                            <p className="text-xs text-neon leading-relaxed">
                                &gt; SYSTEM_READY<br />
                                &gt; CONNECTED_TO: AMAZON_JP, RAKUTEN<br />
                                &gt; WAITING_FOR_INPUT...
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-neon border-b-2 border-neon inline-block uppercase tracking-wider">Detected_Signals</h3>
                            <ProductCard title="Sony WH-1000XM5 [NEURO-LINK]" price="¥42,000" image="https://via.placeholder.com/150" />
                            <ProductCard title="Vintage Deck [ARCHIVE_Grade]" price="€120.00" image="https://via.placeholder.com/150" />
                        </div>
                    </div>
                )}

                {activeTab === "search" && (
                    <div className="space-y-4">
                        <SearchBar />
                        <div className="text-center text-neon-dim text-xs mt-12 animate-pulse">
                            _AWAITING_QUERY_INPUT_
                        </div>
                    </div>
                )}

                {activeTab === "settings" && (
                    <div className="p-4 text-center text-neon-dim font-mono text-xs border border-neon/20 mt-10">
                        [ SYSTEM CONFIGURATION LOCKED ]
                    </div>
                )}
            </main>

            <CartDrawer />
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    )
}

export default IndexPopup
