export const EthicalOverlay = ({ score }: { score: number }) => {
    const color = score > 80 ? 'bg-neon text-black' : score > 50 ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'

    return (
        <div className="absolute top-2 left-2 z-10 group">
            <div className={`${color} text-xs font-bold px-2 py-1 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center gap-1 cursor-help backdrop-blur-md`}>
                <span>🌱</span>
                <span>{score}/100</span>
            </div>

            {/* Tooltip */}
            <div className="hidden group-hover:block absolute top-8 left-0 w-48 bg-dark-card p-3 rounded-lg shadow-xl border border-dark-border text-xs z-20">
                <p className="font-bold mb-1 text-white">Sustainability Score</p>
                <div className="w-full bg-gray-800 h-1.5 rounded-full mb-2 overflow-hidden">
                    <div className={`h-full ${score > 80 ? 'bg-neon' : score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score}%` }}></div>
                </div>
                <p className="text-gray-400">Based on material transparency, supply chain, and labor standards.</p>
            </div>
        </div>
    )
}
