import { AdapterRegistry } from '../scrapers/adapterRegistry';
import { ScrapedProduct } from '@omnipay/shared/src/types/product';

export class ScrapingService {
    /**
     * Scrape search results from a specific region
     */
    static async scrapeSearchResults(region: string, query: string): Promise<ScrapedProduct[]> {
        const adapters = AdapterRegistry.getAdapters(region);

        if (adapters.length === 0) {
            console.warn(`[ScrapingService] No adapters found for region: ${region}`);
            return [];
        }

        try {
            console.log(`[ScrapingService] Scraping ${region} with ${adapters.length} adapters for "${query}"`);
            const results = await Promise.all(
                adapters.map(adapter => adapter.scrapeSearchResults(query).catch(e => []))
            );
            return results.flat();
        } catch (error) {
            console.error(`[ScrapingService] Error scraping ${region}:`, error);
            return [];
        }
    }

    /**
     * Scrape a specific product URL
     */
    static async scrapeProduct(url: string, region: string): Promise<ScrapedProduct | null> {
        const adapters = AdapterRegistry.getAdapters(region);

        if (adapters.length === 0) {
            // TODO: Fallback to generic scraper or try to detect region from URL
            return null;
        }

        // For single product, just use the first matching adapter
        return await adapters[0].scrapeProduct(url);
    }
}
