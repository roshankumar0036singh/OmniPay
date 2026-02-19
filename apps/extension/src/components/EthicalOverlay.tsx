export const EthicalOverlay = ({ score }: { score: number }) => {
    const color = score > 80 ? 'text-neon border-neon' : score > 50 ? 'text-yellow-500 border-yellow-500' : 'text-red-500 border-red-500'

    return (
        <div className="absolute top-2 left-2 z-10 group font-mono">
            <div className={`bg-black ${color} border-2 text-[10px] font-bold px-1.5 py-0.5 shadow-[2px_2px_0px_#000] flex items-center gap-1 cursor-help hover:bg-white hover:text-black transition-colors`}>
                <span>ETH_SCORE:</span>
                <span>{score}</span>
            </div>

            {/* Tooltip */}
            <div className="hidden group-hover:block absolute top-8 left-0 w-48 bg-black p-3 border-2 border-neon shadow-neon text-xs z-20">
                <p className="font-bold mb-2 text-neon uppercase tracking-wider border-b border-neon/30 pb-1">Analysis_Report</p>
                <div className="w-full bg-neon-dim h-2 mb-2 border border-neon/30">
                    <div className={`h-full bg-neon shadow-neon`} style={{ width: `${score}%` }}></div>
                </div>
                <p className="text-neon-dim text-[10px] leading-tight">&gt; MATERIAL_TRANSPARENCY: OK<br />&gt; SUPPLY_CHAIN: VERIFIED</p>
            </div>
        </div>
    )
}
