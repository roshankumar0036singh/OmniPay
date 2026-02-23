export interface ScrapedProduct {
    id: string; // ASIN, productId, etc.
    title: string;
    price: number;
    currency: string;
    image: string;
    description?: string;
    url: string;
    site: string;
    region: string; // 'JP', 'US', 'DE', etc.
    originalPriceText?: string;
    metadata?: Record<string, any>;
}

export interface RegionPrice {
    region: string;
    price: number;
    currency: string;
    priceUsd: number;
    url: string;
    site: string;
}

export interface PriceComparison {
    productId: string;
    bestDeal: RegionPrice;
    prices: RegionPrice[];
    savingsPercent: number;
}
