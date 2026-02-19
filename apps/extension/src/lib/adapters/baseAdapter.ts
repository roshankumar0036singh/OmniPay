export interface ScrapedProduct {
    id: string;
    title: string;
    price: number;
    currency: string;
    imageUrl: string;
    url: string;
}

export interface SiteAdapter {
    detectProductPage(): boolean;
    scrapeProduct(): Promise<ScrapedProduct | null>;
}
