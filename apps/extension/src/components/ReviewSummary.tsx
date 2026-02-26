import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText, ThumbsUp, ThumbsDown, Star, ChevronDown, ChevronUp, Sparkles, Quote } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { PremiumButton } from './PremiumButton';
import { ApiClient } from '../services/apiClient';
import { cn } from '../utils/cn';

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
    const { t } = useTranslation();

    useEffect(() => {
        const fetchSentiment = async () => {
            try {
                const result = await ApiClient.analyzeSentiment(productId, title);
                if (result) {
                    setData(result);
                }
            } catch (e) {
                console.error("Sentiment analysis failed", e);
            } finally {
                setLoading(false);
            }
        };

        if (productId && title) fetchSentiment();
    }, [productId, title]);

    if (loading || !data) return null;

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                size={12}
                className={cn(
                    "transition-all",
                    i < Math.round(rating) ? "text-neon fill-neon drop-shadow-neon" : "text-gray-700"
                )}
            />
        ));
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel w-full max-w-[340px] shadow-glass border-white/5 overflow-hidden"
        >
            {/* Header / Summary */}
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all group"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <MessageSquareText className="text-neon" size={20} />
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-1 -right-1 w-2 h-2 bg-neon rounded-full blur-[2px]" />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-white italic uppercase tracking-wider">AI Consensus</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                            {renderStars(data.avgRating)}
                            <span className="text-[9px] font-bold text-gray-500 ml-1">({data.reviewCount} Reports)</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ rotate: expanded ? 180 : 0 }}
                        className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/10"
                    >
                        <ChevronDown size={14} className="text-gray-500" />
                    </motion.div>
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5"
                    >
                        <div className="p-4 space-y-5">
                            {/* Consensus Card */}
                            <div className="relative p-4 rounded-2xl bg-white/5 border border-white/5 overflow-hidden">
                                <Quote className="absolute -top-2 -left-2 text-neon/10 w-12 h-12" />
                                <p className="text-[11px] font-medium text-gray-300 leading-relaxed italic z-10 relative">
                                    {data.consensus}
                                </p>
                            </div>

                            {/* Pros & Cons Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-neon">
                                        <ThumbsUp size={12} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Strengths</span>
                                    </div>
                                    <ul className="space-y-1.5">
                                        {data.pros.map((pro, idx) => (
                                            <motion.li
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                key={idx}
                                                className="text-[10px] text-gray-500 font-medium flex items-center gap-1.5"
                                            >
                                                <div className="w-1 h-1 bg-neon/30 rounded-full" />
                                                {pro}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <ThumbsDown size={12} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Cautions</span>
                                    </div>
                                    <ul className="space-y-1.5">
                                        {data.cons.map((con, idx) => (
                                            <motion.li
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                key={idx}
                                                className="text-[10px] text-gray-700 font-medium flex items-center gap-1.5"
                                            >
                                                <div className="w-1 h-1 bg-white/10 rounded-full" />
                                                {con}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
