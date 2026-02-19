export const ReviewSummaryPanel = ({ consensus, pros, cons }: { consensus: string, pros: string[], cons: string[] }) => (
    <div className="bg-dark-card p-4 rounded-xl border border-dark-border mt-4 shadow-lg">
        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
            <span className="bg-neon text-black text-xs px-1.5 py-0.5 rounded">AI</span> Review Summary
        </h3>
        <p className="text-sm text-gray-300 italic mb-3 border-l-2 border-neon pl-3 py-1 bg-white/5 rounded-r">"{consensus}"</p>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <h4 className="text-xs font-bold text-neon uppercase mb-1 tracking-wider">Pros</h4>
                <ul className="text-xs text-gray-400 space-y-1 list-none">
                    {pros.map((p, i) => <li key={i} className="flex gap-1"><span className="text-neon">✓</span> {p}</li>)}
                </ul>
            </div>
            <div>
                <h4 className="text-xs font-bold text-red-500 uppercase mb-1 tracking-wider">Cons</h4>
                <ul className="text-xs text-gray-400 space-y-1 list-none">
                    {cons.map((c, i) => <li key={i} className="flex gap-1"><span className="text-red-500">×</span> {c}</li>)}
                </ul>
            </div>
        </div>
    </div>
)
