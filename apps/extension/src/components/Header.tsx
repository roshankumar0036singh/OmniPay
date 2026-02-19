export const Header = () => (
    <header className="bg-dark-bg border-b border-dark-border px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neon rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(204,255,0,0.4)]">
                <span className="text-black font-bold text-lg">O</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">OmniPay</h1>
        </div>
        <div className="text-xs font-bold text-neon bg-neon-dim px-2 py-1 rounded-full border border-neon/30">
            ACTIVE
        </div>
    </header>
)
