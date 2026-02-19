export const Header = () => (
    <header className="bg-retro-bg border-b-2 border-neon px-4 py-3 flex items-center justify-between sticky top-0 z-30 font-mono">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neon flex items-center justify-center shadow-neon">
                <span className="text-black font-extrabold text-xl font-mono">O</span>
            </div>
            <h1 className="text-xl font-bold text-neon tracking-widest uppercase">OMNIPAY<span className="animate-pulse">_</span></h1>
        </div>
        <div className="text-[10px] font-bold text-black bg-neon px-2 py-0.5 border border-white shadow-[2px_2px_0px_#FFF]">
            LIVE
        </div>
    </header>
)
