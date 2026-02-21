export interface ScrapedProduct {
    id: string;
    title: string;
    price: number;
    currency: string;
    imageUrl: string;
    description?: string;
    url: string;
}

export interface SiteAdapter {
    detectProductPage(): boolean;
    scrapeProduct(): Promise<ScrapedProduct | null>;
}
