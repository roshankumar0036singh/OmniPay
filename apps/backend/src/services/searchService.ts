import { LingoService } from '../integrations/lingoService';
import { CurrencyService } from './currencyService';
import { ShippingEstimator } from './shippingEstimator';

interface SearchParams {
    query: string;
    regions: string[]; // ["JP", "DE", "ES", "US"]
    currency: string; // "USD"
}

export class SearchService {
    private static lingo = LingoService.getInstance();

    static async globalSearch(params: SearchParams) {
        const { query, regions, currency } = params;

        console.log(`[SearchService] Searching for "${query}" in [${regions.join(', ')}]`);

        // 1. Translate Query (Parallel)
        const translatedQueries = await Promise.all(
            regions.map(async (region) => {
                // Determine target language based on region
                // Simple mapping for now
                const langMap: Record<string, string> = {
                    "JP": "ja",
                    "DE": "de",
                    "ES": "es",
                    "CN": "zh",
                    "US": "en"
                };
                const targetLang = langMap[region] || "en";

                // Don't translate if already in target language (optimization)
                if (targetLang === "en") return { region, query };

                // Use Lingo to translate
                const translated = await this.lingo.translate({
                    text: query,
                    targetLang,
                    sourceLang: 'en', // Assuming input is English for now
                    context: 'ecommerce-search'
                });

                return { region, query: translated.translated };
            })
        );

        console.log('[SearchService] Translated Queries:', translatedQueries);

        // 2. Mock Parallel Scrape (Phase 10 will implement real scrapers)
        const allResults = await Promise.all(
            translatedQueries.map(async ({ region, query }) => {
                return this.mockScrape(region, query);
            })
        );

        const flatResults = allResults.flat();

        // 3. Normalize & Calculate Landed Cost
        const enrichedResults = await Promise.all(flatResults.map(async (item) => {
            const priceUsd = await CurrencyService.convert(item.price, item.currency, "USD");
            const landedCost = await ShippingEstimator.estimateLandedCost(priceUsd, item.region);

            return {
                ...item,
                priceUsd,
                landedCost,
                totalPriceUsd: landedCost.total
            };
        }));

        // 4. Rank by Total Price
        return enrichedResults.sort((a, b) => a.totalPriceUsd - b.totalPriceUsd);
    }

    private static async mockScrape(region: string, query: string) {
        // Mock data to simulate scraping results
        // In Phase 10, this will call AdapterRegistry.getAdapter(region).scrapeSearchResults(query)
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

        const mockItems = [
            {
                id: `${region}-1`,
                title: `[${region}] ${query} - Premium Model`,
                price: Math.floor(Math.random() * 10000) + 5000,
                currency: region === "JP" ? "JPY" : region === "DE" || region === "ES" ? "EUR" : "USD",
                region,
                site: region === "JP" ? "Amazon JP" : region === "DE" ? "Amazon DE" : "Amazon US",
                image: "https://via.placeholder.com/150",
                url: "https://amazon.co.jp/dp/B000000"
            },
            {
                id: `${region}-2`,
                title: `[${region}] ${query} - SE Model`,
                price: Math.floor(Math.random() * 5000) + 2000,
                currency: region === "JP" ? "JPY" : region === "DE" || region === "ES" ? "EUR" : "USD",
                region,
                site: region === "JP" ? "Rakuten" : "eBay",
                image: "https://via.placeholder.com/150",
                url: "https://rakuten.co.jp/item/123"
            }
        ];

        return mockItems;
    }
}
