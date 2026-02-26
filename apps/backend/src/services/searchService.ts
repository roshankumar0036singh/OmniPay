import { LingoService } from '../integrations/lingoService';
import { CurrencyService } from './currencyService';
import { ShippingEstimator } from './shippingEstimator';
import { ScrapingService } from './scrapingService';

import algoliasearch from 'algoliasearch';

const algoliaClient = process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_API_KEY
    ? algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
    : null;

interface SearchParams {
    query: string;
    regions: string[]; // ["JP", "DE", "ES", "US"]
    currency: string; // "USD"
}

export class SearchService {
    private static lingo = LingoService.getInstance();

    static async globalSearch(params: SearchParams) {
        const { query, regions = ["JP", "US", "DE", "ES", "FR", "CN", "MX", "GB", "GLOBAL"], currency = "USD" } = params;

        console.log(`[SearchService] Searching for "${query}" in [${regions.join(', ')}]`);

        // OPTIONAL: Try Algolia first for cached global results
        if (algoliaClient) {
            try {
                const index = algoliaClient.initIndex('omnipay_products');
                const algoliaRes = await index.search(query);
                if (algoliaRes.hits.length > 0) {
                    console.log("[SearchService] Returning cached results from Algolia");
                    // Assuming Algolia hits match the expected format
                    return algoliaRes.hits as any[];
                }
            } catch (err) {
                console.warn("[SearchService] Algolia search failed, falling back to scrape", err);
            }
        }

        // 1. Translate Query (Parallel)
        const translatedQueries = await Promise.all(
            regions.map(async (region) => {
                // Determine target language based on region
                const langMap: Record<string, string> = {
                    "JP": "ja",
                    "DE": "de",
                    "ES": "es",
                    "CN": "zh",
                    "US": "en",
                    "MX": "es",
                    "FR": "fr",
                    "GB": "en",
                    "GLOBAL": "en"
                };
                const targetLang = langMap[region] || "en";
                if (targetLang === "en" || region === "GLOBAL") return { region, query };
                try {
                    const translated = await this.lingo.translate({ text: query, targetLang, sourceLang: 'en', context: 'ecommerce-search' });
                    return { region, query: translated.translated };
                } catch (e) {
                    return { region, query }; // Fallback
                }
            })
        );

        // 2. Parallel Scrape (Real)
        const allResults = await Promise.all(
            translatedQueries.map(async ({ region, query }) => {
                try {
                    return await ScrapingService.scrapeSearchResults(region, query);
                } catch (e) {
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

        const ranked = enrichedResults.sort((a, b) => a.totalPriceUsd - b.totalPriceUsd);

        // 4. Fire-and-forget sync to Algolia
        if (algoliaClient && ranked.length > 0) {
            const index = algoliaClient.initIndex('omnipay_products');
            const objectsToSave = ranked.map(r => ({ ...r, objectID: r.id || encodeURIComponent(r.url) }));
            index.saveObjects(objectsToSave).catch((e: any) => console.error("Algolia sync failed", e));
        }

        return ranked;
    }
}
