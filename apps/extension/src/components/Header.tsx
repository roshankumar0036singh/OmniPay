import { LingoChip } from "./LingoChip"

export const Header = () => (
    <header className="flex items-center justify-between p-4 bg-lingo-dark/80 backdrop-blur-md border-b border-lingo-border z-20 sticky top-0">
        <div className="flex items-center gap-3">
            <LingoChip className="w-10 h-10" />
            <div>
                <h1 className="text-lg font-bold tracking-tight text-white leading-none">OmniPay</h1>
                <span className="text-[10px] text-lingo-green font-medium uppercase tracking-wider">AI Global Shopper</span>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <span className="text-xs">🔔</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lingo-green to-blue-500 p-[1px]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs">OP</div>
            </div>
        </div>
    </header>
)
