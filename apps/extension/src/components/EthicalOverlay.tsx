export const EthicalOverlay = ({ score }: { score: number }) => {
    const color = score > 80 ? 'bg-green-500' : score > 50 ? 'bg-yellow-500' : 'bg-red-500'

    return (
        <div className="absolute top-2 left-2 z-10 group">
            <div className={`${color} text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 cursor-help`}>
                <span>🌱</span>
                <span>{score}/100</span>
            </div>

            {/* Tooltip */}
            <div className="hidden group-hover:block absolute top-8 left-0 w-48 bg-white p-3 rounded-lg shadow-xl border border-gray-100 text-xs">
                <p className="font-bold mb-1">Sustainability Score</p>
                <div className="w-full bg-gray-200 h-1.5 rounded-full mb-2 overflow-hidden">
                    <div className={`h-full ${color}`} style={{ width: `${score}%` }}></div>
                </div>
                <p className="text-gray-500">Based on material transparency, supply chain, and labor standards.</p>
            </div>
        </div>
    )
}
