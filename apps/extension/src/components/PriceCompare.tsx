export const PriceCompare = ({ prices }: { prices: { region: string, price: string, isBest: boolean }[] }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold mb-3 flex items-center gap-2">
            <span>💰</span> Global Price Check
        </h3>
        <div className="space-y-2">
            {prices.map((p, i) => (
                <div key={i} className={`flex justify-between items-center p-2 rounded-lg ${p.isBest ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{p.region === 'JP' ? '🇯🇵' : p.region === 'US' ? '🇺🇸' : '🇪🇺'}</span>
                        <span className="font-medium text-sm">{p.region}</span>
                    </div>
                    <div className="text-right">
                        <div className={`font-bold ${p.isBest ? 'text-green-700' : 'text-gray-900'}`}>{p.price}</div>
                        {p.isBest && <div className="text-[10px] text-green-600 font-medium">BEST DEAL</div>}
                    </div>
                </div>
            ))}
        </div>
    </div>
)
