export const PriceCompare = ({ prices }: { prices: { region: string, price: string, isBest: boolean }[] }) => (
    <div className="bg-black border-2 border-neon p-2 mt-4 font-mono relative overflow-hidden">
        <div className="absolute top-0 right-0 text-[10px] bg-neon text-black px-1 font-bold">PRICE_MATRIX</div>
        <h3 className="font-bold mb-3 flex items-center gap-2 text-neon text-xs tracking-widest mt-2">
            &gt; GLOBAL_PRICE_CHECK
        </h3>
        <div className="space-y-1">
            {prices.map((p, i) => (
                <div key={i} className={`flex justify-between items-center p-1 border-b border-neon/20 ${p.isBest ? 'bg-neon/10' : ''}`}>
                    <div className="flex items-center gap-2">
                        <span className="text-xs opacity-70">[{p.region}]</span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                        <div className={`font-bold text-sm ${p.isBest ? 'text-neon animate-pulse' : 'text-neon-dim'}`}>{p.price}</div>
                        {p.isBest && <div className="text-[9px] bg-neon text-black px-1">LOWEST</div>}
                    </div>
                </div>
            ))}
        </div>
    </div>
)
