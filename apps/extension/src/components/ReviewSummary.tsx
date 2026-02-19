export const ReviewSummaryPanel = ({ consensus, pros, cons }: { consensus: string, pros: string[], cons: string[] }) => (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-2">AI Review Summary</h3>
        <p className="text-sm text-gray-700 italic mb-3">"{consensus}"</p>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <h4 className="text-xs font-bold text-green-700 uppercase mb-1">Pros</h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-3">
                    {pros.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
            </div>
            <div>
                <h4 className="text-xs font-bold text-red-700 uppercase mb-1">Cons</h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-3">
                    {cons.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
            </div>
        </div>
    </div>
)
