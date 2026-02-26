import { useSearchStore } from '../stores/useSearchStore';
import { ProductCard } from './ProductCard';

export const SearchResults = () => {
    const { results, isLoading, query } = useSearchStore();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-gray-500 animate-pulse">
                <div className="w-12 h-12 rounded-full border-2 border-lingo-green/20 border-t-lingo-green animate-spin mb-4"></div>
                <p>Scanning global markets...</p>
            </div>
        );
    }

    if (!isLoading && results.length === 0 && query.length > 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-center border border-white/5 border-dashed rounded-3xl bg-white/5 backdrop-blur-sm mt-4">
                <div className="w-12 h-12 rounded-full bg-neon/5 border border-neon/10 flex items-center justify-center mb-4">
                    <span className="w-1.5 h-1.5 bg-neon rounded-full animate-pulse shadow-neon" />
                </div>
                <h3 className="text-sm font-black text-white italic uppercase tracking-tighter">No Intel Found</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2 max-w-[200px]">
                    Global node scan complete. Consider adjusting region parameters.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-20">
            {results.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={`${product.currency} ${product.price.toLocaleString()}`}
                    image={product.image}
                    region={product.region}
                    site={product.site}
                    // Format landed cost if available
                    landedCost={product.totalPriceUsd ? `$${product.totalPriceUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : undefined}
                    // Mock savings logic for demo purposes (real logic would come from PriceArbitrage service)
                    savings={product.region === 'JP' ? '15%' : undefined}
                />
            ))}
        </div>
    );
};
