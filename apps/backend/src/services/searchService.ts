import { LingoService } from '../integrations/lingoService';
import { CurrencyService } from './currencyService';
import { ShippingEstimator } from './shippingEstimator';
import { ScrapingService } from './scrapingService';

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
                const langMap: Record<string, string> = {
                    "JP": "ja",
                    "DE": "de",
                    "ES": "es",
                    "CN": "zh",
                    "US": "en"
                };
                const targetLang = langMap[region] || "en";

                if (targetLang === "en") return { region, query };

                try {
                    const translated = await this.lingo.translate({
                        text: query,
                        targetLang,
                        sourceLang: 'en',
                        context: 'ecommerce-search'
                    });

                    return { region, query: translated.translated };
                } catch (e) {
                    console.error(`[SearchService] Translation failed for ${region}`, e);
                    return { region, query }; // Fallback to original
                }
            })
        );

        console.log('[SearchService] Translated Queries:', translatedQueries);

        // 2. Parallel Scrape (Real)
        const allResults = await Promise.all(
            translatedQueries.map(async ({ region, query }) => {
                try {
                    return await ScrapingService.scrapeSearchResults(region, query);
                } catch (e) {
                    console.error(`[SearchService] Failed to scrape ${region}:`, e);
                    return [];
                }
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
}
