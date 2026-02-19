import { LingoChip } from "./LingoChip"
import { Bell, User } from "lucide-react"

export const Header = () => (
    <header className="flex items-center justify-between px-5 py-4 bg-lingo-dark/90 backdrop-blur-xl border-b border-white/5 z-20 sticky top-0">
        <div className="flex items-center gap-3 group cursor-pointer">
            <LingoChip className="w-8 h-8" />
            <div className="flex flex-col">
                <h1 className="text-base font-bold text-white leading-none tracking-tight group-hover:text-lingo-green transition-colors">OmniPay</h1>
                <span className="text-[9px] text-gray-500 font-medium tracking-widest uppercase mt-0.5 group-hover:text-gray-400 transition-colors">Global Intelligence</span>
            </div>
        </div>

        <div className="flex items-center gap-3">
            <button className="relative w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                <Bell size={16} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-lingo-green rounded-full shadow-[0_0_8px_#4ade80]" />
            </button>

            <button className="w-8 h-8 rounded-full p-[1px] bg-gradient-to-b from-white/20 to-transparent hover:from-lingo-green hover:to-lingo-green/50 transition-all group overflow-hidden">
                <div className="w-full h-full rounded-full bg-lingo-card flex items-center justify-center">
                    <span className="text-[10px] font-bold text-gray-300 group-hover:text-white">OP</span>
                </div>
            </button>
        </div>
    </header>
)
