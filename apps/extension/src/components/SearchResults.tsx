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
            <div className="flex flex-col items-center justify-center p-10 text-gray-500 text-center">
                <p className="mb-2 text-xl">🌍</p>
                <p>No global results found.</p>
                <p className="text-xs mt-2">Try adjusting your region filters.</p>
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
