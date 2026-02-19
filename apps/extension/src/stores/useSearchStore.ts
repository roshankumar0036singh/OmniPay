import { create } from 'zustand';

export interface SearchResult {
    id: string;
    title: string;
    price: number;
    currency: string;
    image: string;
    region: string;
    site: string;
    url: string;
    priceUsd: number;
    totalPriceUsd: number;
    landedCost: {
        shippingCost: number;
        dutyCost: number;
        total: number;
    };
}

interface SearchState {
    query: string;
    results: SearchResult[];
    isLoading: boolean;
    activeRegions: string[];
    setQuery: (q: string) => void;
    setResults: (r: SearchResult[]) => void;
    setLoading: (l: boolean) => void;
    toggleRegion: (region: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    query: '',
    results: [],
    isLoading: false,
    activeRegions: ['JP', 'US', 'DE'], // Default regions
    setQuery: (q) => set({ query: q }),
    setResults: (r) => set({ results: r }),
    setLoading: (l) => set({ isLoading: l }),
    toggleRegion: (region) => set((state) => {
        const regions = state.activeRegions.includes(region)
            ? state.activeRegions.filter(r => r !== region)
            : [...state.activeRegions, region];
        return { activeRegions: regions };
    })
}));
