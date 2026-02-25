import { ApifyClient } from 'apify-client';

export interface ScrapedData {
    title: string;
    price: number;
    currency: string;
    image: string;
    description: string;
}

export class BrightDataScraperService {
    /**
     * Replaces the client-side DOM walker.
     * Hits Apify/BrightData Amazon Scraper API to bypass bot protections.
     * Returns structured JSON.
     */
    static async scrapeProductUrl(url: string): Promise<ScrapedData> {
        if (!process.env.APIFY_API_TOKEN) {
            console.warn("APIFY_API_TOKEN not found. Returning mock structured data.");
            return {
                title: "Mock Product from Server",
                price: 1000,
                currency: "JPY",
                image: "mock-url",
                description: "Mock description"
            };
        }

        try {
            const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN });

            // This assumes an existing Apify Actor for Amazon scraping is set up
            const run = await client.actor("junglee/amazon-scraper").call({
                urls: [{ url }],
                maxItemsPerStartUrl: 1,
            });

            const { items } = await client.dataset(run.defaultDatasetId).listItems();

            if (items.length === 0) throw new Error("No items scraped");

            const product = items[0] as any;

            return {
                title: product.title || '',
                price: parseFloat(product.price) || 0,
                currency: product.currency || 'USD',
                image: product.thumbnailImage || '',
                description: product.description || ''
            };

        } catch (e) {
            console.error("Scraping failed", e);
            throw e;
        }
    }
}
