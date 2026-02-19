import { AdapterRegistry } from '../scrapers/adapterRegistry';
import { ScrapedProduct } from '@omnipay/shared/src/types/product';

export class ScrapingService {
    /**
     * Scrape search results from a specific region
     */
    static async scrapeSearchResults(region: string, query: string): Promise<ScrapedProduct[]> {
        const adapter = AdapterRegistry.getAdapter(region);

        if (!adapter) {
            console.warn(`[ScrapingService] No adapter found for region: ${region}`);
            return [];
        }

        try {
            console.log(`[ScrapingService] Scraping ${region} for "${query}"`);
            return await adapter.scrapeSearchResults(query);
        } catch (error) {
            console.error(`[ScrapingService] Error scraping ${region}:`, error);
            return [];
        }
    }

    /**
     * Scrape a specific product URL
     */
    static async scrapeProduct(url: string, region: string): Promise<ScrapedProduct | null> {
        const adapter = AdapterRegistry.getAdapter(region);

        if (!adapter) {
            // TODO: Fallback to generic scraper or try to detect region from URL
            return null;
        }

        return await adapter.scrapeProduct(url);
    }
}
