import { useState, useEffect } from 'react';
import { MessageSquareText, ThumbsUp, ThumbsDown, Star, ChevronDown, ChevronUp } from 'lucide-react';

interface ReviewSummaryData {
    productId: string;
    consensus: string;
    pros: string[];
    cons: string[];
    avgRating: number;
    reviewCount: number;
}

export const ReviewSummary = ({ productId, title }: { productId: string, title: string }) => {
    const [data, setData] = useState<ReviewSummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const fetchSentiment = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/sentiment/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer dev-token'
                    },
                    body: JSON.stringify({ productId, title })
                });

                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                }
            } catch (e) {
                console.error("Sentiment analysis failed", e);
            } finally {
                setLoading(false);
            }
        };

        if (productId && title) {
            fetchSentiment();
        }
    }, [productId, title]);

    if (loading) return null;
    if (!data) return null;

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                size={14}
                className={i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
            />
        ));
    };

    return (
        <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl w-[320px] font-sans text-white z-50">
            {/* Header */}
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-2">
                    <MessageSquareText className="text-neon" size={18} />
                    <h3 className="text-sm font-bold tracking-wide">Community Sentiment</h3>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        {renderStars(data.avgRating)}
                    </div>
                    <span className="text-xs font-mono text-gray-400">({data.reviewCount})</span>
                    {expanded ? <ChevronUp size={16} className="text-gray-500 ml-1" /> : <ChevronDown size={16} className="text-gray-500 ml-1" />}
                </div>
            </div>

            {/* Details */}
            {expanded && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-4">

                    <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
                        <p className="text-xs text-gray-300 leading-relaxed">
                            {data.consensus}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Pros */}
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider flex items-center gap-1">
                                <ThumbsUp size={12} /> Pros
                            </span>
                            <ul className="text-xs text-gray-400 space-y-1 pl-1 border-l-2 border-green-500/30">
                                {data.pros.map((pro, idx) => (
                                    <li key={idx}>• {pro}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Cons */}
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                                <ThumbsDown size={12} /> Cons
                            </span>
                            <ul className="text-xs text-gray-400 space-y-1 pl-1 border-l-2 border-red-500/30">
                                {data.cons.map((con, idx) => (
                                    <li key={idx}>• {con}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};
