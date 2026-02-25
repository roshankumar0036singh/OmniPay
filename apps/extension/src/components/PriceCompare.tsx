import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, Globe, AlertCircle, ShoppingCart, ExternalLink, Sparkles } from 'lucide-react';
import { PremiumButton } from './PremiumButton';
import { cn } from '../utils/cn';

interface RegionPrice {
    region: string;
    price: number;
    currency: string;
    priceUsd: number;
    url: string;
    site: string;
}

interface PriceComparison {
    productId: string;
    bestDeal: RegionPrice;
    prices: RegionPrice[];
    savingsPercent: number;
}

export const PriceCompare = ({ productTitle }: { productTitle: string }) => {
    const [data, setData] = useState<PriceComparison | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchComparison = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/price/compare', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer dev-token'
                    },
                    body: JSON.stringify({ query: productTitle })
                });

                if (res.ok) {
                    const comparison = await res.json();
                    if (comparison.prices && comparison.prices.length > 0) {
                        setData(comparison);
                    } else {
                        setError(true);
                    }
                } else {
                    setError(true);
                }
            } catch (e) {
                console.error("Failed to fetch price comparison", e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (productTitle) fetchComparison();
    }, [productTitle]);

    if (loading) {
        return (
            <div className="glass-panel p-5 rounded-2xl w-full max-w-[340px] animate-pulse space-y-4 shadow-glass border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-white/10 rounded-full" />
                    <div className="h-4 bg-white/10 w-1/2 rounded" />
                </div>
                <div className="space-y-3">
                    <div className="h-14 bg-white/5 rounded-xl" />
                    <div className="h-14 bg-white/5 rounded-xl" />
                </div>
            </div>
        );
    }

    if (error || !data || data.prices.length <= 1) return null;

    const regionFlags: Record<string, string> = {
        'US': '🇺🇸', 'JP': '🇯🇵', 'DE': '🇩🇪', 'ES': '🇪🇸', 'GB': '🇬🇧', 'FR': '🇫🇷'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-5 rounded-2xl w-full max-w-[340px] shadow-glass border-white/10 relative overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Globe className="text-neon" size={16} />
                    <h3 className="text-[11px] font-black text-white italic uppercase tracking-wider">Global Price Intelligence</h3>
                </div>
                <div className="flex items-center gap-1.5 text-[8px] text-neon/70 font-black uppercase tracking-tighter">
                    <Sparkles size={10} className="animate-pulse" /> Live Audit
                </div>
            </div>

            {/* List */}
            <div className="space-y-2 mb-5">
                {data.prices.map((item, idx) => {
                    const isBest = item.region === data.bestDeal.region;
                    return (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={item.region}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-xl transition-all border",
                                isBest
                                    ? 'bg-neon/10 border-neon/30 shadow-neon/5'
                                    : 'bg-white/5 border-white/5 hover:border-white/10'
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl filter drop-shadow-sm">{regionFlags[item.region] || '🌐'}</span>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white uppercase tracking-tighter">{item.region}</span>
                                    <span className="text-[9px] text-gray-500 font-bold uppercase">{item.site}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1">
                                    <span className={cn(
                                        "text-xs font-black italic",
                                        isBest ? 'text-neon' : 'text-white'
                                    )}>
                                        ${item.priceUsd.toFixed(2)}
                                    </span>
                                </div>
                                <span className="text-[8px] text-gray-600 font-bold uppercase">
                                    {item.currency} {item.price.toLocaleString()}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Insight / CTAs */}
            <AnimatePresence>
                {data.savingsPercent > 5 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-grand-neon rounded-xl p-3 flex items-start gap-3 mb-4 shadow-neon/10"
                    >
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-white/20">
                            <TrendingDown size={18} className="text-black" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black text-black italic uppercase leading-tight">Save {data.savingsPercent}% cross-border</span>
                            <span className="text-[9px] text-black/60 font-bold leading-tight">Cheapest source found in {regionFlags[data.bestDeal.region]} {data.bestDeal.region} region.</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex gap-2">
                <PremiumButton
                    variant="neon"
                    glow
                    onClick={() => window.open(data.bestDeal.url, '_blank')}
                    className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2"
                >
                    Extract Deal <ExternalLink size={12} />
                </PremiumButton>
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-neon/5 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-16 h-16 bg-neon/10 blur-2xl rounded-full" />
        </motion.div>
    );
};
