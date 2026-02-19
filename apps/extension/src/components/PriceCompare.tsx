export const PriceCompare = ({ prices }: { prices: { region: string, price: string, isBest: boolean }[] }) => (
    <div className="bg-dark-card p-4 rounded-xl shadow-lg border border-dark-border mt-4">
        <h3 className="font-bold mb-3 flex items-center gap-2 text-white text-sm">
            <span>💰</span> Global Price Check
        </h3>
        <div className="space-y-2">
            {prices.map((p, i) => (
                <div key={i} className={`flex justify-between items-center p-2 rounded-lg transition ${p.isBest ? 'bg-neon-dim border border-neon/30' : 'bg-gray-800 border border-transparent'}`}>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{p.region === 'JP' ? '🇯🇵' : p.region === 'US' ? '🇺🇸' : '🇪🇺'}</span>
                        <span className={`font-medium text-sm ${p.isBest ? 'text-neon' : 'text-gray-400'}`}>{p.region}</span>
                    </div>
                    <div className="text-right">
                        <div className={`font-bold ${p.isBest ? 'text-neon shadow-neon-sm' : 'text-gray-300'}`}>{p.price}</div>
                        {p.isBest && <div className="text-[10px] text-neon font-bold">BEST DEAL</div>}
                    </div>
                </div>
            ))}
        </div>
    </div>
)
