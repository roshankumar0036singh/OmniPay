import { useState, useEffect } from 'react';
import { TrendingDown, Globe, AlertCircle } from 'lucide-react';

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
                // In a real extension, use background script or proper API client.
                // Hardcoding localhost for demo/hackathon purposes.
                const res = await fetch('http://localhost:3000/api/price/compare', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer dev-token' // Mock auth
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

        if (productTitle) {
            fetchComparison();
        }
    }, [productTitle]);

    if (loading) {
        return (
            <div className="bg-black/80 backdrop-blur-md border border-neon/30 p-4 rounded-xl shadow-neon w-80 font-mono animate-pulse">
                <div className="h-4 bg-white/10 w-1/2 mb-4 rounded"></div>
                <div className="space-y-2">
                    <div className="h-8 bg-white/5 rounded"></div>
                    <div className="h-8 bg-white/5 rounded"></div>
                    <div className="h-8 bg-white/5 rounded"></div>
                </div>
            </div>
        );
    }

    if (error || !data || data.prices.length <= 1) {
        return null; // Don't show if no arbitrage opportunity found
    }

    const regionFlags: Record<string, string> = {
        'US': '🇺🇸', 'JP': '🇯🇵', 'DE': '🇩🇪', 'ES': '🇪🇸'
    };

    return (
        <div className="bg-black/90 backdrop-blur-xl border border-neon/50 p-4 rounded-xl shadow-neon w-[340px] font-sans text-white z-50">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                <Globe className="text-neon" size={16} />
                <h3 className="text-sm font-bold tracking-wide">Global Price Check</h3>
            </div>

            <div className="space-y-2 mb-4">
                {data.prices.map((item, idx) => {
                    const isBest = item.region === data.bestDeal.region;
                    return (
                        <div
                            key={item.region}
                            className={`flex items-center justify-between p-2 rounded-lg border \${isBest ? 'border-neon bg-neon/10' : 'border-white/5 bg-white/5'}`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{regionFlags[item.region] || '🌐'}</span>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold">{item.region}</span>
                                    <span className="text-[10px] text-gray-400">{item.site}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className={`text-sm font-mono \${isBest ? 'text-neon font-bold' : 'text-gray-300'}`}>
                                    ${item.priceUsd.toFixed(2)}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                    {item.currency} {item.price.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {data.savingsPercent > 5 && (
                <div className="bg-neon/10 border border-neon/30 rounded-lg p-2.5 flex items-start gap-2 mb-3">
                    <TrendingDown className="text-neon shrink-0 mt-0.5" size={16} />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-neon">Save {data.savingsPercent}% cross-border</span>
                        <span className="text-[10px] text-gray-400">Buying from {regionFlags[data.bestDeal.region]} {data.bestDeal.region} is cheaper.</span>
                    </div>
                </div>
            )}

            <button
                onClick={() => window.open(data.bestDeal.url, '_blank')}
                className="w-full py-2 bg-neon hover:bg-white text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-[0_0_10px_rgba(74,222,128,0.2)]"
            >
                View Best Deal →
            </button>
        </div>
    );
};
