export const ReviewSummaryPanel = ({ consensus, pros, cons }: { consensus: string, pros: string[], cons: string[] }) => (
    <div className="bg-black border-2 border-neon p-3 mt-4 font-mono shadow-crt">
        <h3 className="font-bold text-neon text-xs mb-2 flex items-center gap-2 border-b border-neon pb-1">
            <span className="animate-blink">█</span> AI_ANALYSIS_LOG
        </h3>
        <p className="text-xs text-neon-dim mb-3 pl-2 border-l border-neon/50">" {consensus} "</p>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <h4 className="text-[10px] font-bold text-neon uppercase mb-1 bg-neon/10 inline-block px-1">++ POSITIVE_VECTORS</h4>
                <ul className="text-[10px] text-neon-dim space-y-1">
                    {pros.map((p, i) => <li key={i}>+ {p}</li>)}
                </ul>
            </div>
            <div>
                <h4 className="text-[10px] font-bold text-red-500 uppercase mb-1 bg-red-900/20 inline-block px-1">-- NEGATIVE_VECTORS</h4>
                <ul className="text-[10px] text-red-400/80 space-y-1">
                    {cons.map((c, i) => <li key={i}>- {c}</li>)}
                </ul>
            </div>
        </div>
    </div>
)
